"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabase";

type Mode = "signin" | "signup" | "recovery" | "update" | "mfa";

function friendlyAuthError(message: string) {
  const value = message.toLowerCase();
  if (value.includes("invalid login credentials")) return "E-mail ou palavra-passe incorretos. Confirma os dados ou recupera a palavra-passe.";
  if (value.includes("email not confirmed")) return "Ainda falta confirmar o teu e-mail. Abre a mensagem de confirmação que recebeste.";
  if (value.includes("already registered") || value.includes("user already registered")) return "Este e-mail já tem uma conta. Escolhe «Iniciar sessão» ou recupera a palavra-passe.";
  if (value.includes("password should be at least")) return "A palavra-passe deve ter pelo menos 6 caracteres.";
  if (value.includes("rate limit")) return "Foram feitos muitos pedidos. Aguarda alguns minutos e tenta novamente.";
  return message;
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [factorId, setFactorId] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (searchParams.get("mode") === "recovery") {
      setMode("update");
      setMessage("Verificação concluída. Define uma nova palavra-passe para a tua conta.");
    }
  }, [searchParams]);

  function switchMode(next: Mode) {
    setMode(next);
    setMessage("");
    setError("");
    setPassword("");
    setOtp("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setError("");
    try {
      const normalizedEmail = email.trim().toLowerCase();
      if (mode === "signup") {
        const { data, error: authError } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: { emailRedirectTo: window.location.origin + "/shop" },
        });
        if (authError) throw authError;
        if (data.user && data.user.identities?.length === 0) {
          setMessage("Este e-mail já está registado. Escolhe «Iniciar sessão» ou «Esqueci-me da palavra-passe».");
        } else if (!data.session) {
          setMessage("Conta criada. Confirma o e-mail recebido. Depois volta aqui e escolhe «Iniciar sessão» com a mesma palavra-passe.");
          setMode("signin");
          setPassword("");
        } else {
          setMessage("Conta criada com sucesso. A abrir a loja...");
          router.replace("/shop");
        }
      } else if (mode === "recovery") {
        const { error: authError } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
          redirectTo: window.location.origin + "/shop/reset-password",
        });
        if (authError) throw authError;
        setMessage("Se existir uma conta com este e-mail, receberás uma mensagem com instruções para criar uma nova palavra-passe.");
      } else if (mode === "update") {
        const { error: authError } = await supabase.auth.updateUser({ password });
        if (authError) throw authError;
        setMessage("Palavra-passe atualizada. Já podes iniciar sessão com a nova palavra-passe.");
        setMode("signin");
        setPassword("");
        router.replace("/login");
      } else if (mode === "mfa") {
        const { error: verifyError } = await supabase.auth.mfa.verify({
          factorId,
          challengeId,
          code: otp.trim(),
        });
        if (verifyError) throw verifyError;
        setMessage("Identidade confirmada. A abrir a loja...");
        router.replace("/shop");
      } else {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });
        if (authError) throw authError;
        if (!data.session) throw new Error("O início de sessão não foi concluído. Tenta novamente.");

        const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();
        if (factorsError) throw factorsError;
        const verifiedTotp = factors.totp.find((factor) => factor.status === "verified");
        if (verifiedTotp) {
          const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId: verifiedTotp.id });
          if (challengeError) throw challengeError;
          setMessage("A tua conta tem autenticação em dois passos ativa. A abrir a verificação segura...");
          router.replace("/login/mfa");
        } else {
          setMessage("Sessão iniciada. A abrir a loja...");
          router.replace("/shop");
        }
      }
    } catch (err) {
      setError(friendlyAuthError(err instanceof Error ? err.message : "Não foi possível concluir a autenticação."));
    } finally {
      setBusy(false);
    }
  }

  const isRecovery = mode === "recovery";
  const isUpdate = mode === "update";
  const isSignup = mode === "signup";
  const isMfa = mode === "mfa";

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="logo">AI</div>
        <span className="eyebrow">ACESSO SEGURO</span>
        <h1>AI Business Autopilot</h1>
        <p className="intro">{isMfa ? "Confirma a tua identidade com o código temporário da aplicação autenticadora." : isRecovery ? "Recebe um link seguro para recuperar o acesso." : isUpdate ? "Define uma nova palavra-passe para a tua conta." : "Entra na tua conta para aceder à loja."}</p>
        {!isRecovery && !isUpdate && !isMfa && (
          <div className="tabs">
            <button type="button" className={mode === "signin" ? "selected" : ""} onClick={() => switchMode("signin")}>Iniciar sessão</button>
            <button type="button" className={mode === "signup" ? "selected" : ""} onClick={() => switchMode("signup")}>Criar conta</button>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {!isMfa && <>
            <label htmlFor="email">E-mail</label>
            <input id="email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="teuemail@exemplo.com" />
          </>}
          {isMfa ? <>
            <label htmlFor="otp">Código de 6 dígitos</label>
            <input id="otp" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="000000" />
          </> : !isRecovery && <>
            <label htmlFor="password">{isUpdate ? "Nova palavra-passe" : "Palavra-passe"}</label>
            <input id="password" type="password" autoComplete={isUpdate ? "new-password" : mode === "signin" ? "current-password" : "new-password"} minLength={6} required value={password} onChange={e => setPassword(e.target.value)} placeholder="Mínimo de 6 caracteres" />
          </>}
          <button className="submit" type="submit" disabled={busy}>{busy ? "A processar..." : isMfa ? "Confirmar código" : isRecovery ? "Enviar link de recuperação" : isUpdate ? "Guardar nova palavra-passe" : isSignup ? "Criar conta" : "Entrar na loja"}</button>
        </form>
        {mode === "signin" && <button type="button" className="text-link" onClick={() => switchMode("recovery")}>Esqueci-me da palavra-passe</button>}
        {(isRecovery || isUpdate || isMfa) && <button type="button" className="text-link" onClick={() => { switchMode("signin"); if (isMfa) void supabase.auth.signOut(); }}>Voltar ao início de sessão</button>}
        {message && <p className="message" role="status">{message}</p>}
        {error && <p className="error" role="alert">{error}</p>}
        <div className="safe-note">🛡️ Proteção de conta com MFA opcional. Compras, anúncios e pagamentos reais permanecem bloqueados.</div>
      </section>
      <style jsx>{`
        * { box-sizing: border-box; }
        .auth-page { min-height: 100vh; display: grid; place-items: center; padding: 22px; background: radial-gradient(ellipse at 50% 0%, rgba(30,64,175,.22), transparent 48%), #080d19; color: #f8fafc; font-family: Arial, sans-serif; }
        .auth-card { width: 100%; max-width: 430px; padding: 30px; border: 1px solid rgba(148,163,184,.18); border-radius: 20px; background: #101a2c; box-shadow: 0 24px 70px rgba(0,0,0,.28); }
        .logo { width: 48px; height: 48px; display: grid; place-items: center; margin-bottom: 22px; border-radius: 14px; background: linear-gradient(135deg,#22d3ee,#6366f1); color: #07111f; font-weight: 900; }
        .eyebrow { color: #67e8f9; font-size: 10px; font-weight: 700; letter-spacing: 2px; }
        h1 { margin: 10px 0; font-size: 27px; line-height: 1.2; }
        .intro { margin: 0 0 22px; color: #94a3b8; font-size: 13px; line-height: 1.6; }
        .tabs { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; margin-bottom: 20px; padding: 5px; border-radius: 11px; background: #080d19; }
        .tabs button { padding: 11px 7px; border: 0; border-radius: 8px; background: transparent; color: #94a3b8; font-size: 12px; cursor: pointer; }
        .tabs button.selected { background: #1e293b; color: #67e8f9; }
        label { display: block; margin: 14px 0 7px; color: #cbd5e1; font-size: 12px; }
        input { width: 100%; padding: 13px; border: 1px solid rgba(148,163,184,.22); border-radius: 9px; outline: none; background: #080d19; color: white; font-size: 14px; }
        input:focus { border-color: #67e8f9; }
        .submit { width: 100%; margin-top: 22px; padding: 13px; border: 0; border-radius: 9px; background: linear-gradient(100deg,#22d3ee,#818cf8); color: #07111f; font-size: 13px; font-weight: 800; cursor: pointer; }
        .submit:disabled { opacity: .6; cursor: wait; }
        .text-link { display: block; margin: 14px auto 0; border: 0; background: transparent; color: #67e8f9; font-size: 12px; cursor: pointer; text-decoration: underline; }
        .message, .error { margin: 15px 0 0; padding: 11px; border-radius: 9px; font-size: 12px; line-height: 1.5; }
        .message { background: rgba(34,197,94,.09); color: #86efac; }
        .error { background: rgba(248,113,113,.09); color: #fca5a5; }
        .safe-note { margin-top: 22px; padding-top: 16px; border-top: 1px solid rgba(148,163,184,.12); color: #94a3b8; font-size: 11px; line-height: 1.6; }
        @media (max-width: 420px) { .auth-card { padding: 22px; } h1 { font-size: 24px; } }
      `}</style>
    </main>
  );
}
