"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { styles } from "@/lib/styles";

export default function LoginPage() {
  const router = useRouter();
  const { login, requestPasswordReset } = useStore();

  const [mode, setMode] = useState("login"); // 'login' | 'forgot'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function submitLogin() {
    setBusy(true); setErr(""); setMsg("");
    const { ok, error } = await login(email.trim(), password);
    setBusy(false);
    if (ok) router.push("/dashboard");
    else setErr(error || "Incorrect email or password.");
  }

  async function submitReset() {
    setBusy(true); setErr(""); setMsg("");
    const { ok, error } = await requestPasswordReset(email.trim());
    setBusy(false);
    if (ok) setMsg("Check your email for a reset link.");
    else setErr(error || "Couldn't send the reset email.");
  }

  return (
    <main style={{ ...styles.section, maxWidth: 440 }}>
      <div style={styles.loginCard}>
        <p style={styles.kickerDark}>MEMBERS AREA</p>
        <h2 style={{ ...styles.h2, fontSize: 30 }}>
          {mode === "login" ? "Member Login" : "Reset Password"}
        </h2>
        <p style={{ opacity: 0.7, fontSize: 14, marginBottom: 24 }}>
          {mode === "login"
            ? "Sign in with the email address the club registered for you."
            : "Enter your email and we'll send you a reset link."}
        </p>

        <input
          style={{ ...styles.input, width: "100%", marginBottom: 12 }}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {mode === "login" && (
          <input
            style={{ ...styles.input, width: "100%", marginBottom: 16 }}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitLogin()}
          />
        )}

        {err && <p style={{ color: "#C0392B", fontSize: 14, margin: "0 0 12px" }}>{err}</p>}
        {msg && <div style={styles.flash}>{msg}</div>}

        <button
          style={{ ...styles.cta, width: "100%", opacity: busy ? 0.6 : 1, marginBottom: 12 }}
          onClick={mode === "login" ? submitLogin : submitReset}
          disabled={busy}
        >
          {busy ? "Working…" : mode === "login" ? "Log in" : "Send reset link"}
        </button>

        <button
          style={{ ...styles.linkBtn, padding: 4, fontSize: 14 }}
          onClick={() => { setMode(mode === "login" ? "forgot" : "login"); setErr(""); setMsg(""); }}
        >
          {mode === "login" ? "Forgot password?" : "← Back to login"}
        </button>
      </div>
    </main>
  );
}
