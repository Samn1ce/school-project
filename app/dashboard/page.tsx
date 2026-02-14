import { getSupabaseServer } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await getSupabaseServer();

  // 1️⃣ Get logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <p>You are not logged in</p>;
  }

  // 2️⃣ Fetch student profile
  const { data: student } = await supabase
    .from("students")
    .select("*")
    .eq("id", user.id)
    .single();

  // 3️⃣ Fetch today's academic events
  const { data: events } = await supabase
    .from("academic_events")
    .select("*")
    .order("event_date", { ascending: true });

  return (
    <main className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-2">Welcome, {student?.full_name}</h1>

      <p className="text-gray-600 mb-6">Department: {student?.department}</p>

      <section className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-3">Academic Events</h2>

        <ul className="space-y-2">
          {events?.map((event: any) => (
            <li key={event.id} className="border p-2 rounded">
              <p className="font-medium">{event.title}</p>
              <p className="text-sm text-gray-500">{event.event_date}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
