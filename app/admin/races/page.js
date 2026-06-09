"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { COLORS, fmtDate } from "@/lib/data";
import { styles } from "@/lib/styles";
import { parseGpx, fmtDistance, fmtElevation } from "@/lib/race/gpx";

const TYPES = [
  "LRRL League Race",
  "Cross-country League",
  "Club Series",
  "Social / parkrun",
  "Endurance / Team",
  "Other",
];

export default function AdminRacesPage() {
  return (
    <Suspense fallback={<p style={{ padding: 40 }}>Loading...</p>}>
      <AdminRacesInner />
    </Suspense>
  );
}

function AdminRacesInner() {
  const router = useRouter();
  const {
    loggedIn, loading, isAdmin,
    races, createRace, updateRace, deleteRace, uploadRaceGpx,
  } = useStore();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState("");

  useEffect(() => {
    if (!loading && (!loggedIn || !isAdmin)) {
      router.replace(loggedIn ? "/dashboard" : "/login");
    }
  }, [loading, loggedIn, isAdmin, router]);

  useEffect(() => {
    if (editId && !editing) {
      const target = races.find((r) => r.id === editId);
      if (target) setEditing({ ...target });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId]);

  if (loading) return <p style={{ padding: 40 }}>Loading...</p>;
  if (!loggedIn || !isAdmin) return null;

  function startNew() {
    setEditing({
      id: null,
      name: "",
      race_date: "",
      location: "",
      distance_text: "",
      type: TYPES[0],
      blurb: "",
      description: "",
      course_notes: "",
      external_signup_url: "",
      route: null,
      distance_m: null,
      elevation_gain_m: null,
      elevation_loss_m: null,
      start_lat: null,
      start_lon: null,
      gpx_storage_path: null,
      _isNew: true,
      _gpxFile: null,
    });
  }

  function startEdit(race) {
    setEditing({ ...race });
  }

  async function saveEditing() {
    if (!editing.name.trim() || !editing.race_date) {
      setFlash("Name and date are required.");
      return;
    }
    setSaving(true);
    setFlash("");

    let raceId = editing.id;
    let payload = { ...editing };

    if (editing._isNew) {
      const { ok, race, error } = await createRace(payload);
      if (!ok) { setFlash("Error: " + (error || "could not save")); setSaving(false); return; }
      raceId = race.id;
    } else {
      const { ok, error } = await updateRace(raceId, payload);
      if (!ok) { setFlash("Error: " + (error || "could not save")); setSaving(false); return; }
    }

    // If a new GPX file was attached, upload it and update the race row.
    if (editing._gpxFile) {
      const upload = await uploadRaceGpx(raceId, editing._gpxFile);
      if (upload.ok) {
        await updateRace(raceId, { gpx_storage_path: upload.storage_path });
      } else {
        setFlash("Race saved, but GPX upload failed: " + (upload.error || ""));
      }
    }

    setSaving(false);
    setEditing(null);
    setFlash("");
    router.replace("/admin/races");
  }

  async function handleDelete(race) {
    if (!confirm('Delete "' + race.name + '"? This removes the race and all its RSVPs.')) return;
    const { ok, error } = await deleteRace(race.id);
    if (!ok) setFlash("Error: " + (error || "could not delete"));
  }

  function cancelEditing() {
    setEditing(null);
    router.replace("/admin/races");
  }

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 32px 64px" }}>
      <div style={{ marginBottom: 8, fontSize: 13 }}>
        <Link href="/admin" style={{ color: COLORS.teal, fontWeight: 600 }}>
          Back to Admin
        </Link>
      </div>
      <p style={styles.kickerDark}>ADMIN - RACES</p>
      <h2 style={styles.h2}>Manage Races</h2>
      <p style={{ opacity: 0.7, marginTop: 8, marginBottom: 24, maxWidth: 720 }}>
        Create and edit race entries. Upload a GPX file to populate the route map,
        distance, and elevation automatically.
      </p>

      {flash ? (
        <div style={{ ...styles.flash, marginBottom: 16 }}>{flash}</div>
      ) : null}

      {!editing ? (
        <>
          <button onClick={startNew} style={{ ...styles.cta, marginBottom: 20 }}>
            + New race
          </button>

          {races.length === 0 ? (
            <div style={{ padding: 32, textAlign: "center", opacity: 0.7, background: "#fff", borderRadius: 14, border: "1px solid " + COLORS.mist }}>
              No races yet. Click + New race above to add the first.
            </div>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {races.map((r) => (
                <div
                  key={r.id}
                  style={{
                    background: "#fff",
                    border: "1px solid " + COLORS.mist,
                    borderRadius: 14,
                    padding: 16,
                    display: "flex",
                    gap: 16,
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 240 }}>
                    <strong style={{ fontSize: 16 }}>{r.name}</strong>
                    <p style={{ margin: "2px 0 0", fontSize: 13, opacity: 0.7 }}>
                      {fmtDate(r.race_date)} - {r.location || "no location set"}
                    </p>
                    <div style={{ display: "flex", gap: 10, marginTop: 6, fontSize: 12, flexWrap: "wrap" }}>
                      <Pill on={!!r.route} text="Route" />
                      <Pill on={!!r.description} text="Description" />
                      <Pill on={!!r.external_signup_url} text="Signup link" />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => startEdit(r)} style={ghostStyle}>Edit</button>
                    <button onClick={() => handleDelete(r)} style={dangerStyle}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : null}

      {editing ? (
        <RaceEditor
          race={editing}
          onChange={setEditing}
          onSave={saveEditing}
          onCancel={cancelEditing}
          saving={saving}
        />
      ) : null}
    </main>
  );
}

function RaceEditor({ race, onChange, onSave, onCancel, saving }) {
  const set = (k, v) => onChange({ ...race, [k]: v });

  return (
    <div style={{ background: "#fff", border: "1px solid " + COLORS.mist, borderRadius: 16, padding: 24 }}>
      <h3 style={{ margin: "0 0 16px", fontFamily: "'Fraunces', serif" }}>
        {race._isNew ? "New race" : "Editing: " + (race.name || "(unnamed)")}
      </h3>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 14 }}>
        <Field label="Race name">
          <input style={inputStyle} value={race.name || ""} onChange={(e) => set("name", e.target.value)} />
        </Field>
        <Field label="Date">
          <input type="date" style={inputStyle} value={race.race_date || ""} onChange={(e) => set("race_date", e.target.value)} />
        </Field>
        <Field label="Type">
          <select style={inputStyle} value={race.type || TYPES[0]} onChange={(e) => set("type", e.target.value)}>
            {TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Location">
          <input style={inputStyle} value={race.location || ""} onChange={(e) => set("location", e.target.value)} placeholder="e.g. Rotherby, Leicestershire" />
        </Field>
        <Field label="Stated distance">
          <input style={inputStyle} value={race.distance_text || ""} onChange={(e) => set("distance_text", e.target.value)} placeholder="e.g. 8 miles, 5k, half marathon" />
        </Field>
        <Field label="External signup URL">
          <input type="url" style={inputStyle} value={race.external_signup_url || ""} onChange={(e) => set("external_signup_url", e.target.value)} placeholder="https://..." />
        </Field>
      </div>

      <Field label="Short blurb (shown on the races list)">
        <input style={inputStyle} value={race.blurb || ""} onChange={(e) => set("blurb", e.target.value)} />
      </Field>

      <Field label="Full description" style={{ marginTop: 14 }}>
        <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} value={race.description || ""} onChange={(e) => set("description", e.target.value)} />
      </Field>

      <Field label="Course notes" style={{ marginTop: 14 }}>
        <textarea style={{ ...inputStyle, minHeight: 60, resize: "vertical" }} value={race.course_notes || ""} onChange={(e) => set("course_notes", e.target.value)} placeholder="Notable hills, footing, anything runners should know..." />
      </Field>

      <div style={{ marginTop: 20 }}>
        <GpxDropzone
          existing={race.route ? {
            distance_m: race.distance_m,
            elevation_gain_m: race.elevation_gain_m,
            elevation_loss_m: race.elevation_loss_m,
            point_count: race.route.length,
          } : null}
          onParsed={(parsed, file) => {
            onChange({
              ...race,
              route: parsed.points,
              distance_m: parsed.distance_m,
              elevation_gain_m: parsed.elevation_gain_m,
              elevation_loss_m: parsed.elevation_loss_m,
              start_lat: parsed.start.lat,
              start_lon: parsed.start.lon,
              _gpxFile: file,
            });
          }}
          onClear={() => {
            onChange({
              ...race,
              route: null,
              distance_m: null,
              elevation_gain_m: null,
              elevation_loss_m: null,
              start_lat: null,
              start_lon: null,
              gpx_storage_path: null,
              _gpxFile: null,
            });
          }}
        />
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
        <button style={styles.cta} onClick={onSave} disabled={saving}>
          {saving ? "Saving..." : "Save race"}
        </button>
        <button style={ghostStyle} onClick={onCancel} disabled={saving}>Cancel</button>
      </div>
    </div>
  );
}

function GpxDropzone({ existing, onParsed, onClear }) {
  const [drag, setDrag] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef(null);

  async function handleFile(file) {
    setErr("");
    if (!file) return;
    if (!/\.gpx$/i.test(file.name)) { setErr("That does not look like a .gpx file."); return; }
    if (file.size > 5 * 1024 * 1024) { setErr("File too large (5 MB max)."); return; }
    setBusy(true);
    try {
      const text = await file.text();
      const parsed = parseGpx(text);
      if (!parsed) { setErr("Could not read this GPX - no track points found."); return; }
      onParsed(parsed, file);
    } catch (e) {
      setErr("Could not read this file.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <label style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: 0.5, opacity: 0.7, marginBottom: 6 }}>
        ROUTE (GPX FILE)
      </label>

      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files?.[0]); }}
        onClick={() => inputRef.current?.click()}
        style={{
          border: "2px dashed " + (drag ? COLORS.teal : COLORS.mist),
          borderRadius: 12,
          padding: 24,
          textAlign: "center",
          background: drag ? COLORS.teal + "10" : "#fafafa",
          cursor: "pointer",
          transition: "all .15s",
        }}
      >
        {busy ? (
          <p style={{ margin: 0, opacity: 0.7 }}>Parsing...</p>
        ) : existing ? (
          <div>
            <p style={{ margin: "0 0 6px", fontWeight: 700, color: COLORS.teal }}>Route loaded</p>
            <p style={{ margin: 0, fontSize: 13, opacity: 0.8 }}>
              {fmtDistance(existing.distance_m)} - up {fmtElevation(existing.elevation_gain_m)} - down {fmtElevation(existing.elevation_loss_m)} - {existing.point_count} pts
            </p>
            <p style={{ margin: "8px 0 0", fontSize: 12, opacity: 0.6 }}>Drop a new file to replace</p>
          </div>
        ) : (
          <div>
            <p style={{ margin: "0 0 4px", fontWeight: 700 }}>Drop a GPX file here or click to browse</p>
            <p style={{ margin: 0, fontSize: 12, opacity: 0.65 }}>From Strava, Garmin Connect, plotaroute, etc. (5 MB max)</p>
          </div>
        )}
        <input ref={inputRef} type="file" accept=".gpx" onChange={(e) => handleFile(e.target.files?.[0])} style={{ display: "none" }} />
      </div>

      {existing ? (
        <button onClick={onClear} type="button" style={{ marginTop: 8, background: "transparent", border: "none", color: "#C0392B", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: 0 }}>
          Remove route
        </button>
      ) : null}

      {err ? <p style={{ color: "#C0392B", fontSize: 13, margin: "8px 0 0" }}>{err}</p> : null}
    </div>
  );
}

function Field({ label, children, style }) {
  return (
    <div style={style}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: 0.5, opacity: 0.7, marginBottom: 6 }}>
        {label.toUpperCase()}
      </label>
      {children}
    </div>
  );
}

function Pill({ on, text }) {
  return (
    <span style={{ padding: "3px 8px", borderRadius: 12, fontSize: 10, fontWeight: 700, background: on ? COLORS.green : COLORS.mist, color: on ? "#fff" : "#6b7280", whiteSpace: "nowrap" }}>
      {on ? "yes" : "no"} {text}
    </span>
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

const dangerStyle = {
  background: "transparent",
  color: "#C0392B",
  border: "1.5px solid #C0392B",
  padding: "10px 18px",
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 700,
  cursor: "pointer",
};
