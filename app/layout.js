import "./globals.css";
import { StoreProvider } from "@/lib/store";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Wreake Runners — Running Club, Syston, Leicester",
  description: "A friendly, inclusive running club based in Syston, Leicester. Running better together since 1981.",
};

// Reading cookies (via the server Supabase client below) opts this layout
// out of static generation. Declaring it dynamic makes that explicit and
// prevents a build/runtime conflict on any otherwise-static route. The
// whole site is already effectively dynamic (client store + Supabase on
// every page), so there's no meaningful cost here.
export const dynamic = "force-dynamic";

// Root layout is a Server Component. It reads the session from cookies on the
// server (the source of truth) and hands the user down to the client store as
// initialUser. This means the client NEVER starts from a null/logged-out
// guess — it's hydrated with the server-validated identity, eliminating the
// "logged out flash" / "Member chip" on navigation.
export default async function RootLayout({ children }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en-GB">
      <body>
        <StoreProvider initialUser={user}>
          <Nav />
          {children}
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
