import { getSupabaseServer } from "@/lib/supabase/server";
import DashboardUI from "./dashboard-ui";

export default async function DashboardPage() {
  const supabase = await getSupabaseServer();

  // Get logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-zinc-200 rounded-full mx-auto animate-pulse" />
          <p className="text-xl font-medium text-zinc-600">
            Please log in to access your dashboard
          </p>
        </div>
      </div>
    );
  }

  // Fetch student profile
  const { data: student } = await supabase
    .from("students")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch academic events
  const { data: events } = await supabase
    .from("academic_events")
    .select("*")
    .order("event_date", { ascending: true });

  return (
    <DashboardUI
      student={student || {}}
      events={events || []}
      userId={user.id}
    />
  );
}
