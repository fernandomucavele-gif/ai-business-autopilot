"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export function AuthGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  const isPublicRoute =
    pathname === "/login" ||
    pathname === "/shop" ||
    pathname === "/shop/reset-password";

  useEffect(() => {
    let mounted = true;

    const redirectForSession = (hasSession: boolean) => {
      if (!mounted) return;
      setChecking(false);

      // Read the query string in the browser without useSearchParams,
      // so static pages such as /404 do not require a Suspense boundary.
      const isRecoveryLogin =
        pathname === "/login" &&
        new URLSearchParams(window.location.search).get("mode") === "recovery";

      // Keep password recovery on its own form, never the admin dashboard.
      if (hasSession && pathname === "/login" && !isRecoveryLogin) {
        router.replace("/");
      }

      // Public marketplace and password reset routes are available
      // without an authenticated session.
      if (!hasSession && !isPublicRoute) {
        router.replace("/login");
      }
    };

    void supabase.auth.getSession().then(({ data, error }) => {
      if (error) console.error("Falha ao verificar a sessão:", error);
      redirectForSession(Boolean(data.session));
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (
        event === "SIGNED_IN" ||
        event === "TOKEN_REFRESHED" ||
        event === "SIGNED_OUT" ||
        event === "INITIAL_SESSION" ||
        event === "PASSWORD_RECOVERY"
      ) {
        redirectForSession(Boolean(session));
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [pathname, router, isPublicRoute]);

  if (checking) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#080d19",
          color: "#e2e8f0",
          fontFamily: "Arial, sans-serif",
        }}
      >
        A verificar a sessão segura...
      </main>
    );
  }

  return <>{children}</>;
}
