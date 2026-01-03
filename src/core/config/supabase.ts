import { createClient } from "@supabase/supabase-js";

let supabaseClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  console.log("Environment check - SUPABASE_URL:", supabaseUrl ? "Present" : "Missing");
  console.log("Environment check - SUPABASE_ANON_KEY:", supabaseAnonKey ? "Present" : "Missing");

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("❌ Environment variables missing:");
    console.error("SUPABASE_URL:", supabaseUrl);
    console.error("SUPABASE_ANON_KEY:", supabaseAnonKey ? "Present" : "Missing");
    throw new Error(
      "SUPABASE_URL or SUPABASE_ANON_KEY is not set in environment variables"
    );
  }

  try {
    supabaseClient = createClient(supabaseUrl.trim(), supabaseAnonKey.trim());
    console.log("✅ Supabase client initialized successfully");
    return supabaseClient;
  } catch (error) {
    console.error("❌ Failed to create Supabase client:", error);
    throw error;
  }
}