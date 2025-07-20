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
        {/* <svg
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
        </svg> */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.0"
          width="172.000000pt"
          height="132.000000pt"
          viewBox="0 0 172.000000 132.000000"
          preserveAspectRatio="xMidYMid meet"
        >
          {" "}
          <g
            transform="translate(0.000000,132.000000) scale(0.100000,-0.100000)"
            fill="#1652cc"
            stroke="none"
          >
            {" "}
            <path d="M290 785 c0 -234 0 -428 0 -432 0 -5 39 -11 87 -15 118 -10 269 -36 345 -59 35 -10 66 -19 71 -19 4 0 7 188 7 419 l0 418 -72 30 c-122 50 -280 83 -405 83 l-33 0 0 -425z" />{" "}
            <path d="M1232 1199 c-94 -11 -180 -33 -269 -71 l-73 -30 0 -420 c0 -395 1 -419 18 -414 115 37 348 76 448 76 l44 0 0 435 0 435 -47 -1 c-27 -1 -81 -5 -121 -10z" />{" "}
            <path d="M148 1051 l-48 -15 0 -438 0 -438 58 0 c59 1 177 10 387 32 l120 12 -75 18 c-41 9 -140 23 -220 29 -80 7 -151 16 -157 22 -10 7 -13 104 -15 401 l-3 392 -47 -15z" />{" "}
            <path d="M1490 675 c0 -302 -3 -395 -12 -403 -7 -5 -62 -13 -123 -17 -100 -6 -311 -38 -321 -48 -6 -6 291 -36 434 -43 l122 -7 0 440 0 439 -50 16 -50 16 0 -393z" />{" "}
          </g>{" "}
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
