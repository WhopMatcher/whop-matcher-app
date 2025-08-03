import { whopSdk } from "@/lib/whop-sdk";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function GET() {
	try {
		// Get the user token from headers
		const headersList = await headers();
		const { userId } = await whopSdk.verifyUserToken(headersList);

		// Get the experience/community context
		const experienceId = headersList.get("x-whop-experience-id");
		if (!experienceId) {
			return Response.json(
				{ error: "Experience ID not found in headers" },
				{ status: 400 }
			);
		}

		// Get current user
		const currentUser = await prisma.user.findUnique({
			where: { whopUserId: userId },
			include: { preferences: true },
		});

		if (!currentUser) {
			return Response.json(
				{ error: "User not found" },
				{ status: 404 }
			);
		}

		// Get all other users in the same community
		const potentialMatches = await prisma.user.findMany({
			where: {
				communityId: experienceId,
				whopUserId: { not: userId },
				// Only include users who have completed their profile
				goals: { isEmpty: false },
				skills: { isEmpty: false },
			},
			include: {
				preferences: true,
			},
		});

		// Calculate compatibility scores and filter out existing matches
		const matchesWithScores = await Promise.all(
			potentialMatches.map(async (potentialMatch: any) => {
				// Check if there's already a match between these users
				const existingMatch = await prisma.match.findFirst({
					where: {
						OR: [
							{
								user1Id: currentUser.id,
								user2Id: potentialMatch.id,
							},
							{
								user1Id: potentialMatch.id,
								user2Id: currentUser.id,
							},
						],
					},
				});

				if (existingMatch) {
					return null; // Skip if match already exists
				}

				// Calculate compatibility score
				const compatibilityScore = calculateCompatibility(
					currentUser,
					potentialMatch
				);

				return {
					...potentialMatch,
					compatibilityScore,
				};
			})
		);

		// Filter out null values and sort by compatibility
		const validMatches = matchesWithScores
			.filter((match: any) => match !== null)
			.sort((a: any, b: any) => b.compatibilityScore - a.compatibilityScore);

		return Response.json({
			success: true,
			matches: validMatches,
		});
	} catch (error) {
		console.error("Error getting potential matches:", error);
		return Response.json(
			{ error: "Failed to get potential matches" },
			{ status: 500 }
		);
	}
}

function calculateCompatibility(user1: any, user2: any): number {
	let score = 0;

	// Goal compatibility (shared goals)
	const sharedGoals = user1.goals.filter((goal: string) =>
		user2.goals.includes(goal)
	);
	score += sharedGoals.length * 20;

	// Skill complementarity (different but complementary skills)
	const sharedSkills = user1.skills.filter((skill: string) =>
		user2.skills.includes(skill)
	);
	const uniqueSkills = user1.skills.filter(
		(skill: string) => !user2.skills.includes(skill)
	);
	score += sharedSkills.length * 10;
	score += uniqueSkills.length * 5;

	// Location compatibility
	if (user1.location && user2.location) {
		if (user1.location === user2.location) {
			score += 15;
		} else if (
			user1.location.toLowerCase().includes(user2.location.toLowerCase()) ||
			user2.location.toLowerCase().includes(user1.location.toLowerCase())
		) {
			score += 10;
		}
	}

	// Experience level compatibility
	if (user1.experience && user2.experience) {
		const experienceDiff = Math.abs(user1.experience - user2.experience);
		if (experienceDiff <= 2) {
			score += 10;
		} else if (experienceDiff <= 5) {
			score += 5;
		}
	}

	// Interests compatibility
	if (user1.preferences?.interests && user2.preferences?.interests) {
		const sharedInterests = user1.preferences.interests.filter((interest: string) =>
			user2.preferences.interests.includes(interest)
		);
		score += sharedInterests.length * 8;
	}

	return Math.min(score, 100); // Cap at 100
} 