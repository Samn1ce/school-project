import { getSupabaseServer } from "@/lib/supabase/server";
import LogoutButton from "../components/logout";

export default async function StudentsPage() {
  const supabase = await getSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div>
      <h1>Students</h1>
      <p>{user ? user.email : "Not logged in"}</p>
      <LogoutButton />
    </div>
  );
}
