// app/lib/supabase.js
import { createClient } from "@supabase/supabase-js";

// Create a singleton instance
let supabaseInstance = null;

export function getSupabaseClient() {
  // Don't create client during build time
  if (typeof window === "undefined" && process.env.NODE_ENV === "production") {
    return null;
  }

  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Missing Supabase environment variables");
      return null;
    }

    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
  }

  return supabaseInstance;
}

// Export for compatibility
export const supabase =
  typeof window !== "undefined" ? getSupabaseClient() : null;
