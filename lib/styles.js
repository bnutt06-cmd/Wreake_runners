// lib/styles.js — shared inline styles (mirrors the POC design system)
import { COLORS } from "./data";

const display = "'Fraunces', serif";

export const styles = {
  nav: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "18px 40px", position: "sticky", top: 0, zIndex: 50,
    background: "#ffffff",
    borderBottom: `1px solid ${COLORS.mist}`,
  },
  logo: { display: "flex", alignItems: "center", gap: 12, cursor: "pointer" },
  logoMark: {
    background: `linear-gradient(120deg, ${COLORS.teal}, ${COLORS.sky})`, color: "#fff",
    fontWeight: 800, width: 38, height: 38, borderRadius: 10, display: "grid",
    placeItems: "center", fontFamily: display, fontSize: 16,
  },
  logoText: { fontWeight: 700, letterSpacing: 1.5, fontSize: 15 },
  navLinks: { display: "flex", alignItems: "center", gap: 6 },
  navBtn: {
    background: "none", border: "none", padding: "8px 14px", fontSize: 15,
    color: COLORS.ink, borderRadius: 8, fontWeight: 500,
  },
  navBtnActive: { background: COLORS.mist, fontWeight: 700 },
  cta: {
    background: COLORS.ink, color: "#fff", border: "none",
    padding: "11px 20px", borderRadius: 10, fontWeight: 700, fontSize: 15,
  },
  ghostBtn: {
    background: "transparent", color: COLORS.ink, border: `2px solid ${COLORS.ink}`,
    padding: "9px 20px", borderRadius: 10, fontWeight: 700, fontSize: 15,
  },
  linkBtn: { background: "none", border: "none", color: COLORS.teal, fontWeight: 700, fontSize: 15 },

  hero: {
    position: "relative", overflow: "hidden",
    background: `linear-gradient(135deg, ${COLORS.ink} 0%, #1d3a8c 55%, ${COLORS.sky} 110%)`,
    color: "#fff", padding: "90px 40px 70px",
  },
  heroGrain: {
    position: "absolute", inset: 0, opacity: 0.06,
    backgroundImage:
      "radial-gradient(circle at 20% 30%, #fff 1px, transparent 1px), radial-gradient(circle at 70% 60%, #fff 1px, transparent 1px)",
    backgroundSize: "40px 40px",
  },
  heroInner: { position: "relative", maxWidth: 1100, margin: "0 auto", animation: "fadeUp .7s ease" },
  kicker: { letterSpacing: 3, fontSize: 13, fontWeight: 700, color: COLORS.cyan, margin: 0 },
  kickerDark: { letterSpacing: 3, fontSize: 13, fontWeight: 700, color: COLORS.teal, margin: 0 },
  heroH1: { fontFamily: display, fontSize: "clamp(48px, 8vw, 88px)", lineHeight: 1, margin: "16px 0 20px", fontWeight: 800 },
  heroSub: { fontSize: 19, lineHeight: 1.6, maxWidth: 620, opacity: 0.9, margin: 0 },
  heroBtns: { display: "flex", gap: 14, marginTop: 30, flexWrap: "wrap" },
  statRow: { display: "flex", gap: 40, marginTop: 56, flexWrap: "wrap" },
  statNum: { fontFamily: display, fontSize: 38, fontWeight: 800, color: COLORS.teal },
  statLabel: { fontSize: 14, opacity: 0.8, letterSpacing: 0.5 },

  section: { maxWidth: 1100, margin: "0 auto", padding: "64px 40px" },
  sectionHead: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 32, flexWrap: "wrap", gap: 12 },
  h2: { fontFamily: display, fontSize: "clamp(30px, 4vw, 44px)", margin: "8px 0 0", fontWeight: 800, lineHeight: 1.05 },

  newsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: 24 },
  card: {
    background: "#fff", borderRadius: 16, padding: 28, cursor: "pointer",
    border: `1px solid ${COLORS.mist}`, display: "flex", flexDirection: "column", gap: 10,
  },
  cardTag: {
    alignSelf: "flex-start", background: COLORS.sky, color: "#fff",
    fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 20, letterSpacing: 0.5,
  },
  cardTitle: { fontFamily: display, fontSize: 22, margin: 0, lineHeight: 1.2, fontWeight: 600 },
  cardExcerpt: { fontSize: 15, lineHeight: 1.55, opacity: 0.8, margin: 0, flex: 1 },
  cardMeta: { display: "flex", justifyContent: "space-between", fontSize: 13, opacity: 0.6, fontWeight: 600 },

  overlay: { position: "fixed", inset: 0, background: "rgba(30,42,110,.55)", backdropFilter: "blur(4px)", display: "grid", placeItems: "center", padding: 20, zIndex: 100 },
  modal: { background: COLORS.paper, borderRadius: 18, padding: 40, maxWidth: 640, width: "100%", position: "relative", maxHeight: "85vh", overflow: "auto", animation: "fadeUp .35s ease" },
  closeBtn: { position: "absolute", top: 18, right: 18, background: COLORS.mist, border: "none", width: 36, height: 36, borderRadius: "50%", fontSize: 16, fontWeight: 700 },

  raceRow: {
    display: "flex", gap: 24, alignItems: "flex-start", background: "#fff",
    borderRadius: 16, padding: 24, border: `1px solid ${COLORS.mist}`, flexWrap: "wrap",
  },
  raceDate: {
    background: COLORS.ink, color: "#fff", borderRadius: 12,
    width: 72, height: 72, display: "grid", placeItems: "center", flexShrink: 0,
  },
  raceDay: { fontFamily: display, fontSize: 30, fontWeight: 800, lineHeight: 1 },
  raceMonth: { fontSize: 12, letterSpacing: 1, fontWeight: 700 },
  raceType: { fontSize: 12, fontWeight: 700, color: COLORS.teal, letterSpacing: 1, textTransform: "uppercase" },
  raceSignup: { display: "flex", flexDirection: "column", gap: 8, minWidth: 160 },

  input: { padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${COLORS.mist}`, fontSize: 15, background: "#fff", outline: "none" },

  loginCard: { background: "#fff", borderRadius: 18, padding: 40, border: `1px solid ${COLORS.mist}`, boxShadow: "0 20px 50px rgba(30,42,110,.08)" },

  dashStats: { display: "flex", gap: 20, margin: "28px 0 40px", flexWrap: "wrap" },
  dashStat: { background: "#fff", borderRadius: 14, padding: "20px 28px", border: `1px solid ${COLORS.mist}`, minWidth: 140 },

  publishWrap: { display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24, alignItems: "start" },
  publishCard: { background: "#fff", borderRadius: 16, padding: 28, border: `1px solid ${COLORS.mist}` },
  publishSide: { background: "#fff", borderRadius: 16, padding: 28, border: `1px solid ${COLORS.mist}` },
  miniPost: { padding: 14, borderRadius: 10, background: COLORS.paper, border: `1px solid ${COLORS.mist}` },
  tagPick: { background: "#fff", border: `1.5px solid ${COLORS.mist}`, padding: "6px 14px", borderRadius: 20, fontSize: 14, fontWeight: 600 },
  tagPickActive: { background: COLORS.ink, color: "#fff", borderColor: COLORS.ink },
  flash: { background: COLORS.green, color: "#fff", padding: "10px 14px", borderRadius: 10, fontSize: 14, fontWeight: 600, marginBottom: 16 },

  footer: { background: COLORS.ink, color: "#fff", padding: "40px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 },
};
