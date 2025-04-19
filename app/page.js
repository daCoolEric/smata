"use client";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import SplashScreen from "./components/SplashScreen";
import Loading from "./Loading";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BookOpen, Clock, BrainCircuit, ArrowRight } from "lucide-react";
import Dashboard from "./dashboard/page";

export default function Loader() {
  const router = useRouter();
  const [showHomePage, setShowHomePage] = useState(false);
  const features = [
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Smart Scheduling",
      description:
        "AI-powered timetable generation optimized for your learning style",
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Focus Sessions",
      description: "Pomodoro timer integrated with your study plan",
    },
    {
      icon: <BrainCircuit className="w-8 h-8" />,
      title: "Progress Tracking",
      description: "Visual analytics to monitor your academic growth",
    },
  ];

  const { user, signOutUser, loading } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/home");
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
