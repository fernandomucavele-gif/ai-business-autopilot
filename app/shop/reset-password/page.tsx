"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function PublicPasswordResetPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    let mounted = true;

    const allowPasswordUpdate = () => {
      if (!mounted) return;
      setAuthorized(true);
      setChecking(false);
      setError("");
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" && session) {
        allowPasswordUpdate();
      }
    });

    async function verifyRecoveryLink() {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");

      // PKCE recovery links return a one-time code that must be exchanged
      // in the same browser where the recovery request was started.
      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (!mounted) return;
        if (exchangeError) {
          setError("Este link de recuperação é inválido ou expirou. Solicita um novo link.");
          setChecking(false);
          return;
        }
        allowPasswordUpdate();
        window.history.replaceState({}, document.title, url.pathname);
        return;
      }

      // Implicit-flow recovery links return the recovery type in the URL hash.
      if (url.hash.includes("type=recovery")) {
        const { data, error: sessionError } = await supabase.auth.getSession();
        if (!mounted) return;
        if (!sessionError && data.session) {
          allowPasswordUpdate();
        } else {
          setError("Não foi possível validar este link. Solicita um novo link de recuperação.");
          setChecking(false);
        }
        return;
      }

      if (!mounted) return;
      setError("Abre esta página através do link de recuperação enviado para o teu e-mail.");
      setChecking(false);
    }

    void verifyRecoveryLink();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (password.length < 6) {
      setError("A nova palavra-passe deve ter pelo menos 6 caracteres.");
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
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError(updateError.message);
      setBusy(false);
      return;
    }

    await supabase.auth.signOut();
    setPassword("");
    setConfirmPassword("");
    setCompleted(true);
    setMessage("Palavra-passe alterada com sucesso. Agora podes iniciar sessão com a nova palavra-passe.");
    setBusy(false);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto flex min-h-[80vh] w-full max-w-md items-center">
        <section className="w-full rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl sm:p-8">
          <Link href="/shop" className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 hover:text-cyan-200">
            <span aria-hidden="true">←</span> Marketplace Autopilot
          </Link>
          <div className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-cyan-400 font-black text-slate-950">AI</div>
          <p className="text-xs font-bold tracking-[0.2em] text-cyan-300">RECUPERAÇÃO SEGURA</p>
          <h1 className="mt-2 text-2xl font-extrabold">Criar nova palavra-passe</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">Esta página pertence à área pública do Marketplace. Não abre nem dá acesso ao painel do administrador.</p>

          {checking && <p className="mt-6 rounded-lg bg-slate-800 p-4 text-sm text-slate-300">A validar o link de recuperação...</p>}

          {!checking && !authorized && !completed && (
            <div className="mt-6 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm leading-6 text-amber-200">
              {error}
              <Link href="/login" className="mt-3 block font-semibold text-cyan-300 underline">Voltar e pedir outro link</Link>
            </div>
          )}

          {authorized && !completed && (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block text-sm font-medium text-slate-200">
                Nova palavra-passe
                <input
                  type="password"
                  autoComplete="new-password"
                  minLength={6}
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Mínimo de 6 caracteres"
                  className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-white outline-none focus:border-cyan-400"
                />
              </label>
              <label className="block text-sm font-medium text-slate-200">
                Confirmar nova palavra-passe
                <input
                  type="password"
                  autoComplete="new-password"
                  minLength={6}
                  required
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Repete a nova palavra-passe"
                  className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-white outline-none focus:border-cyan-400"
                />
              </label>
              {error && <p role="alert" className="rounded-lg bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
              <button type="submit" disabled={busy} className="w-full rounded-lg bg-cyan-400 px-4 py-3 font-bold text-slate-950 hover:bg-cyan-300 disabled:opacity-60">
                {busy ? "A guardar..." : "Guardar nova palavra-passe"}
              </button>
            </form>
          )}

          {completed && (
            <div className="mt-6 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
              <p role="status" className="text-sm leading-6 text-emerald-200">{message}</p>
              <Link href="/login" className="mt-4 block rounded-lg bg-cyan-400 px-4 py-3 text-center text-sm font-bold text-slate-950">Iniciar sessão</Link>
              <Link href="/shop" className="mt-3 block text-center text-sm font-semibold text-cyan-300 underline">Voltar à loja pública</Link>
            </div>
          )}

          <p className="mt-7 border-t border-slate-800 pt-5 text-xs leading-5 text-slate-500">A recuperação altera apenas a palavra-passe da conta autenticada pelo link. Não altera permissões nem concede acesso administrativo.</p>
        </section>
      </div>
    </main>
  );
}
