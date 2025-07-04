"use client";
// pages/activities.js
import { activityTypes, mockActivities } from "@/lib/activities";
import { useState } from "react";
import ActivityFeed from "../../components/activities/ActivityFeed";

export default function ActivitiesPage() {
  const [activeFilter, setActiveFilter] = useState("ALL");

  const filteredActivities =
    activeFilter === "ALL"
      ? mockActivities
      : mockActivities.filter((a) => a.type === activeFilter);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Activity</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveFilter("ALL")}
            className={`px-3 py-1 text-sm rounded-full ${
              activeFilter === "ALL"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 dark:bg-gray-700"
            }`}
          >
            All
          </button>
          {Object.keys(activityTypes).map((type) => (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              className={`px-3 py-1 text-sm rounded-full flex items-center gap-1 ${
                activeFilter === type
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700"
              }`}
            >
              <span>{activityTypes[type].icon}</span>
              <span>{type.split("_").join(" ")}</span>
            </button>
          ))}
        </div>
      </div>

      <ActivityFeed activities={filteredActivities} />

      {/* Stats Summary */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon="⏱️" label="Total Study Time" value="12h 45m" />
        <StatCard icon="📝" label="Exams Completed" value="3" />
        <StatCard icon="📓" label="Notes Taken" value="17" />
        <StatCard icon="★" label="Total Coins" value="245" />
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}
