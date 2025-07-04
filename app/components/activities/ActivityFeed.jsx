// components/ActivityFeed.js

import { activityTypes } from "@/lib/activities";
import { formatDistanceToNow } from "date-fns";

export default function ActivityFeed({ activities }) {
  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const meta = activityTypes[activity.type];

        return (
          <div
            key={activity.id}
            className={`p-4 rounded-lg border ${meta.color} border-transparent`}
          >
            <div className="flex items-start gap-3">
              <span className="text-xl mt-0.5">{meta.icon}</span>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="font-medium">{activity.title}</h3>
                  <span className="text-xs opacity-70">
                    {formatDistanceToNow(activity.date)} ago
                  </span>
                </div>

                <p className="text-sm mt-1">
                  You {meta.verb} <strong>{activity.subject}</strong>
                  {activity.duration && ` for ${activity.duration} minutes`}
                </p>

                {activity.coinsEarned && (
                  <div className="mt-2 text-xs flex items-center gap-1">
                    <span>+{activity.coinsEarned} coins</span>
                    <span>★</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
