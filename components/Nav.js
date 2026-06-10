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
  const { loggedIn, isAdmin, profile, logout } = useStore();
  const [aboutOpen, setAboutOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const aboutTimer = useRef(null);
  const userTimer = useRef(null);

  const onAboutSection = pathname === "/about" || pathname.startsWith("/about/");

  function openAbout() {
    if (aboutTimer.current) { clearTimeout(aboutTimer.current); aboutTimer.current = null; }
    setAboutOpen(true);
  }
  function closeAboutSoon() {
    if (aboutTimer.current) clearTimeout(aboutTimer.current);
    aboutTimer.current = setTimeout(() => setAboutOpen(false), 220);
  }
  function openUser() {
    if (userTimer.current) { clearTimeout(userTimer.current); userTimer.current = null; }
    setUserOpen(true);
  }
  function closeUserSoon() {
    if (userTimer.current) clearTimeout(userTimer.current);
    userTimer.current = setTimeout(() => setUserOpen(false), 220);
  }

  // Build display name + initials from the profile.
  const firstName = profile?.first_name || "";
  const lastName = profile?.last_name || "";
  const displayName = (firstName + " " + lastName).trim() || "Member";
  const initials = ((firstName[0] || "") + (lastName[0] || "")).toUpperCase() || "WR";

  return (
    <header style={styles.nav}>
      <Link href="/" className="wr-logo" style={styles.logo}>
        <img
          src="/wreake-runners.png"
          alt="Wreake Runners"
          style={{ height: 56, width: "auto", display: "block" }}
        />
      </Link>
      <nav style={styles.navLinks}>
        <NavLink href="/" active={pathname === "/"}>Home</NavLink>

        {/* About Us dropdown */}
        <div style={{ position: "relative" }} onMouseEnter={openAbout} onMouseLeave={closeAboutSoon}>
          <div
            className={"wr-navbtn" + (onAboutSection ? " wr-navbtn-active" : "")}
            style={{ display: "inline-flex", alignItems: "center", gap: 5, cursor: "pointer" }}
          >
            <Link href="/about" style={{ color: "inherit", textDecoration: "none" }} onClick={() => setAboutOpen(false)}>
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

          {aboutOpen ? (
            <div style={{ position: "absolute", top: "100%", left: 0, paddingTop: 8, zIndex: 60 }}>
              <div
                style={{
                  background: "#fff", border: "1px solid " + COLORS.mist, borderRadius: 12,
                  boxShadow: "0 12px 32px rgba(30,42,110,.16)", padding: 8, minWidth: 250,
                  animation: "wrDropdown .16s ease",
                }}
              >
                {ABOUT_NAV.map(([href, label]) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setAboutOpen(false)}
                    className={"wr-dropitem" + (pathname === href ? " wr-dropitem-active" : "")}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <NavLink href="/beginners" active={pathname === "/beginners"}>Beginners</NavLink>
        <NavLink href="/news" active={pathname === "/news"}>News</NavLink>
        <NavLink href="/races" active={pathname === "/races"}>Races &amp; Events</NavLink>

        {loggedIn ? (
          /* ---- Logged-in: avatar chip + dropdown ---- */
          <div style={{ position: "relative" }} onMouseEnter={openUser} onMouseLeave={closeUserSoon}>
            <button
              className="wr-userchip"
              onClick={() => setUserOpen((o) => !o)}
            >
              <span className="wr-avatar">{initials}</span>
              <span className="wr-username">{firstName || "Member"}</span>
              <span style={{ fontSize: 10, opacity: 0.7 }}>{userOpen ? "\u25B2" : "\u25BC"}</span>
            </button>

            {userOpen ? (
              <div style={{ position: "absolute", top: "100%", right: 0, paddingTop: 8, zIndex: 60 }}>
                <div
                  style={{
                    background: "#fff", border: "1px solid " + COLORS.mist, borderRadius: 12,
                    boxShadow: "0 12px 32px rgba(30,42,110,.16)", padding: 8, minWidth: 220,
                    animation: "wrDropdown .16s ease",
                  }}
                >
                  {/* Header showing who's logged in */}
                  <div style={{ padding: "8px 14px 10px", borderBottom: "1px solid " + COLORS.mist, marginBottom: 6 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: COLORS.teal, textTransform: "uppercase" }}>
                      Club House
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, marginTop: 2 }}>{displayName}</div>
                  </div>

                  <Link href="/dashboard" onClick={() => setUserOpen(false)} className="wr-dropitem">
                    Club House
                  </Link>
                  <Link href="/dashboard/profile" onClick={() => setUserOpen(false)} className="wr-dropitem">
                    Edit profile
                  </Link>
                  {isAdmin ? (
                    <Link href="/admin" onClick={() => setUserOpen(false)} className="wr-dropitem">
                      Admin
                    </Link>
                  ) : null}
                  <button
                    onClick={() => { setUserOpen(false); logout(); router.push("/"); }}
                    className="wr-dropitem"
                    style={{ width: "100%", textAlign: "left", background: "none", border: "none", color: "#C0392B", fontWeight: 600 }}
                  >
                    Log out
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          /* ---- Logged-out: prominent invitation button ---- */
          <button
            className="wr-login-cta"
            onClick={() => router.push("/login")}
          >
            Member Login
          </button>
        )}
      </nav>
    </header>
  );
}

function NavLink({ href, active, children }) {
  return (
    <Link href={href} className={"wr-navbtn" + (active ? " wr-navbtn-active" : "")}>
      {children}
    </Link>
  );
}
