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
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";

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
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const now = new Date();
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(null);

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
  useEffect(() => {
    const fetchProfilePhoto = async () => {
      if (user?.id) {
        try {
          const { data, error } = await supabase
            .from("profiles")
            .select("profile_photo_url")
            .eq("id", user.id)
            .single();

          if (!error && data?.profile_photo_url) {
            setProfilePhotoUrl(data.profile_photo_url);
          }
        } catch (error) {
          console.error("Error fetching profile photo:", error);
        }
      }
    };

    fetchProfilePhoto();
  }, [user]);

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    }
  }, [user, router]);

  const handleSignOutUser = async () => {
    // setIsSigningIn(true);
    try {
      await signOut();
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      // setIsSigningIn(false);
      null;
    }
  };

  return (
    <>
      {/* Header */}
      <header className="bg-[hsl(var(--background))] shadow-sm sticky top-0 z-10">
        <div className="container mx-auto">
          {/* Desktop Header */}
          <div className="hidden md:flex justify-between items-center p-4">
            <div className="flex items-center gap-4">
              <div className=" ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.0"
                  width="60"
                  height="60"
                  viewBox="0 0 172 132"
                  preserveAspectRatio="xMidYMid meet"
                  class="w-15 h-15 fill-purple-600"
                >
                  <g
                    transform="translate(0.000000,132.000000) scale(0.100000,-0.100000)"
                    stroke="none"
                  >
                    <path d="M290 785 c0 -234 0 -428 0 -432 0 -5 39 -11 87 -15 118 -10 269 -36 345 -59 35 -10 66 -19 71 -19 4 0 7 188 7 419 l0 418 -72 30 c-122 50 -280 83 -405 83 l-33 0 0 -425z" />
                    <path d="M1232 1199 c-94 -11 -180 -33 -269 -71 l-73 -30 0 -420 c0 -395 1 -419 18 -414 115 37 348 76 448 76 l44 0 0 435 0 435 -47 -1 c-27 -1 -81 -5 -121 -10z" />
                    <path d="M148 1051 l-48 -15 0 -438 0 -438 58 0 c59 1 177 10 387 32 l120 12 -75 18 c-41 9 -140 23 -220 29 -80 7 -151 16 -157 22 -10 7 -13 104 -15 401 l-3 392 -47 -15z" />
                    <path d="M1490 675 c0 -302 -3 -395 -12 -403 -7 -5 -62 -13 -123 -17 -100 -6 -311 -38 -321 -48 -6 -6 291 -36 434 -43 l122 -7 0 440 0 439 -50 16 -50 16 0 -393z" />
                  </g>
                </svg>
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
                <button
                  onClick={() => router.push("/profile/setup")}
                  className="focus:outline-none"
                >
                  {profilePhotoUrl ? (
                    <img
                      src={profilePhotoUrl}
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
                </button>
                <button
                  onClick={handleSignOutUser}
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.0"
                width="60"
                height="60"
                viewBox="0 0 172 132"
                preserveAspectRatio="xMidYMid meet"
                class="w-15 h-15 fill-purple-600"
              >
                <g
                  transform="translate(0.000000,132.000000) scale(0.100000,-0.100000)"
                  stroke="none"
                >
                  <path d="M290 785 c0 -234 0 -428 0 -432 0 -5 39 -11 87 -15 118 -10 269 -36 345 -59 35 -10 66 -19 71 -19 4 0 7 188 7 419 l0 418 -72 30 c-122 50 -280 83 -405 83 l-33 0 0 -425z" />
                  <path d="M1232 1199 c-94 -11 -180 -33 -269 -71 l-73 -30 0 -420 c0 -395 1 -419 18 -414 115 37 348 76 448 76 l44 0 0 435 0 435 -47 -1 c-27 -1 -81 -5 -121 -10z" />
                  <path d="M148 1051 l-48 -15 0 -438 0 -438 58 0 c59 1 177 10 387 32 l120 12 -75 18 c-41 9 -140 23 -220 29 -80 7 -151 16 -157 22 -10 7 -13 104 -15 401 l-3 392 -47 -15z" />
                  <path d="M1490 675 c0 -302 -3 -395 -12 -403 -7 -5 -62 -13 -123 -17 -100 -6 -311 -38 -321 -48 -6 -6 291 -36 434 -43 l122 -7 0 440 0 439 -50 16 -50 16 0 -393z" />
                </g>
              </svg>
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
            {profilePhotoUrl ? (
              <button
                onClick={() => router.push("/profile/setup")}
                className="focus:outline-none"
              >
                <img
                  src={profilePhotoUrl}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border-2 border-purple-100 dark:border-purple-900"
                  referrerPolicy="no-referrer"
                />
              </button>
            ) : (
              <button
                onClick={() => router.push("/profile/setup")}
                className="focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/50 dark:to-blue-900/50 flex items-center justify-center">
                  <span className="text-purple-600 dark:text-purple-300 font-medium">
                    {user?.displayName?.charAt(0) || "U"}
                  </span>
                </div>
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
