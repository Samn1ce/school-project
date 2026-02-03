import { supabase } from "@/lib/supabase/client";

// This is a Server Component in Next.js
export default async function SchedulesPage() {
  // Step 1: Fetch schedules from Supabase
  const { data: schedules, error } = await supabase
    .from("schedules")
    .select("*")
    .order("start_time", { ascending: true }); // optional: sort by time

  // Step 2: Handle errors
  if (error) {
    return <p>Error loading schedules: {error.message}</p>;
  }

  // Step 3: Render the schedules
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Student Schedules</h1>

      {schedules?.length === 0 ? (
        <p>No schedules found</p>
      ) : (
        <ul className="space-y-3">
          {schedules.map((schedule) => (
            <li key={schedule.id} className="border p-3 rounded">
              <h2 className="font-semibold">{schedule.title}</h2>
              <p>Type: {schedule.activity_type}</p>
              <p>
                Time: {new Date(schedule.start_time).toLocaleString()} -{" "}
                {new Date(schedule.end_time).toLocaleString()}
              </p>
              <p>Semester: {schedule.semester}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
