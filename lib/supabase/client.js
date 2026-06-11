import { createBrowserClient } from "@supabase/ssr";

// Module-level singleton. Created ONCE for the whole browser session and
// reused on every import. This is critical: if the StoreProvider remounts
// on navigation (which it was observed to do), we must NOT create a new
// Supabase client each time — a new client re-reads the session from storage
// asynchronously, creating a window where the user appears logged out and
// the profile is null (the "Member" chip / admin lockout bug). A singleton
// keeps the already-restored session in memory across remounts.
let browserClient = null;

export function createClient() {
  if (browserClient) return browserClient;
  browserClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
  return browserClient;
}
