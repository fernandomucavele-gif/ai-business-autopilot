"use client";

import { useState } from "react";

const menu = [
  ["🏠", "Dashboard"],
  ["🔎", "Research AI"],
  ["🎨", "Creative AI"],
  ["📢", "Ads"],
  ["📊", "Analytics"],
  ["💰", "Finanças"],
  ["🤖", "Agentes"],
  ["👁️", "Monitoramento"],
  ["⚙️", "Configurações"],
];

export default function Home() {
  const [active, setActive] = useState("Dashboard");

  return (
    <main className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="logo">AI</div>
          <div>
            <strong>Business</strong>
            <span>Autopilot</span>
          </div>
        </div>

        <nav>
          {menu.map(([icon, name]) => (
            <button
              key={name}
              className={active === name ? "active" : ""}
              onClick={() => setActive(name)}
            >
              <span>{icon}</span>
              {name}
            </button>
          ))}
        </nav>

        <div className="simulation">
          <div>🟢</div>
          <strong>Simulation Mode</strong>
          <small>Ações reais desativadas</small>
        </div>
      </aside>

      <section className="content">
        <header>
          <div>
            <p className="eyebrow">PRIVATE AI SYSTEM</p>
            <h1>{active}</h1>
            <p className="subtitle">
              Centro de controlo do teu AI Business Autopilot.
            </p>
          </div>

          <div className="status">
            <span className="dot" />
            Sistema online
          </div>
        </header>

        <div className="cards">
          <div className="card">
            <span>💰 Receita</span>
            <strong>0 MT</strong>
            <small>Modo simulação</small>
          </div>

          <div className="card">
            <span>📈 Campanhas</span>
            <strong>0</strong>
            <small>Nenhuma campanha ativa</small>
          </div>

          <div className="card">
            <span>🤖 Tarefas IA</span>
            <strong>0</strong>
            <small>Aguardando execução</small>
          </div>

          <div className="card">
            <span>⚡ Automação</span>
            <strong>OFF</strong>
            <small>Ações reais bloqueadas</small>
          </div>
        </div>

        <div className="grid">
          <section className="panel large">
            <div className="panel-title">
              <div>
                <h2>Centro de atividade</h2>
                <p>Atividade recente do sistema.</p>
              </div>
              <span className="badge">SIMULAÇÃO</span>
            </div>

            <div className="empty">
              <div className="empty-icon">🤖</div>
              <h3>O Autopilot está pronto</h3>
              <p>
                Os agentes de pesquisa, criativos, analytics e anúncios serão
                conectados nas próximas etapas.
              </p>
            </div>
          </section>

          <section className="panel">
            <h2>Segurança</h2>
            <div className="security">
              <div>🛡️ Modo simulação <b>ATIVO</b></div>
              <div>💳 Gastos automáticos <b>BLOQUEADOS</b></div>
              <div>📢 Publicação de anúncios <b>BLOQUEADA</b></div>
              <div>💸 Levantamentos <b>BLOQUEADOS</b></div>
            </div>
          </section>
        </div>
      </section>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .app {
          min-height: 100vh;
          display: flex;
          background: #f4f7fb;
          color: #101828;
          font-family: Arial, sans-serif;
        }

        .sidebar {
          width: 245px;
          min-height: 100vh;
          padding: 24px 16px;
          background: #0b1220;
          color: white;
          display: flex;
          flex-direction: column;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 4px 8px 30px;
        }

        .logo {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          background: #2563eb;
          font-weight: bold;
        }

        .brand strong,
        .brand span {
          display: block;
        }

        .brand span {
          color: #94a3b8;
          font-size: 12px;
          margin-top: 3px;
        }

        nav {
          display: grid;
          gap: 7px;
        }

        nav button {
          border: 0;
          border-radius: 10px;
          padding: 12px;
          text-align: left;
          color: #cbd5e1;
          background: transparent;
          cursor: pointer;
          font-size: 14px;
        }

        nav button span {
          margin-right: 10px;
        }

        nav button:hover,
        nav button.active {
          background: #1e293b;
          color: white;
        }

        .simulation {
          margin-top: auto;
          padding: 14px;
          border: 1px solid #334155;
          border-radius: 12px;
          background: #111c2e;
        }

        .simulation strong,
        .simulation small {
          display: block;
        }

        .simulation strong {
          margin-top: 7px;
          font-size: 13px;
        }

        .simulation small {
          color: #94a3b8;
          margin-top: 4px;
        }

        .content {
          flex: 1;
          padding: 35px;
          max-width: 1500px;
        }

        header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 30px;
        }

        .eyebrow {
          color: #2563eb;
          font-size: 11px;
          font-weight: bold;
          letter-spacing: 1.5px;
        }

        h1 {
          margin: 5px 0;
          font-size: 32px;
        }

        .subtitle,
        .panel p {
          color: #667085;
        }

        .status {
          padding: 10px 14px;
          background: white;
          border: 1px solid #e4e7ec;
          border-radius: 20px;
          font-size: 13px;
        }

        .dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #16a34a;
          margin-right: 7px;
        }

        .cards {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 18px;
        }

        .card,
        .panel {
          background: white;
          border: 1px solid #e4e7ec;
          border-radius: 16px;
          box-shadow: 0 4px 18px rgba(16, 24, 40, 0.04);
        }

        .card {
          padding: 20px;
        }

        .card span,
        .card strong,
        .card small {
          display: block;
        }

        .card strong {
          font-size: 25px;
          margin: 13px 0 5px;
        }

        .card small {
          color: #98a2b3;
        }

        .grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 18px;
        }

        .panel {
          padding: 22px;
        }

        .panel-title {
          display: flex;
          justify-content: space-between;
          gap: 15px;
        }

        .panel h2 {
          margin: 0;
          font-size: 17px;
        }

        .panel-title p {
          margin-top: 6px;
          font-size: 13px;
        }

        .badge {
          height: fit-content;
          padding: 6px 9px;
          border-radius: 8px;
          background: #ecfdf3;
          color: #027a48;
          font-size: 10px;
          font-weight: bold;
        }

        .empty {
          text-align: center;
          padding: 65px 20px;
        }

        .empty-icon {
          font-size: 42px;
        }

        .empty h3 {
          margin-bottom: 5px;
        }

        .empty p {
          max-width: 480px;
          margin: auto;
          line-height: 1.5;
        }

        .security {
          display: grid;
          gap: 14px;
          margin-top: 20px;
        }

        .security div {
          padding: 12px;
          border-radius: 10px;
          background: #f8fafc;
          font-size: 13px;
        }

        .security b {
          display: block;
          margin-top: 5px;
          font-size: 11px;
          color: #475467;
        }

        @media (max-width: 900px) {
          .sidebar {
            width: 80px;
          }

          .brand div:not(.logo),
          nav button:not(.active) {
            font-size: 0;
          }

          .brand {
            justify-content: center;
          }

          .cards {
            grid-template-columns: repeat(2, 1fr);
          }

          .grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .app {
            display: block;
          }

          .sidebar {
            width: 100%;
            min-height: auto;
          }

          nav {
            grid-template-columns: repeat(3, 1fr);
          }

          .simulation {
            display: none;
          }

          .content {
            padding: 22px 15px;
          }

          header {
            display: block;
          }

          .status {
            display: inline-block;
            margin-top: 15px;
          }

          .cards {
            grid-template-columns: 1fr 1fr;
          }

          .card {
            padding: 15px;
          }
        }
      `}</style>
    </main>
  );
            }
