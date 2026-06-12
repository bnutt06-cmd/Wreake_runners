"use client";

import { useState, useRef, useEffect } from "react";
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

  // Desktop dropdown state
  const [aboutOpen, setAboutOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const aboutTimer = useRef(null);
  const userTimer = useRef(null);

  // Mobile menu state
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);

  const onAboutSection = pathname === "/about" || pathname.startsWith("/about/");

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMobileOpen(false);
    setMobileAboutOpen(false);
  }, [pathname]);

  // Prevent body scroll when the mobile menu is open.
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

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

  const firstName = profile?.first_name || "";
  const lastName = profile?.last_name || "";
  const displayName = (firstName + " " + lastName).trim() || "Member";
  const initials = ((firstName[0] || "") + (lastName[0] || "")).toUpperCase() || "WR";

  function doLogout() {
    setUserOpen(false);
    setMobileOpen(false);
    logout();
    router.push("/");
  }

  return (
    <>
    <header style={styles.nav}>
      <Link href="/" className="wr-logo" style={styles.logo}>
        <img src="/wreake-runners.png" alt="Wreake Runners" className="wr-logo-img" />
      </Link>

      {/* ---- DESKTOP NAV ---- */}
      <nav className="wr-desktop-nav">
        <NavLink href="/" active={pathname === "/"}>Home</NavLink>

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
              <div style={{ background: "#fff", border: "1px solid " + COLORS.mist, borderRadius: 12, boxShadow: "0 12px 32px rgba(30,42,110,.16)", padding: 8, minWidth: 250, animation: "wrDropdown .16s ease" }}>
                {ABOUT_NAV.map(([href, label]) => (
                  <Link key={href} href={href} onClick={() => setAboutOpen(false)} className={"wr-dropitem" + (pathname === href ? " wr-dropitem-active" : "")}>
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
        <NavLink href="/join" active={pathname === "/join"}>Join Us</NavLink>
        <Link
          href="/wreake45"
          className={"wr-w45-navpill" + (pathname === "/wreake45" ? " wr-w45-navpill-active" : "")}
        >
          Wreake 45
        </Link>

        {loggedIn ? (
          <Link
            href="/dashboard"
            className={"wr-clubhouse-navpill" + (pathname.startsWith("/dashboard") ? " wr-clubhouse-navpill-active" : "")}
          >
            <span className="wr-clubhouse-navpill-dot" />
            Club House
          </Link>
        ) : null}

        {loggedIn ? (
          <div style={{ position: "relative" }} onMouseEnter={openUser} onMouseLeave={closeUserSoon}>
            <button className="wr-userchip" onClick={() => setUserOpen((o) => !o)}>
              <span className="wr-avatar">{initials}</span>
              <span className="wr-username">{firstName || "Member"}</span>
              <span style={{ fontSize: 10, opacity: 0.7 }}>{userOpen ? "\u25B2" : "\u25BC"}</span>
            </button>

            {userOpen ? (
              <div style={{ position: "absolute", top: "100%", right: 0, paddingTop: 8, zIndex: 60 }}>
                <div style={{ background: "#fff", border: "1px solid " + COLORS.mist, borderRadius: 12, boxShadow: "0 12px 32px rgba(30,42,110,.16)", padding: 8, minWidth: 220, animation: "wrDropdown .16s ease" }}>
                  <div style={{ padding: "8px 14px 10px", borderBottom: "1px solid " + COLORS.mist, marginBottom: 6 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: COLORS.teal, textTransform: "uppercase" }}>Club House</div>
                    <div style={{ fontSize: 15, fontWeight: 700, marginTop: 2 }}>{displayName}</div>
                  </div>
                  <Link href="/dashboard" onClick={() => setUserOpen(false)} className="wr-dropitem">Club House</Link>
                  <Link href="/dashboard/profile" onClick={() => setUserOpen(false)} className="wr-dropitem">Edit profile</Link>
                  {isAdmin ? <Link href="/admin" onClick={() => setUserOpen(false)} className="wr-dropitem">Admin</Link> : null}
                  <button onClick={doLogout} className="wr-dropitem" style={{ width: "100%", textAlign: "left", background: "none", border: "none", color: "#C0392B", fontWeight: 600 }}>Log out</button>
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <button className="wr-login-cta" onClick={() => router.push("/login")}>Member Login</button>
        )}
      </nav>

      {/* ---- MOBILE: hamburger button ---- */}
      <button
        className="wr-burger"
        aria-label="Open menu"
        onClick={() => setMobileOpen((o) => !o)}
      >
        <span style={{ transform: mobileOpen ? "translateY(7px) rotate(45deg)" : "none" }} />
        <span style={{ opacity: mobileOpen ? 0 : 1 }} />
        <span style={{ transform: mobileOpen ? "translateY(-7px) rotate(-45deg)" : "none" }} />
      </button>
    </header>

      {/* ---- MOBILE: slide-down panel (rendered OUTSIDE the header so it
           escapes the header's backdrop-filter stacking context, which was
           causing the panel to render behind page content) ---- */}
      {mobileOpen ? (
        <div className="wr-mobile-panel">
          {loggedIn ? (
            <div className="wr-mobile-userhead">
              <span className="wr-avatar" style={{ width: 38, height: 38, fontSize: 14 }}>{initials}</span>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: COLORS.teal, textTransform: "uppercase" }}>Club House</div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{displayName}</div>
              </div>
            </div>
          ) : null}

          <Link href="/" className="wr-mobile-link">Home</Link>

          {/* About Us with expandable sub-items */}
          <button
            className="wr-mobile-link wr-mobile-expand"
            onClick={() => setMobileAboutOpen((o) => !o)}
          >
            About Us
            <span style={{ fontSize: 12, opacity: 0.6 }}>{mobileAboutOpen ? "\u25B2" : "\u25BC"}</span>
          </button>
          {mobileAboutOpen ? (
            <div className="wr-mobile-sub">
              {ABOUT_NAV.map(([href, label]) => (
                <Link key={href} href={href} className="wr-mobile-sublink">{label}</Link>
              ))}
            </div>
          ) : null}

          <Link href="/beginners" className="wr-mobile-link">Beginners</Link>
          <Link href="/news" className="wr-mobile-link">News</Link>
          <Link href="/races" className="wr-mobile-link">Races &amp; Events</Link>
          <Link href="/join" className="wr-mobile-link">Join Us</Link>
          <Link href="/wreake45" className="wr-mobile-link" style={{ color: COLORS.teal, fontWeight: 800 }}>Wreake 45 &#127881;</Link>

          <div className="wr-mobile-divider" />

          {loggedIn ? (
            <>
              <Link href="/dashboard" className="wr-mobile-link">Club House</Link>
              <Link href="/dashboard/profile" className="wr-mobile-link">Edit profile</Link>
              {isAdmin ? <Link href="/admin" className="wr-mobile-link">Admin</Link> : null}
              <button onClick={doLogout} className="wr-mobile-link" style={{ color: "#C0392B", textAlign: "left", width: "100%", background: "none", border: "none" }}>Log out</button>
            </>
          ) : (
            <button className="wr-login-cta" style={{ width: "100%", marginTop: 8 }} onClick={() => { setMobileOpen(false); router.push("/login"); }}>
              Member Login
            </button>
          )}
        </div>
      ) : null}
    </>
  );
}

function NavLink({ href, active, children }) {
  return (
    <Link href={href} className={"wr-navbtn" + (active ? " wr-navbtn-active" : "")}>
      {children}
    </Link>
  );
}
