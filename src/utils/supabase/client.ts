import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "./info";

/**
 * Centralized Supabase client instance
 * This ensures only one client instance is created across the entire application
 * to avoid "Multiple GoTrueClient instances" warnings
 */
const supabaseUrl = `https://${projectId}.supabase.co`;

export const supabase = createClient(supabaseUrl, publicAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  global: {
    headers: {
      'x-client-info': 'mental-compass-app',
    },
  },
  db: {
    schema: 'public',
  },
});
