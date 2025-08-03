import { whopSdk } from "@/lib/whop-sdk";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function GET() {
	try {
		// Get the user token from headers
		const headersList = await headers();
		const { userId } = await whopSdk.verifyUserToken(headersList);

		// Get current user
		const currentUser = await prisma.user.findUnique({
			where: { whopUserId: userId },
		});

		if (!currentUser) {
			return Response.json(
				{ error: "User not found" },
				{ status: 404 }
			);
		}

		// Get all matches for the user
		const userMatches = await prisma.match.findMany({
			where: {
				OR: [
					{ user1Id: currentUser.id },
					{ user2Id: currentUser.id },
				],
			},
			include: {
				user1: true,
				user2: true,
				connection: true,
			},
		});

		// Calculate match statistics
		const totalMatches = userMatches.length;
		const acceptedMatches = userMatches.filter((match: any) => match.status === "accepted").length;
		const pendingMatches = userMatches.filter((match: any) => match.status === "pending").length;
		const rejectedMatches = userMatches.filter((match: any) => match.status === "rejected").length;

		// Calculate connection statistics
		const connections = userMatches.filter((match: any) => match.connection).length;
		const connectionRate = totalMatches > 0 ? (connections / totalMatches) * 100 : 0;

		// Get match history over time (last 30 days)
		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

		const recentMatches = userMatches.filter((match: any) => 
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

		// Calculate average compatibility score
		const compatibilityScores = userMatches
			.filter((match: any) => match.compatibility > 0)
			.map((match: any) => match.compatibility);
		
		const averageCompatibility = compatibilityScores.length > 0 
			? compatibilityScores.reduce((sum: number, score: number) => sum + score, 0) / compatibilityScores.length 
			: 0;

		// Get top matching categories (goals and skills)
		const allGoals = userMatches.flatMap((match: any) => {
			const otherUser = match.user1Id === currentUser.id ? match.user2 : match.user1;
			return otherUser.goals || [];
		});

		const allSkills = userMatches.flatMap((match: any) => {
			const otherUser = match.user1Id === currentUser.id ? match.user2 : match.user1;
			return otherUser.skills || [];
		});

		// Count occurrences
		const goalCounts = allGoals.reduce((acc: Record<string, number>, goal: string) => {
			acc[goal] = (acc[goal] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		const skillCounts = allSkills.reduce((acc: Record<string, number>, skill: string) => {
			acc[skill] = (acc[skill] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		// Get top 5 goals and skills
		const topGoals = Object.entries(goalCounts)
			.sort(([,a], [,b]) => (b as number) - (a as number))
			.slice(0, 5)
			.map(([goal, count]) => ({ goal, count: count as number }));

		const topSkills = Object.entries(skillCounts)
			.sort(([,a], [,b]) => (b as number) - (a as number))
			.slice(0, 5)
			.map(([skill, count]) => ({ skill, count: count as number }));

		// Calculate growth metrics
		const lastWeek = new Date();
		lastWeek.setDate(lastWeek.getDate() - 7);
		
		const matchesThisWeek = userMatches.filter((match: any) => 
			match.createdAt >= lastWeek
		).length;

		const matchesLastWeek = userMatches.filter((match: any) => {
			const twoWeeksAgo = new Date();
			twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
			return match.createdAt >= twoWeeksAgo && match.createdAt < lastWeek;
		}).length;

		const weeklyGrowth = matchesLastWeek > 0 
			? ((matchesThisWeek - matchesLastWeek) / matchesLastWeek) * 100 
			: matchesThisWeek > 0 ? 100 : 0;

		return Response.json({
			success: true,
			analytics: {
				overview: {
					totalMatches,
					acceptedMatches,
					pendingMatches,
					rejectedMatches,
					connections,
					connectionRate: Math.round(connectionRate * 100) / 100,
					averageCompatibility: Math.round(averageCompatibility * 100) / 100,
				},
				growth: {
					matchesThisWeek,
					matchesLastWeek,
					weeklyGrowth: Math.round(weeklyGrowth * 100) / 100,
				},
				trends: {
					chartData,
					topGoals,
					topSkills,
				},
				recentActivity: recentMatches.slice(0, 5).map((match: any) => ({
					id: match.id,
					status: match.status,
					compatibility: match.compatibility,
					createdAt: match.createdAt,
					otherUser: match.user1Id === currentUser.id ? match.user2 : match.user1,
				})),
			},
		});
	} catch (error) {
		console.error("Error fetching user analytics:", error);
		return Response.json(
			{ error: "Failed to fetch user analytics" },
			{ status: 500 }
		);
	}
} 