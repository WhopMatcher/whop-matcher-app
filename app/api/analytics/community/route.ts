import { whopSdk } from "@/lib/whop-sdk";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function GET() {
	try {
		// Get the user token from headers
		const headersList = await headers();
		const { userId } = await whopSdk.verifyUserToken(headersList);
		const experienceId = headersList.get("x-whop-experience-id");

		if (!experienceId) {
			return Response.json(
				{ error: "Experience ID not found in headers" },
				{ status: 400 }
			);
		}

		// Get current user to check if they're an admin
		const currentUser = await prisma.user.findUnique({
			where: { whopUserId: userId },
		});

		if (!currentUser) {
			return Response.json(
				{ error: "User not found" },
				{ status: 404 }
			);
		}

		// Get community statistics
		const communityUsers = await prisma.user.findMany({
			where: { communityId: experienceId },
		});

		const communityMatches = await prisma.match.findMany({
			where: {
				OR: [
					{ user1: { communityId: experienceId } },
					{ user2: { communityId: experienceId } },
				],
			},
			include: {
				user1: true,
				user2: true,
				connection: true,
			},
		});

		// Calculate community statistics
		const totalUsers = communityUsers.length;
		const totalMatches = communityMatches.length;
		const acceptedMatches = communityMatches.filter((match: any) => 
			match.status === "accepted"
		).length;
		const pendingMatches = communityMatches.filter((match: any) => 
			match.status === "pending"
		).length;
		const connections = communityMatches.filter((match: any) => match.connection).length;

		// Calculate match rate per user
		const averageMatchesPerUser = totalUsers > 0 ? totalMatches / totalUsers : 0;
		const connectionRate = totalMatches > 0 ? (connections / totalMatches) * 100 : 0;

		// Get activity over time (last 30 days)
		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

		const recentMatches = communityMatches.filter((match: any) => 
			match.createdAt >= thirtyDaysAgo
		);

		// Group matches by date for chart data
		const matchHistory = recentMatches.reduce((acc: Record<string, number>, match: any) => {
			const date = match.createdAt.toISOString().split('T')[0];
			acc[date] = (acc[date] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		// Convert to array format for charts
		const chartData = Object.entries(matchHistory).map(([date, count]) => ({
			date,
			matches: count,
		})).sort((a, b) => a.date.localeCompare(b.date));

		// Calculate user growth
		const newUsersThisWeek = communityUsers.filter((user: any) => {
			const lastWeek = new Date();
			lastWeek.setDate(lastWeek.getDate() - 7);
			return user.createdAt >= lastWeek;
		}).length;

		const newUsersLastWeek = communityUsers.filter((user: any) => {
			const twoWeeksAgo = new Date();
			twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
			return user.createdAt >= twoWeeksAgo && user.createdAt < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
		}).length;

		const userGrowth = newUsersLastWeek > 0 
			? ((newUsersThisWeek - newUsersLastWeek) / newUsersLastWeek) * 100 
			: newUsersThisWeek > 0 ? 100 : 0;

		// Get top community goals and skills
		const allCommunityGoals = communityUsers.flatMap((user: any) => user.goals || []);
		const allCommunitySkills = communityUsers.flatMap((user: any) => user.skills || []);

		const goalCounts = allCommunityGoals.reduce((acc: Record<string, number>, goal: string) => {
			acc[goal] = (acc[goal] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		const skillCounts = allCommunitySkills.reduce((acc: Record<string, number>, skill: string) => {
			acc[skill] = (acc[skill] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		const topCommunityGoals = Object.entries(goalCounts)
			.sort(([,a], [,b]) => (b as number) - (a as number))
			.slice(0, 10)
			.map(([goal, count]) => ({ goal, count: count as number }));

		const topCommunitySkills = Object.entries(skillCounts)
			.sort(([,a], [,b]) => (b as number) - (a as number))
			.slice(0, 10)
			.map(([skill, count]) => ({ skill, count: count as number }));

		// Calculate average compatibility scores
		const compatibilityScores = communityMatches
			.filter((match: any) => match.compatibility > 0)
			.map((match: any) => match.compatibility);
		
		const averageCompatibility = compatibilityScores.length > 0 
			? compatibilityScores.reduce((sum: number, score: number) => sum + score, 0) / compatibilityScores.length 
			: 0;

		// Get most active users
		const userMatchCounts = communityUsers.map((user: any) => {
			const userMatches = communityMatches.filter((match: any) => 
				match.user1Id === user.id || match.user2Id === user.id
			).length;
			return { username: user.username, matches: userMatches };
		}).sort((a: any, b: any) => b.matches - a.matches).slice(0, 5);

		// Get recent activity
		const recentActivity = recentMatches.slice(0, 10).map((match: any) => ({
			id: match.id,
			status: match.status,
			compatibility: match.compatibility,
			createdAt: match.createdAt,
			user1: { username: match.user1.username },
			user2: { username: match.user2.username },
		}));

		return Response.json({
			success: true,
			analytics: {
				overview: {
					totalUsers,
					totalMatches,
					acceptedMatches,
					pendingMatches,
					connections,
					averageMatchesPerUser: Math.round(averageMatchesPerUser * 100) / 100,
					connectionRate: Math.round(connectionRate * 100) / 100,
					averageCompatibility: Math.round(averageCompatibility * 100) / 100,
				},
				growth: {
					newUsersThisWeek,
					newUsersLastWeek,
					userGrowth: Math.round(userGrowth * 100) / 100,
				},
				trends: {
					chartData,
					topCommunityGoals,
					topCommunitySkills,
				},
				topUsers: userMatchCounts,
				recentActivity,
			},
		});
	} catch (error) {
		console.error("Error fetching community analytics:", error);
		return Response.json(
			{ error: "Failed to fetch community analytics" },
			{ status: 500 }
		);
	}
} 