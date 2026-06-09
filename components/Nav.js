"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { styles } from "@/lib/styles";
import { COLORS } from "@/lib/data";
import { ABOUT_NAV } from "@/components/ContentPage";

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const { loggedIn, isAdmin, logout } = useStore();
  const [aboutOpen, setAboutOpen] = useState(false);

  const onAboutSection = pathname === "/about" || pathname.startsWith("/about/");

  return (
    <header style={styles.nav}>
      <Link href="/" style={styles.logo}>
        <span style={styles.logoMark}>WR</span>
        <span style={styles.logoText}>WREAKE RUNNERS</span>
      </Link>
      <nav style={styles.navLinks}>
        <Link
          href="/"
          style={{ ...styles.navBtn, ...(pathname === "/" ? styles.navBtnActive : {}) }}
        >
          Home
        </Link>

        <div
          style={{ position: "relative" }}
          onMouseEnter={() => setAboutOpen(true)}
          onMouseLeave={() => setAboutOpen(false)}
        >
          <button
            onClick={() => setAboutOpen((o) => !o)}
            style={{
              ...styles.navBtn,
              ...(onAboutSection ? styles.navBtnActive : {}),
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            About Us
            <span style={{ fontSize: 10, opacity: 0.7 }}>{aboutOpen ? "\u25B2" : "\u25BC"}</span>
          </button>

          {aboutOpen ? (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                marginTop: 6,
                background: "#fff",
                border: "1px solid " + COLORS.mist,
                borderRadius: 12,
                boxShadow: "0 12px 32px rgba(30,42,110,.14)",
                padding: 8,
                minWidth: 240,
                zIndex: 60,
              }}
            >
              {ABOUT_NAV.map(([href, label]) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setAboutOpen(false)}
                    style={{
                      display: "block",
                      padding: "9px 14px",
                      fontSize: 14,
                      fontWeight: active ? 700 : 500,
                      color: active ? COLORS.ink : "#374151",
                      borderRadius: 8,
                      textDecoration: "none",
                      background: active ? COLORS.mist : "transparent",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
          ) : null}
        </div>

        <Link
          href="/news"
          style={{ ...styles.navBtn, ...(pathname === "/news" ? styles.navBtnActive : {}) }}
        >
          News
        </Link>
        <Link
          href="/races"
          style={{ ...styles.navBtn, ...(pathname === "/races" ? styles.navBtnActive : {}) }}
        >
          Races & Events
        </Link>

        {loggedIn ? (
          <Link
            href="/dashboard"
            style={{ ...styles.navBtn, ...(pathname === "/dashboard" ? styles.navBtnActive : {}) }}
          >
            Dashboard
          </Link>
        ) : null}
        {loggedIn && isAdmin ? (
          <Link
            href="/admin"
            style={{ ...styles.navBtn, ...(pathname === "/admin" ? styles.navBtnActive : {}) }}
          >
            Admin
          </Link>
        ) : null}
        <button
          style={styles.cta}
          onClick={() => {
            if (loggedIn) { logout(); router.push("/"); }
            else { router.push("/login"); }
          }}
        >
          {loggedIn ? "Log out" : "Member Login"}
        </button>
      </nav>
    </header>
  );
}
