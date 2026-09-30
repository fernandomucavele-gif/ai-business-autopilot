"use client";

import { useAutopilot } from "./context/autopilot-context";

const menu = [
  ["🏠", "Dashboard"],
  ["🔎", "Research AI"],
  ["🎨", "Creative AI"],
  ["📢", "Ads AI"],
  ["📊", "Analytics AI"],
  ["💰", "Finance AI"],
  ["🤝", "Customer AI"],
  ["📦", "Orders AI"],
  ["🤖", "Supervisor AI"],
  ["👁️", "Monitoramento"],
];

export default function Home() {
  const { state, metrics } = useAutopilot();

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
            <button key={name}>
              <span>{icon}</span>
              {name}
            </button>
          ))}
        </nav>

        <div className="simulation">
          🟢
          <strong>Simulation Mode</strong>
          <small>Ações reais desativadas</small>
        </div>
      </aside>

      <section className="content">
        <header>
          <div>
            <p className="eyebrow">PRIVATE AI SYSTEM</p>
            <h1>AI Business Autopilot</h1>
            <p className="subtitle">
              Centro de controlo do teu sistema de automação.
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
            <strong>{metrics.revenue} MT</strong>
            <small>Modo simulação</small>
          </div>

          <div className="card">
            <span>📦 Produtos</span>
            <strong>{state.products.length}</strong>
            <small>Produtos pesquisados</small>
          </div>

          <div className="card">
            <span>📢 Campanhas</span>
            <strong>{state.campaigns.length}</strong>
            <small>Campanhas criadas</small>
          </div>

          <div className="card">
            <span>⚡ Automação</span>
            <strong>
              {state.automation.simulationMode ? "SIMULAÇÃO" : "ATIVA"}
            </strong>
            <small>Ações reais bloqueadas</small>
          </div>
        </div>

        <div className="grid">
          <section className="panel large">
            <div className="panel-title">
              <div>
                <h2>Centro de atividade</h2>
                <p>Estado atual dos agentes do Autopilot.</p>
              </div>

              <span className="badge">SIMULAÇÃO</span>
            </div>

            <div className="agents">
              {menu.slice(1).map(([icon, name]) => (
                <div className="agent" key={name}>
                  <span className="agent-icon">{icon}</span>
                  <div>
                    <strong>{name}</strong>
                    <small>Disponível para execução</small>
                  </div>
                  <b>READY</b>
                </div>
              ))}
            </div>
          </section>

          <section className="panel">
            <h2>Segurança</h2>

            <div className="security">
              <div>
                🛡️