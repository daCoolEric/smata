// app/Loading.jsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
export default function Loading() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(user ? "/dashboard" : "/login");
    }, 10000); // Changed from 240000 to 15000 (15 seconds)
    return () => clearTimeout(timer);
  }, [user, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      {/* Logo with animated pulse */}
      <div className="animate-pulse">
        <svg
          className="w-24 h-24 text-white"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
            fill="currentColor"
          />
          <path
            d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* App name with modern typography */}
      <h1 className="mt-6 text-4xl font-bold text-white tracking-tight">
        Smata
      </h1>

      {/* Tagline with subtle animation */}
      <p className="mt-2 text-lg text-white/90 animate-fade-in">
        Your Study Companion for Smarter Learning
      </p>

      {/* Loading indicator */}
      <div className="mt-8 w-24 h-1 bg-white/30 rounded-full overflow-hidden">
        <div className="h-full bg-white animate-progress" />
      </div>
    </div>
  );
}
