"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";

export default function PublicPasswordResetPage() {
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    let mounted = true;
    let recoveryDetected = false;
    const callbackUrl = new URL(window.location.href);
    const hasRecoveryProof =
      callbackUrl.searchParams.has("code") ||
      (callbackUrl.searchParams.get("token_hash") !== null && callbackUrl.searchParams.get("type") === "recovery") ||
      callbackUrl.searchParams.get("type") === "recovery" ||
      callbackUrl.hash.includes("type=recovery");

    const finishValidation = () => {
      if (!mounted || recoveryDetected) return;
      recoveryDetected = true;
      setAuthorized(true);
      setChecking(false);
      setError("");
      // Remove one-time recovery credentials from the visible address.
      window.history.replaceState({}, document.title, window.location.pathname);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session && (event === "PASSWORD_RECOVERY" || hasRecoveryProof)) {
          finishValidation();
        }
      }
    );

    async function validateRecoveryLink() {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const tokenHash = url.searchParams.get("token_hash");
      const type = url.searchParams.get("type");

      try {
        // Newer Supabase email templates may send a token_hash instead of a PKCE code.
        if (tokenHash && type === "recovery") {
          const { error: otpError } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: "recovery",
          });
          if (otpError) throw otpError;
        } else if (code) {
          // The client may already have exchanged the PKCE code during initialization.
          // Check for that session first to avoid exchanging a one-time code twice.
          const { data: existing } = await supabase.auth.getSession();
          if (!existing.session) {
            const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
            if (exchangeError) throw exchangeError;
          }
        } else if (type !== "recovery" && !url.hash.includes("type=recovery")) {
          throw new Error("Abre esta página através do link de recuperação enviado para o teu e-mail.");
        }

        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!data.session) {
          throw new Error("Este link de recuperação é inválido ou expirou. Solicita um novo link.");
        }
        finishValidation();
      } catch (err) {
        if (!mounted || recoveryDetected) return;
        setError(err instanceof Error ? err.message : "Não foi possível validar o link. Solicita um novo link.");
        setChecking(false);
      }
    }

    const validationTimeout = window.setTimeout(() => {
      if (mounted && !recoveryDetected && checking) {
        setError("A validação demorou demasiado. Solicita um novo link de recuperação e abre-o novamente.");
        setChecking(false);
      }
    }, 15000);

    void validateRecoveryLink();

    return () => {
      mounted = false;
      window.clearTimeout(validationTimeout);
      subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("A nova palavra-passe deve ter pelo menos 8 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("As palavras-passe não coincidem.");
      return;
    }
    if (!authorized) {
      setError("O link de recuperação ainda não foi validado. Solicita um novo link.");
      return;
    }

    setBusy(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;

      await supabase.auth.signOut();
      setPassword("");
      setConfirmPassword("");
      setCompleted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível alterar a palavra-passe.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070b16] px-4 py-10 text-slate-100">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
      <section className="relative w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/90 p-7 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-9">
        <Link href="/shop" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 transition hover:text-cyan-200">
          <span aria-hidden="true">←</span> Marketplace Autopilot
        </Link>

        <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-cyan-300 to-indigo-400 text-lg font-black text-slate-950 shadow-lg shadow-cyan-500/10">
          AI
        </div>
        <p className="text-[11px] font-bold tracking-[0.24em] text-cyan-300">RECUPERAÇÃO SEGURA</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight">Nova palavra-passe</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          Valida o link enviado para o teu e-mail e define uma nova palavra-passe para a tua conta.
        </p>

        {checking && (
          <div className="mt-7 flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300" role="status">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-cyan-300/30 border-t-cyan-300" />
            A validar o link de recuperação...
          </div>
        )}

        {!checking && !authorized && !completed && (
          <div className="mt-7 rounded-xl border border-amber-400/20 bg-amber-400/10 p-4">
            <p className="text-sm leading-6 text-amber-100" role="alert">{error}</p>
            <Link href="/login" className="mt-4 inline-flex font-semibold text-cyan-300 underline underline-offset-4">
              Voltar e pedir outro link
            </Link>
          </div>
        )}

        {authorized && !completed && (
          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <label className="block text-sm font-medium text-slate-200">
              Nova palavra-passe
              <input
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Pelo menos 8 caracteres"
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/10"
              />
            </label>
            <label className="block text-sm font-medium text-slate-200">
              Confirmar nova palavra-passe
              <input
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Repete a nova palavra-passe"
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/10"
              />
            </label>
            {error && <p className="rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200" role="alert">{error}</p>}
            <button type="submit" disabled={busy} className="w-full rounded-xl bg-gradient-to-r from-cyan-300 to-indigo-300 px-4 py-3.5 font-bold text-slate-950 shadow-lg shadow-cyan-500/10 transition hover:brightness-105 disabled:cursor-wait disabled:opacity-60">
              {busy ? "A guardar..." : "Guardar nova palavra-passe"}
            </button>
          </form>
        )}

        {completed && (
          <div className="mt-7 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-5">
            <p className="text-sm leading-6 text-emerald-100" role="status">
              Palavra-passe alterada com sucesso. Agora podes iniciar sessão com a nova palavra-passe.
            </p>
            <Link href="/login" className="mt-5 block rounded-xl bg-cyan-300 px-4 py-3 text-center text-sm font-bold text-slate-950 transition hover:bg-cyan-200">
              Iniciar sessão
            </Link>
            <Link href="/shop" className="mt-4 block text-center text-sm font-semibold text-cyan-300 underline underline-offset-4">
              Voltar à loja pública
            </Link>
          </div>
        )}

        <p className="mt-8 border-t border-white/10 pt-5 text-xs leading-5 text-slate-500">
          A recuperação altera apenas a palavra-passe da conta validada. Não modifica permissões nem concede acesso administrativo.
        </p>
      </section>
    </main>
  );
}
