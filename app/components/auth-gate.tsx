"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export function AuthGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const isLoginPage = pathname === "/login";

  useEffect(() => {
    let mounted = true;
    const redirectForSession = (hasSession: boolean) => {
      if (!mounted) return;
      setChecking(false);
      if (hasSession && pathname === "/login") router.replace("/");
      if (!hasSession && pathname !== "/login") router.replace("/login");
    };

    // Confirm the persisted session on initial load; the auth event remains
    // subscribed for sign-in, sign-out and token refresh changes.
    void supabase.auth.getSession().then(({ data, error }) => {
      if (error) console.error("Falha ao verificar a sessão:", error);
      redirectForSession(Boolean(data.session));
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "SIGNED_OUT" || event === "INITIAL_SESSION") {
        redirectForSession(Boolean(session));
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [pathname, router]);

  if (checking) {
    return <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#080d19", color: "#e2e8f0", fontFamily: "Arial, sans-serif" }}>A verificar a sessão segura...</main>;
  }
  if (!isLoginPage && checking) return null;
  return <>{children}</>;
}
