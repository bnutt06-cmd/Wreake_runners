"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { COLORS } from "@/lib/data";
import { styles } from "@/lib/styles";

export default function ProfileEditPage() {
  const router = useRouter();
  const { loggedIn, loading, profile, updateOwnProfile } = useStore();

  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [date_of_birth, setDob] = useState("");
  const [club_start_date, setClubStart] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState("");

  useEffect(() => {
    if (!loading && !loggedIn) router.replace("/login");
  }, [loading, loggedIn, router]);

  // Hydrate the form once the profile loads.
  useEffect(() => {
    if (!profile) return;
    setFirstName(profile.first_name || "");
    setLastName(profile.last_name || "");
    setGender(profile.gender || "");
    setDob(profile.date_of_birth || "");
    setClubStart(profile.club_start_date || "");
    setBio(profile.bio || "");
  }, [profile]);

  if (loading) return <p style={{ padding: 40 }}>Loading...</p>;
  if (!loggedIn) return null;

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setFlash("");
    const { ok, error } = await updateOwnProfile({
      first_name: first_name.trim() || null,
      last_name: last_name.trim() || null,
      gender: gender || null,
      date_of_birth: date_of_birth || null,
      club_start_date: club_start_date || null,
      bio: bio.trim() || null,
    });
    setSaving(false);
    if (ok) {
      setFlash("Profile saved.");
      setTimeout(() => setFlash(""), 3000);
    } else {
      setFlash("Error: " + (error || "could not save"));
    }
  }

  // For Standards to work the member needs both gender + DOB.
  const standardsReady = !!gender && !!date_of_birth;

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "40px 32px 64px" }}>
      <p style={styles.kickerDark}>YOUR PROFILE</p>
      <h2 style={styles.h2}>Profile details</h2>
      <p style={{ opacity: 0.7, marginTop: 8, marginBottom: 24 }}>
        Fill in your details so the Standards portal can match you to the right
        age category, and so your name appears properly on race rosters.
      </p>

      {!standardsReady ? (
        <div style={infoBoxStyle}>
          <strong>Heads up:</strong> Gender and date of birth are needed for the
          Standards portal to calculate your age category. The portal uses mock
          data until you fill these in.
        </div>
      ) : null}

      <form onSubmit={handleSave} style={formStyle}>
        <div style={twoColStyle}>
          <Field label="First name">
            <input
              style={inputStyle}
              value={first_name}
              onChange={(e) => setFirstName(e.target.value)}
              autoComplete="given-name"
            />
          </Field>
          <Field label="Last name">
            <input
              style={inputStyle}
              value={last_name}
              onChange={(e) => setLastName(e.target.value)}
              autoComplete="family-name"
            />
          </Field>
        </div>

        <div style={twoColStyle}>
          <Field label="Gender (for Standards age category)">
            <select
              style={inputStyle}
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Choose...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </Field>
          <Field label="Date of birth">
            <input
              type="date"
              style={inputStyle}
              value={date_of_birth}
              onChange={(e) => setDob(e.target.value)}
            />
          </Field>
        </div>

        <Field label="Club start date (when did you join Wreake Runners?)">
          <input
            type="date"
            style={inputStyle}
            value={club_start_date}
            onChange={(e) => setClubStart(e.target.value)}
          />
        </Field>

        <Field label="Bio (your favourite thing about running, for the members directory)">
          <textarea
            style={{ ...inputStyle, minHeight: 100, resize: "vertical" }}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="The cold-morning long run with hot coffee waiting at the end..."
            maxLength={500}
          />
          <p style={{ margin: "4px 0 0", fontSize: 11, opacity: 0.6, textAlign: "right" }}>
            {bio.length} / 500
          </p>
        </Field>

        <div style={{ marginTop: 16, padding: 12, background: COLORS.mist, borderRadius: 10, fontSize: 12, opacity: 0.75 }}>
          Profile photos are coming soon. For now, your initials appear next to
          your name across the site.
        </div>

        {flash ? (
          <div style={{ ...styles.flash, marginTop: 16 }}>{flash}</div>
        ) : null}

        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          <button type="submit" style={styles.cta} disabled={saving}>
            {saving ? "Saving..." : "Save profile"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            style={ghostStyle}
          >
            Back to dashboard
          </button>
        </div>
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

const ghostStyle = {
  background: "transparent",
  color: COLORS.ink,
  border: "1.5px solid " + COLORS.ink,
  padding: "10px 18px",
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 700,
  cursor: "pointer",
};

const formStyle = {
  display: "grid",
  gap: 16,
  background: "#fff",
  border: "1px solid " + COLORS.mist,
  borderRadius: 16,
  padding: 24,
};

const twoColStyle = {
  display: "grid",
  gap: 16,
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
};

const infoBoxStyle = {
  background: COLORS.mist,
  borderLeft: "4px solid " + COLORS.teal,
  padding: 14,
  borderRadius: 8,
  marginBottom: 20,
  fontSize: 13,
};
