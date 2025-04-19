import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Suspense } from "react";
import Loading from "./Loading";
import AppFooter from "./components/AppFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Smata | AI-Powered Study Companion for Smarter Learning",
  description:
    "Boost your academic performance with Smata - the intelligent study planner that generates personalized timetables, tracks progress, and optimizes your learning schedule. Perfect for students who want to study smarter, not harder.",
  keywords: [
    "study planner",
    "AI timetable generator",
    "student productivity",
    "exam preparation tool",
    "personalized study schedule",
    "academic organizer",
    "smart learning app",
    "college study companion",
    "high school study tool",
    "effective study techniques",
  ],
  openGraph: {
    title: "Smata | Your AI Study Assistant",
    description:
      "Transform how you study with AI-powered scheduling and progress tracking. Get your personalized study plan today!",
    url: "https://getsmata.xyz",
    siteName: "Smata",
    images: [
      {
        url: "https://getsmata.xyz/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Smata Study Companion Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smata | AI-Powered Study Companion",
    description:
      "The smart way to organize your study time and boost academic performance",
    images: ["https://getsmata.xyz/twitter-card.jpg"],
  },
  alternates: {
    canonical: "https://getsmata.xyz",
  },

  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport = {
  themeColor: "#4F46E5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  // Optional: Add other viewport settings
  // userScalable: "no",
  // interactiveWidget: "resizes-visual",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {" "}
          <Suspense fallback={<Loading />}>{children} </Suspense>
          <AppFooter />
        </AuthProvider>
      </body>
    </html>
  );
}
