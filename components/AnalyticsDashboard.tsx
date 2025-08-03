"use client";

import { useState, useEffect } from "react";
import { 
	LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
	XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { 
	TrendingUp, Users, Heart, Target, Briefcase, Activity, 
	BarChart3, Loader2, AlertCircle, User 
} from "lucide-react";

interface AnalyticsData {
	overview: {
		totalMatches: number;
		acceptedMatches: number;
		pendingMatches: number;
		rejectedMatches: number;
		connections: number;
		connectionRate: number;
		averageCompatibility: number;
	};
	growth: {
		matchesThisWeek: number;
		matchesLastWeek: number;
		weeklyGrowth: number;
	};
	trends: {
		chartData: Array<{ date: string; matches: number }>;
		topGoals: Array<{ goal: string; count: number }>;
		topSkills: Array<{ skill: string; count: number }>;
	};
	recentActivity: Array<{
		id: string;
		status: string;
		compatibility: number;
		createdAt: string;
		otherUser: { username: string };
	}>;
}

interface CommunityAnalyticsData {
	overview: {
		totalUsers: number;
		totalMatches: number;
		acceptedMatches: number;
		pendingMatches: number;
		connections: number;
		averageMatchesPerUser: number;
		connectionRate: number;
		averageCompatibility: number;
	};
	growth: {
		newUsersThisWeek: number;
		newUsersLastWeek: number;
		userGrowth: number;
	};
	trends: {
		chartData: Array<{ date: string; matches: number }>;
		topCommunityGoals: Array<{ goal: string; count: number }>;
		topCommunitySkills: Array<{ skill: string; count: number }>;
	};
	topUsers: Array<{ username: string; matches: number }>;
	recentActivity: Array<{
		id: string;
		status: string;
		compatibility: number;
		createdAt: string;
		user1: { username: string };
		user2: { username: string };
	}>;
}

interface AnalyticsDashboardProps {
	isAdmin?: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function AnalyticsDashboard({ isAdmin = false }: AnalyticsDashboardProps) {
	const [userAnalytics, setUserAnalytics] = useState<AnalyticsData | null>(null);
	const [communityAnalytics, setCommunityAnalytics] = useState<CommunityAnalyticsData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState<"user" | "community">("user");

	useEffect(() => {
		fetchAnalytics();
	}, [activeTab]);

	const fetchAnalytics = async () => {
		try {
			setIsLoading(true);
			setError(null);

			if (activeTab === "user") {
				const response = await fetch("/api/analytics/user");
				if (!response.ok) throw new Error("Failed to fetch user analytics");
				const result = await response.json();
				setUserAnalytics(result.analytics);
			} else {
				const response = await fetch("/api/analytics/community");
				if (!response.ok) throw new Error("Failed to fetch community analytics");
				const result = await response.json();
				setCommunityAnalytics(result.analytics);
			}
		} catch (err) {
			console.error("Error fetching analytics:", err);
			setError("Failed to load analytics data");
		} finally {
			setIsLoading(false);
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString();
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "accepted": return "text-green-600";
			case "pending": return "text-yellow-600";
			case "rejected": return "text-red-600";
			default: return "text-gray-600";
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-96">
				<div className="text-center">
					<Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
					<p className="text-gray-600">Loading analytics...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center h-96">
				<div className="text-center">
					<AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
					<h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Analytics</h3>
					<p className="text-gray-600 mb-4">{error}</p>
					<button
						onClick={fetchAnalytics}
						className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
					>
						Try Again
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Tab Navigation */}
			<div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
				<button
					onClick={() => setActiveTab("user")}
					className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
						activeTab === "user"
							? "bg-white text-blue-600 shadow-sm"
							: "text-gray-600 hover:text-gray-900"
					}`}
				>
					<User className="w-4 h-4 inline mr-2" />
					My Analytics
				</button>
				{isAdmin && (
					<button
						onClick={() => setActiveTab("community")}
						className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
							activeTab === "community"
								? "bg-white text-blue-600 shadow-sm"
								: "text-gray-600 hover:text-gray-900"
						}`}
					>
						<Users className="w-4 h-4 inline mr-2" />
						Community Analytics
					</button>
				)}
			</div>

			{/* User Analytics */}
			{activeTab === "user" && userAnalytics && (
				<div className="space-y-6">
					{/* Overview Cards */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						<div className="bg-white rounded-xl shadow-lg p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600">Total Matches</p>
									<p className="text-2xl font-bold text-gray-900">{userAnalytics.overview.totalMatches}</p>
								</div>
								<Heart className="w-8 h-8 text-pink-500" />
							</div>
						</div>

						<div className="bg-white rounded-xl shadow-lg p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600">Connections</p>
									<p className="text-2xl font-bold text-gray-900">{userAnalytics.overview.connections}</p>
								</div>
								<TrendingUp className="w-8 h-8 text-green-500" />
							</div>
						</div>

						<div className="bg-white rounded-xl shadow-lg p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600">Success Rate</p>
									<p className="text-2xl font-bold text-gray-900">{userAnalytics.overview.connectionRate}%</p>
								</div>
								<BarChart3 className="w-8 h-8 text-blue-500" />
							</div>
						</div>

						<div className="bg-white rounded-xl shadow-lg p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600">Avg Compatibility</p>
									<p className="text-2xl font-bold text-gray-900">{userAnalytics.overview.averageCompatibility}%</p>
								</div>
								<Activity className="w-8 h-8 text-purple-500" />
							</div>
						</div>
					</div>

					{/* Growth Metrics */}
					<div className="bg-white rounded-xl shadow-lg p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Growth</h3>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="text-center">
								<p className="text-2xl font-bold text-blue-600">{userAnalytics.growth.matchesThisWeek}</p>
								<p className="text-sm text-gray-600">This Week</p>
							</div>
							<div className="text-center">
								<p className="text-2xl font-bold text-gray-600">{userAnalytics.growth.matchesLastWeek}</p>
								<p className="text-sm text-gray-600">Last Week</p>
							</div>
							<div className="text-center">
								<p className={`text-2xl font-bold ${userAnalytics.growth.weeklyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
									{userAnalytics.growth.weeklyGrowth >= 0 ? '+' : ''}{userAnalytics.growth.weeklyGrowth}%
								</p>
								<p className="text-sm text-gray-600">Growth</p>
							</div>
						</div>
					</div>

					{/* Charts */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{/* Match History Chart */}
						<div className="bg-white rounded-xl shadow-lg p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">Match History</h3>
							<ResponsiveContainer width="100%" height={300}>
								<AreaChart data={userAnalytics.trends.chartData}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="date" />
									<YAxis />
									<Tooltip />
									<Area type="monotone" dataKey="matches" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
								</AreaChart>
							</ResponsiveContainer>
						</div>

						{/* Top Goals Chart */}
						<div className="bg-white rounded-xl shadow-lg p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">Top Matching Goals</h3>
							<ResponsiveContainer width="100%" height={300}>
								<BarChart data={userAnalytics.trends.topGoals}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="goal" />
									<YAxis />
									<Tooltip />
									<Bar dataKey="count" fill="#8B5CF6" />
								</BarChart>
							</ResponsiveContainer>
						</div>
					</div>

					{/* Recent Activity */}
					<div className="bg-white rounded-xl shadow-lg p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
						<div className="space-y-3">
							{userAnalytics.recentActivity.map((activity) => (
								<div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
									<div className="flex items-center space-x-3">
										<div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
											<Heart className="w-4 h-4 text-blue-600" />
										</div>
										<div>
											<p className="font-medium text-gray-900">@{activity.otherUser.username}</p>
											<p className="text-sm text-gray-600">
												{activity.compatibility}% compatibility
											</p>
										</div>
									</div>
									<div className="text-right">
										<p className={`text-sm font-medium ${getStatusColor(activity.status)}`}>
											{activity.status}
										</p>
										<p className="text-xs text-gray-500">
											{formatDate(activity.createdAt)}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			)}

			{/* Community Analytics */}
			{activeTab === "community" && communityAnalytics && (
				<div className="space-y-6">
					{/* Overview Cards */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						<div className="bg-white rounded-xl shadow-lg p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600">Total Users</p>
									<p className="text-2xl font-bold text-gray-900">{communityAnalytics.overview.totalUsers}</p>
								</div>
								<Users className="w-8 h-8 text-blue-500" />
							</div>
						</div>

						<div className="bg-white rounded-xl shadow-lg p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600">Total Matches</p>
									<p className="text-2xl font-bold text-gray-900">{communityAnalytics.overview.totalMatches}</p>
								</div>
								<Heart className="w-8 h-8 text-pink-500" />
							</div>
						</div>

						<div className="bg-white rounded-xl shadow-lg p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600">Connection Rate</p>
									<p className="text-2xl font-bold text-gray-900">{communityAnalytics.overview.connectionRate}%</p>
								</div>
								<TrendingUp className="w-8 h-8 text-green-500" />
							</div>
						</div>

						<div className="bg-white rounded-xl shadow-lg p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600">Avg Matches/User</p>
									<p className="text-2xl font-bold text-gray-900">{communityAnalytics.overview.averageMatchesPerUser}</p>
								</div>
								<BarChart3 className="w-8 h-8 text-purple-500" />
							</div>
						</div>
					</div>

					{/* Growth Metrics */}
					<div className="bg-white rounded-xl shadow-lg p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="text-center">
								<p className="text-2xl font-bold text-blue-600">{communityAnalytics.growth.newUsersThisWeek}</p>
								<p className="text-sm text-gray-600">New This Week</p>
							</div>
							<div className="text-center">
								<p className="text-2xl font-bold text-gray-600">{communityAnalytics.growth.newUsersLastWeek}</p>
								<p className="text-sm text-gray-600">New Last Week</p>
							</div>
							<div className="text-center">
								<p className={`text-2xl font-bold ${communityAnalytics.growth.userGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
									{communityAnalytics.growth.userGrowth >= 0 ? '+' : ''}{communityAnalytics.growth.userGrowth}%
								</p>
								<p className="text-sm text-gray-600">Growth</p>
							</div>
						</div>
					</div>

					{/* Charts */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{/* Community Activity Chart */}
						<div className="bg-white rounded-xl shadow-lg p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">Community Activity</h3>
							<ResponsiveContainer width="100%" height={300}>
								<LineChart data={communityAnalytics.trends.chartData}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="date" />
									<YAxis />
									<Tooltip />
									<Line type="monotone" dataKey="matches" stroke="#3B82F6" strokeWidth={2} />
								</LineChart>
							</ResponsiveContainer>
						</div>

						{/* Top Community Goals */}
						<div className="bg-white rounded-xl shadow-lg p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">Community Goals</h3>
							<ResponsiveContainer width="100%" height={300}>
								<BarChart data={communityAnalytics.trends.topCommunityGoals}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="goal" />
									<YAxis />
									<Tooltip />
									<Bar dataKey="count" fill="#10B981" />
								</BarChart>
							</ResponsiveContainer>
						</div>
					</div>

					{/* Top Users */}
					<div className="bg-white rounded-xl shadow-lg p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">Most Active Users</h3>
						<div className="space-y-3">
							{communityAnalytics.topUsers.map((user, index) => (
								<div key={user.username} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
									<div className="flex items-center space-x-3">
										<div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
											<span className="text-sm font-bold text-blue-600">{index + 1}</span>
										</div>
										<div>
											<p className="font-medium text-gray-900">@{user.username}</p>
											<p className="text-sm text-gray-600">{user.matches} matches</p>
										</div>
									</div>
									<div className="text-right">
										<p className="text-sm font-medium text-blue-600">#{index + 1}</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	);
} 