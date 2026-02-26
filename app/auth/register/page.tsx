"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const [form, setForm] = useState({
    full_name: "",
    matric_no: "",
    department: "",
    level: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const supabase = createClient();

    const { data, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (authError || !data.user) {
      setError(authError?.message || "Registration failed");
      setLoading(false);
      return;
    }

    const { error: profileError } = await supabase.from("students").insert({
      id: data.user.id,
      full_name: form.full_name,
      matric_number: form.matric_no,
      department: form.department,
      level: form.level,
    });

    if (profileError) {
      setError(profileError.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      setSuccess("Account created successfully! Redirecting...");
      setLoading(false);
      await new Promise((resolve) => setTimeout(resolve, 100));
      window.location.href = "/waitingScreen";
    } else {
      setError("Login succeeded but no session was created");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4 font-sans text-zinc-900">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl border border-zinc-100 overflow-hidden">
        {/* Header Section */}
        <div className="bg-zinc-900 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-green-500 rounded-full blur-[50px] -ml-16 -mt-16 opacity-20" />

          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mx-auto mb-4 border border-white/20">
              <svg
                className="w-6 h-6 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Create Account
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              Join the academic platform today
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 flex items-start gap-3">
              <svg
                className="w-5 h-5 text-red-500 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-100 flex items-start gap-3">
              <svg
                className="w-5 h-5 text-green-500 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-green-600 font-medium">{success}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  name="full_name"
                  type="text"
                  placeholder="John Doe"
                  value={form.full_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-zinc-900 placeholder-zinc-400"
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                  Matric Number
                </label>
                <input
                  name="matric_no"
                  type="text"
                  placeholder="U2023/12345"
                  value={form.matric_no}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-zinc-900 placeholder-zinc-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                  Department
                </label>
                <input
                  name="department"
                  type="text"
                  placeholder="Comp Sci"
                  value={form.department}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-zinc-900 placeholder-zinc-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                  Level
                </label>
                <input
                  name="level"
                  type="text"
                  placeholder="100"
                  value={form.level}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-zinc-900 placeholder-zinc-400"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-100 my-2"></div>

            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                placeholder="student@university.edu"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-zinc-900 placeholder-zinc-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-zinc-900 placeholder-zinc-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-zinc-900 text-white font-bold py-3.5 rounded-xl hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-zinc-900/10 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Creating Account...</span>
                </>
              ) : (
                "Register"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <a
              href="/auth/login"
              className="font-bold text-green-600 hover:text-green-700 hover:underline"
            >
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
