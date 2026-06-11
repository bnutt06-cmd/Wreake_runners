import { createBrowserClient } from "@supabase/ssr";

// Browser client. createBrowserClient from @supabase/ssr stores the session
// in cookies (shared with the server) and is safe to call per-component —
// it manages a shared instance internally. With server-side hydration
// (root layout passes the user into the store), the client no longer needs
// to discover identity on its own; it just reacts to sign-in/out events.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}
