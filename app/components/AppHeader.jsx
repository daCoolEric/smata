// app/components/AppHeader.jsx
"use client";
import { useAuth } from "@/context/AuthContext";
import {
  BrainCircuit,
  Coins,
  Heart,
  Flame,
  Sun,
  Moon,
  LogOut,
  Home,
  Brain,
  Zap,
  BookOpen,
  Calendar,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

const navItems = [
  { name: "Dashboard", path: "/home/dashboard" },
  { name: "Focus", path: "/home/focus" },
  { name: "Energize ", path: "/home/energize" },
  { name: "Study", path: "/home/study" },
  { name: "Activities", path: "/home/activities" },
];

export default function AppHeader({
  coins,
  health,
  streak,
  darkMode,
  toggleTheme,
  handleSignOut,
}) {
  const { user } = useAuth();
  const pathname = usePathname();
  const now = new Date();

  const currentTime = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const currentDate = now.toLocaleDateString([], {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      {/* Header */}
      <header className="bg-[hsl(var(--background))] shadow-sm sticky top-0 z-10">
        <div className="container mx-auto">
          {/* Desktop Header */}
          <div className="hidden md:flex justify-between items-center p-4">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <div>
                <h1
                  className="text-2xl font-bold bg-gradient-to-r 
              from-[hsl(var(--gradient-from))] 
              to-[hsl(var(--gradient-to))]
              bg-clip-text text-transparent"
                >
                  Smata
                </h1>
                <p className="text-sm text-[hsl(var(--timestamp-color))]">
                  {currentTime} · {currentDate}
                </p>
              </div>
            </div>

            {/* Game Stats */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 bg-[hsl(var(--secondary))] dark:bg-[hsl(var(--secondary))] px-3 py-1 rounded-full">
                <Coins className="w-5 h-5 text-yellow-500" />
                <span className="font-medium text-[hsl(var(--foreground))]">
                  {coins}
                </span>
              </div>

              <div className="flex items-center gap-2 bg-[hsl(var(--secondary))] dark:bg-[hsl(var(--secondary))] px-3 py-1 rounded-full">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="font-medium text-[hsl(var(--foreground))]">
                  {health}/100
                </span>
              </div>

              <div className="flex items-center gap-2 bg-[hsl(var(--secondary))] dark:bg-[hsl(var(--secondary))] px-3 py-1 rounded-full">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="font-medium text-[hsl(var(--foreground))]">
                  {streak} day streak
                </span>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              {/* User Profile */}
              <div className="flex items-center gap-2">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border-2 border-purple-100 dark:border-purple-900"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/50 dark:to-blue-900/50 flex items-center justify-center">
                    <span className="text-purple-600 dark:text-purple-300 font-medium">
                      {user?.displayName?.charAt(0) || "U"}
                    </span>
                  </div>
                )}
                <button
                  onClick={handleSignOut}
                  className="hidden md:flex items-center gap-1 px-4 py-2 font-medium text-sm text-[hsl(var(--foreground))] hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-full transition-all duration-200"
                >
                  Sign Out
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block border-t border-gray-200/50 dark:border-gray-700/30">
            <div className="flex">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`flex-1 text-center px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    pathname === item.path
                      ? "text-[hsl(var(--nav-foreground))] border-b-2 border-[hsl(var(--nav-foreground))] bg-purple-50/50 dark:bg-purple-900/20"
                      : "text-gray-500 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-300 hover:bg-purple-50/30 dark:hover:bg-purple-900/10"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden bg-[hsl(var(--background))] backdrop-blur-md p-4 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <h1
                className="text-lg font-bold 
              bg-gradient-to-r 
              from-[hsl(var(--gradient-from))] 
              to-[hsl(var(--gradient-to))]
              bg-clip-text text-transparent"
              >
                Smata
              </h1>
              <p className="text-xs text-[hsl(var(--timestamp-color))]">
                {currentTime} ·{" "}
                {now.toLocaleDateString([], { month: "short", day: "numeric" })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
            <div className="flex items-center gap-1 bg-[hsl(var(--secondary))] px-2 py-1 rounded-full">
              <Coins className="w-4 h-4 text-yellow-500" />
              <span className="text-xs font-medium">{coins}</span>
            </div>
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border-2 border-purple-100 dark:border-purple-900"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/50 dark:to-blue-900/50 flex items-center justify-center">
                <span className="text-purple-600 dark:text-purple-300 font-medium">
                  {user?.displayName?.charAt(0) || "U"}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
