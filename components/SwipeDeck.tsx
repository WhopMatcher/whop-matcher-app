"use client";

import { useState, useEffect } from "react";
import { motion, PanInfo, useAnimation } from "framer-motion";
import { Heart, X, Star, MapPin, Target, Briefcase, Users, Loader2 } from "lucide-react";

interface Match {
  id: string;
  whopUserId: string;
  username: string;
  goals: string[];
  skills: string[];
  location: string;
  experience: number;
  bio: string;
  compatibilityScore: number;
  preferences?: {
    interests: string[];
  };
}

interface SwipeDeckProps {
  onMatch?: (match: Match) => void;
  onReject?: (match: Match) => void;
}

export default function SwipeDeck({ onMatch, onReject }: SwipeDeckProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

  const controls = useAnimation();

  useEffect(() => {
    fetchPotentialMatches();
  }, []);

  const fetchPotentialMatches = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/matches/potential");
      if (!response.ok) {
        throw new Error("Failed to fetch potential matches");
      }

      const result = await response.json();
      setMatches(result.matches);
    } catch (err) {
      console.error("Error fetching matches:", err);
      setError("Failed to load potential matches");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwipe = async (direction: "left" | "right", match: Match) => {
    setIsProcessing(true);

    try {
      if (direction === "right") {
        // Create a match
        const response = await fetch("/api/matches/connect", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            targetUserId: match.id,
            action: "like",
          }),
        });

        if (response.ok) {
          onMatch?.(match);
        }
      } else {
        // Reject the match
        const response = await fetch("/api/matches/connect", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            targetUserId: match.id,
            action: "reject",
          }),
        });

        if (response.ok) {
          onReject?.(match);
        }
      }
    } catch (error) {
      console.error("Error processing swipe:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragEnd = async (event: any, info: PanInfo) => {
    const swipeThreshold = 100;
    const currentMatch = matches[currentIndex];

    if (info.offset.x > swipeThreshold) {
      // Swipe right
      await handleSwipe("right", currentMatch);
      setCurrentIndex(prev => prev + 1);
    } else if (info.offset.x < -swipeThreshold) {
      // Swipe left
      await handleSwipe("left", currentMatch);
      setCurrentIndex(prev => prev + 1);
    } else {
      // Return to center
      controls.start({ x: 0, y: 0, rotate: 0 });
    }
  };

  // Mobile touch handlers for better mobile experience
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    
    // Prevent vertical scrolling if horizontal swipe is detected
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = async (e: React.TouchEvent) => {
    if (!touchStart) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    const currentMatch = matches[currentIndex];
    
    // Only trigger swipe if horizontal movement is greater than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      const direction = deltaX > 0 ? "right" : "left";
      await handleSwipe(direction, currentMatch);
      setCurrentIndex(prev => prev + 1);
    }
    
    setTouchStart(null);
  };

  const getExperienceText = (level: number) => {
    switch (level) {
      case 1: return "Beginner";
      case 2: return "Intermediate";
      case 3: return "Advanced";
      case 4: return "Expert";
      default: return "Not specified";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Finding potential matches...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Matches Found</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchPotentialMatches}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (currentIndex >= matches.length) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No More Matches</h3>
          <p className="text-gray-600 mb-4">
            You've seen all available matches. Check back later for new connections!
          </p>
          <button
            onClick={() => {
              setCurrentIndex(0);
              fetchPotentialMatches();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  const currentMatch = matches[currentIndex];

  return (
    <div className="relative h-96 flex items-center justify-center">
      {/* Card Stack */}
      <div className="relative w-80 h-96">
        {/* Background cards for depth effect */}
        {matches.slice(currentIndex + 1, currentIndex + 3).map((_, index) => (
          <div
            key={`bg-${index}`}
            className="absolute inset-0 bg-white rounded-2xl shadow-lg border border-gray-200"
            style={{
              transform: `scale(${0.9 - index * 0.05}) translateY(${index * 8}px)`,
              zIndex: 10 - index,
            }}
          />
        ))}

        {/* Current card */}
        <motion.div
          key={currentMatch.id}
          className="absolute inset-0 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.8}
          onDragEnd={handleDragEnd}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          animate={controls}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Card Header */}
          <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 p-6">
            <div className="absolute top-4 right-4">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-3 py-1">
                <span className="text-white font-semibold text-sm">
                  {currentMatch.compatibilityScore}% Match
                </span>
              </div>
            </div>
            
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-2xl font-bold text-white mb-1">
                @{currentMatch.username}
              </h2>
              <div className="flex items-center space-x-2 text-white text-sm">
                <MapPin className="w-4 h-4" />
                <span>{currentMatch.location || "Location not set"}</span>
              </div>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-6">
            {/* Experience Level */}
            <div className="flex items-center space-x-2 mb-4">
              <Briefcase className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">
                {getExperienceText(currentMatch.experience)}
              </span>
            </div>

            {/* Bio */}
            {currentMatch.bio && (
              <p className="text-gray-700 mb-4 line-clamp-3">{currentMatch.bio}</p>
            )}

            {/* Goals */}
            {currentMatch.goals.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Goals</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {currentMatch.goals.slice(0, 3).map((goal, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                    >
                      {goal}
                    </span>
                  ))}
                  {currentMatch.goals.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                      +{currentMatch.goals.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Skills */}
            {currentMatch.skills.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Briefcase className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">Skills</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {currentMatch.skills.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                  {currentMatch.skills.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                      +{currentMatch.skills.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Swipe Instructions */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-center space-x-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-1">
                <X className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-xs text-gray-600">Swipe Left</span>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-1">
                <Heart className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-xs text-gray-600">Swipe Right</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-4">
        <button
          onClick={() => handleSwipe("left", currentMatch)}
          disabled={isProcessing}
          className="w-16 h-16 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors disabled:opacity-50"
        >
          <X className="w-8 h-8 mx-auto" />
        </button>
        <button
          onClick={() => handleSwipe("right", currentMatch)}
          disabled={isProcessing}
          className="w-16 h-16 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors disabled:opacity-50"
        >
          <Heart className="w-8 h-8 mx-auto" />
        </button>
      </div>

      {/* Progress Indicator */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
        <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-full px-4 py-2">
          <span className="text-sm font-medium text-gray-700">
            {currentIndex + 1} of {matches.length}
          </span>
        </div>
      </div>
    </div>
  );
} 