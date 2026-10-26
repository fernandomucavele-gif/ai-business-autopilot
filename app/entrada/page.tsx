
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import "./entrada.css";

export default function EntradaPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;

        if (!data.session) {
          setMessage(
            "Conta criada. Verifica o teu email para confirmar a conta."
          );
        } else {
          router.replace("/");
          router.refresh();
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        router.replace("/");
        router.refresh();
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível concluir a operação."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="entry-screen">
      <header className="entry-header">
        <div className="entry-brand-mark">A</div>
        <div>
          <p className="entry-brand">AI BUSINESS</p>
          <p className="entry-brand-sub">AUTOPILOT</p>
        </div>
        <div className="entry-status">
          <span /> SISTEMA DISPONÍVEL
        </div>
      </header>

      <div className="entry-content">
        <section className="cinema-scene">
          <div className="scene-horizon" />
          <div className="scene-floor" />
          <div className="scene-light" />
          <div className="traveler">
            <div className="traveler-head" />
            <div className="traveler-body" />
            <div className="traveler-arm" />
            <div className="traveler-leg traveler-leg-left" />
            <div className="traveler-leg traveler-leg-right" />
          </div>
          <div className="suitcase">
            <div className="case-handle" />
            <div className="case-base">
              <span className="case-emblem">A</span>
              <span className="case-line" />
            </div>
            <div className="case-lid">
              <div className="case-inner-light" />
            </div>
            <div className="case-beam" />
          </div>
          <div className="scene-particles">
            <i /><i /><i /><i /><i /><i />
          </div>
          <p className="scene-caption">
            O FUTURO DOS NEGÓCIOS COMEÇA AQUI
          </p>
        </section>

        <section className="entry-copy">
          <span className="entry-eyebrow">
            INTELLIGENT BUSINESS SYSTEM
          </span>
          <h1>
            O teu negócio.
            <br />
            <span>Em modo Autopilot.</span>
          </h1>
          <p className="entry-description">
            Entra no centro de controlo do AI Business Autopilot para
            pesquisar oportunidades, acompanhar operações e gerir o teu sistema.
          </p>
        </section>

        <section className="auth-panel">
          <div className="auth-tabs">
            <button
              type="button"
              className={mode === "login" ? "auth-tab active" : "auth-tab"}
              onClick={() => {
                setMode("login");
                setMessage("");
              }}
            >
              Iniciar sessão
            </button>
            <button
              type="button"
              className={mode === "signup" ? "auth-tab active" : "auth-tab"}
              onClick={() => {
                setMode("signup");
                setMessage("");
              }}
            >
              Criar conta
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              Email
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                placeholder="teu@email.com"
              />
            </label>

            <label>
              Palavra-passe
              <input
                type="password"
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                placeholder="Mínimo de 6 caracteres"
              />
            </label>

            <button className="auth-submit" type="submit" disabled={busy}>
              {busy
                ? "A processar..."
                : mode === "login"
                  ? "Entrar no Autopilot"
                  : "Criar a minha conta"}
            </button>

            {message && (
              <p className="auth-message" role="status">
                {message}
              </p>
            )}
          </form>

          <p className="auth-note">
            Acesso através do Supabase Auth. As operações comerciais continuam
            em modo de simulação.
          </p>
        </section>
      </div>

      <footer className="entry-footer">
        <span>AI BUSINESS AUTOPILOT</span>
        <span>AMBIENTE DE SIMULAÇÃO</span>
      </footer>
    </main>
  );
}
