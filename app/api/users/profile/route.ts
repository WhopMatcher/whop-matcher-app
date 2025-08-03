import { whopSdk } from "@/lib/whop-sdk";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function PUT(request: Request) {
	try {
		// Get the user token from headers
		const headersList = await headers();
		const { userId } = await whopSdk.verifyUserToken(headersList);

		// Get request body
		const body = await request.json();
		const { goals, skills, location, experience, bio, preferences } = body;

		// Validate required fields
		if (!goals || !skills) {
			return Response.json(
				{ error: "Goals and skills are required" },
				{ status: 400 }
			);
		}

		// Update user profile
		const updatedUser = await prisma.user.update({
			where: { whopUserId: userId },
			data: {
				goals,
				skills,
				location,
				experience,
				bio,
				updatedAt: new Date(),
			},
		});

		// Update or create preferences
		if (preferences) {
			await prisma.matchingPreferences.upsert({
				where: { userId: updatedUser.id },
				update: {
					interests: preferences.interests || [],
					experienceRange: preferences.experienceRange,
					locationRadius: preferences.locationRadius,
					ageRange: preferences.ageRange,
					updatedAt: new Date(),
				},
				create: {
					userId: updatedUser.id,
					interests: preferences.interests || [],
					experienceRange: preferences.experienceRange,
					locationRadius: preferences.locationRadius,
					ageRange: preferences.ageRange,
				},
			});
		}

		return Response.json({
			success: true,
			user: {
				id: updatedUser.id,
				whopUserId: updatedUser.whopUserId,
				username: updatedUser.username,
				communityId: updatedUser.communityId,
				goals: updatedUser.goals,
				skills: updatedUser.skills,
				location: updatedUser.location,
				experience: updatedUser.experience,
				bio: updatedUser.bio,
				createdAt: updatedUser.createdAt,
				updatedAt: updatedUser.updatedAt,
			},
		});
	} catch (error) {
		console.error("Error updating user profile:", error);
		return Response.json(
			{ error: "Failed to update user profile" },
			{ status: 500 }
		);
	}
} 