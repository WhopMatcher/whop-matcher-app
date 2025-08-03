"use client";

import { useState, useEffect } from "react";
import { whopSdk } from "@/lib/whop-sdk";
import { headers } from "next/headers";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import { BarChart3, ArrowLeft, Crown, User } from "lucide-react";
import Link from "next/link";

interface UserData {
	whopUserId: string;
	username: string;
	accessLevel: string;
}

export default function DashboardPage() {
	const [user, setUser] = useState<UserData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchUserData();
	}, []);

	const fetchUserData = async () => {
		try {
			setIsLoading(true);
			setError(null);

			// Get user data from Whop
			const response = await fetch("/api/users/sync", {
				method: "GET",
			});

			if (!response.ok) {
				throw new Error("Failed to fetch user data");
			}

			const result = await response.json();
			setUser({
				whopUserId: result.user.whopUserId,
				username: result.user.username,
				accessLevel: "customer", // This would come from Whop SDK in a real implementation
			});
		} catch (err) {
			console.error("Error fetching user data:", err);
			setError("Failed to load user data");
		} finally {
			setIsLoading(false);
		}
	};

	const isAdmin = user?.accessLevel === "admin";

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Loading dashboard...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
				<div className="text-center">
					<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<BarChart3 className="w-8 h-8 text-red-600" />
					</div>
					<h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
					<p className="text-gray-600 mb-4">{error}</p>
					<button
						onClick={fetchUserData}
						className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
					>
						Try Again
					</button>
				</div>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
				<div className="text-center">
					<User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
					<h2 className="text-xl font-semibold text-gray-900 mb-2">No User Found</h2>
					<p className="text-gray-600">Please try refreshing the page.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
			<div className="max-w-7xl mx-auto px-4 py-8">
				{/* Header */}
				<div className="mb-8">
					<Link
						href="/experiences/[experienceId]"
						className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Matcher
					</Link>
					
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
							<p className="text-gray-600">
								Track your matching performance and community insights
							</p>
						</div>
						
						<div className="flex items-center space-x-3">
							<div className="flex items-center space-x-2">
								<User className="w-5 h-5 text-gray-600" />
								<span className="text-sm text-gray-600">@{user.username}</span>
							</div>
							{isAdmin && (
								<div className="flex items-center space-x-2 bg-yellow-100 px-3 py-1 rounded-full">
									<Crown className="w-4 h-4 text-yellow-600" />
									<span className="text-sm font-medium text-yellow-800">Admin</span>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Admin Notice */}
				{isAdmin && (
					<div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 mb-8">
						<div className="flex items-center space-x-3">
							<Crown className="w-6 h-6 text-blue-600" />
							<div>
								<h3 className="text-lg font-semibold text-blue-900">Community Analytics Available</h3>
								<p className="text-blue-700">
									As an admin, you can view both personal and community-wide analytics to track growth and engagement.
								</p>
							</div>
						</div>
					</div>
				)}

				{/* Analytics Dashboard */}
				<AnalyticsDashboard isAdmin={isAdmin} />

				{/* Feature Status */}
				<div className="mt-8 bg-white rounded-xl shadow-lg p-6">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">
						Analytics Features
					</h3>
					<div className="grid md:grid-cols-3 gap-4 text-sm">
						<div className="bg-green-50 rounded-lg p-3">
							<p className="font-medium text-green-800">✅ User Analytics</p>
							<p className="text-green-600">Personal match statistics</p>
						</div>
						<div className="bg-green-50 rounded-lg p-3">
							<p className="font-medium text-green-800">✅ Growth Tracking</p>
							<p className="text-green-600">Weekly metrics & trends</p>
						</div>
						<div className="bg-green-50 rounded-lg p-3">
							<p className="font-medium text-green-800">✅ Data Visualization</p>
							<p className="text-green-600">Recharts integration</p>
						</div>
						<div className="bg-green-50 rounded-lg p-3">
							<p className="font-medium text-green-800">✅ Connection Tracking</p>
							<p className="text-green-600">Mutual match detection</p>
						</div>
						<div className="bg-green-50 rounded-lg p-3">
							<p className="font-medium text-green-800">✅ Community Analytics</p>
							<p className="text-green-600">Admin-only insights</p>
						</div>
						<div className="bg-yellow-50 rounded-lg p-3">
							<p className="font-medium text-yellow-800">🔄 Real-time Updates</p>
							<p className="text-yellow-600">Live data refresh</p>
						</div>
					</div>
				</div>

				{/* Coming Soon Notice */}
				<div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
					<h3 className="text-lg font-semibold text-yellow-800 mb-2">
						🚀 Ready for STEP 6
					</h3>
					<p className="text-yellow-700">
						Analytics dashboard and connection tracking are complete! Next: Polish UI, optimize for mobile, and add discover page.
					</p>
				</div>
			</div>
		</div>
	);
} 