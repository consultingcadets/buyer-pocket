import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const AUTH_PAGES = new Set(["/login", "/signup"]);
const SIGNUP_ONBOARDING = /^\/signup\/(eligibility|profile|notifications)/;
const APP_ROUTES = /^\/(today|buyers|reminders|settings|notes)/;

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  if (user) {
    // Authenticated users leave /login and /signup (step 1 only)
    if (AUTH_PAGES.has(pathname)) {
      return NextResponse.redirect(new URL("/today", request.url));
    }
  } else {
    // Unauthenticated users can't access app routes
    if (APP_ROUTES.test(pathname)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // Unauthenticated users can't access signup continuation steps
    if (SIGNUP_ONBOARDING.test(pathname)) {
      return NextResponse.redirect(new URL("/signup", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
