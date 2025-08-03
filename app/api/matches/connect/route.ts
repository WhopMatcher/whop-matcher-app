import { whopSdk } from "@/lib/whop-sdk";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function POST(request: Request) {
	try {
		// Get the user token from headers
		const headersList = await headers();
		const { userId } = await whopSdk.verifyUserToken(headersList);

		// Get request body
		const body = await request.json();
		const { targetUserId, action } = body;

		if (!targetUserId || !action) {
			return Response.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}

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

		// Get target user
		const targetUser = await prisma.user.findUnique({
			where: { id: targetUserId },
		});

		if (!targetUser) {
			return Response.json(
				{ error: "Target user not found" },
				{ status: 404 }
			);
		}

		// Check if match already exists
		const existingMatch = await prisma.match.findFirst({
			where: {
				OR: [
					{
						user1Id: currentUser.id,
						user2Id: targetUser.id,
					},
					{
						user1Id: targetUser.id,
						user2Id: currentUser.id,
					},
				],
			},
		});

		if (existingMatch) {
			// Update existing match
			const updatedMatch = await prisma.match.update({
				where: { id: existingMatch.id },
				data: {
					status: action === "like" ? "accepted" : "rejected",
					compatibility: existingMatch.compatibility,
					updatedAt: new Date(),
				},
			});

			// Check if this creates a mutual match (both users liked each other)
			if (action === "like" && updatedMatch.status === "accepted") {
				// Check if there's a reverse match that's also accepted
				const reverseMatch = await prisma.match.findFirst({
					where: {
						user1Id: targetUser.id,
						user2Id: currentUser.id,
						status: "accepted",
					},
				});

				if (reverseMatch) {
					// Create a connection record for the mutual match
					await prisma.connection.create({
						data: {
							matchId: updatedMatch.id,
							interactionLevel: "initial",
							collaborationStatus: "pending",
						},
					});
				}
			}

			return Response.json({
				success: true,
				match: updatedMatch,
				action,
				isMutualMatch: action === "like" && updatedMatch.status === "accepted",
			});
		} else {
			// Create new match
			const newMatch = await prisma.match.create({
				data: {
					user1Id: currentUser.id,
					user2Id: targetUser.id,
					compatibility: 0, // Will be calculated later
					status: action === "like" ? "pending" : "rejected",
				},
			});

			// Check if this creates a mutual match
			if (action === "like") {
				const reverseMatch = await prisma.match.findFirst({
					where: {
						user1Id: targetUser.id,
						user2Id: currentUser.id,
						status: "accepted",
					},
				});

				if (reverseMatch) {
					// Update the new match to accepted and create connection
					const updatedMatch = await prisma.match.update({
						where: { id: newMatch.id },
						data: { status: "accepted" },
					});

					await prisma.connection.create({
						data: {
							matchId: updatedMatch.id,
							interactionLevel: "initial",
							collaborationStatus: "pending",
						},
					});

					return Response.json({
						success: true,
						match: updatedMatch,
						action,
						isMutualMatch: true,
					});
				}
			}

			return Response.json({
				success: true,
				match: newMatch,
				action,
				isMutualMatch: false,
			});
		}
	} catch (error) {
		console.error("Error processing match:", error);
		return Response.json(
			{ error: "Failed to process match" },
			{ status: 500 }
		);
	}
} 