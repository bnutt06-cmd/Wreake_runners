"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { createClient } from "./supabase/client";
import { ROLES } from "./data";

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [supabase] = useState(() => createClient());

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null); // { id, first_name, last_name, role }
  const [news, setNews] = useState([]);
  const [signups, setSignups] = useState({});
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

  // ---- ON MOUNT ----
  useEffect(() => {
    let active = true;
    (async () => {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!active) return;
      setUser(u);
      const prof = await loadProfile(u?.id);
      const canSeeAll = prof?.role === ROLES.ADMIN || prof?.role === ROLES.CONTENT_ADMIN;
      await Promise.all([loadNews(canSeeAll), loadSignups()]);
      setLoading(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_e, session) => {
      const u = session?.user || null;
      setUser(u);
      const prof = await loadProfile(u?.id);
      const canSeeAll = prof?.role === ROLES.ADMIN || prof?.role === ROLES.CONTENT_ADMIN;
      await loadNews(canSeeAll);
    });

    return () => { active = false; sub.subscription.unsubscribe(); };
  }, [supabase, loadProfile, loadNews, loadSignups]);

  // ---- AUTH ACTIONS ----
  async function login(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { ok: !error, error: error?.message };
  }

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    await loadNews(false);
  }

  async function requestPasswordReset(email) {
    const redirectTo = `${window.location.origin}/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    return { ok: !error, error: error?.message };
  }

  async function updatePassword(newPassword) {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    return { ok: !error, error: error?.message };
  }

  async function updateOwnProfile({ first_name, last_name }) {
    if (!user) return { ok: false };
    const { error } = await supabase
      .from("profiles")
      .update({ first_name, last_name, updated_at: new Date().toISOString() })
      .eq("id", user.id);
    if (!error) await loadProfile(user.id);
    return { ok: !error, error: error?.message };
  }

  // ---- NEWS ACTIONS ----
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

  // ---- ADMIN ACTIONS ----
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

  // Note: deleting the auth user itself requires the service_role key, which
  // we don't expose to the browser. The admin dashboard removes the profile
  // row here; the auth.users row should be removed in Supabase dashboard
  // (Authentication → Users) for full offboarding.
  async function removeProfile(userId) {
    if (!isAdmin) return { ok: false };
    const { error } = await supabase.from("profiles").delete().eq("id", userId);
    return { ok: !error, error: error?.message };
  }

  // ---- RACES ----
  async function addSignup(raceId, name) {
    const { error } = await supabase.from("signups").insert({
      race_id: raceId, runner_name: name, user_id: user?.id || null,
    });
    if (!error) await loadSignups();
    return { ok: !error };
  }

  return (
    <StoreContext.Provider
      value={{
        user, profile, role, loggedIn, isAdmin, isContentAdmin, canCreateNews, loading,
        news, signups,
        login, logout, requestPasswordReset, updatePassword, updateOwnProfile,
        createStory, approveStory, deleteStory,
        listAllProfiles, changeUserRole, removeProfile,
        addSignup,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
