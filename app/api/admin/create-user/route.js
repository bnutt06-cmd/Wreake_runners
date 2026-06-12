import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

// POST /api/admin/create-user
// Creates a new member account. Admin-only, server-side, using the service
// role key (which must NEVER be exposed to the browser).
export async function POST(request) {
  // 1) Verify the CALLER is a logged-in admin. We use the normal server
  //    client (cookie-based) to read who's making the request, then check
  //    their role in the profiles table. Without this check, anyone who
  //    found the endpoint could create accounts.
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const { data: callerProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (!callerProfile || callerProfile.role !== "Admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  // 2) Validate input.
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const email = (body.email || "").trim().toLowerCase();
  const password = body.password || "";
  const firstName = (body.first_name || "").trim();
  const lastName = (body.last_name || "").trim();
  const role = body.role || "Member";

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }
  if (!["Member", "Content Admin", "Admin"].includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  // 3) Create the user with the service-role admin client. The service key is
  //    a server-only env var. email_confirm: true means the account is active
  //    immediately (no confirmation email needed) since the admin is creating
  //    it deliberately. The first_name/last_name go into user metadata, which
  //    the existing DB trigger uses to auto-create the matching profile row.
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    return NextResponse.json(
      { error: "Server is not configured for user creation (missing service key)" },
      { status: 500 }
    );
  }
  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    serviceKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { first_name: firstName, last_name: lastName },
  });

  if (createErr) {
    // Common case: email already registered.
    return NextResponse.json({ error: createErr.message }, { status: 400 });
  }

  // 4) If a non-default role was chosen, set it on the freshly-created profile.
  //    (The trigger creates the profile with the default 'Member' role.)
  if (role !== "Member" && created?.user?.id) {
    const { error: roleErr } = await admin
      .from("profiles")
      .update({ role })
      .eq("id", created.user.id);
    if (roleErr) {
      // User was created but role update failed — report it so the admin knows.
      return NextResponse.json({
        ok: true,
        warning: "User created, but setting the role failed: " + roleErr.message,
        user_id: created.user.id,
      });
    }
  }

  return NextResponse.json({ ok: true, user_id: created?.user?.id });
}
