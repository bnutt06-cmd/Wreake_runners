"use client";

import { useState, useRef } from "react";
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
  const closeTimer = useRef(null);

  const onAboutSection = pathname === "/about" || pathname.startsWith("/about/");

  // Open immediately on enter; close on a short delay so crossing the small
  // gap between button and menu doesn't snap it shut. This is the fix for
  // "the dropdown is impossible to click".
  function open() {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
    setAboutOpen(true);
  }
  function scheduleClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setAboutOpen(false), 220);
  }

  return (
    <header style={styles.nav}>
      <Link href="/" className="wr-logo" style={styles.logo}>
        <span style={styles.logoMark}>WR</span>
        <span style={styles.logoText}>WREAKE RUNNERS</span>
      </Link>
      <nav style={styles.navLinks}>
        <NavLink href="/" active={pathname === "/"}>Home</NavLink>

        {/* About Us — text navigates to overview, whole control opens dropdown */}
        <div
          style={{ position: "relative" }}
          onMouseEnter={open}
          onMouseLeave={scheduleClose}
        >
          <div
            className={"wr-navbtn" + (onAboutSection ? " wr-navbtn-active" : "")}
            style={{ display: "inline-flex", alignItems: "center", gap: 5, cursor: "pointer" }}
          >
            <Link
              href="/about"
              style={{ color: "inherit", textDecoration: "none" }}
              onClick={() => setAboutOpen(false)}
            >
              About Us
            </Link>
            <button
              onClick={(e) => { e.preventDefault(); setAboutOpen((o) => !o); }}
              aria-label="Toggle About menu"
              style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "inherit", fontSize: 10, opacity: 0.7, lineHeight: 1 }}
            >
              {aboutOpen ? "\u25B2" : "\u25BC"}
            </button>
          </div>

          {/* Invisible bridge removes the dead gap between button and menu */}
          {aboutOpen ? (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                paddingTop: 8,
                zIndex: 60,
              }}
            >
              <div
                style={{
                  background: "#fff",
                  border: "1px solid " + COLORS.mist,
                  borderRadius: 12,
                  boxShadow: "0 12px 32px rgba(30,42,110,.16)",
                  padding: 8,
                  minWidth: 250,
                  animation: "wrDropdown .16s ease",
                }}
              >
                {ABOUT_NAV.map(([href, label]) => {
                  const active = pathname === href;
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setAboutOpen(false)}
                      className={"wr-dropitem" + (active ? " wr-dropitem-active" : "")}
                    >
                      {label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>

        <NavLink href="/news" active={pathname === "/news"}>News</NavLink>
        <NavLink href="/races" active={pathname === "/races"}>Races &amp; Events</NavLink>

        {loggedIn ? (
          <NavLink href="/dashboard" active={pathname === "/dashboard"}>Dashboard</NavLink>
        ) : null}
        {loggedIn && isAdmin ? (
          <NavLink href="/admin" active={pathname === "/admin"}>Admin</NavLink>
        ) : null}
        <button
          className="wr-cta"
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

function NavLink({ href, active, children }) {
  return (
    <Link
      href={href}
      className={"wr-navbtn" + (active ? " wr-navbtn-active" : "")}
    >
      {children}
    </Link>
  );
}
