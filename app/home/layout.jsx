// app/dashboard/layout.jsx
"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import AppHeader from "../components/AppHeader";
import { LogOut, BrainCircuit, BookOpen, Clock, Calendar } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Confetti from "react-confetti";

const navItems = [
  { name: "Dashboard", path: "/home/dashboard" },
  { name: "Focus", path: "/home/focus" },
  { name: "Energize ", path: "/home/energize" },
  { name: "Study", path: "/home/study" },
  { name: "Activities", path: "/home/activities" },
];

const navIcons = {
  Dashboard: <BrainCircuit className="w-5 h-5" />,
  "Study Plan": <BookOpen className="w-5 h-5" />,
  "Study Sessions": <Clock className="w-5 h-5" />,
  Activities: <Calendar className="w-5 h-5" />,
  SignOut: <LogOut className="w-5 h-5" />,
};

export default function DashboardLayout({ children }) {
  const { user, signOutUser } = useAuth();
  const [coins, setCoins] = useState(250);
  const [health, setHealth] = useState(80);
  const [streak, setStreak] = useState(3);
  const [showConfetti, setShowConfetti] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Handle theme initialization with SSR compatibility
  useEffect(() => {
    // Set mounted to true when component mounts
    setMounted(true);

    // Get stored theme from localStorage or use system preference as fallback
    const storedTheme = localStorage.getItem("smataTheme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    // Determine which theme to use
    if (storedTheme === "dark" || (storedTheme === null && systemPrefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Effect for theme changes after initial mount
  useEffect(() => {
    if (!mounted) return;

    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("smataTheme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("smataTheme", "light");
    }
  }, [darkMode, mounted]);

  // Game state initialization
  useEffect(() => {
    if (!mounted) return;

    const savedState = JSON.parse(localStorage.getItem("smataGameState")) || {};
    setCoins(savedState.coins || 250);
    setHealth(savedState.health || 80);
    setStreak(savedState.streak || 3);
    setCompletedSessions(savedState.completedSessions || 0);

    const lastLogout = localStorage.getItem("lastLogoutDate");
    const today = new Date().toDateString();
    if (lastLogout !== today) {
      setHealth((prev) => Math.max(prev - 10, 0));
    }
  }, [mounted]);

  // Save game state
  useEffect(() => {
    if (!mounted) return;

    localStorage.setItem(
      "smataGameState",
      JSON.stringify({
        coins,
        health,
        streak,
        completedSessions,
      })
    );
  }, [coins, health, streak, completedSessions, mounted]);

  // Log out
  useEffect(() => {
    if (!user && mounted) {
      router.push("/login");
    }
  }, [user, router, mounted]);

  const handleSignOut = () => {
    const today = new Date().toDateString();
    const lastLogout = localStorage.getItem("lastLogoutDate");
    if (lastLogout !== today) {
      setCoins((prev) => prev + 20);
      setHealth((prev) => Math.min(prev + 5, 100));
      localStorage.setItem("lastLogoutDate", today);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
    signOutUser();
  };

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  // Prevent rendering until after client-side hydration
  if (!mounted) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-900"></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100 pb-20 md:pb-0">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}

      {/* Header */}
      <AppHeader
        coins={coins}
        health={health}
        streak={streak}
        darkMode={darkMode}
        toggleTheme={toggleTheme}
        handleSignOut={handleSignOut}
      />

      {/* Main Content */}
      <main className="container mx-auto p-4 md:p-6">{children}</main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 shadow-lg z-20">
        <div className="flex justify-around">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={`flex flex-col items-center justify-center py-3 px-2 w-full transition-colors ${
                pathname === item.path
                  ? "text-purple-600 dark:text-purple-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-300"
              }`}
            >
              <div className="w-6 h-6">{navIcons[item.name]}</div>
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          ))}
          <button
            onClick={handleSignOut}
            className={`flex flex-col items-center justify-center py-3 px-2 w-full transition-colors text-gray-500 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-300`}
          >
            <div className="w-6 h-6">{navIcons.SignOut}</div>
            <span className="text-xs mt-1">Sign Out</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
