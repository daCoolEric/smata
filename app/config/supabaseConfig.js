// app/config/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://iwxvasuhwjcdoavjuuvs.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3eHZhc3Vod2pjZG9hdmp1dXZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NjM2MjQsImV4cCI6MjA2NjEzOTYyNH0.OXl96l2oB9ruoTlUqQnCUu2uBC0P8b0Dvy4X0kMpuvo";

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
