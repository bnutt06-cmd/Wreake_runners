"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { createClient } from "./supabase/client";
import { ROLES } from "./data";

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [supabase] = useState(() => createClient());

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [news, setNews] = useState([]);
  const [signups, setSignups] = useState({});
  // Phase B: real-data tables
  const [races, setRaces] = useState([]);
  const [raceRegs, setRaceRegs] = useState([]); // [{race_id, profile_id, profile: {first_name, last_name, ...}}]
  const [standardsLookup, setStandardsLookup] = useState([]);
  const [myStandardsLogs, setMyStandardsLogs] = useState([]);
  const [clubEvents, setClubEvents] = useState([]);
  const [pinnedPost, setPinnedPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const loggedIn = !!user;
  const role = profile?.role || ROLES.MEMBER;
  const isAdmin = role === ROLES.ADMIN;
  const isContentAdmin = role === ROLES.CONTENT_ADMIN;
  const canCreateNews = isAdmin || isContentAdmin;

  // ---- LOADERS ----
  const loadProfile = useCallback(async (uid) => {
    if (!uid) { setProfile(null); return null; }
    const { data } = await supabase.from("profiles").select("*").eq("id", uid).single();
    setProfile(data || null);
    return data;
  }, [supabase]);

  const loadNews = useCallback(async (canSeeAll) => {
    let q = supabase.from("news_stories").select("*").order("created_at", { ascending: false });
    if (!canSeeAll) q = q.eq("status", "published");
    const { data } = await q;
    setNews(data || []);
  }, [supabase]);

  const loadSignups = useCallback(async () => {
    const { data } = await supabase.from("signups").select("race_id, runner_name");
    const grouped = {};
    (data || []).forEach((s) => {
      grouped[s.race_id] = grouped[s.race_id] || [];
      grouped[s.race_id].push(s.runner_name);
    });
    setSignups(grouped);
  }, [supabase]);

  const loadRaces = useCallback(async () => {
    const { data } = await supabase
      .from("races")
      .select("*")
      .order("race_date", { ascending: true });
    setRaces(data || []);
  }, [supabase]);

  const loadRaceRegs = useCallback(async () => {
    const { data } = await supabase
      .from("race_registrations")
      .select("race_id, profile_id, profiles(first_name, last_name)");
    setRaceRegs(data || []);
  }, [supabase]);

  const loadStandardsLookup = useCallback(async () => {
    const { data } = await supabase
      .from("standards_lookup")
      .select("category, distance, tier, target_time_seconds");
    setStandardsLookup(data || []);
  }, [supabase]);

  const loadMyStandardsLogs = useCallback(async (uid) => {
    if (!uid) { setMyStandardsLogs([]); return; }
    const { data } = await supabase
      .from("member_standards_log")
      .select("*")
      .eq("profile_id", uid)
      .order("race_date", { ascending: false });
    setMyStandardsLogs(data || []);
  }, [supabase]);

  const loadClubEvents = useCallback(async () => {
    const { data } = await supabase
      .from("club_events")
      .select("*")
      .order("event_timestamp", { ascending: true });
    setClubEvents(data || []);
  }, [supabase]);

  const loadPinnedPost = useCallback(async () => {
    const { data } = await supabase
      .from("pinned_posts")
      .select("*, author:profiles(first_name, last_name)")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    setPinnedPost(data || null);
  }, [supabase]);

  // ---- ON MOUNT ----
  useEffect(() => {
    let active = true;
    (async () => {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!active) return;
      setUser(u);
      const prof = await loadProfile(u?.id);
      const canSeeAll = prof?.role === ROLES.ADMIN || prof?.role === ROLES.CONTENT_ADMIN;
      await Promise.all([
        loadNews(canSeeAll),
        loadSignups(),
        loadRaces(),
        loadRaceRegs(),
        loadStandardsLookup(),
        loadMyStandardsLogs(u?.id),
        loadClubEvents(),
        loadPinnedPost(),
      ]);
      setLoading(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_e, session) => {
      const u = session?.user || null;
      setUser(u);
      const prof = await loadProfile(u?.id);
      const canSeeAll = prof?.role === ROLES.ADMIN || prof?.role === ROLES.CONTENT_ADMIN;
      await Promise.all([
        loadNews(canSeeAll),
        loadMyStandardsLogs(u?.id),
      ]);
    });

    return () => { active = false; sub.subscription.unsubscribe(); };
  }, [supabase, loadProfile, loadNews, loadSignups, loadRaces, loadRaceRegs, loadStandardsLookup, loadMyStandardsLogs, loadClubEvents, loadPinnedPost]);

  // ---- AUTH ----
  async function login(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { ok: !error, error: error?.message };
  }

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setMyStandardsLogs([]);
    await loadNews(false);
  }

  async function requestPasswordReset(email) {
    const redirectTo = window.location.origin + "/reset-password";
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    return { ok: !error, error: error?.message };
  }

  async function updatePassword(newPassword) {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    return { ok: !error, error: error?.message };
  }

  async function updateOwnProfile(fields) {
    if (!user) return { ok: false };
    const allowed = [
      "first_name", "last_name",
      "gender", "date_of_birth",
      "club_start_date", "bio",
      "avatar_url",
    ];
    const payload = { updated_at: new Date().toISOString() };
    for (const k of allowed) {
      if (k in fields) payload[k] = fields[k];
    }
    const { error } = await supabase
      .from("profiles")
      .update(payload)
      .eq("id", user.id);
    if (!error) await loadProfile(user.id);
    return { ok: !error, error: error?.message };
  }

  // ---- NEWS ----
  async function createStory({ title, body, image_url }) {
    if (!user || !canCreateNews) return { ok: false };
    const status = isAdmin ? "published" : "pending";
    const { error } = await supabase.from("news_stories").insert({
      title, body, image_url: image_url || null,
      author_id: user.id, status,
    });
    if (!error) {
      const canSeeAll = isAdmin || isContentAdmin;
      await loadNews(canSeeAll);
    }
    return { ok: !error, error: error?.message, status };
  }

  async function approveStory(id) {
    if (!isAdmin) return { ok: false };
    const { error } = await supabase.from("news_stories").update({ status: "published" }).eq("id", id);
    if (!error) await loadNews(true);
    return { ok: !error };
  }

  async function deleteStory(id) {
    if (!isAdmin) return { ok: false };
    const { error } = await supabase.from("news_stories").delete().eq("id", id);
    if (!error) await loadNews(true);
    return { ok: !error };
  }

  // ---- ADMIN ----
  async function listAllProfiles() {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("first_name", { ascending: true });
    return { data: data || [], error: error?.message };
  }

  async function changeUserRole(userId, newRole) {
    if (!isAdmin) return { ok: false };
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq("id", userId);
    return { ok: !error, error: error?.message };
  }

  async function removeProfile(userId) {
    if (!isAdmin) return { ok: false };
    const { error } = await supabase.from("profiles").delete().eq("id", userId);
    return { ok: !error, error: error?.message };
  }

  // ---- LEGACY (v2) SIGNUPS ----
  // Kept for backward compatibility; new RSVPs use race_registrations.
  async function addSignup(raceId, name) {
    const { error } = await supabase.from("signups").insert({
      race_id: raceId, runner_name: name, user_id: user?.id || null,
    });
    if (!error) await loadSignups();
    return { ok: !error };
  }

  // ---- RACES (Phase B) ----
  async function createRace(payload) {
    if (!isAdmin) return { ok: false, error: "admin only" };
    const insert = sanitiseRace(payload);
    const { data, error } = await supabase.from("races").insert(insert).select().single();
    if (!error) await loadRaces();
    return { ok: !error, error: error?.message, race: data };
  }

  async function updateRace(id, payload) {
    if (!isAdmin) return { ok: false, error: "admin only" };
    const update = { ...sanitiseRace(payload), updated_at: new Date().toISOString() };
    const { error } = await supabase.from("races").update(update).eq("id", id);
    if (!error) await loadRaces();
    return { ok: !error, error: error?.message };
  }

  async function deleteRace(id) {
    if (!isAdmin) return { ok: false, error: "admin only" };
    const { error } = await supabase.from("races").delete().eq("id", id);
    if (!error) await Promise.all([loadRaces(), loadRaceRegs()]);
    return { ok: !error, error: error?.message };
  }

  // Upload a GPX file to Supabase Storage and return its public URL + path.
  // The file content is also parsed client-side and saved as derived columns
  // on the race row, so the modal can render without re-fetching the GPX.
  async function uploadRaceGpx(raceId, file) {
    if (!isAdmin) return { ok: false, error: "admin only" };
    if (!file) return { ok: false, error: "no file" };
    const path = raceId + "-" + Date.now() + ".gpx";
    const { error: upErr } = await supabase.storage
      .from("race-gpx")
      .upload(path, file, { upsert: true, contentType: "application/gpx+xml" });
    if (upErr) return { ok: false, error: upErr.message };
    return { ok: true, storage_path: path };
  }

  // Toggle "I'm Running" for the current user on a race.
  async function toggleRaceRegistration(raceId) {
    if (!user) return { ok: false, error: "not logged in" };
    const existing = raceRegs.find(
      (r) => r.race_id === raceId && r.profile_id === user.id
    );
    if (existing) {
      const { error } = await supabase
        .from("race_registrations")
        .delete()
        .eq("race_id", raceId)
        .eq("profile_id", user.id);
      if (!error) await loadRaceRegs();
      return { ok: !error, removed: true };
    } else {
      const { error } = await supabase
        .from("race_registrations")
        .insert({ race_id: raceId, profile_id: user.id });
      if (!error) await loadRaceRegs();
      return { ok: !error, added: true };
    }
  }

  // ---- STANDARDS (Phase B) ----
  async function submitStandard(payload) {
    if (!user) return { ok: false, error: "not logged in" };
    const insert = {
      profile_id: user.id,
      distance: payload.distance,
      achieved_time_seconds: payload.achieved_time_seconds,
      formatted_time: payload.formatted_time,
      race_name: payload.race_name,
      race_date: payload.race_date,
      is_virtual: !!payload.is_virtual,
      is_leicestershire_region: !!payload.is_leicestershire_region,
      is_valid_lrrl_5k: payload.is_valid_lrrl_5k !== false,
      proof_url: payload.proof_url || null,
    };
    const { error } = await supabase.from("member_standards_log").insert(insert);
    if (!error) await loadMyStandardsLogs(user.id);
    return { ok: !error, error: error?.message };
  }

  async function deleteStandardLog(id) {
    if (!user) return { ok: false };
    const { error } = await supabase
      .from("member_standards_log")
      .delete()
      .eq("id", id);
    if (!error) await loadMyStandardsLogs(user.id);
    return { ok: !error, error: error?.message };
  }

  // Admin-only: list everyone's logs for the claims panel.
  async function listAllStandardsLogs() {
    if (!isAdmin) return { data: [], error: "admin only" };
    const { data, error } = await supabase
      .from("member_standards_log")
      .select("*, profiles(first_name, last_name, gender, date_of_birth)")
      .order("race_date", { ascending: false });
    return { data: data || [], error: error?.message };
  }

  async function verifyStandardLog(id, verified) {
    if (!isAdmin) return { ok: false };
    const { error } = await supabase
      .from("member_standards_log")
      .update({ is_verified_by_admin: verified })
      .eq("id", id);
    return { ok: !error, error: error?.message };
  }

  // ---- CLUB EVENTS (Phase C) ----
  async function createEvent(payload) {
    if (!isAdmin) return { ok: false, error: "admin only" };
    const insert = sanitiseEvent(payload);
    const { error } = await supabase.from("club_events").insert(insert);
    if (!error) await loadClubEvents();
    return { ok: !error, error: error?.message };
  }

  async function updateEvent(id, payload) {
    if (!isAdmin) return { ok: false, error: "admin only" };
    const update = { ...sanitiseEvent(payload), updated_at: new Date().toISOString() };
    const { error } = await supabase.from("club_events").update(update).eq("id", id);
    if (!error) await loadClubEvents();
    return { ok: !error, error: error?.message };
  }

  async function deleteEvent(id) {
    if (!isAdmin) return { ok: false, error: "admin only" };
    const { error } = await supabase.from("club_events").delete().eq("id", id);
    if (!error) await loadClubEvents();
    return { ok: !error, error: error?.message };
  }

  // ---- PINNED POST (Phase C) ----
  async function setPinnedPostAction(payload) {
    if (!isAdmin) return { ok: false, error: "admin only" };
    // Deactivate the current active pin, then insert the new one.
    // Two-step so the history is preserved (you can see past pins).
    await supabase.from("pinned_posts").update({ is_active: false }).eq("is_active", true);
    const { error } = await supabase.from("pinned_posts").insert({
      title: payload.title,
      body: payload.body,
      author_id: user?.id || null,
      is_active: true,
    });
    if (!error) await loadPinnedPost();
    return { ok: !error, error: error?.message };
  }

  async function clearPinnedPost() {
    if (!isAdmin) return { ok: false };
    const { error } = await supabase
      .from("pinned_posts")
      .update({ is_active: false })
      .eq("is_active", true);
    if (!error) await loadPinnedPost();
    return { ok: !error, error: error?.message };
  }

  return (
    <StoreContext.Provider
      value={{
        // identity
        user, profile, role, loggedIn, isAdmin, isContentAdmin, canCreateNews, loading,
        // data
        news, signups, races, raceRegs, standardsLookup, myStandardsLogs,
        clubEvents, pinnedPost,
        // refreshers
        loadRaces, loadRaceRegs, loadStandardsLookup, loadMyStandardsLogs,
        loadClubEvents, loadPinnedPost,
        // auth + profile
        login, logout, requestPasswordReset, updatePassword, updateOwnProfile,
        // news
        createStory, approveStory, deleteStory,
        // admin
        listAllProfiles, changeUserRole, removeProfile,
        // legacy signups
        addSignup,
        // races (phase B)
        createRace, updateRace, deleteRace, uploadRaceGpx, toggleRaceRegistration,
        // standards (phase B)
        submitStandard, deleteStandardLog, listAllStandardsLogs, verifyStandardLog,
        // events + pinned post (phase C)
        createEvent, updateEvent, deleteEvent,
        setPinnedPost: setPinnedPostAction, clearPinnedPost,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

// Strip client-only fields before insert/update.
function sanitiseEvent(payload) {
  const allowed = ["title", "description", "event_timestamp", "end_timestamp", "event_type", "location"];
  const out = {};
  for (const k of allowed) {
    if (k in payload) out[k] = payload[k] ?? null;
  }
  return out;
}

// Strip client-only fields (_isNew, etc.) before insert/update.
function sanitiseRace(payload) {
  const allowed = [
    "name", "race_date", "type", "location", "distance_text",
    "blurb", "description", "course_notes", "external_signup_url",
    "route", "distance_m", "elevation_gain_m", "elevation_loss_m",
    "start_lat", "start_lon", "gpx_storage_path",
  ];
  const out = {};
  for (const k of allowed) {
    if (k in payload) out[k] = payload[k] ?? null;
  }
  return out;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
