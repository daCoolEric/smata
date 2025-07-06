// app/config/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Only throw error in development or if completely missing
if (
  (!supabaseUrl || !supabaseAnonKey) &&
  process.env.NODE_ENV !== "production"
) {
  throw new Error(
    "Supabase URL and Anon Key must be provided in environment variables"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
