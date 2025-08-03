"use client";

import { useState, useEffect } from "react";
import { whopSdk } from "@/lib/whop-sdk";
import { headers } from "next/headers";
import ProfileSetup from "@/components/ProfileSetup";
import { User, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

interface UserProfile {
  id: string;
  whopUserId: string;
  username: string;
  communityId: string;
  goals: string[];
  skills: string[];
  location: string;
  experience: number;
  bio: string;
  preferences?: {
    interests: string[];
    experienceRange: string;
    locationRadius: number;
    ageRange: string;
  };
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileCompletion, setProfileCompletion] = useState(0);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // First sync the user with our database
      const syncResponse = await fetch("/api/users/sync", {
        method: "POST",
      });

      if (!syncResponse.ok) {
        throw new Error("Failed to sync user");
      }

      // Then get the user profile
      const response = await fetch("/api/users/sync", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const result = await response.json();
      setUser(result.user);
      calculateProfileCompletion(result.user);
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setError("Failed to load profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateProfileCompletion = (userData: UserProfile) => {
    let completed = 0;
    const total = 6; // goals, skills, location, experience, bio, interests

    if (userData.goals && userData.goals.length > 0) completed++;
    if (userData.skills && userData.skills.length > 0) completed++;
    if (userData.location) completed++;
    if (userData.experience) completed++;
    if (userData.bio) completed++;
    if (userData.preferences?.interests && userData.preferences.interests.length > 0) completed++;

    setProfileCompletion(Math.round((completed / total) * 100));
  };

  const handleProfileUpdate = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    calculateProfileCompletion(updatedUser);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchUserProfile}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Profile Found</h2>
          <p className="text-gray-600">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/experiences/[experienceId]"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Matcher
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Profile</h1>
              <p className="text-gray-600">Complete your profile to get better matches</p>
            </div>
            
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm font-medium text-gray-700">Profile Completion</span>
                <span className="text-sm font-bold text-blue-600">{profileCompletion}%</span>
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${profileCompletion}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Status */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">@{user.username}</h2>
              <p className="text-gray-600">Community: {user.communityId}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">{user.goals?.length || 0}</div>
              <div className="text-sm text-gray-600">Goals</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">{user.skills?.length || 0}</div>
              <div className="text-sm text-gray-600">Skills</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {user.location ? "Set" : "Not Set"}
              </div>
              <div className="text-sm text-gray-600">Location</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {user.experience || "Not Set"}
              </div>
              <div className="text-sm text-gray-600">Experience</div>
            </div>
          </div>

          {profileCompletion === 100 && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-800 font-medium">Profile Complete!</span>
              </div>
              <p className="text-green-700 text-sm mt-1">
                You're ready to start matching with other community members.
              </p>
            </div>
          )}
        </div>

        {/* Profile Setup Form */}
        <ProfileSetup user={user} onProfileUpdate={handleProfileUpdate} />
      </div>
    </div>
  );
} 