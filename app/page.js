"use client";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import SplashScreen from "./components/SplashScreen";
import { useRouter } from "next/navigation";

export default function Loader() {
  const router = useRouter();

  const { user, loading } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/landing");
    }, 10000); // Changed from 240000 to 15000 (15 seconds)
    return () => clearTimeout(timer);
  }, []);

  if (loading || !user) {
    // return <div>Loading...</div>;
    return <SplashScreen />;
  }

  return (
    <>
      <SplashScreen />
    </>
  );
}
