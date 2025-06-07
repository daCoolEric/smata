"use client"
import { useState, useRef } from 'react';

const meditations = [
  {
    id: 1,
    title: 'Pre-Study Focus',
    duration: '3 min',
    audioSrc: '/meditations/pre-study.mp3',
    description: 'Clear your mind before studying'
  },
  {
    id: 2,
    title: 'Post-Study Relaxation',
    duration: '5 min',
    audioSrc: '/meditations/post-study.mp3',
    description: 'Release tension after studying'
  },
  {
    id: 3,
    title: 'Exam Stress Relief',
    duration: '2 min',
    audioSrc: '/meditations/exam-stress.mp3',
    description: 'Quick calm before exams'
  }
];

export default function GuidedMeditation() {
  const [currentMeditation, setCurrentMeditation] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const handlePlay = (meditation) => {
    setCurrentMeditation(meditation);
    setIsPlaying(true);
    audioRef.current.src = meditation.audioSrc;
    audioRef.current.play();
  };

  const handleStop = () => {
    setIsPlaying(false);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  return (
    <div className="max-w-2xl mx-auto p-5 bg-gray-50 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Guided Meditations</h2>
      
      <audio ref={audioRef} />
      
      {currentMeditation && isPlaying ? (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-2">{currentMeditation.title}</h3>
          <p className="text-gray-600 mb-4">{currentMeditation.description}</p>
          <button 
            onClick={handleStop}
            className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
          >
            Stop Meditation
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {meditations.map(meditation => (
            <div key={meditation.id} className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{meditation.title}</h3>
                  <p className="text-gray-500 text-sm">Duration: {meditation.duration}</p>
                </div>
                <button 
                  onClick={() => handlePlay(meditation)}
                  className="py-1 px-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-medium transition-colors"
                >
                  Play
                </button>
              </div>
              <p className="text-gray-600 mt-2 text-sm">{meditation.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}