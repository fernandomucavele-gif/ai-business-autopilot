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
    pathname === "/login/mfa" ||
    pathname === "/shop" ||
    pathname === "/shop/reset-password" ||
    pathname === "/shop/security";

  useEffect(() => {
    let mounted = true;

    // Recovery emails can occasionally return to Site URL instead of the
    // requested redirectTo. Detect Supabase's recovery marker before the
    // dashboard is rendered and preserve the callback URL for the reset page.
    const currentUrl = new URL(window.location.href);
    const isPasswordRecoveryCallback =
      currentUrl.searchParams.has("code") ||
      currentUrl.searchParams.get("type") === "recovery" ||
      currentUrl.hash.includes("type=recovery");

    if (isPasswordRecoveryCallback && pathname !== "/shop/reset-password") {
      const callbackUrl =
        "/shop/reset-password" + currentUrl.search + currentUrl.hash;
      router.replace(callbackUrl);
      return () => {
        mounted = false;
      };
    }

    const redirectForSession = async (hasSession: boolean) => {
      if (!mounted) return;

      // Accounts that enrolled a second factor must complete MFA before
      // entering any private application route.
      if (hasSession && !isPublicRoute) {
        const { data: assurance } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        const { data: factors } = await supabase.auth.mfa.listFactors();
        const hasVerifiedTotp = factors?.totp.some((factor) => factor.status === "verified") ?? false;
        if (hasVerifiedTotp && assurance?.currentLevel !== "aal2") {
          router.replace("/login/mfa");
          return;
        }
      }

      if (!mounted) return;
      setChecking(false);

      const loginMode = new URLSearchParams(window.location.search).get("mode");
      const isAuthStep =
        pathname === "/login" &&
        (loginMode === "recovery" || loginMode === "mfa");

      if (hasSession && pathname === "/login" && !isAuthStep) {
        router.replace("/shop");
      }

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
