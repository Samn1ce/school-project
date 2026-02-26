"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { populateMockData } from "../actions/mock-data";

export default function WaitingScreenPage() {
  const supabase = createClient();

  const [student, setStudent] = useState<any>(null);
  const [state, setState] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState(
    "Preparing your personalized dashboard..."
  );
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const autoGenerate = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/auth/login";
        return;
      }

      const { data: studentData } = await supabase
        .from("students")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!studentData?.is_new_user) {
        window.location.href = "/dashboard";
        return;
      }

      setStudent(studentData);
      setMessage("Reading your profile...");

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMessage(`Generating courses for ${studentData.department}...`);

      const result = await populateMockData(user.id);

      if (result.success) {
        setMessage("Creating your schedule...");
        await new Promise((resolve) => setTimeout(resolve, 500));

        setState("success");
        setStats(result.stats);
      } else {
        setState("error");
        setMessage(result.message || "Failed to generate data");
      }
    };

    autoGenerate();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
      {/* Content */}
      <div className="relative z-10 max-w-2xl w-full text-center">
        {/* Logo/Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto mb-6 border-4 border-green-500">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Welcome to School Companion AI! 🎓
          </h1>
          <p className="text-lg text-gray-600 max-w-lg mx-auto">
            Hi{" "}
            <span className="font-semibold text-green-600">
              {student?.full_name || "Student"}
            </span>
            ! Let's set up your profile to give you the best experience.
          </p>
        </div>

        {/* Features preview cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md border-2 border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Smart Schedule</h3>
            <p className="text-sm text-gray-500">
              Track your classes and events
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border-2 border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">AI Assistant</h3>
            <p className="text-sm text-gray-500">Get homework help anytime</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border-2 border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Study Tools</h3>
            <p className="text-sm text-gray-500">Organize your courses</p>
          </div>
        </div>

        {/* Status text - Changes based on state */}
        {state === "loading" && (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-gray-500">{message}</p>
          </div>
        )}

        {state === "success" && (
          <div className="bg-white rounded-xl shadow-lg border-2 border-green-200 p-6 mx-auto max-w-md">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-500">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">
              All Set! 🎉
            </h3>
            <p className="text-sm text-gray-600 mb-4">Your profile is ready!</p>

            {stats && (
              <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 mb-4 text-sm">
                <div className="space-y-2 text-gray-600">
                  <p className="flex items-center justify-between">
                    <span>📚 Courses:</span>
                    <span className="font-bold text-green-600">
                      {stats.courses}
                    </span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span>📅 Schedules:</span>
                    <span className="font-bold text-green-600">
                      {stats.schedules}
                    </span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span>📆 Events:</span>
                    <span className="font-bold text-green-600">
                      {stats.events}
                    </span>
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                window.location.href = "/dashboard";
              }}
              className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg border-2 border-green-700 transition-all"
            >
              Go to Dashboard 🎉
            </button>
          </div>
        )}

        {state === "error" && (
          <div className="bg-white rounded-xl shadow-lg border-2 border-red-200 p-6 mx-auto max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-red-300">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">Oops!</h3>
            <p className="text-sm text-gray-600 mb-4">{message}</p>

            <button
              onClick={() => {
                window.location.reload();
              }}
              className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg border-2 border-green-700 transition-all"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
