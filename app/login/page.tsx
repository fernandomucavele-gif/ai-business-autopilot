"use client";

import { useState, type FormEvent } from "react";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setError("");

    try {
      if (mode === "signup") {
        const { data, error: authError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: window.location.origin + "/" },
        });
        if (authError) throw authError;
        if (!data.session) {
          setMessage("Conta criada. Verifica o teu e-mail e confirma o endereço antes de iniciar sessão.");
        } else {
          setMessage("Conta criada com sucesso. A abrir o Autopilot...");
        }
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (authError) throw authError;
        setMessage("Sessão iniciada. A abrir o Autopilot...");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível concluir a autenticação.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="logo">AI</div>
        <span className="eyebrow">ACESSO SEGURO</span>
        <h1>AI Business Autopilot</h1>
        <p className="intro">Entra na tua conta para aceder ao teu centro de controlo.</p>

        <div className="tabs">
          <button type="button" className={mode === "signin" ? "selected" : ""} onClick={() => { setMode("signin"); setMessage(""); setError(""); }}>Iniciar sessão</button>
          <button type="button" className={mode === "signup" ? "selected" : ""} onClick={() => { setMode("signup"); setMessage(""); setError(""); }}>Criar conta</button>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">E-mail</label>
          <input id="email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="teuemail@exemplo.com" />
          <label htmlFor="password">Palavra-passe</label>
          <input id="password" type="password" autoComplete={mode === "signin" ? "current-password" : "new-password"} minLength={6} required value={password} onChange={e => setPassword(e.target.value)} placeholder="Mínimo de 6 caracteres" />
          <button className="submit" type="submit" disabled={busy}>{busy ? "A processar..." : mode === "signin" ? "Entrar no sistema" : "Criar conta"}</button>
        </form>

        {message && <p className="message" role="status">{message}</p>}
        {error && <p className="error" role="alert">{error}</p>}

        <div className="safe-note">🛡️ Ambiente de simulação. Compras, anúncios e pagamentos reais permanecem bloqueados.</div>
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
        .message, .error { margin: 15px 0 0; padding: 11px; border-radius: 9px; font-size: 12px; line-height: 1.5; }
        .message { background: rgba(34,197,94,.09); color: #86efac; }
        .error { background: rgba(248,113,113,.09); color: #fca5a5; }
        .safe-note { margin-top: 22px; padding-top: 16px; border-top: 1px solid rgba(148,163,184,.12); color: #94a3b8; font-size: 11px; line-height: 1.6; }
        @media (max-width: 420px) { .auth-card { padding: 22px; } h1 { font-size: 24px; } }
      `}</style>
    </main>
  );
}
