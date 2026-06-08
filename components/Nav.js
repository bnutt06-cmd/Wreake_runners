"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { styles } from "@/lib/styles";

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const { loggedIn, isAdmin, logout } = useStore();

  const publicLinks = [
    ["/", "Home"],
    ["/news", "News"],
    ["/races", "Races & Events"],
  ];

  return (
    <header style={styles.nav}>
      <Link href="/" style={styles.logo}>
        <span style={styles.logoMark}>WR</span>
        <span style={styles.logoText}>WREAKE RUNNERS</span>
      </Link>
      <nav style={styles.navLinks}>
        {publicLinks.map(([href, label]) => (
          <Link
            key={href}
            href={href}
            style={{ ...styles.navBtn, ...(pathname === href ? styles.navBtnActive : {}) }}
          >
            {label}
          </Link>
        ))}
        {loggedIn && (
          <Link
            href="/dashboard"
            style={{ ...styles.navBtn, ...(pathname === "/dashboard" ? styles.navBtnActive : {}) }}
          >
            Dashboard
          </Link>
        )}
        {loggedIn && isAdmin && (
          <Link
            href="/admin"
            style={{ ...styles.navBtn, ...(pathname === "/admin" ? styles.navBtnActive : {}) }}
          >
            Admin
          </Link>
        )}
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
