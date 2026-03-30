export async function signInWithGoogle(supabase) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?next=/`
    }
  });
}
export async function signOut(supabase) {
  return supabase.auth.signOut();
}
export function getCurrentSession(supabase) {
  return supabase.auth.getSession();
}
export function getCurrentUser(supabase) {
  return supabase.auth.getUser();
}
export function onAuthStateChange(supabase, callback) {
  return supabase.auth.onAuthStateChange(callback);
}
