"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1️⃣ Create auth user
    const { data, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (authError || !data.user) {
      setError(authError?.message || "Registration failed");
      setLoading(false);
      return;
    }

    // 2️⃣ Create student profile
    const { error: profileError } = await supabase.from("students").insert({
      id: data.user.id,
      full_name: form.full_name,
      matric_no: form.matric_no,
      department: form.department,
      level: form.level,
    });

    if (profileError) {
      setError(profileError.message);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleRegister}>
      <h1>Register</h1>

      <input name="full_name" placeholder="Full Name" onChange={handleChange} />
      <input
        name="matric_no"
        placeholder="Matric Number"
        onChange={handleChange}
      />
      <input
        name="department"
        placeholder="Department"
        onChange={handleChange}
      />
      <input name="level" placeholder="Level" onChange={handleChange} />

      <input
        name="email"
        type="email"
        placeholder="Email"
        onChange={handleChange}
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
      />

      <button disabled={loading}>
        {loading ? "Creating account..." : "Register"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
