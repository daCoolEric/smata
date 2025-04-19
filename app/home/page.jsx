// app/page.jsx
"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BookOpen, Clock, BrainCircuit, ArrowRight } from "lucide-react";

export default function HomePage() {
  const router = useRouter();

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <BrainCircuit className="w-8 h-8 text-purple-600" />
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Smata
          </span>
        </div>
        <button
          onClick={() => router.push("/login")}
          className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transition-all"
        >
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Study Smarter, Not Harder
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mt-5 mb-10">
            Smata uses AI to create personalized study plans that adapt to your
            learning patterns and optimize your academic performance.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => router.push("/login")}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transition-all flex items-center gap-2"
            >
              Start Free Today
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* App Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mt-16 bg-white/50 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-gray-100 max-w-4xl mx-auto"
        >
          <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <div className="text-center p-8">
              <BrainCircuit className="w-16 h-16 mx-auto text-purple-600 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-800">
                Your Personalized Study Dashboard
              </h3>
              <p className="text-gray-500 mt-2">
                AI-generated timetables • Focus timer • Progress analytics
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            How Smata Helps You Learn
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Our AI-powered tools are designed to maximize your study efficiency
            and academic performance
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
            >
              <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-500">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Transform Your Study Habits?
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Join thousands of students who are achieving more with less effort
          </p>
          <button
            onClick={() => router.push("/login")}
            className="px-8 py-3 rounded-full bg-white text-blue-600 hover:bg-gray-100 transition-all font-medium flex items-center gap-2 mx-auto"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-gray-100">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center mb-6">
            <BrainCircuit className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-gray-500">
            © {new Date().getFullYear()} Grinbox. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
