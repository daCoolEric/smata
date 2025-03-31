export function generateTimetable(courses, classSchedule) {
  // Configuration
  const MORNING_STUDY_TIME = 2 * 60; // 2 hours in minutes
  const EVENING_STUDY_TIME = 4 * 60; // 4 hours in minutes
  const STUDY_TO_CLASS_RATIO = 1.5;
  const MIN_BREAK_TIME = 30; // Minimum break between classes in minutes

  // Helper functions
  function calculateTimeDiff(startTime, endTime) {
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);
    return endHour * 60 + endMinute - (startHour * 60 + startMinute);
  }

  function formatMinutes(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0
      ? `${hours} hour${hours !== 1 ? "s" : ""}${
          mins > 0 ? ` and ${mins} minute${mins !== 1 ? "s" : ""}` : ""
        }`
      : `${mins} minute${mins !== 1 ? "s" : ""}`;
  }

  // 1. Calculate required study time for each course
  const studyRequirements = {};
  for (const course of courses) {
    studyRequirements[course.course] =
      course.credit_hours * STUDY_TO_CLASS_RATIO * 60;
  }

  // 2. Calculate available study time between classes
  const availableStudyTime = {};
  const days = Object.keys(classSchedule);

  for (const day of days) {
    availableStudyTime[day] = [];
    const sessions = classSchedule[day];

    for (let i = 1; i < sessions.length; i++) {
      const breakMinutes =
        calculateTimeDiff(sessions[i - 1].endTime, sessions[i].startTime) -
        MIN_BREAK_TIME;

      if (breakMinutes > 0) {
        availableStudyTime[day].push({
          course: sessions[i].course,
          availableMinutes: breakMinutes,
        });
      }
    }
  }

  // 3. Deduct available time from requirements
  const remainingStudyTime = { ...studyRequirements };
  for (const day of days) {
    for (const session of availableStudyTime[day]) {
      if (remainingStudyTime[session.course] !== undefined) {
        remainingStudyTime[session.course] = Math.max(
          0,
          remainingStudyTime[session.course] - session.availableMinutes
        );
      }
    }
  }

  // 4. Create weekly study schedule
  const weeklySchedule = {};
  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    const nextDay = days[(i + 1) % days.length];
    weeklySchedule[day] = {
      coursesToReview: [...new Set(classSchedule[day].map((s) => s.course))],
      coursesToRevise: [
        ...new Set(classSchedule[nextDay].map((s) => s.course)),
      ],
      studyHoursRequired: { ...studyRequirements },
    };
  }

  // 5. Allocate study sessions
  const timetable = {};
  const remainingMinutes = { ...remainingStudyTime };

  function allocateStudyTime(schedule, availableTime, isMorning) {
    const priorityCourses = isMorning
      ? [...schedule.coursesToReview, ...schedule.coursesToRevise]
      : [...schedule.coursesToRevise, ...schedule.coursesToReview];

    // Filter out courses with no remaining time needed
    const relevantCourses = [...new Set(priorityCourses)].filter(
      (course) => remainingMinutes[course] > 0
    );

    if (relevantCourses.length === 0) return [];

    // Sort by remaining time (descending)
    relevantCourses.sort((a, b) => remainingMinutes[b] - remainingMinutes[a]);

    const allocation = [];
    let timeLeft = availableTime;

    // First pass: allocate minimum time to each course
    const minTimePerCourse = Math.floor(availableTime / relevantCourses.length);
    for (const course of relevantCourses) {
      if (timeLeft <= 0) break;

      const timeToAllocate = Math.min(
        minTimePerCourse,
        remainingMinutes[course],
        120 // Max 2 hours per session
      );

      if (timeToAllocate > 0) {
        allocation.push({
          course,
          time: formatMinutes(timeToAllocate),
          minutes: timeToAllocate,
        });
        remainingMinutes[course] -= timeToAllocate;
        timeLeft -= timeToAllocate;
      }
    }

    // Second pass: distribute remaining time
    if (timeLeft > 0) {
      const coursesWithNeed = relevantCourses.filter(
        (course) => remainingMinutes[course] > 0
      );

      if (coursesWithNeed.length > 0) {
        const extraTimePerCourse = Math.floor(
          timeLeft / coursesWithNeed.length
        );

        for (const course of coursesWithNeed) {
          const extraTime = Math.min(
            remainingMinutes[course],
            extraTimePerCourse,
            30 // Max 30 extra minutes
          );

          if (extraTime > 0) {
            const existing = allocation.find((a) => a.course === course);
            if (existing) {
              existing.time = formatMinutes(existing.minutes + extraTime);
              existing.minutes += extraTime;
            } else {
              allocation.push({
                course,
                time: formatMinutes(extraTime),
                minutes: extraTime,
              });
            }
            remainingMinutes[course] -= extraTime;
            timeLeft -= extraTime;
          }
        }
      }
    }

    return allocation.sort((a, b) => b.minutes - a.minutes);
  }

  for (const day of days) {
    const schedule = weeklySchedule[day];

    // Allocate morning study time
    const morningAllocation = allocateStudyTime(
      schedule,
      MORNING_STUDY_TIME,
      true
    );

    // Allocate evening study time
    const eveningAllocation = allocateStudyTime(
      schedule,
      EVENING_STUDY_TIME,
      false
    );

    timetable[day] = {
      morning: morningAllocation,
      evening: eveningAllocation,
    };
  }

  function analyzeBreaks(schedule) {
    const result = {};
    for (const day of days) {
      result[day] = [];
      const sessions = schedule[day];

      for (let i = 1; i < sessions.length; i++) {
        const diff = calculateTimeDiff(
          sessions[i - 1].endTime,
          sessions[i].startTime
        );

        result[day].push({
          between: `${sessions[i - 1].course} → ${sessions[i].course}`,
          duration: formatMinutes(diff),
        });
      }
    }
    return result;
  }

  function formatTimetable(timetable) {
    const result = [];
    const days = Object.keys(timetable);

    for (const day of days) {
      // Process morning sessions
      if (
        timetable[day].morning &&
        timetable[day].morning !== "No study scheduled"
      ) {
        timetable[day].morning.forEach((item) => {
          result.push({
            day,
            timeSlot: "morning",
            course: item.course,
            time: item.time,
          });
        });
      }

      // Process evening sessions
      if (
        timetable[day].evening &&
        timetable[day].evening !== "No study scheduled"
      ) {
        timetable[day].evening.forEach((item) => {
          result.push({
            day,
            timeSlot: "evening",
            course: item.course,
            time: item.time,
          });
        });
      }
    }

    return result;
  }

  function createTimeTable(timetable) {
    const sessions = [];

    for (const [day, timeSlots] of Object.entries(timetable)) {
      // Process morning sessions
      if (timeSlots.morning && timeSlots.morning !== "No study scheduled") {
        // First split by comma followed by space and capital letter (new course)
        const morningSessions = timeSlots.morning.split(/, (?=[A-Z])/);

        morningSessions.forEach((session) => {
          // Find the last colon that precedes the time
          const timeMatch = session.match(
            /: ([\d\s\w]+(?: and [\d\s\w]+)? minutes?|[\d\s\w]+ hours?(?: and [\d\s\w]+ minutes?)?)$/
          );
          if (timeMatch) {
            const time = timeMatch[0].substring(2); // Remove the ": "
            const course = session.substring(0, timeMatch.index).trim();
            sessions.push({
              day,
              timeSlot: "morning",
              course,
              time,
            });
          }
        });
      }

      // Process evening sessions (same logic)
      if (timeSlots.evening && timeSlots.evening !== "No study scheduled") {
        const eveningSessions = timeSlots.evening.split(/, (?=[A-Z])/);

        eveningSessions.forEach((session) => {
          const timeMatch = session.match(
            /: ([\d\s\w]+(?: and [\d\s\w]+)? minutes?|[\d\s\w]+ hours?(?: and [\d\s\w]+ minutes?)?)$/
          );
          if (timeMatch) {
            const time = timeMatch[0].substring(2);
            const course = session.substring(0, timeMatch.index).trim();
            sessions.push({
              day,
              timeSlot: "evening",
              course,
              time,
            });
          }
        });
      }
    }

    return sessions;
  }

  return {
    breakAnalysis: analyzeBreaks(classSchedule),
    studyRequirements: Object.fromEntries(
      Object.entries(studyRequirements).map(([course, mins]) => [
        course,
        formatMinutes(mins),
      ])
    ),
    remainingStudyTime: Object.fromEntries(
      Object.entries(remainingMinutes).map(([course, mins]) => [
        course,
        formatMinutes(mins),
      ])
    ),
    timetable: formatTimetable(timetable),
  };
}
