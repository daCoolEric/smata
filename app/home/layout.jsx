// app/dashboard/layout.jsx
"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import AppHeader from "../components/AppHeader";
import { LogOut, Home, Brain, Zap, BookOpen, Calendar } from "lucide-react";
import Link from "next/link";
import Confetti from "react-confetti";
import AppFooter from "../components/AppFooter";
import { useTheme } from "next-themes";

const navItems = [
  { name: "Dashboard", path: "/home/dashboard" },
  { name: "Focus", path: "/home/focus" },
  { name: "Energize", path: "/home/energize" },
  { name: "Study", path: "/home/study" },
  { name: "Activities", path: "/home/activities" },
];

const navIcons = {
  Dashboard: <Home className="w-5 h-5" />,
  Focus: <Brain className="w-5 h-5" />,
  Energize: <Zap className="w-5 h-5" />,
  Study: <BookOpen className="w-5 h-5" />,
  Activities: <Calendar className="w-5 h-5" />,
  SignOut: <LogOut className="w-5 h-5" />,
};

export default function DashboardLayout({ children }) {
  const { user, isLoading, signOutUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const [coins, setCoins] = useState(250);
  const [health, setHealth] = useState(80);
  const [streak, setStreak] = useState(3);
  const [showConfetti, setShowConfetti] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const toggleDarkMode = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    setMounted(true);
  }, []);

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

  useEffect(() => {
    if (!isLoading && !user && mounted) {
      router.push("/auth/login");
    }
  }, [user, router, isLoading, mounted]);

  const handleSignOut = async () => {
    try {
      const today = new Date().toDateString();
      const lastLogout = localStorage.getItem("lastLogoutDate");

      if (lastLogout !== today) {
        setCoins((prev) => prev + 20);
        setHealth((prev) => Math.min(prev + 5, 100));
        localStorage.setItem("lastLogoutDate", today);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }

      await signOutUser();
      router.push("/auth/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (!mounted) {
    return <div className="min-h-screen bg-background"></div>;
  }

  return (
    <div class="min-h-screen pb-20 md:pb-0 ">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}

      {/* Header */}
      <AppHeader
        coins={coins}
        health={health}
        streak={streak}
        darkMode={theme === "dark"}
        toggleTheme={toggleDarkMode}
      />

      {/* Main Content */}
      <main className="container bg-[hsl(var(--main-bg))]  mx-auto p-4 md:p-6">
        {children}
      </main>

      {/* Mobile Navigation */}
      <nav
        className={`
  md:hidden 
  fixed bottom-0 left-0 right-0 
  bg-[hsl(var(--background))]
  border-t border-[hsl(var(--nav-mobile-border))]
  shadow-lg 
  z-20
`}
      >
        <div className="flex justify-around">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={`flex flex-col items-center justify-center py-3 px-2 w-full transition-all duration-200 ${
                pathname === item.path
                  ? "text-[hsl(var(--nav-foreground))] bg-purple-50/50 dark:bg-purple-900/20"
                  : "text-gray-500 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-300 hover:bg-purple-50/30 dark:hover:bg-purple-900/10"
              }`}
            >
              <div
                className={`w-6 h-6 transition-all duration-200 ${
                  pathname === item.path
                    ? "text-[hsl(var(--nav-foreground))]"
                    : "text-gray-500 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-300"
                }`}
              >
                {navIcons[item.name]}
              </div>
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          ))}
          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="flex flex-col items-center justify-center py-3 px-2 w-full transition-all duration-200 text-gray-500 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-300 hover:bg-purple-50/30 dark:hover:bg-purple-900/10"
          >
            <div className="w-6 h-6 text-gray-500 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-300">
              {navIcons.SignOut}
            </div>
            <span className="text-xs mt-1">Sign Out</span>
          </button>
        </div>
      </nav>
      <AppFooter />
    </div>
  );
}
