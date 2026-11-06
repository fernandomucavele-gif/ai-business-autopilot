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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      if (session) {
        setChecking(false);
        if (pathname === "/login" && (event === "SIGNED_IN" || event === "INITIAL_SESSION")) {
          router.replace("/");
        }
        return;
      }

      if (event === "INITIAL_SESSION" || event === "SIGNED_OUT") {
        setChecking(false);
        if (pathname !== "/login") router.replace("/login");
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [pathname, router]);

  if (checking) {
    return (
      <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#080d19", color: "#e2e8f0", fontFamily: "Arial, sans-serif" }}>
        A verificar a sessão segura...
      </main>
    );
  }

  if (!isLoginPage && checking) return null;
  return <>{children}</>;
}
