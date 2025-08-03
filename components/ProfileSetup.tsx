"use client";

import { useState, useEffect } from "react";
import { User, Target, MapPin, Briefcase, Heart, Save, Loader2 } from "lucide-react";

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

interface ProfileSetupProps {
  user: UserProfile;
  onProfileUpdate?: (updatedUser: UserProfile) => void;
}

export default function ProfileSetup({ user, onProfileUpdate }: ProfileSetupProps) {
  const [formData, setFormData] = useState({
    goals: user.goals || [],
    skills: user.skills || [],
    location: user.location || "",
    experience: user.experience || 1,
    bio: user.bio || "",
    interests: user.preferences?.interests || [],
    experienceRange: user.preferences?.experienceRange || "1-3",
    locationRadius: user.preferences?.locationRadius || 50,
    ageRange: user.preferences?.ageRange || "18-35",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [newGoal, setNewGoal] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [newInterest, setNewInterest] = useState("");

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSaveStatus("idle");
  };

  const addItem = (field: "goals" | "skills" | "interests", value: string) => {
    if (value.trim() && !formData[field].includes(value.trim())) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
      setSaveStatus("idle");
    }
  };

  const removeItem = (field: "goals" | "skills" | "interests", index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
    setSaveStatus("idle");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSaveStatus("saving");

    try {
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          goals: formData.goals,
          skills: formData.skills,
          location: formData.location,
          experience: formData.experience,
          bio: formData.bio,
          preferences: {
            interests: formData.interests,
            experienceRange: formData.experienceRange,
            locationRadius: formData.locationRadius,
            ageRange: formData.ageRange,
          },
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setSaveStatus("saved");
        onProfileUpdate?.(result.user);
        
        // Reset save status after 3 seconds
        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
        setSaveStatus("error");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      setSaveStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Complete Your Profile</h2>
            <p className="text-gray-600">Help us find the perfect matches for you</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Goals Section */}
          <div>
            <label className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-3">
              <Target className="w-5 h-5 text-blue-600" />
              <span>Goals</span>
            </label>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  placeholder="Add a goal (e.g., Build a startup, Learn React)"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => {
                    addItem("goals", newGoal);
                    setNewGoal("");
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.goals.map((goal, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {goal}
                    <button
                      type="button"
                      onClick={() => removeItem("goals", index)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div>
            <label className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-3">
              <Briefcase className="w-5 h-5 text-purple-600" />
              <span>Skills</span>
            </label>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill (e.g., JavaScript, Marketing, Design)"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => {
                    addItem("skills", newSkill);
                    setNewSkill("");
                  }}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeItem("skills", index)}
                      className="ml-2 text-purple-600 hover:text-purple-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Location & Experience */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-3">
                <MapPin className="w-5 h-5 text-green-600" />
                <span>Location</span>
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="City, Country"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-3">
                <Briefcase className="w-5 h-5 text-orange-600" />
                <span>Experience Level</span>
              </label>
              <select
                value={formData.experience}
                onChange={(e) => handleInputChange("experience", parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value={1}>Beginner (0-2 years)</option>
                <option value={2}>Intermediate (2-5 years)</option>
                <option value={3}>Advanced (5-10 years)</option>
                <option value={4}>Expert (10+ years)</option>
              </select>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-3">
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              placeholder="Tell us about yourself, your background, and what you're looking for..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Interests Section */}
          <div>
            <label className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-3">
              <Heart className="w-5 h-5 text-pink-600" />
              <span>Interests</span>
            </label>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  placeholder="Add an interest (e.g., AI, Travel, Music)"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => {
                    addItem("interests", newInterest);
                    setNewInterest("");
                  }}
                  className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm"
                  >
                    {interest}
                    <button
                      type="button"
                      onClick={() => removeItem("interests", index)}
                      className="ml-2 text-pink-600 hover:text-pink-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Matching Preferences */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Matching Preferences</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Range
                </label>
                <select
                  value={formData.experienceRange}
                  onChange={(e) => handleInputChange("experienceRange", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="1-3">1-3 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5-10">5-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location Radius (km)
                </label>
                <input
                  type="number"
                  value={formData.locationRadius}
                  onChange={(e) => handleInputChange("locationRadius", parseInt(e.target.value))}
                  min="10"
                  max="500"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age Range
                </label>
                <select
                  value={formData.ageRange}
                  onChange={(e) => handleInputChange("ageRange", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="18-25">18-25</option>
                  <option value="25-35">25-35</option>
                  <option value="35-45">35-45</option>
                  <option value="45+">45+</option>
                </select>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              {saveStatus === "saving" && (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <span className="text-blue-600">Saving...</span>
                </>
              )}
              {saveStatus === "saved" && (
                <>
                  <Save className="w-4 h-4 text-green-600" />
                  <span className="text-green-600">Profile saved!</span>
                </>
              )}
              {saveStatus === "error" && (
                <span className="text-red-600">Error saving profile</span>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                "Save Profile"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 