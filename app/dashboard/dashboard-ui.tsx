"use client";

import { useState } from "react";
import LogoutButton from "../components/logout";
import { Badge } from "../components/badges";
import { ChatModal } from "../components/chat-room";

interface DashboardUIProps {
  student: any;
  events: any;
  userId: string;
}

export default function DashboardUI({
  student,
  events,
  userId,
}: DashboardUIProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Get current date info
  const today = new Date();
  const currentHour = today.getHours();
  const greeting =
    currentHour < 12
      ? "Good Morning"
      : currentHour < 18
      ? "Good Afternoon"
      : "Good Evening";

  const dateString = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 font-sans selection:bg-green-100 selection:text-green-900">
      {/* Sticky Glass Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-zinc-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16">
          <div className="flex justify-between items-center h-full">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center shadow-lg shadow-green-600/20">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <span className="font-bold text-xl tracking-tight text-zinc-900">
                School<span className="text-green-600">Companion</span>
              </span>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Section - Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Welcome Card */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-zinc-200 p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] relative overflow-hidden group">
            {/* Decorative Background Element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50 pointer-events-none group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
              <div className="hidden md:block">
                <div className="w-24 h-24 rounded-2xl bg-zinc-100 border-2 border-zinc-200 flex items-center justify-center shadow-inner">
                  <span className="text-3xl font-bold text-zinc-400">
                    {student?.full_name?.charAt(0) || "S"}
                  </span>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider">
                    {greeting}
                  </span>
                  <span className="text-zinc-400 text-sm font-medium">
                    {dateString}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 tracking-tight mb-4">
                  {student?.full_name || "Student"}
                </h2>

                <div className="flex flex-wrap gap-3">
                  <Badge icon="department" text={student?.department} />
                  <Badge icon="level" text={`Level ${student?.level}`} />
                  <Badge icon="id" text={student?.matric_number} />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats / Status Card */}
          <div className="lg:col-span-4 bg-zinc-900 rounded-2xl p-8 text-white relative overflow-hidden flex flex-col justify-between shadow-xl shadow-zinc-900/10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 rounded-full blur-[80px] -mr-16 -mt-32 opacity-20" />

            <div>
              <p className="text-zinc-400 font-medium mb-1">Academic Status</p>
              <h3 className="text-2xl font-bold tracking-tight text-white">
                Spring Semester
              </h3>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/15 transition-colors">
                <p className="text-3xl font-bold">{events?.length || 0}</p>
                <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold mt-1">
                  Events
                </p>
              </div>
              <div className="bg-green-500/20 backdrop-blur-sm rounded-xl p-4 border border-green-500/30">
                <p className="text-3xl font-bold text-green-400">98%</p>
                <p className="text-xs text-green-200/80 uppercase tracking-wider font-semibold mt-1">
                  Attendance
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Events (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-green-500 rounded-full"></span>
                Upcoming Schedule
              </h3>
              <button className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors">
                View Calendar &rarr;
              </button>
            </div>

            {events && events.length > 0 ? (
              <div className="grid gap-4">
                {events.map((event: any) => (
                  <div
                    key={event.id}
                    className="group bg-white rounded-xl p-5 border border-zinc-200 hover:border-green-500 hover:ring-1 hover:ring-green-500 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row gap-5 items-start sm:items-center"
                  >
                    {/* Date Block */}
                    <div className="shrink-0 w-16 h-16 bg-zinc-50 rounded-xl border border-zinc-100 flex flex-col items-center justify-center text-center group-hover:bg-green-50 group-hover:border-green-100 transition-colors">
                      <span className="text-xs font-bold text-zinc-500 uppercase group-hover:text-green-600">
                        {new Date(event.event_date).toLocaleDateString(
                          "en-US",
                          { month: "short" }
                        )}
                      </span>
                      <span className="text-xl font-bold text-zinc-900 group-hover:text-green-700">
                        {new Date(event.event_date).getDate()}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-bold text-zinc-900 truncate group-hover:text-green-700 transition-colors">
                        {event.title}
                      </h4>
                      <div className="flex items-center gap-4 mt-1 text-sm text-zinc-500">
                        {event.location && (
                          <div className="flex items-center gap-1.5">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            {event.location}
                          </div>
                        )}
                        <div className="hidden sm:block w-1 h-1 rounded-full bg-zinc-300" />
                        <span className="truncate">
                          {new Date(event.event_date).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>

                    <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border-2 border-dashed border-zinc-200 p-12 text-center">
                <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-400">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-zinc-900">
                  No events scheduled
                </h3>
                <p className="text-zinc-500 mt-1 mb-6 max-w-sm mx-auto">
                  Your schedule is clear for now. Enjoy your free time or plan
                  ahead.
                </p>
                <button className="bg-zinc-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-900/20">
                  Add Event
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Quick Actions (1/3 width) */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-zinc-900 rounded-full"></span>
              Quick Actions
            </h3>

            <div className="grid grid-cols-1 gap-4">
              {/* Chat Card */}
              <button
                onClick={() => setIsChatOpen(true)}
                className="group relative w-full text-left bg-linear-to-br from-green-600 to-emerald-700 rounded-2xl p-6 text-white shadow-lg shadow-green-600/20 overflow-hidden hover:scale-[1.02] transition-transform duration-300"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <svg
                    className="w-32 h-32"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                  </svg>
                </div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-4 border border-white/20">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold mb-1">AI Assistant</h4>
                  <p className="text-green-100 text-sm font-medium">
                    Ask questions & get help
                  </p>
                </div>
              </button>

              {/* Resources Card */}
              <button className="group w-full text-left bg-white rounded-2xl p-6 border border-zinc-200 hover:border-zinc-300 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-50 rounded-xl flex items-center justify-center border border-zinc-100 group-hover:bg-zinc-100 transition-colors">
                    <svg
                      className="w-6 h-6 text-zinc-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-zinc-900 group-hover:text-green-600 transition-colors">
                      Study Resources
                    </h4>
                    <p className="text-zinc-500 text-sm">
                      Access course materials
                    </p>
                  </div>
                </div>
              </button>

              {/* Assignments Card */}
              <button className="group w-full text-left bg-white rounded-2xl p-6 border border-zinc-200 hover:border-zinc-300 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-50 rounded-xl flex items-center justify-center border border-zinc-100 group-hover:bg-zinc-100 transition-colors">
                    <svg
                      className="w-6 h-6 text-zinc-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-zinc-900 group-hover:text-green-600 transition-colors">
                      Assignments
                    </h4>
                    <p className="text-zinc-500 text-sm">View pending tasks</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>
      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        userId={userId}
      />
    </div>
  );
}
