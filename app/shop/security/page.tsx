"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

type Factor = { id: string; friendly_name?: string; status: string };

export default function CustomerSecurityPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [factor, setFactor] = useState<Factor | null>(null);
  const [factorId, setFactorId] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadFactors() {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      router.replace("/login");
      return;
    }
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!userData.user?.email_confirmed_at) {
      const pendingEmail = userData.user?.email ?? "";
      await supabase.auth.signOut();
      router.replace("/login?mode=verify&email=" + encodeURIComponent(pendingEmail));
      return;
    }
    const { data, error: listError } = await supabase.auth.mfa.listFactors();
    if (listError) throw listError;
    const verified = data.totp.find((item) => item.status === "verified");
    if (verified) {
      const { data: assurance } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (assurance?.currentLevel !== "aal2") {
        router.replace("/login/mfa");
        return;
      }
    }
    setFactor(verified ? { id: verified.id, friendly_name: verified.friendly_name, status: verified.status } : null);
  }

  useEffect(() => {
    let active = true;
    void loadFactors().catch((err) => { if (active) setError(err instanceof Error ? err.message : "Não foi possível carregar a segurança."); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function startEnrollment() {
    setBusy(true); setError(""); setMessage("");
    try {
      const { data, error: enrollError } = await supabase.auth.mfa.enroll({ factorType: "totp", friendlyName: "Autopilot Authenticator" });
      if (enrollError) throw enrollError;
      setFactorId(data.id);
      setQrCode(data.totp.qr_code);
      setSecret(data.totp.secret);
      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId: data.id });
      if (challengeError) throw challengeError;
      setChallengeId(challenge.id);
      setMessage("Lê o QR code com Google Authenticator, Microsoft Authenticator ou outra aplicação TOTP e introduz o código gerado.");
    } catch (err) { setError(err instanceof Error ? err.message : "Não foi possível iniciar a configuração."); }
    finally { setBusy(false); }
  }

  async function verifyEnrollment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setMessage("");
    try {
      const { error: verifyError } = await supabase.auth.mfa.verify({ factorId, challengeId, code: code.trim() });
      if (verifyError) throw verifyError;
      setQrCode(""); setSecret(""); setCode(""); setFactorId(""); setChallengeId("");
      await loadFactors();
      setMessage("Autenticação em dois passos ativada. No próximo início de sessão será pedido um código da aplicação autenticadora.");
    } catch (err) { setError(err instanceof Error ? err.message : "Código inválido. Tenta novamente."); }
    finally { setBusy(false); }
  }

  async function disableMfa() {
    if (!factor) return;
    setBusy(true); setError(""); setMessage("");
    try {
      const { error: removeError } = await supabase.auth.mfa.unenroll({ factorId: factor.id });
      if (removeError) throw removeError;
      setFactor(null);
      setMessage("A autenticação em dois passos foi desativada.");
    } catch (err) { setError(err instanceof Error ? err.message : "Não foi possível desativar a proteção."); }
    finally { setBusy(false); }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <section className="mx-auto w-full max-w-xl rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl sm:p-8">
        <Link href="/shop" className="text-sm font-semibold text-cyan-300 hover:text-cyan-200">← Voltar à loja</Link>
        <p className="mt-7 text-xs font-bold tracking-[0.2em] text-cyan-300">SEGURANÇA DA CONTA</p>
        <h1 className="mt-2 text-2xl font-extrabold">Autenticação em dois passos</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">Adiciona uma camada extra de proteção. Depois da palavra-passe, a tua conta pedirá um código temporário de uma aplicação autenticadora.</p>
        {loading && <p className="mt-6 text-sm text-slate-300">A verificar a tua conta...</p>}
        {!loading && factor && <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
          <p className="font-semibold text-emerald-300">Proteção ativa</p>
          <p className="mt-1 text-sm text-slate-300">Aplicação autenticadora ligada: {factor.friendly_name || "TOTP"}</p>
          <button type="button" disabled={busy} onClick={disableMfa} className="mt-4 rounded-lg border border-red-400/40 px-4 py-2 text-sm font-semibold text-red-300 disabled:opacity-50">{busy ? "A processar..." : "Desativar autenticação em dois passos"}</button>
        </div>}
        {!loading && !factor && !factorId && <button type="button" disabled={busy} onClick={startEnrollment} className="mt-6 w-full rounded-lg bg-cyan-400 px-4 py-3 text-sm font-extrabold text-slate-950 disabled:opacity-50">{busy ? "A preparar..." : "Ativar autenticação em dois passos"}</button>}
        {qrCode && <div className="mt-6 rounded-xl border border-slate-700 bg-slate-950 p-4">
          <p className="text-sm font-semibold">1. Lê este QR code</p>
          <img src={qrCode} alt="QR code para configurar a aplicação autenticadora" className="mx-auto my-4 h-52 w-52 rounded-lg bg-white p-2"/>
          <p className="text-xs text-slate-400">Se não conseguires ler o QR code, introduz esta chave manualmente na aplicação:</p>
          <p className="mt-2 break-all rounded bg-slate-900 p-3 font-mono text-sm text-cyan-200">{secret}</p>
          <form onSubmit={verifyEnrollment} className="mt-5">
            <label htmlFor="totp-code" className="block text-sm font-semibold">2. Introduz o código de 6 dígitos</label>
            <input id="totp-code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-3 text-white outline-none focus:border-cyan-400" placeholder="000000"/>
            <button type="submit" disabled={busy} className="mt-4 w-full rounded-lg bg-cyan-400 px-4 py-3 text-sm font-extrabold text-slate-950 disabled:opacity-50">{busy ? "A verificar..." : "Confirmar e ativar proteção"}</button>
          </form>
        </div>}
        {message && <p role="status" className="mt-5 rounded-lg bg-emerald-500/10 p-3 text-sm leading-6 text-emerald-300">{message}</p>}
        {error && <p role="alert" className="mt-5 rounded-lg bg-red-500/10 p-3 text-sm leading-6 text-red-300">{error}</p>}
        <p className="mt-6 border-t border-slate-800 pt-4 text-xs leading-5 text-slate-500">Guarda o acesso à tua aplicação autenticadora. O Supabase não fornece códigos de recuperação TOTP nativos; recomendamos configurar uma segunda aplicação autenticadora de confiança como método de reserva.</p>
      </section>
    </main>
  );
}
