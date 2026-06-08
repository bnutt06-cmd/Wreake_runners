"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { styles } from "@/lib/styles";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { user, loading, updatePassword } = useStore();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      setErr("This reset link has expired or is invalid. Request a new one from the login page.");
    }
  }, [loading, user]);

  async function submit() {
    setErr("");
    if (password.length < 8) { setErr("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setErr("Passwords don't match."); return; }
    setBusy(true);
    const { ok, error } = await updatePassword(password);
    setBusy(false);
    if (ok) router.push("/dashboard");
    else setErr(error || "Couldn't update password.");
  }

  return (
    <main style={{ ...styles.section, maxWidth: 440 }}>
      <div style={styles.loginCard}>
        <p style={styles.kickerDark}>RESET PASSWORD</p>
        <h2 style={{ ...styles.h2, fontSize: 30 }}>New password</h2>
        <p style={{ opacity: 0.7, fontSize: 14, marginBottom: 24 }}>
          Choose a new password (8 characters minimum).
        </p>

        <input
          style={{ ...styles.input, width: "100%", marginBottom: 12 }}
          type="password" placeholder="New password"
          value={password} onChange={(e) => setPassword(e.target.value)}
        />
        <input
          style={{ ...styles.input, width: "100%", marginBottom: 16 }}
          type="password" placeholder="Confirm password"
          value={confirm} onChange={(e) => setConfirm(e.target.value)}
        />

        {err && <p style={{ color: "#C0392B", fontSize: 14, margin: "0 0 12px" }}>{err}</p>}

        <button
          style={{ ...styles.cta, width: "100%", opacity: busy ? 0.6 : 1 }}
          onClick={submit} disabled={busy || !user}
        >
          {busy ? "Updating…" : "Update password"}
        </button>
      </div>
    </main>
  );
}