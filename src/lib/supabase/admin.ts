import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Server-only. Never import in client components.
// Bypasses RLS — use only in webhook handlers and scheduled jobs.
export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
