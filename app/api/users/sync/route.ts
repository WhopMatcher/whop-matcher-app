import { whopSdk } from "@/lib/whop-sdk";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function POST() {
	try {
		// Get the user token from headers
		const headersList = await headers();
		const { userId } = await whopSdk.verifyUserToken(headersList);

		// Get user data from Whop
		const whopUser = await whopSdk.users.getUser({ userId });

		// Get the experience/community context
		const experienceId = headersList.get("x-whop-experience-id");
		if (!experienceId) {
			return Response.json(
				{ error: "Experience ID not found in headers" },
				{ status: 400 }
			);
		}

		// Check if user exists in our database
		let user = await prisma.user.findUnique({
			where: { whopUserId: userId },
		});

		if (user) {
			// Update existing user
			user = await prisma.user.update({
				where: { whopUserId: userId },
				data: {
					username: whopUser.username,
					communityId: experienceId,
					updatedAt: new Date(),
				},
			});
		} else {
			// Create new user
			user = await prisma.user.create({
				data: {
					whopUserId: userId,
					username: whopUser.username,
					communityId: experienceId,
					goals: [],
					skills: [],
				},
			});
		}

		return Response.json({
			success: true,
			user: {
				id: user.id,
				whopUserId: user.whopUserId,
				username: user.username,
				communityId: user.communityId,
				goals: user.goals,
				skills: user.skills,
				location: user.location,
				experience: user.experience,
				bio: user.bio,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
			},
		});
	} catch (error) {
		console.error("Error syncing user:", error);
		return Response.json(
			{ error: "Failed to sync user" },
			{ status: 500 }
		);
	}
}

export async function GET() {
	try {
		// Get the user token from headers
		const headersList = await headers();
		const { userId } = await whopSdk.verifyUserToken(headersList);

		// Get user from our database
		const user = await prisma.user.findUnique({
			where: { whopUserId: userId },
			include: {
				preferences: true,
			},
		});

		if (!user) {
			return Response.json(
				{ error: "User not found" },
				{ status: 404 }
			);
		}

		return Response.json({
			success: true,
			user: {
				id: user.id,
				whopUserId: user.whopUserId,
				username: user.username,
				communityId: user.communityId,
				goals: user.goals,
				skills: user.skills,
				location: user.location,
				experience: user.experience,
				bio: user.bio,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
				preferences: user.preferences,
			},
		});
	} catch (error) {
		console.error("Error getting user:", error);
		return Response.json(
			{ error: "Failed to get user" },
			{ status: 500 }
		);
	}
} 