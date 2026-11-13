"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabase";

type Mode = "signin" | "signup" | "verify-email" | "recovery" | "update" | "mfa";

function friendlyAuthError(message: string) {
  const value = message.toLowerCase();
  if (value.includes("invalid login credentials")) return "E-mail ou palavra-passe incorretos. Confirma os dados ou recupera a palavra-passe.";
  if (value.includes("email not confirmed")) return "Ainda falta confirmar o teu e-mail. Introduz o código de 6 dígitos enviado para a tua caixa de entrada.";
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
  const [resending, setResending] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [factorId, setFactorId] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const requestedMode = searchParams.get("mode");
    const requestedEmail = searchParams.get("email");
    if (requestedEmail) setEmail(requestedEmail);
    if (requestedMode === "signup") {
      setMode("signup");
      setMessage("");
    }
    if (requestedMode === "verify") {
      setMode("verify-email");
      setMessage("Introduz o código de 6 dígitos enviado para o teu e-mail.");
    }
    if (requestedMode === "recovery") {
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
        } else {
          // A new account must prove ownership of its email before using private features.
          // If confirmation is disabled in Supabase, discard the temporary session;
          // the dashboard must have Confirm email enabled for this flow to work.
          if (data.session) await supabase.auth.signOut();
          setMode("verify-email");
          setPassword("");
          setOtp("");
          setMessage("Enviámos um código de confirmação para o teu e-mail. Introduz os 6 dígitos abaixo. O prazo de validade será definido nas configurações de segurança do serviço.");
        }
      } else if (mode === "verify-email") {
        const { error: verifyError } = await supabase.auth.verifyOtp({ email: normalizedEmail, token: otp.trim(), type: "signup" });
        if (verifyError) throw verifyError;
        setMessage("E-mail confirmado com sucesso. A abrir a loja...");
        router.replace("/shop");
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
  const isEmailVerification = mode === "verify-email";
  const isUpdate = mode === "update";
  const isSignup = mode === "signup";
  const isMfa = mode === "mfa";

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="logo">AI</div>
        <span className="eyebrow">ACESSO SEGURO</span>
        <h1>AI Business Autopilot</h1>
        <p className="intro">{isMfa ? "Confirma a tua identidade com o código temporário da aplicação autenticadora." : isEmailVerification ? "Confirma que tens acesso ao endereço de e-mail usado no registo." : isRecovery ? "Recebe um link seguro para recuperar o acesso." : isUpdate ? "Define uma nova palavra-passe para a tua conta." : "Entra na tua conta para aceder à loja."}</p>
        {!isRecovery && !isUpdate && !isMfa && !isEmailVerification && (
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
          {(isMfa || isEmailVerification) ? <>
            <label htmlFor="otp">{isMfa ? "Código da aplicação autenticadora" : "Código de confirmação do e-mail"}</label>
            <input id="otp" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="000000" />
          </> : !isRecovery && <>
            <label htmlFor="password">{isUpdate ? "Nova palavra-passe" : "Palavra-passe"}</label>
            <input id="password" type="password" autoComplete={isUpdate ? "new-password" : mode === "signin" ? "current-password" : "new-password"} minLength={6} required value={password} onChange={e => setPassword(e.target.value)} placeholder="Mínimo de 6 caracteres" />
          </>}
          <button className="submit" type="submit" disabled={busy}>{busy ? "A processar..." : isMfa ? "Confirmar código" : isEmailVerification ? "Verificar e-mail" : isRecovery ? "Enviar link de recuperação" : isUpdate ? "Guardar nova palavra-passe" : isSignup ? "Criar conta" : "Entrar na loja"}</button>
        </form>
        {mode === "signin" && <button type="button" className="text-link" onClick={() => switchMode("recovery")}>Esqueci-me da palavra-passe</button>}
        {isEmailVerification && <button type="button" className="text-link" disabled={resending || resendCount >= 3} onClick={async () => {
          setResending(true); setError(""); setMessage("");
          try {
            const { error: resendError } = await supabase.auth.resend({ type: "signup", email: email.trim().toLowerCase() });
            if (resendError) throw resendError;
            setResendCount((count) => count + 1);
            setMessage("Se o endereço estiver registado e puder receber confirmação, enviaremos um novo código. Verifica também a pasta de spam.");
          } catch (err) {
            setError(friendlyAuthError(err instanceof Error ? err.message : "Não foi possível reenviar o código."));
          } finally {
            setResending(false);
          }
        }}>{resending ? "A reenviar..." : resendCount >= 3 ? "Limite de reenvios desta sessão atingido" : "Reenviar código"}</button>}
        {(isRecovery || isUpdate || isMfa || isEmailVerification) && <button type="button" className="text-link" onClick={() => { switchMode("signin"); if (isMfa) void supabase.auth.signOut(); }}>Voltar ao início de sessão</button>}
        {message && <p className="message" role="status">{message}</p>}
        {error && <p className="error" role="alert">{error}</p>}
        <div className="safe-note">🛡️ Proteção de conta com MFA opcional. Compras, anúncios e pagamentos reais permanecem bloqueados.</div>
      </section>
      <style jsx>{`
        * { box-sizing: border-box; }
        .auth-page { position: relative; min-height: 100vh; display: grid; place-items: center; padding: 24px 18px; overflow: hidden; background: radial-gradient(ellipse at 50% -10%, rgba(34,211,238,.16), transparent 42%), radial-gradient(ellipse at 100% 100%, rgba(99,102,241,.12), transparent 38%), #070b16; color: #f8fafc; font-family: Arial, sans-serif; }
        .auth-card { position: relative; width: 100%; max-width: 450px; padding: 34px; border: 1px solid rgba(148,163,184,.16); border-radius: 25px; background: linear-gradient(155deg, rgba(19,31,52,.98), rgba(10,17,31,.98)); box-shadow: 0 28px 90px rgba(0,0,0,.42), inset 0 1px rgba(255,255,255,.035); }
        .logo { width: 54px; height: 54px; display: grid; place-items: center; margin-bottom: 24px; border: 1px solid rgba(255,255,255,.22); border-radius: 17px; background: linear-gradient(135deg,#67e8f9,#818cf8); color: #07111f; font-size: 17px; font-weight: 900; box-shadow: 0 10px 30px rgba(34,211,238,.15); }
        .eyebrow { color: #67e8f9; font-size: 10px; font-weight: 800; letter-spacing: 2.4px; }
        h1 { margin: 11px 0 10px; font-size: 28px; line-height: 1.2; letter-spacing: -.5px; }
        .intro { margin: 0 0 24px; color: #9aa9bf; font-size: 13px; line-height: 1.7; }
        .tabs { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; margin-bottom: 21px; padding: 5px; border: 1px solid rgba(148,163,184,.08); border-radius: 13px; background: rgba(3,8,20,.7); }
        .tabs button { padding: 12px 8px; border: 0; border-radius: 9px; background: transparent; color: #94a3b8; font-size: 12px; font-weight: 700; cursor: pointer; transition: .2s ease; }
        .tabs button.selected { background: #1e3048; color: #8be9f7; box-shadow: inset 0 0 0 1px rgba(103,232,249,.13); }
        label { display: block; margin: 15px 0 8px; color: #d5deeb; font-size: 12px; font-weight: 700; }
        input { width: 100%; padding: 14px 15px; border: 1px solid rgba(148,163,184,.2); border-radius: 11px; outline: none; background: rgba(4,10,22,.82); color: white; font-size: 14px; transition: border-color .2s, box-shadow .2s; }
        input::placeholder { color: #64748b; }
        input:focus { border-color: #67e8f9; box-shadow: 0 0 0 3px rgba(103,232,249,.09); }
        .submit { width: 100%; margin-top: 23px; padding: 14px; border: 0; border-radius: 11px; background: linear-gradient(100deg,#67e8f9,#a5b4fc); color: #07111f; font-size: 13px; font-weight: 900; letter-spacing: .15px; cursor: pointer; box-shadow: 0 10px 25px rgba(34,211,238,.12); transition: transform .2s, filter .2s; }
        .submit:hover:not(:disabled) { filter: brightness(1.06); transform: translateY(-1px); }
        .submit:disabled { opacity: .58; cursor: wait; }
        .text-link { display: block; margin: 15px auto 0; border: 0; background: transparent; color: #7ddff0; font-size: 12px; font-weight: 600; cursor: pointer; text-decoration: underline; text-underline-offset: 3px; }
        .text-link:disabled { opacity: .5; cursor: not-allowed; }
        .message, .error { margin: 16px 0 0; padding: 12px 13px; border-radius: 11px; font-size: 12px; line-height: 1.6; }
        .message { border: 1px solid rgba(74,222,128,.16); background: rgba(34,197,94,.08); color: #a7f3c0; }
        .error { border: 1px solid rgba(248,113,113,.18); background: rgba(248,113,113,.08); color: #fecaca; }
        .safe-note { margin-top: 25px; padding-top: 17px; border-top: 1px solid rgba(148,163,184,.12); color: #8292aa; font-size: 11px; line-height: 1.7; }
        @media (max-width: 480px) { .auth-card { padding: 25px 21px; border-radius: 21px; } h1 { font-size: 25px; } }
      `}</style>
    </main>
  );
}
