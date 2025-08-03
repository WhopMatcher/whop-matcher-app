import { Heart, ArrowRight, Star, Users, Target, BarChart3, MapPin } from "lucide-react";

export default function DiscoverPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
			{/* Hero Section */}
			<div className="relative overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
				<div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">
					<div className="text-center">
						<div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-2 mb-8">
							<Star className="w-5 h-5 text-yellow-500" />
							<span className="text-sm font-medium text-gray-700">AI-Powered Community Networking</span>
						</div>
						
						<h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
							Connect with Your
							<span className="text-gradient block">Community</span>
						</h1>
						
						<p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
							AI-powered networking that transforms your Whop community into a collaboration powerhouse
						</p>
						
						<div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
							<button className="group bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-4 px-8 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover-lift shadow-glow">
								<span className="flex items-center justify-center space-x-2">
									<Heart className="w-5 h-5" />
									<span>Try Matcher Free</span>
									<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
								</span>
							</button>
							<button className="bg-white/80 backdrop-blur-sm border-2 border-gray-200 text-gray-700 font-semibold py-4 px-8 rounded-xl hover:border-gray-300 hover-lift transition-all duration-300">
								View Demo
							</button>
						</div>

						{/* Stats */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
							<div className="text-center">
								<div className="text-3xl md:text-4xl font-bold text-gradient mb-2">10K+</div>
								<div className="text-gray-600">Active Users</div>
							</div>
							<div className="text-center">
								<div className="text-3xl md:text-4xl font-bold text-gradient mb-2">50K+</div>
								<div className="text-gray-600">Connections Made</div>
							</div>
							<div className="text-center">
								<div className="text-3xl md:text-4xl font-bold text-gradient mb-2">95%</div>
								<div className="text-gray-600">Success Rate</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Features Section */}
			<div className="max-w-7xl mx-auto px-4 py-20">
				<div className="text-center mb-16">
					<h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
						Why Communities Choose Matcher
					</h2>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto">
						Built specifically for Whop communities to foster meaningful connections and drive collaboration.
					</p>
				</div>

				<div className="grid md:grid-cols-3 gap-8 mb-20">
					<div className="group bg-white rounded-2xl shadow-soft p-8 hover-lift">
						<div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
							<Target className="w-8 h-8 text-white" />
						</div>
						<h3 className="text-2xl font-bold text-gray-900 mb-4">Smart AI Matching</h3>
						<p className="text-gray-600 leading-relaxed">
							Our advanced AI algorithm analyzes goals, skills, and interests to create meaningful matches that drive real collaboration.
						</p>
					</div>
					
					<div className="group bg-white rounded-2xl shadow-soft p-8 hover-lift">
						<div className="w-16 h-16 bg-gradient-secondary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
							<Users className="w-8 h-8 text-white" />
						</div>
						<h3 className="text-2xl font-bold text-gray-900 mb-4">Community Growth</h3>
						<p className="text-gray-600 leading-relaxed">
							Increase member engagement and retention through meaningful relationships and mastermind groups.
						</p>
					</div>
					
					<div className="group bg-white rounded-2xl shadow-soft p-8 hover-lift">
						<div className="w-16 h-16 bg-gradient-success rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
							<BarChart3 className="w-8 h-8 text-white" />
						</div>
						<h3 className="text-2xl font-bold text-gray-900 mb-4">Revenue Boost</h3>
						<p className="text-gray-600 leading-relaxed">
							Higher engagement leads to better retention and increased subscription renewals.
						</p>
					</div>
				</div>
			</div>

			{/* Success Stories */}
			<div className="bg-white py-20">
				<div className="max-w-7xl mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
							Success Stories
						</h2>
						<p className="text-xl text-gray-600 max-w-3xl mx-auto">
							See how Matcher is transforming communities and creating meaningful connections.
						</p>
					</div>
					
					<div className="grid md:grid-cols-2 gap-8">
						<div className="group bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 hover-lift">
							<div className="flex items-center space-x-4 mb-6">
								<div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center">
									<span className="text-white font-bold text-xl">TM</span>
								</div>
								<div>
									<h4 className="text-xl font-bold text-gray-900">TechMasters Community</h4>
									<p className="text-gray-600">Developer Network</p>
								</div>
							</div>
							<p className="text-gray-700 leading-relaxed text-lg mb-4">
								"Matcher helped us create <span className="font-bold text-blue-600">150+ partnerships</span> between developers. Our retention jumped <span className="font-bold text-blue-600">40%</span> in just 3 months!"
							</p>
							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-500">
									📊 2,500+ members • $25K/mo revenue
								</span>
								<a
									href="https://whop.com/techmasters/?a=matcher_app"
									className="text-blue-600 hover:text-blue-700 font-semibold text-sm group-hover:underline"
								>
									Visit Community →
								</a>
							</div>
						</div>
						
						<div className="group bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 hover-lift">
							<div className="flex items-center space-x-4 mb-6">
								<div className="w-16 h-16 bg-gradient-secondary rounded-2xl flex items-center justify-center">
									<span className="text-white font-bold text-xl">CC</span>
								</div>
								<div>
									<h4 className="text-xl font-bold text-gray-900">CreatorCollab Hub</h4>
									<p className="text-gray-600">Content Creator Network</p>
								</div>
							</div>
							<p className="text-gray-700 leading-relaxed text-lg mb-4">
								"Members found their perfect collaboration partners. We saw <span className="font-bold text-blue-600">300% growth</span> in cross-promotion campaigns and <span className="font-bold text-blue-600">$15K+</span> in affiliate earnings."
							</p>
							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-500">
									📊 1,800+ members • $18K/mo revenue
								</span>
								<a
									href="https://whop.com/creatorcollab/?a=matcher_app"
									className="text-blue-600 hover:text-blue-700 font-semibold text-sm group-hover:underline"
								>
									Visit Community →
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Additional Features */}
			<div className="max-w-7xl mx-auto px-4 py-20">
				<div className="text-center mb-16">
					<h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
						Powerful Features
					</h2>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto">
						Everything you need to build meaningful connections in your community.
					</p>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
					<div className="group bg-white rounded-2xl shadow-soft p-6 hover-lift">
						<div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
							<Target className="w-6 h-6 text-white" />
						</div>
						<h3 className="text-lg font-bold text-gray-900 mb-2">Goal-Based Matching</h3>
						<p className="text-gray-600 text-sm">
							AI matches members based on shared goals and complementary skills.
						</p>
					</div>
					
					<div className="group bg-white rounded-2xl shadow-soft p-6 hover-lift">
						<div className="w-12 h-12 bg-gradient-secondary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
							<Heart className="w-6 h-6 text-white" />
						</div>
						<h3 className="text-lg font-bold text-gray-900 mb-2">Icebreaker Conversations</h3>
						<p className="text-gray-600 text-sm">
							Smart conversation starters to help connections get started.
						</p>
					</div>
					
					<div className="group bg-white rounded-2xl shadow-soft p-6 hover-lift">
						<div className="w-12 h-12 bg-gradient-success rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
							<Users className="w-6 h-6 text-white" />
						</div>
						<h3 className="text-lg font-bold text-gray-900 mb-2">Mastermind Groups</h3>
						<p className="text-gray-600 text-sm">
							Automatically form groups of 3-5 members with similar goals.
						</p>
					</div>
					
					<div className="group bg-white rounded-2xl shadow-soft p-6 hover-lift">
						<div className="w-12 h-12 bg-gradient-warm rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
							<BarChart3 className="w-6 h-6 text-white" />
						</div>
						<h3 className="text-lg font-bold text-gray-900 mb-2">Analytics Dashboard</h3>
						<p className="text-gray-600 text-sm">
							Track connection success rates and community growth metrics.
						</p>
					</div>
					
					<div className="group bg-white rounded-2xl shadow-soft p-6 hover-lift">
						<div className="w-12 h-12 bg-gradient-cool rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
							<MapPin className="w-6 h-6 text-white" />
						</div>
						<h3 className="text-lg font-bold text-gray-900 mb-2">Location Optimization</h3>
						<p className="text-gray-600 text-sm">
							Prioritize local connections for in-person meetups.
						</p>
					</div>
					
					<div className="group bg-white rounded-2xl shadow-soft p-6 hover-lift">
						<div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
							<Star className="w-6 h-6 text-white" />
						</div>
						<h3 className="text-lg font-bold text-gray-900 mb-2">Viral Mechanics</h3>
						<p className="text-gray-600 text-sm">
							Built-in referral system to grow your community organically.
						</p>
					</div>
				</div>
			</div>

			{/* Call to Action */}
			<div className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
				<div className="max-w-4xl mx-auto px-4 text-center">
					<h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
						Ready to Transform Your Community?
					</h2>
					<p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
						Join thousands of communities using Matcher to build stronger connections and drive growth.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
						<button className="group bg-white text-blue-600 font-bold py-4 px-8 rounded-xl hover:bg-blue-50 transition-all duration-300 hover-lift">
							<span className="flex items-center justify-center space-x-2">
								<Heart className="w-5 h-5" />
								<span>Get Started Free</span>
								<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
							</span>
						</button>
						<button className="bg-transparent border-2 border-white text-white font-semibold py-4 px-8 rounded-xl hover:bg-white/10 transition-all duration-300">
							Schedule Demo
						</button>
					</div>
					
					{/* Affiliate Link */}
					<div className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
						<p className="text-blue-100 mb-4">Ready to install Matcher in your community?</p>
						<a 
							href="/discover/matcher-access-pass/?app=matcher-app-id" 
							className="inline-flex items-center space-x-2 bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg hover:bg-blue-50 transition-all duration-300"
						>
							<span>Get Access Pass</span>
							<ArrowRight className="w-4 h-4" />
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
