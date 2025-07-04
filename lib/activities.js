// lib/activities.js
export const activityTypes = {
  STUDY_SESSION: {
    icon: "⏱️",
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    verb: "studied",
  },
  EXAM: {
    icon: "📝",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    verb: "has an upcoming",
  },
  NOTE: {
    icon: "📓",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    verb: "created a note in",
  },
  RESOURCE: {
    icon: "📚",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    verb: "accessed",
  },
  GROUP: {
    icon: "👥",
    color:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    verb: "joined",
  },
};

export const mockActivities = [
  {
    id: "1",
    type: "STUDY_SESSION",
    subject: "Mathematics",
    title: "Algebra Practice",
    duration: 45,
    date: new Date(Date.now() - 3600000), // 1 hour ago
    coinsEarned: 15,
  },
  {
    id: "2",
    type: "NOTE",
    subject: "Biology",
    title: "Cell Structure Notes",
    date: new Date(Date.now() - 86400000), // 1 day ago
    preview: "The cell is the basic structural...",
  },
  // Add more sample activities...
];
