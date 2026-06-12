import Link from "next/link";
import { COLORS } from "@/lib/data";

export default function Footer() {
  return (
    <footer style={{ background: COLORS.ink, color: "#fff", marginTop: 0 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "44px 32px 28px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 40, justifyContent: "space-between" }}>
          {/* Club info */}
          <div style={{ maxWidth: 320 }}>
            <strong style={{ letterSpacing: 1, fontSize: 16 }}>WREAKE RUNNERS</strong>
            <p style={{ opacity: 0.75, margin: "10px 0 0", fontSize: 14, lineHeight: 1.6 }}>
              Catholic Church Hall, Broad Street, Syston, LE7 1GH
            </p>
            <p style={{ opacity: 0.75, margin: "4px 0 0", fontSize: 14 }}>Running better together since 1981.</p>
            {/* Socials */}
            <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
              <a
                href="https://www.instagram.com/wreake_runners"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Wreake Runners on Instagram"
                style={socialBtn}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/wreakerunners"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Wreake Runners on Facebook"
                style={socialBtn}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <div style={footHead}>Explore</div>
            <div style={{ display: "grid", gap: 8 }}>
              <Link href="/about" style={footLink}>About Us</Link>
              <Link href="/beginners" style={footLink}>Beginners</Link>
              <Link href="/news" style={footLink}>News</Link>
              <Link href="/races" style={footLink}>Races &amp; Events</Link>
              <Link href="/join" style={footLink}>Join Us</Link>
            </div>
          </div>

          {/* Affiliations */}
          <div>
            <div style={footHead}>Proudly affiliated</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center" }}>
              <a href="https://www.englandathletics.org/" target="_blank" rel="noopener noreferrer" style={logoWrap} aria-label="England Athletics Affiliated Club">
                <img src="/ea-affiliated.png" alt="England Athletics Affiliated Club" style={{ height: 46, width: "auto", display: "block" }} />
              </a>
              <a href="https://lran.org.uk/" target="_blank" rel="noopener noreferrer" style={logoWrap} aria-label="Leicestershire Running and Athletics Network">
                <img src="/lran.jpg" alt="Leicestershire Running & Athletics Network" style={{ height: 56, width: "auto", display: "block" }} />
              </a>
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,.15)", marginTop: 32, paddingTop: 18, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <div style={{ opacity: 0.6, fontSize: 13 }}>© {new Date().getFullYear()} Wreake Runners</div>
          <div style={{ opacity: 0.6, fontSize: 13 }}>Syston, Leicester</div>
        </div>
      </div>
    </footer>
  );
}

const socialBtn = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 38,
  height: 38,
  borderRadius: 10,
  background: "rgba(255,255,255,.12)",
  color: "#fff",
  textDecoration: "none",
  transition: "background .18s ease",
};

const footHead = {
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: 1.2,
  textTransform: "uppercase",
  opacity: 0.6,
  marginBottom: 14,
};

const footLink = {
  color: "#fff",
  opacity: 0.85,
  textDecoration: "none",
  fontSize: 14,
};

const logoWrap = {
  background: "#fff",
  borderRadius: 8,
  padding: "8px 12px",
  display: "inline-flex",
  alignItems: "center",
};
