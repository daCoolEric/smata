"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import FileUploader from "../../components/studySession/FileUploader";
import DocumentViewer from "../../components/studySession/DocumentViewer";
import QuestionGenerator from "../../components/studySession/QuestionsGenerator";
import { useRouter } from "next/navigation";
import TimetableGenerator from "../study-plan/page";

const StudySection = () => {
  // State declarations
  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [selectedText, setSelectedText] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [studyGoal, setStudyGoal] = useState("");
  const [studyDuration, setStudyDuration] = useState(5); // Default to 5 minutes
  const [breakDuration, setBreakDuration] = useState(1);
  const [isActive, setIsActive] = useState(false);
  const [isStudyTime, setIsStudyTime] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [studyNote, setStudyNote] = useState("");
  const [progress, setProgress] = useState(0);
  const [assessmentScore, setAssessmentScore] = useState(null);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [segments, setSegments] = useState([]);
  const [currentSegmentProgress, setCurrentSegmentProgress] = useState(0);
  const [showBreakPopup, setShowBreakPopup] = useState(false);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [skippedBreaks, setSkippedBreaks] = useState(0);
  const [isResuming, setIsResuming] = useState(false);
  const [proficiencyScore, setProficiencyScore] = useState(null);

  const router = useRouter();

  // Calculate segments based on study duration
  const calculateSegments = useCallback(
    (totalMinutes) => {
      const newSegments = [];
      let remainingMinutes = totalMinutes;

      while (remainingMinutes > 0) {
        // Add study segment (max 2 minutes)
        const studySegmentDuration = Math.min(2, remainingMinutes);
        newSegments.push({
          type: "study",
          duration: studySegmentDuration,
          timeLeft: studySegmentDuration * 60,
          progress: 0,
        });
        remainingMinutes -= studySegmentDuration;

        // Add break segment if there's more study time left
        if (remainingMinutes > 0) {
          newSegments.push({
            type: "break",
            duration: breakDuration,
            timeLeft: breakDuration * 60,
            progress: 0,
          });
        }
      }

      return newSegments;
    },
    [breakDuration]
  );

  // Initialize segments when study duration changes
  useEffect(() => {
    const newSegments = calculateSegments(studyDuration);
    setSegments(newSegments);
    setCyclesCompleted(0);
    setIsStudyTime(true);
    setIsActive(false);
    setSessionCompleted(false);
    setProgress(0);
    setCurrentSegmentIndex(0);
    setIsResuming(false);

    // Set initial time to first segment duration
    if (newSegments.length > 0) {
      setTimeLeft(newSegments[0].duration * 60);
    }
  }, [studyDuration, calculateSegments]);

  // Handle automatic start of break timer when break popup shows
  useEffect(() => {
    if (showBreakPopup) {
      // Automatically start the break timer when the popup appears
      setIsActive(true);
    }
  }, [showBreakPopup]);

  // Timer logic
  useEffect(() => {
    let interval = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;

          // Update current segment progress
          if (currentSegmentIndex < segments.length) {
            const segmentDuration = segments[currentSegmentIndex].duration * 60;
            const segmentProgress = 1 - newTime / segmentDuration;
            setCurrentSegmentProgress(segmentProgress);

            // Update progress for the entire session
            let totalElapsed = 0;
            let totalDuration = 0;

            segments.forEach((seg, idx) => {
              totalDuration += seg.duration * 60;
              if (idx < currentSegmentIndex) {
                totalElapsed += seg.duration * 60;
              } else if (idx === currentSegmentIndex) {
                totalElapsed += seg.duration * 60 - newTime;
              }
            });

            setProgress(totalElapsed / totalDuration);
          }

          return newTime;
        });
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      clearInterval(interval);

      // Move to next segment
      const nextSegmentIndex = currentSegmentIndex + 1;

      // Check if session is complete
      if (nextSegmentIndex >= segments.length) {
        setIsActive(false);
        setSessionCompleted(true);
        // When session is complete, update progress to 100% and fill all segments
        setProgress(1);
        return;
      }

      // Prepare for next segment
      setIsActive(false);
      setCurrentSegmentIndex(nextSegmentIndex);
      const nextSegment = segments[nextSegmentIndex];
      setIsStudyTime(nextSegment.type === "study");
      setTimeLeft(nextSegment.duration * 60);
      setCurrentSegmentProgress(0);

      // Mark as resuming if the next segment is study
      if (nextSegment.type === "study") {
        setIsResuming(true);
      }

      // Show break popup if next segment is break
      if (nextSegment.type === "break") {
        setShowBreakPopup(true);
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, currentSegmentIndex, segments]);

  // Handle break timer completion
  useEffect(() => {
    if (showBreakPopup && timeLeft === 0) {
      // If break timer has reached zero, hide the popup and prepare for next segment
      setShowBreakPopup(false);

      // Move to the next segment (which should be a study segment)
      const nextSegmentIndex = currentSegmentIndex + 1;

      // Check if session is complete
      if (nextSegmentIndex >= segments.length) {
        setIsActive(false);
        setSessionCompleted(true);
        // When session is complete, update progress to 100% and fill all segments
        setProgress(1);
        return;
      }

      // Set up the next study segment
      setCurrentSegmentIndex(nextSegmentIndex);
      const nextSegment = segments[nextSegmentIndex];
      setIsStudyTime(nextSegment.type === "study");
      setTimeLeft(nextSegment.duration * 60);
      setCurrentSegmentProgress(0);
      setIsResuming(true); // Set resuming to true after break
    }
  }, [timeLeft, showBreakPopup, currentSegmentIndex, segments]);

  // When session is completed, set progress to 100%
  useEffect(() => {
    if (sessionCompleted) {
      setProgress(1);
      setCurrentSegmentProgress(1);
    }
  }, [sessionCompleted]);

  // Start the next session (study or break)
  const startNextSession = () => {
    setIsActive(true);
    if (showBreakPopup) {
      setShowBreakPopup(false);
    }
    // Reset resuming state when explicitly starting a session
    setIsResuming(false);
  };

  // Timer controls
  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Render cycle segments with progress
  const renderCycleSegments = () => {
    return segments.map((segment, index) => {
      const isCompleted = sessionCompleted || index < currentSegmentIndex;
      const isCurrent = !sessionCompleted && index === currentSegmentIndex;
      const isStudySegment = segment.type === "study";

      // Calculate progress for current segment
      let segmentProgress = 0;
      if (sessionCompleted) {
        segmentProgress = 1;
      } else if (isCurrent && isActive) {
        segmentProgress = currentSegmentProgress;
      } else if (isCompleted) {
        segmentProgress = 1;
      }

      return (
        <div key={`segment-${index}`} className="flex-1 mx-1">
          <div className="h-1 w-full bg-gray-200 rounded-sm mb-1">
            <div
              className={`h-full rounded-sm ${
                isCompleted
                  ? isStudySegment
                    ? "bg-blue-500"
                    : "bg-green-500"
                  : isCurrent
                  ? isStudySegment
                    ? "bg-blue-300"
                    : "bg-green-300"
                  : "bg-gray-200"
              }`}
              style={{
                width: `${segmentProgress * 100}%`,
                transition: "width 1s linear",
              }}
            />
          </div>
          <div className="text-xs text-center text-gray-500">
            {segment.type === "study" ? "S" : "B"} {Math.ceil((index + 1) / 2)}
          </div>
        </div>
      );
    });
  };

  // Handlers
  const handleFileUpload = (uploadedFile, content) => {
    setFile(uploadedFile);
    setFileContent(content);
    setSelectedText("");
  };

  const handleTextSelected = (text) => {
    setSelectedText(text);
    setStudyGoal(text);
    setStudyNote(text);
  };

  const handleNext = () => {
    if (activeStep < 3) setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    if (activeStep > 0) setActiveStep(activeStep - 1);
  };

  const handleStartLearning = () => {
    handleNext();
    // Timer will start only when user clicks "Start Study"
  };

  const handleAssessmentSubmit = (score) => {
    setAssessmentScore(score);
  };

  const handleStudyDurationChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setStudyDuration(Math.max(2, value));
    }
  };

  const handleBreakDurationChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setBreakDuration(value);
    }
  };

  const generateAIAnalogy = async (studyNote) => {
    try {
      setAiResponse("Generating analogy...");

      const response = await fetch("/api/generate-analogy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studyNote }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAiResponse(data.analogy || data.content);
    } catch (error) {
      console.error("Error generating analogy:", error);
      setAiResponse("Failed to generate analogy. Please try again.");
    }
  };

  const generateAISummary = async (studyNote) => {
    try {
      setAiResponse("Generating key points summary...");

      const response = await fetch("/api/generate-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studyNote,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAiResponse(data.summary || data.content);
      return data.content[0].text;
    } catch (error) {
      return "Failed to generate summary: " + error.message;
    }
  };

  const skipBreak = () => {
    // Simulate watching an ad
    setSkippedBreaks(skippedBreaks + 1);

    // Close the break popup
    setShowBreakPopup(false);
    setIsActive(false);

    // Move to the next study segment
    let nextStudySegmentIndex = currentSegmentIndex + 1;
    while (
      nextStudySegmentIndex < segments.length &&
      segments[nextStudySegmentIndex].type !== "study"
    ) {
      nextStudySegmentIndex++;
    }

    if (nextStudySegmentIndex < segments.length) {
      setCurrentSegmentIndex(nextStudySegmentIndex);
      setIsStudyTime(true);
      setTimeLeft(segments[nextStudySegmentIndex].duration * 60);
      setIsResuming(true); // Set resuming to true after skipping a break
    } else {
      setSessionCompleted(true);
      setProgress(1);
    }
  };

  const courses = [
    "Web Development Fundamentals",
    "Advanced JavaScript",
    "React Masterclass",
    "Node.js Backend Development",
    "UI/UX Design Principles",
    "Data Structures & Algorithms",
    "Python for Data Science",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      {/* Banner */}
      <a href="/home/study-plan" className="block cursor-pointer">
        <div className="bg-indigo-600 text-white rounded-xl p-6 mb-8 shadow-lg transform hover:scale-[1.01] transition-transform duration-300 hover:bg-indigo-700 active:scale-[0.99]">
          <h1 className="text-2xl md:text-3xl font-bold text-center">
            Get Your Free Study Plan Now!
          </h1>
          <p className="text-center mt-2 opacity-90">
            Personalized learning path tailored just for you
          </p>
        </div>
      </a>

      {/* Marquee */}
      <div className="bg-white rounded-xl p-4 mb-8 shadow-md overflow-hidden">
        <div className="text-lg font-semibold text-indigo-700 mb-2">
          Popular Courses:
        </div>
        <div className="relative overflow-hidden">
          <div className="animate-marquee whitespace-nowrap">
            {courses.concat(courses).map((course, index) => (
              <span key={index} className="mx-4 text-gray-700 inline-block">
                {course} •
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Break Popup */}
      {showBreakPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-green-600">Break Time!</h2>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            </div>

            <p className="text-gray-600 mb-4">
              Take a short break to recharge your brain. Stand up, stretch, or
              just relax for a moment.
            </p>

            <div className="bg-green-50 rounded-lg p-4 flex flex-col items-center mb-6">
              <div className="text-3xl font-bold text-green-700 mb-2">
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-green-600">
                Break {Math.ceil((currentSegmentIndex + 1) / 2)} of{" "}
                {Math.floor(segments.length / 2)}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={skipBreak}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors border border-gray-300 flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
                Skip Break (Watch Ad)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Carousel */}
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Progress Steps */}
        <div className="flex justify-between px-6 pt-6 pb-2">
          {[1, 2, 3, 4].map((step, index) => (
            <div key={step} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                  index <= activeStep ? "bg-indigo-600" : "bg-gray-300"
                }`}
              >
                {step}
              </div>
              <div
                className={`text-xs mt-1 ${
                  index <= activeStep
                    ? "text-indigo-600 font-medium"
                    : "text-gray-400"
                }`}
              >
                {["Goal", "Duration", "Learn", "Assess"][index]}
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Content */}
        <div className="p-6">
          {/* Step 1: Study Goal */}
          {activeStep === 0 && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-indigo-700 mb-4">
                Set Your Study Goal
              </h2>
              <FileUploader onFileUpload={handleFileUpload} />
              <DocumentViewer
                file={file}
                fileContent={fileContent}
                onTextSelected={handleTextSelected}
              />
              <button
                onClick={handleNext}
                disabled={!studyGoal.trim()}
                className={`mt-6 px-6 py-3 rounded-lg font-medium ${
                  studyGoal.trim()
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                } transition-colors`}
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Learning Duration */}
          {activeStep === 1 && (
            <div className="max-w-md mx-auto p-2 bg-white rounded-xl shadow-sm">
              <div className="mb-8">
                <div className="flex flex-col items-center gap-6">
                  <div className="w-full">
                    <div className="space-y-2 text-center">
                      <label className="block text-sm font-medium text-gray-700">
                        Study Duration
                      </label>
                      <div className="flex justify-center gap-3">
                        <div className="w-32">
                          <select
                            value={Math.floor(studyDuration / 60)}
                            onChange={(e) => {
                              const hours = parseInt(e.target.value);
                              const mins = studyDuration % 60;
                              const totalMins = hours * 60 + mins;
                              setStudyDuration(Math.max(2, totalMins));
                            }}
                            disabled={isActive}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                          >
                            {[...Array(7)].map((_, i) => (
                              <option key={i} value={i}>
                                {i} {i === 1 ? "hour" : "hours"}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="w-32">
                          <select
                            value={studyDuration % 60}
                            onChange={(e) => {
                              const mins = parseInt(e.target.value);
                              const hours = Math.floor(studyDuration / 60);
                              const totalMins = hours * 60 + mins;
                              setStudyDuration(Math.max(2, totalMins));
                            }}
                            disabled={isActive}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                          >
                            {[...Array(12)].map((_, i) => (
                              <option key={i * 5} value={i * 5}>
                                {i * 5} mins
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        Minimum study duration: 2 minutes
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6 p-4 bg-blue-50 rounded-lg text-center">
                <h3 className="text-sm font-medium text-gray-700 mb-1">
                  Selected Duration
                </h3>
                <p className="text-lg font-semibold text-blue-600">
                  {Math.floor(studyDuration / 60) > 0
                    ? `${Math.floor(studyDuration / 60)} hour${
                        Math.floor(studyDuration / 60) !== 1 ? "s" : ""
                      } `
                    : ""}
                  {studyDuration % 60 > 0
                    ? `${studyDuration % 60} minute${
                        studyDuration % 60 !== 1 ? "s" : ""
                      }`
                    : ""}
                </p>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                <button
                  onClick={handleBack}
                  className="px-6 py-3 rounded-lg font-medium text-gray-600 hover:bg-gray-50 transition-colors flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Back
                </button>
                <button
                  onClick={handleStartLearning}
                  disabled={studyDuration < 2}
                  className={`px-8 py-3 text-white rounded-lg font-bold transition-colors shadow-md hover:shadow-lg ${
                    studyDuration >= 2
                      ? "bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
                      : "bg-indigo-300 cursor-not-allowed"
                  }`}
                >
                  Start Learning
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Learning in Progress */}
          {activeStep === 2 && (
            <div className="max-w-screen mx-auto p-2 bg-white rounded-lg shadow-md">
              <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
                {isStudyTime ? "Study Time" : "Break Time"}
              </h1>
              <div className="flex flex-col md:flex-row justify-between gap-4">
                {/* Session Configuration - Now appears first on mobile */}
                <div className="mb-6 order-2 md:order-1 md:w-1/3">
                  <div className="grid grid-cols-1 gap-2 md:gap-4 text-sm">
                    <div className="bg-gray-50 p-2 md:p-3 rounded-lg">
                      <p className="text-gray-500">Study</p>
                      <p className="font-medium">{studyDuration} min</p>
                    </div>

                    {/* Book Icon */}
                    <div className="flex justify-center my-2">
                      <div className="p-3 bg-indigo-100 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-indigo-600"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                        </svg>
                      </div>
                    </div>

                    {/* Timer controls */}
                    <div className="flex justify-center gap-4 w-full sm:w-auto">
                      {!sessionCompleted ? (
                        <>
                          {!isActive ? (
                            <button
                              onClick={startNextSession}
                              className={`px-6 py-2 rounded-md font-medium w-full sm:w-auto ${
                                isStudyTime
                                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                                  : "bg-green-500 hover:bg-green-600 text-white"
                              }`}
                            >
                              {isStudyTime
                                ? isResuming
                                  ? "Resume Study"
                                  : "Start Study"
                                : "Start Break"}
                            </button>
                          ) : (
                            <button
                              onClick={toggleTimer}
                              className={`px-6 py-2 rounded-md font-medium w-full sm:w-auto ${
                                isActive
                                  ? "bg-red-500 hover:bg-red-600 text-white"
                                  : "bg-blue-500 hover:bg-blue-600 text-white"
                              }`}
                            >
                              {isActive ? "Pause" : "Resume"}
                            </button>
                          )}
                        </>
                      ) : (
                        <button
                          onClick={handleNext}
                          className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md font-medium w-full sm:w-auto"
                        >
                          Assessment
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Timer Display - Now appears second on mobile */}
                <div
                  className={`text-center py-6 md:py-8 mb-4 rounded-lg order-1 md:order-2 md:w-2/3 ${
                    isStudyTime ? "bg-blue-100" : "bg-green-100"
                  }`}
                >
                  <div className="text-4xl md:text-5xl font-bold my-4 px-5">
                    {formatTime(timeLeft)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {isStudyTime ? "Study" : "Break"}{" "}
                    {Math.ceil((currentSegmentIndex + 1) / 2)} of{" "}
                    {segments.filter((s) => s.type === "study").length}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{Math.round(progress * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${
                      isStudyTime ? "bg-blue-500" : "bg-green-500"
                    }`}
                    style={{ width: `${progress * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-4">
                  {renderCycleSegments()}
                </div>
              </div>

              {/* Study Section */}
              <div
                className={`mb-4 transition-all duration-300 ${
                  studyNote && isStudyTime ? "opacity-100" : "opacity-0 h-0"
                }`}
              >
                {studyNote && isStudyTime && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-gray-200">
                    <div className="flex items-start">
                      <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-indigo-600"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-semibold text-gray-800 mb-1">
                            Current Focus
                          </h3>
                          <button
                            onClick={() => setShowAIAssistant(!showAIAssistant)}
                            className="flex items-center text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full transition-colors"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 mr-1"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                            AI Assistant
                          </button>
                        </div>
                        <div className="max-w-screen">
                          <p className="text-gray-700 leading-relaxed bg-yellow-50/50 px-3 py-2 rounded-lg border-l-4 border-indigo-400 mb-2">
                            {studyNote}
                          </p>
                        </div>

                        {showAIAssistant && (
                          <div className="mt-3 bg-blue-50/50 rounded-lg p-3 border border-blue-100">
                            <div className="flex items-center text-blue-600 mb-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-2"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span className="text-sm font-medium">
                                AI Study Suggestions
                              </span>
                            </div>

                            <div className="space-y-2 text-sm">
                              <button
                                onClick={() => generateAISummary(studyNote)}
                                className="w-full text-left bg-white hover:bg-blue-100 px-3 py-2 rounded-lg border border-blue-200 flex items-center"
                              >
                                <span>📝 Get key points summary</span>
                              </button>

                              <button
                                onClick={() => generateAIAnalogy(studyNote)}
                                className="w-full text-left bg-white hover:bg-blue-100 px-3 py-2 rounded-lg border border-blue-200 flex items-center"
                              >
                                <span>🔗 Create helpful analogy</span>
                              </button>
                            </div>

                            {aiResponse && (
                              <div className="mt-3 bg-white p-3 rounded-lg border border-gray-200">
                                <div className="text-sm text-gray-700 whitespace-pre-line">
                                  {aiResponse}
                                </div>
                                <button
                                  onClick={() => setAiResponse(null)}
                                  className="mt-2 text-xs text-gray-500 hover:text-gray-700"
                                >
                                  Clear response
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="mt-2 text-xs text-gray-500 flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 mr-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Study time - Stay focused!
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-center items-center gap-4 mt-6 mb-6">
                {/* Back button */}
                <button
                  onClick={handleBack}
                  className="px-6 py-3 rounded-lg font-medium text-gray-600 hover:bg-gray-50 transition-colors flex items-center w-full sm:w-auto justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Back
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Assessment */}

          {activeStep === 3 && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-indigo-700 mb-4">
                Assessment
              </h2>
              <QuestionGenerator
                selectedText={studyNote}
                onProficiencyChange={(score) => setProficiencyScore(score)}
              />

              <div className="flex justify-center">
                <div className="flex flex-col-reverse sm:flex-row justify-center items-center gap-4 mt-6 mb-6">
                  {/* Back button */}
                  <button
                    onClick={handleBack}
                    className="px-6 py-3 rounded-lg font-medium text-gray-600 hover:bg-gray-50 transition-colors flex items-center w-full sm:w-auto justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Back to Study
                  </button>

                  {/* End Session button - only show if proficiency is 80% or more */}
                  {proficiencyScore !== null && (
                    <button
                      onClick={() => router.push("/home/dashboard")}
                      className={`px-6 py-3 rounded-lg font-medium flex items-center w-full sm:w-auto justify-center ${
                        proficiencyScore >= 80
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-gray-300 text-gray-600"
                      } transition-colors`}
                      disabled={proficiencyScore < 80}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      End Session
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudySection;
