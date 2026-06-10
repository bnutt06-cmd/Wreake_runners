"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { styles } from "@/lib/styles";
import { COLORS } from "@/lib/data";

const TABS = [
  { href: "/dashboard", label: "The Club Area" },
  { href: "/dashboard/standards", label: "Standards" },
  { href: "/dashboard/races", label: "Race Hub" },
  { href: "/dashboard/events", label: "Club Events" },
];

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { loggedIn, accessResolved, profile, role, isAdmin } = useStore();

  useEffect(() => {
    if (accessResolved && !loggedIn) router.replace("/login");
  }, [accessResolved, loggedIn, router]);

  if (!accessResolved) return <main style={styles.section}><p>Loading...</p></main>;
  if (!loggedIn) return null;

  const firstName = profile?.first_name || "";

  return (
    <main>
      {/* ---- Club House banner: distinct members-area identity ---- */}
      <div
        style={{
          background: "linear-gradient(135deg, " + COLORS.ink + " 0%, #1d3a8c 60%, " + COLORS.teal + " 130%)",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* subtle dot texture */}
        <div
          style={{
            position: "absolute", inset: 0, opacity: 0.06,
            backgroundImage: "radial-gradient(circle at 20% 30%, #fff 1px, transparent 1px), radial-gradient(circle at 70% 60%, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="wr-clubhouse-pad" style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 32px 0", position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,.14)", padding: "5px 12px", borderRadius: 999, fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase" }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: COLORS.cyan, display: "inline-block" }} />
                The Club House
              </div>
              <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, margin: "14px 0 0" }}>
                {firstName ? "Welcome back, " + firstName : "Welcome to the Club House"}
              </h1>
              <p style={{ opacity: 0.85, margin: "8px 0 0", fontSize: 14 }}>
                Signed in as <strong>{role}</strong>.{isAdmin ? " You have admin privileges." : ""}
              </p>
            </div>
            <Link href="/dashboard/profile" className="wr-clubhouse-editbtn">
              Edit profile
            </Link>
          </div>

          {/* Tabs sit inside the banner */}
          <nav className="wr-clubtabs-row" style={{ display: "flex", gap: 4, marginTop: 28 }}>
            {TABS.map((t) => {
              const active = pathname === t.href;
              return (
                <Link
                  key={t.href}
                  href={t.href}
                  className={"wr-clubtab" + (active ? " wr-clubtab-active" : "")}
                >
                  {t.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content area */}
      <div className="wr-clubhouse-pad" style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 32px 64px" }}>
        {children}
      </div>
    </main>
  );
}
