"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function CustomerMfaChallengePage() {
  const router = useRouter();
  const [factorId, setFactorId] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function prepare() {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        router.replace("/login");
        return;
      }
      const { data: factors, error: factorError } = await supabase.auth.mfa.listFactors();
      if (factorError) throw factorError;
      const factor = factors.totp.find((item) => item.status === "verified");
      if (!factor) {
        router.replace("/shop");
        return;
      }
      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId: factor.id });
      if (challengeError) throw challengeError;
      if (active) {
        setFactorId(factor.id);
        setChallengeId(challenge.id);
      }
    }
    void prepare().catch((err) => { if (active) setError(err instanceof Error ? err.message : "Não foi possível preparar a verificação."); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [router]);

  async function verify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const { error: verifyError } = await supabase.auth.mfa.verify({ factorId, challengeId, code: code.trim() });
    if (verifyError) {
      setError("Código incorreto ou expirado. Confirma o código atual na tua aplicação autenticadora e tenta novamente.");
      setBusy(false);
      return;
    }
    router.replace("/shop");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <section className="mx-auto mt-16 w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-7 shadow-2xl">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-cyan-400 text-xl font-black text-slate-950">2FA</div>
        <p className="mt-6 text-xs font-bold tracking-[0.2em] text-cyan-300">VERIFICAÇÃO ADICIONAL</p>
        <h1 className="mt-2 text-2xl font-extrabold">Confirma que és tu</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">Abre a tua aplicação autenticadora e introduz o código temporário de 6 dígitos para continuar.</p>
        {loading && <p className="mt-6 text-sm text-slate-300">A preparar verificação segura...</p>}
        {!loading && factorId && <form onSubmit={verify} className="mt-6">
          <label htmlFor="mfa-code" className="block text-sm font-semibold">Código de segurança</label>
          <input id="mfa-code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="000000" className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-center text-xl tracking-[0.4em] text-white outline-none focus:border-cyan-400"/>
          <button type="submit" disabled={busy || code.length !== 6} className="mt-5 w-full rounded-lg bg-cyan-400 px-4 py-3 text-sm font-extrabold text-slate-950 disabled:opacity-50">{busy ? "A confirmar..." : "Verificar e entrar"}</button>
        </form>}
        {error && <p role="alert" className="mt-5 rounded-lg bg-red-500/10 p-3 text-sm leading-6 text-red-300">{error}</p>}
        <button type="button" onClick={async () => { await supabase.auth.signOut(); router.replace("/login"); }} className="mt-5 w-full text-sm text-slate-400 underline">Terminar sessão e voltar</button>
      </section>
    </main>
  );
}
