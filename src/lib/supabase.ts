import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase env vars. Copy .env.example → .env and fill in your project values."
  );
}

// Only the anon key is used here - service_role key never touches the browser.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
