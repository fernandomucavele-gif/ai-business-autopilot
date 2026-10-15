
"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();

      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError) {
        setError("Email ou palavra-passe inválidos.");
        return;
      }

      const requested = searchParams.get("next") || "/";
      const safePath =
        requested.startsWith("/") && !requested.startsWith("//")
          ? requested
          : "/";

      router.replace(safePath);
      router.refresh();
    } catch {
      setError("Não foi possível ligar ao sistema. Verifica a configuração.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="logo">AI</div>
        <p className="eyebrow">PRIVATE AI SYSTEM</p>
        <h1>Business Autopilot</h1>
        <p className="description">
          Inicia sessão para aceder ao teu centro de controlo.
        </p>

        <form onSubmit={handleLogin}>
          <label htmlFor="email">Email autorizado</label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="teu@email.com"
          />

          <label htmlFor="password">Palavra-passe</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Introduz a palavra-passe"
          />

          {error && <p className="error" role="alert">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "A verificar..." : "Iniciar sessão"}
          </button>
        </form>

        <div className="security">
          🛡️ Acesso privado · Registos públicos desativados
        </div>
        <p className="footer">Modo de simulação · Operações reais bloqueadas</p>
      </section>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: 20px;
          background: radial-gradient(ellipse at top, #172554, #080d19 65%);
          color: #f8fafc;
          font-family: Arial, sans-serif;
        }
        .login-card {
          width: 100%;
          max-width: 430px;
          padding: 32px;
          border: 1px solid rgba(148,163,184,.2);
          border-radius: 20px;
          background: rgba(16,26,44,.96);
          box-shadow: 0 24px 80px rgba(0,0,0,.3);
        }
        .logo {
          display: grid;
          place-items: center;
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: linear-gradient(135deg,#22d3ee,#6366f1);
          color: #07111f;
          font-weight: 900;
          font-size: 20px;
        }
        .eyebrow {
          margin-top: 25px;
          color: #67e8f9;
          font-size: 10px;
          letter-spacing: 2px;
        }
        h1 { margin: 8px 0; font-size: 28px; }
        .description { color: #94a3b8; font-size: 13px; line-height: 1.6; }
        form { display: grid; gap: 10px; margin-top: 26px; }
        label { margin-top: 6px; font-size: 12px; color: #cbd5e1; }
        input {
          width: 100%;
          box-sizing: border-box;
          padding: 13px;
          border: 1px solid #334155;
          border-radius: 10px;
          background: #0b1220;
          color: white;
          font-size: 14px;
        }
        input:focus { outline: 2px solid #22d3ee; outline-offset: 1px; }
        button {
          margin-top: 10px;
          padding: 13px;
          border: 0;
          border-radius: 10px;
          background: #22d3ee;
          color: #07111f;
          font-weight: 800;
          cursor: pointer;
        }
        button:disabled { opacity: .6; cursor: wait; }
        .error { color: #fca5a5; font-size: 12px; line-height: 1.5; }
        .security {
          margin-top: 22px;
          padding: 12px;
          border: 1px solid rgba(34,197,94,.2);
          border-radius: 10px;
          color: #86efac;
          font-size: 11px;
          line-height: 1.5;
        }
        .footer { margin-top: 18px; color: #64748b; font-size: 10px; text-align: center; }
        @media (max-width: 480px) {
          .login-card { padding: 24px 20px; }
        }
      `}</style>
    </main>
  );
                                     }
  
