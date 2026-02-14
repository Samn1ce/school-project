import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const value = request.cookies.get(name)?.value;
          console.log(`🍪 GET cookie: ${name} = ${value ? "exists" : "null"}`);
          return value;
        },
        set(name: string, value: string, options) {
          console.log(`🍪 SET cookie: ${name}`);
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options) {
          console.log(`🍪 REMOVE cookie: ${name}`);
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log("🔐 Session exists:", !!session);
  console.log("📍 Path:", request.nextUrl.pathname);

  // Redirect authenticated users away from auth pages
  if (
    session &&
    (request.nextUrl.pathname.startsWith("/auth/login") ||
      request.nextUrl.pathname.startsWith("/auth/register"))
  ) {
    console.log("✅ Redirecting authenticated user to /students");
    return NextResponse.redirect(new URL("/students", request.url));
  }

  // Redirect unauthenticated users to login
  if (!session && request.nextUrl.pathname.startsWith("/students")) {
    console.log("⛔ Redirecting unauthenticated user to /auth/login");
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/students/:path*", "/auth/login", "/auth/register"],
};
