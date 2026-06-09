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
  const { loggedIn, loading, profile, role, isAdmin } = useStore();

  useEffect(() => {
    if (!loading && !loggedIn) router.replace("/login");
  }, [loading, loggedIn, router]);

  if (loading) return <main style={styles.section}><p>Loading…</p></main>;
  if (!loggedIn) return null;

  const tabBar = {
    display: "flex",
    gap: 4,
    borderBottom: `2px solid ${COLORS.mist}`,
    marginBottom: 32,
    overflowX: "auto",
  };
  const tabLink = (active) => ({
    padding: "12px 20px",
    fontSize: 15,
    fontWeight: 600,
    color: active ? COLORS.ink : "#6b7280",
    borderBottom: `3px solid ${active ? COLORS.teal : "transparent"}`,
    marginBottom: -2,
    whiteSpace: "nowrap",
    textDecoration: "none",
    transition: "color .15s",
  });

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 32px 64px" }}>
      <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
        <div>
          <p style={styles.kickerDark}>WELCOME BACK</p>
          <h2 style={{ ...styles.h2, marginTop: 6 }}>
            {profile?.first_name ? `Hi, ${profile.first_name}` : "The Club Area"}
          </h2>
          <p style={{ opacity: 0.7, marginTop: 8, fontSize: 14 }}>
            Signed in as <strong>{role}</strong>.
            {isAdmin && " You have admin privileges."}
          </p>
        </div>
        <Link
          href="/dashboard/profile"
          style={{
            padding: "8px 14px",
            background: "#fff",
            color: COLORS.ink,
            border: `1.5px solid ${COLORS.mist}`,
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          Edit profile
        </Link>
      </div>

      <nav style={tabBar}>
        {TABS.map((t) => (
          <Link key={t.href} href={t.href} style={tabLink(pathname === t.href)}>
            {t.label}
          </Link>
        ))}
      </nav>

      {children}
    </main>
  );
}
