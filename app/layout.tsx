import { WhopApp } from "@whop/react/components";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	metadataBase: new URL("https://matcher.whop.com"),
	title: "Matcher - AI-Powered Community Networking | Whop",
	description: "Connect with like-minded community members through intelligent matching. Find business partners, mentors, and collaborators in your Whop community.",
	keywords: "community networking, AI matching, business partners, mentors, collaborators, Whop app",
	authors: [{ name: "Matcher Team" }],
	creator: "Matcher",
	publisher: "Matcher",
	robots: "index, follow",
	openGraph: {
		title: "Matcher - AI-Powered Community Networking",
		description: "Connect with like-minded community members through intelligent matching. Find business partners, mentors, and collaborators.",
		url: "https://matcher.whop.com",
		siteName: "Matcher",
		images: [
			{
				url: "/og-image.png",
				width: 1200,
				height: 630,
				alt: "Matcher - AI-Powered Community Networking",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Matcher - AI-Powered Community Networking",
		description: "Connect with like-minded community members through intelligent matching.",
		images: ["/og-image.png"],
	},
};

export const viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
};

export const themeColor = "#667eea";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<WhopApp>{children}</WhopApp>
			</body>
		</html>
	);
}
