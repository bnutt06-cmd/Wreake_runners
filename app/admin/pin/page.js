"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { COLORS, fmtDate } from "@/lib/data";
import { styles } from "@/lib/styles";

export default function AdminPinPage() {
  const router = useRouter();
  const {
    loggedIn, authReady, isAdmin,
    pinnedPost, setPinnedPost, clearPinnedPost,
  } = useStore();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState("");

  useEffect(() => {
    if (authReady && (!loggedIn || !isAdmin)) {
      router.replace(loggedIn ? "/dashboard" : "/login");
    }
  }, [authReady, loggedIn, isAdmin, router]);

  if (!authReady) return <p style={{ padding: 40 }}>Loading...</p>;
  if (!loggedIn || !isAdmin) return null;

  async function handleSave(e) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setFlash("Title and body are required.");
      return;
    }
    setSaving(true);
    setFlash("");
    const { ok, error } = await setPinnedPost({ title: title.trim(), body: body.trim() });
    setSaving(false);
    if (!ok) {
      setFlash("Error: " + (error || "could not save"));
      return;
    }
    setTitle("");
    setBody("");
    setFlash("Pinned post updated.");
    setTimeout(() => setFlash(""), 3000);
  }

  async function handleClear() {
    if (!confirm("Remove the active pinned post? The Club Area will no longer show a banner.")) return;
    setSaving(true);
    await clearPinnedPost();
    setSaving(false);
    setFlash("Pinned post cleared.");
    setTimeout(() => setFlash(""), 3000);
  }

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "40px 32px 64px" }}>
      <div style={{ marginBottom: 8, fontSize: 13 }}>
        <Link href="/admin" style={{ color: COLORS.teal, fontWeight: 600 }}>Back to Admin</Link>
      </div>
      <p style={styles.kickerDark}>ADMIN - PIN</p>
      <h2 style={styles.h2}>Club Area Pinned Post</h2>
      <p style={{ opacity: 0.7, marginTop: 8, marginBottom: 24 }}>
        The pinned post appears at the top of the Club Area dashboard. Use it
        for time-sensitive announcements: weather cancellations, venue changes,
        important reminders. Saving a new pin replaces the active one.
      </p>

      {flash ? <div style={{ ...styles.flash, marginBottom: 16 }}>{flash}</div> : null}

      {pinnedPost ? (
        <div
          style={{
            background: COLORS.mist,
            borderLeft: "4px solid " + COLORS.teal,
            padding: 16,
            borderRadius: 10,
            marginBottom: 24,
          }}
        >
          <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 700, letterSpacing: 1, opacity: 0.6, textTransform: "uppercase" }}>
            Currently pinned (since {fmtDate(pinnedPost.created_at)})
          </p>
          <strong style={{ fontSize: 16 }}>{pinnedPost.title}</strong>
          <p style={{ margin: "8px 0 12px", fontSize: 14, lineHeight: 1.55 }}>{pinnedPost.body}</p>
          <button
            onClick={handleClear}
            disabled={saving}
            style={{
              background: "transparent",
              border: "1.5px solid #C0392B",
              color: "#C0392B",
              padding: "6px 12px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              cursor: saving ? "wait" : "pointer",
            }}
          >
            Clear pinned post
          </button>
        </div>
      ) : (
        <div
          style={{
            padding: 16,
            background: "#fff",
            border: "1px dashed " + COLORS.mist,
            borderRadius: 10,
            marginBottom: 24,
            textAlign: "center",
            fontSize: 14,
            opacity: 0.65,
          }}
        >
          No pin active.
        </div>
      )}

      <form onSubmit={handleSave} style={{ background: "#fff", border: "1px solid " + COLORS.mist, borderRadius: 16, padding: 24, display: "grid", gap: 14 }}>
        <h3 style={{ margin: 0, fontFamily: "'Fraunces', serif", fontSize: 18 }}>
          {pinnedPost ? "Replace pinned post" : "Set pinned post"}
        </h3>

        <Field label="Title">
          <input
            style={inputStyle}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Track session moved indoors tonight"
            maxLength={120}
          />
        </Field>

        <Field label="Body">
          <textarea
            style={{ ...inputStyle, minHeight: 100, resize: "vertical" }}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Heavy rain forecast - we're moving tonight's session to the indoor facility..."
            maxLength={400}
          />
          <p style={{ margin: "4px 0 0", fontSize: 11, opacity: 0.6, textAlign: "right" }}>
            {body.length} / 400
          </p>
        </Field>

        <button type="submit" style={styles.cta} disabled={saving}>
          {saving ? "Saving..." : (pinnedPost ? "Replace pinned post" : "Pin this post")}
        </button>
      </form>
    </main>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: 0.5, opacity: 0.7, marginBottom: 6 }}>
        {label.toUpperCase()}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  padding: "10px 12px",
  borderRadius: 8,
  border: "1.5px solid " + COLORS.mist,
  fontSize: 14,
  background: "#fff",
  width: "100%",
  outline: "none",
  fontFamily: "inherit",
};
