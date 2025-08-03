export default function Page() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-4xl mx-auto">
				<div className="text-center mb-12">
					<h1 className="text-6xl font-bold text-gray-900 mb-4">
						Welcome to Matcher
					</h1>
					<p className="text-xl text-gray-600">
						AI-powered networking app for Whop communities
					</p>
				</div>

				<div className="space-y-8">
					<div className="bg-white p-8 rounded-xl shadow-lg">
						<h2 className="text-3xl font-semibold text-gray-900 mb-4 flex items-center">
							<span className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white mr-4">
								1
							</span>
							Create your Whop app
						</h2>
						<p className="text-gray-600 ml-14 mb-4">
							Go to your{" "}
							<a
								href="https://whop.com/dashboard"
								target="_blank"
								rel="noopener noreferrer"
								className="text-blue-600 hover:text-blue-700 underline"
							>
								Whop Dashboard
							</a>{" "}
							and create a new app in the Developer section. Set the app name to
							"Matcher" and configure the hosting settings.
						</p>
						<div className="ml-14 bg-gray-50 rounded-lg p-4">
							<p className="text-sm text-gray-700 font-medium mb-2">
								Required Settings:
							</p>
							<ul className="text-sm text-gray-600 space-y-1">
								<li>• Base URL: Your deployment domain</li>
								<li>• App path: /experiences/[experienceId]</li>
								<li>• Discover path: /discover</li>
							</ul>
						</div>
					</div>

					<div className="bg-white p-8 rounded-xl shadow-lg">
						<h2 className="text-3xl font-semibold text-gray-900 mb-4 flex items-center">
							<span className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-purple-500 text-white mr-4">
								2
							</span>
							Configure environment variables
						</h2>
						<p className="text-gray-600 ml-14 mb-4">
							Copy the environment variables from your Whop dashboard and add them
							to your deployment platform (Vercel recommended).
						</p>
						{process.env.NODE_ENV === "development" && (
							<div className="ml-14 bg-gray-50 rounded-lg p-4">
								<p className="text-sm text-gray-700 font-medium mb-2">
									Required Environment Variables:
								</p>
								<pre className="text-xs text-gray-600">
									<code>
										WHOP_API_KEY={process.env.WHOP_API_KEY?.slice(0, 5)}...
										<br />
										NEXT_PUBLIC_WHOP_AGENT_USER_ID=
										{process.env.NEXT_PUBLIC_WHOP_AGENT_USER_ID}
										<br />
										NEXT_PUBLIC_WHOP_APP_ID=
										{process.env.NEXT_PUBLIC_WHOP_APP_ID}
										<br />
										NEXT_PUBLIC_WHOP_COMPANY_ID=
										{process.env.NEXT_PUBLIC_WHOP_COMPANY_ID}
										<br />
										DATABASE_URL=your_postgresql_connection_string
									</code>
								</pre>
							</div>
						)}
					</div>

					<div className="bg-white p-8 rounded-xl shadow-lg">
						<h2 className="text-3xl font-semibold text-gray-900 mb-4 flex items-center">
							<span className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-green-500 text-white mr-4">
								3
							</span>
							Install Matcher in your community
						</h2>
						<p className="text-gray-600 ml-14 mb-4">
							Add Matcher to your Whop community to enable AI-powered networking
							for your members.
						</p>
						{process.env.NEXT_PUBLIC_WHOP_APP_ID ? (
							<div className="ml-14">
								<a
									href={`https://whop.com/apps/${process.env.NEXT_PUBLIC_WHOP_APP_ID}/install`}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
								>
									Install Matcher →
								</a>
							</div>
						) : (
							<div className="ml-14">
								<span className="text-amber-600 font-medium">
									Please set your environment variables to see the installation
									link
								</span>
							</div>
						)}
					</div>

					<div className="bg-white p-8 rounded-xl shadow-lg">
						<h2 className="text-3xl font-semibold text-gray-900 mb-4 flex items-center">
							<span className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-orange-500 text-white mr-4">
								4
							</span>
							Test the experience
						</h2>
						<p className="text-gray-600 ml-14 mb-4">
							Once installed, your community members can access Matcher through
							the Whop dashboard. They'll see a personalized networking interface
							with matching features.
						</p>
						<div className="ml-14 bg-blue-50 rounded-lg p-4">
							<p className="text-sm text-blue-800">
								💡 <strong>Tip:</strong> The experience view is gated by Whop SDK
								authentication, ensuring only your community members can access
								the networking features.
							</p>
						</div>
					</div>
				</div>

				<div className="mt-12 text-center">
					<div className="bg-white rounded-xl p-8 shadow-lg">
						<h3 className="text-2xl font-bold text-gray-900 mb-4">
							What's Next?
						</h3>
						<p className="text-gray-600 mb-6">
							We're actively building the core matching features. Stay tuned for:
						</p>
						<div className="grid md:grid-cols-3 gap-4 text-sm">
							<div className="text-center">
								<span className="text-2xl mb-2 block">🎯</span>
								<p className="font-medium text-gray-900">Smart Matching</p>
								<p className="text-gray-600">AI-powered compatibility scoring</p>
							</div>
							<div className="text-center">
								<span className="text-2xl mb-2 block">💬</span>
								<p className="font-medium text-gray-900">Icebreakers</p>
								<p className="text-gray-600">Conversation starters for connections</p>
							</div>
							<div className="text-center">
								<span className="text-2xl mb-2 block">📊</span>
								<p className="font-medium text-gray-900">Analytics</p>
								<p className="text-gray-600">Connection success tracking</p>
							</div>
						</div>
					</div>
				</div>

				<div className="mt-8 text-center text-sm text-gray-500">
					<p>
						Need help? Visit the{" "}
						<a
							href="https://dev.whop.com"
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-600 hover:text-blue-700 underline"
						>
							Whop Documentation
						</a>{" "}
						or{" "}
						<a
							href="/discover"
							className="text-purple-600 hover:text-purple-700 underline"
						>
							view the discover page
						</a>
					</p>
				</div>
			</div>
		</div>
	);
}
