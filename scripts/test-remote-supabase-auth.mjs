import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";

const url = process.env.REMOTE_SUPABASE_URL;
const publishableKey = process.env.REMOTE_SUPABASE_PUBLISHABLE_KEY;
const serviceRoleKey = process.env.REMOTE_SUPABASE_SERVICE_ROLE_KEY;

if (!url || !publishableKey || !serviceRoleKey) {
  throw new Error("Missing remote test Supabase environment variables.");
}
if (!url.includes("sgfshctthntmfolnsmbw.supabase.co")) {
  throw new Error("Refusing to run: URL is not the isolated ai-business-autopilot-test project.");
}

const admin = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const suffix = randomUUID();
const users = [
  { email: `autopilot-remote-a-${suffix}@example.test`, password: `Remote-A-${randomUUID()}!`, label: "account-a" },
  { email: `autopilot-remote-b-${suffix}@example.test`, password: `Remote-B-${randomUUID()}!`, label: "account-b" },
];
const created = [];
const clients = [];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

try {
  for (const entry of users) {
    const { data, error } = await admin.auth.admin.createUser({
      email: entry.email,
      password: entry.password,
      email_confirm: true,
      app_metadata: { role: "admin" },
    });
    if (error) throw error;
    created.push(data.user.id);
    entry.id = data.user.id;
  }

  for (const entry of users) {
    const client = createClient(url, publishableKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data, error } = await client.auth.signInWithPassword({
      email: entry.email,
      password: entry.password,
    });
    if (error) throw error;
    assert(data.user?.id === entry.id, `Login failed for ${entry.label}`);
    clients.push(client);
  }

  for (let i = 0; i < users.length; i++) {
    const { data: userData, error: userError } = await clients[i].auth.getUser();
    if (userError || userData.user?.id !== users[i].id) {
      throw userError ?? new Error(`Session mismatch for ${users[i].label}`);
    }
    const { error } = await clients[i].from("autopilot_state").upsert({
      user_id: users[i].id,
      state_key: "remote-auth-test",
      state_value: { marker: users[i].label, simulationMode: true, testOnly: true },
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id,state_key" });
    if (error) throw error;
  }

  for (let i = 0; i < users.length; i++) {
    const { data, error } = await clients[i]
      .from("autopilot_state")
      .select("user_id,state_value")
      .eq("user_id", users[i].id)
      .eq("state_key", "remote-auth-test")
      .maybeSingle();
    if (error) throw error;
    assert(data?.user_id === users[i].id, `Persistence failed for ${users[i].label}`);
    assert(data?.state_value?.marker === users[i].label, `Wrong data returned to ${users[i].label}`);

    const otherUser = users[1 - i];
    const { data: otherData, error: otherError } = await clients[i]
      .from("autopilot_state")
      .select("user_id")
      .eq("user_id", otherUser.id)
      .eq("state_key", "remote-auth-test");
    if (otherError) throw otherError;
    assert((otherData ?? []).length === 0, `Cross-account data leak into ${users[i].label}`);
  }

  const { error: signOutError } = await clients[0].auth.signOut();
  if (signOutError) throw signOutError;
  const { data: signedOut, error: sessionError } = await clients[0].auth.getSession();
  assert(!sessionError && signedOut.session === null, "Logout did not clear the remote test session.");

  const { error: reloginError } = await clients[0].auth.signInWithPassword({
    email: users[0].email,
    password: users[0].password,
  });
  if (reloginError) throw reloginError;
  const { data: persistedAgain, error: persistedError } = await clients[0]
    .from("autopilot_state")
    .select("state_value")
    .eq("user_id", users[0].id)
    .eq("state_key", "remote-auth-test")
    .maybeSingle();
  if (persistedError) throw persistedError;
  assert(persistedAgain?.state_value?.marker === "account-a", "Data did not persist after logout/login.");

  process.stdout.write("PASS: isolated remote test project — two logins, sessions, logout/relogin, persistence and RLS account isolation.\n");
} finally {
  for (const client of clients) {
    await client.auth.signOut().catch(() => {});
  }
  for (const id of created) {
    await admin.auth.admin.deleteUser(id).catch(() => {});
  }
}
