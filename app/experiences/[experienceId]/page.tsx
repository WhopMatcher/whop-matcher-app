import { whopSdk } from "@/lib/whop-sdk";
import { headers } from "next/headers";
import { User, MapPin, Target, Users, Settings, Heart, ArrowRight, UserCheck, BarChart3 } from "lucide-react";
import Link from "next/link";
import SwipeDeck from "@/components/SwipeDeck";

export default async function ExperiencePage({
	params,
}: {
	params: Promise<{ experienceId: string }>;
}) {
	// The headers contains the user token
	const headersList = await headers();

	// The experienceId is a path param
	const { experienceId } = await params;

	// The user token is in the headers
	const { userId } = await whopSdk.verifyUserToken(headersList);

	const result = await whopSdk.access.checkIfUserHasAccessToExperience({
		userId,
		experienceId,
	});

	const user = await whopSdk.users.getUser({ userId });
	const experience = await whopSdk.experiences.getExperience({ experienceId });

	// Either: 'admin' | 'customer' | 'no_access';
	const { accessLevel } = result;

	// If user doesn't have access, show access denied
	if (!result.hasAccess) {
		return (
			<div className="flex justify-center items-center h-screen px-8">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-red-600 mb-4">
						Access Denied
					</h1>
					<p className="text-gray-600">
						You don't have access to this Matcher experience.
					</p>
				</div>
			</div>
		);
	}

	// Sync user with database (this will be handled by client-side API calls)
	// For now, we'll show the UI and let the client handle the sync

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
			<div className="max-w-6xl mx-auto px-4 py-8">
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-gray-900 mb-2">
						Welcome to Matcher
					</h1>
					<p className="text-lg text-gray-600">
						AI-powered networking for {experience.name}
					</p>
				</div>

				{/* User Profile Card */}
				<div className="bg-white rounded-xl shadow-lg p-6 mb-8">
					<div className="flex items-center space-x-4 mb-4">
						<div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
							<User className="w-8 h-8 text-white" />
						</div>
						<div>
							<h2 className="text-xl font-semibold text-gray-900">
								{user.name}
							</h2>
							<p className="text-gray-600">@{user.username}</p>
							<p className="text-sm text-gray-500">
								Access Level: {accessLevel}
							</p>
						</div>
					</div>

					{/* Quick Stats */}
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
						<div className="bg-blue-50 rounded-lg p-4 text-center">
							<Target className="w-6 h-6 text-blue-600 mx-auto mb-2" />
							<p className="text-sm text-gray-600">Goals Set</p>
							<p className="text-2xl font-bold text-blue-600">0</p>
						</div>
						<div className="bg-purple-50 rounded-lg p-4 text-center">
							<Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
							<p className="text-sm text-gray-600">Connections</p>
							<p className="text-2xl font-bold text-purple-600">0</p>
						</div>
						<div className="bg-green-50 rounded-lg p-4 text-center">
							<MapPin className="w-6 h-6 text-green-600 mx-auto mb-2" />
							<p className="text-sm text-gray-600">Location</p>
							<p className="text-lg font-semibold text-green-600">Not Set</p>
						</div>
						<div className="bg-pink-50 rounded-lg p-4 text-center">
							<Heart className="w-6 h-6 text-pink-600 mx-auto mb-2" />
							<p className="text-sm text-gray-600">Matches</p>
							<p className="text-2xl font-bold text-pink-600">0</p>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="flex flex-col sm:flex-row gap-3">
						<Link
							href="/profile"
							className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 text-center"
						>
							<UserCheck className="w-5 h-5 inline mr-2" />
							Complete Profile
						</Link>
						<Link
							href="#matches"
							className="flex-1 bg-white border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:border-gray-400 transition-all duration-200 text-center"
						>
							<Heart className="w-5 h-5 inline mr-2" />
							Start Matching
						</Link>
						<Link
							href="/dashboard"
							className="flex-1 bg-white border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:border-gray-400 transition-all duration-200 text-center"
						>
							<BarChart3 className="w-5 h-5 inline mr-2" />
							Analytics
						</Link>
					</div>
				</div>

				{/* Features Preview */}
				<div className="grid md:grid-cols-2 gap-6 mb-8">
					<div className="bg-white rounded-xl shadow-lg p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-3">
							Smart Matching
						</h3>
						<p className="text-gray-600 mb-4">
							Our AI analyzes your goals, skills, and interests to find the perfect
							connections for collaboration and growth.
						</p>
						<div className="text-sm text-gray-500">
							🎯 Goal-based matching
							<br />
							🤝 Skill complementarity
							<br />
							📍 Location optimization
						</div>
					</div>

					<div className="bg-white rounded-xl shadow-lg p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-3">
							Community Growth
						</h3>
						<p className="text-gray-600 mb-4">
							Build meaningful relationships and mastermind groups within your
							Whop community.
						</p>
						<div className="text-sm text-gray-500">
							💬 Icebreaker conversations
				<br />
							👥 Mastermind groups
				<br />
							📊 Connection analytics
						</div>
					</div>
				</div>

				{/* Discover Matches Section */}
				<div id="matches" className="bg-white rounded-xl shadow-lg p-8 mb-8">
					<div className="text-center mb-8">
						<h2 className="text-3xl font-bold text-gray-900 mb-2">
							Discover Matches
						</h2>
						<p className="text-gray-600">
							Swipe through potential connections in your community
						</p>
					</div>

					{/* SwipeDeck Component */}
					<div className="flex justify-center">
						<SwipeDeck
							onMatch={(match) => {
								console.log("Matched with:", match.username);
								// Handle match success
							}}
							onReject={(match) => {
								console.log("Rejected:", match.username);
								// Handle rejection
							}}
						/>
					</div>

					{/* Instructions */}
					<div className="mt-8 text-center">
						<div className="inline-flex items-center space-x-6 bg-gray-50 rounded-full px-6 py-3">
							<div className="flex items-center space-x-2">
								<div className="w-4 h-4 bg-red-500 rounded-full"></div>
								<span className="text-sm text-gray-600">Swipe Left to Pass</span>
							</div>
							<div className="flex items-center space-x-2">
								<div className="w-4 h-4 bg-green-500 rounded-full"></div>
								<span className="text-sm text-gray-600">Swipe Right to Connect</span>
							</div>
						</div>
					</div>
				</div>

				{/* API Status */}
				<div className="bg-white rounded-xl shadow-lg p-6 mb-8">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">
						Feature Status
					</h3>
					<div className="grid md:grid-cols-3 gap-4 text-sm">
						<div className="bg-green-50 rounded-lg p-3">
							<p className="font-medium text-green-800">✅ Profile Setup</p>
							<p className="text-green-600">Complete form with validation</p>
						</div>
						<div className="bg-green-50 rounded-lg p-3">
							<p className="font-medium text-green-800">✅ Swipe Interface</p>
							<p className="text-green-600">Framer Motion animations</p>
						</div>
						<div className="bg-green-50 rounded-lg p-3">
							<p className="font-medium text-green-800">✅ Match API</p>
							<p className="text-green-600">/api/matches/connect</p>
						</div>
						<div className="bg-green-50 rounded-lg p-3">
							<p className="font-medium text-green-800">✅ User Sync</p>
							<p className="text-green-600">/api/users/sync</p>
						</div>
						<div className="bg-green-50 rounded-lg p-3">
							<p className="font-medium text-green-800">✅ Profile API</p>
							<p className="text-green-600">/api/users/profile</p>
						</div>
						<div className="bg-yellow-50 rounded-lg p-3">
							<p className="font-medium text-yellow-800">🔄 Database Migration</p>
							<p className="text-yellow-600">Ready to deploy</p>
						</div>
					</div>
				</div>

				{/* Coming Soon Notice */}
				<div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
					<h3 className="text-lg font-semibold text-yellow-800 mb-2">
						🚀 Ready for STEP 5
					</h3>
					<p className="text-yellow-700">
						Profile setup and swipe interface are complete! Next: Add analytics dashboard and connection tracking.
					</p>
				</div>
			</div>
		</div>
	);
}
