"use client";

import { useState } from "react";

type MenuItem = {
  icon: string;
  name: string;
};

const menu: MenuItem[] = [
  { icon: "🏠", name: "Dashboard" },
  { icon: "🔎", name: "Research AI" },
  { icon: "🏭", name: "Fornecedores" },
  { icon: "🎨", name: "Creative AI" },
  { icon: "📢", name: "Ads AI" },
  { icon: "📊", name: "Analytics" },
  { icon: "👥", name: "Customer AI" },
  { icon: "📦", name: "Orders AI" },
  { icon: "💰", name: "Finanças" },
  { icon: "🤖", name: "Supervisor AI" },
  { icon: "👁️", name: "Monitoramento" },
  { icon: "⚙️", name: "Configurações" },
];

const markets = [
  "Moçambique",
  "Brasil",
  "Portugal",
  "África do Sul",
  "Europa",
  "EUA",
  "Global",
];

const products = [
  {
    name: "Organizador inteligente para casa",
    market: "Moçambique",
    score: 88,
  },
  {
    name: "Acessório portátil para automóvel",
    market: "Brasil",
    score: 84,
  },
  {
    name: "Acessório de fitness doméstico",
    market: "Europa",
    score: 81,
  },
];

export default function Home() {
  const [active, setActive] = useState("Dashboard");
  const [market, setMarket] = useState("Moçambique");
  const [researchRunning, setResearchRunning] = useState(false);
  const [researchDone, setResearchDone] = useState(false);

  const [autopilotActive, setAutopilotActive] = useState(true);

  function startResearch() {
    setResearchRunning(true);
    setResearchDone(false);

    setTimeout(() => {
      setResearchRunning(false);
      setResearchDone(true);
    }, 1500);
  }

  function toggleAutopilot() {
    setAutopilotActive((value) => !value);
  }

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
          {menu.map((item) => (
            <button
              key={item.name}
              className={active === item.name ? "active" : ""}
              onClick={() => setActive(item.name)}
            >
              <span>{item.icon}</span>
              {item.name}
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
        <header className="topbar">
          <strong>AI Business Autopilot</strong>

          <div className="online">
            <span>●</span>{" "}
            {autopilotActive ? "Online" : "Pausado"}
          </div>
        </header>

        <div className="page">
          {active === "Dashboard" && (
            <>
              <Header
                title="Dashboard"
                description="Centro de controlo do teu AI Business Autopilot."
              />

              <div className="cards">
                <Card title="💰 Receita" value="0 MT" />
                <Card title="📈 Campanhas" value="0" />
                <Card title="🤖 Produtos analisados" value="0" />
                <Card
                  title="⚡ Automação"
                  value={autopilotActive ? "ATIVA" : "PAUSADA"}
                />
              </div>

              <div className="grid2">
                <section className="panel">
                  <h2>🎯 Centro de atividade</h2>

                  <div className="activity">
                    <div className="bigIcon">🤖</div>

                    <div>
                      <strong>
                        {autopilotActive
                          ? "Autopilot preparado"
                          : "Autopilot pausado"}
                      </strong>

                      <p>
                        O sistema está preparado para pesquisar produtos,
                        analisar fornecedores, criar criativos, preparar
                        anúncios e acompanhar operações.
                      </p>

                      <button
                        className={
                          autopilotActive
                            ? "dangerButton"
                            : "primaryButton"
                        }
                        onClick={toggleAutopilot}
                      >
                        {autopilotActive
                          ? "⏸ Pausar Autopilot"
                          : "▶ Ativar Autopilot"}
                      </button>
                    </div>
                  </div>
                </section>

                <section className="panel">
                  <h2>🔐 Segurança</h2>

                  <StatusRow
                    label="Modo simulação"
                    value="ATIVO"
                  />

                  <StatusRow
                    label="Compras automáticas"
                    value="BLOQUEADAS"
                  />

                  <StatusRow
                    label="Pagamentos automáticos"
                    value="BLOQUEADOS"
                  />

                  <StatusRow
                    label="Publicação real"
                    value="BLOQUEADA"
                  />

                  <StatusRow
                    label="Levantamentos"
                    value="BLOQUEADOS"
                  />
                </section>
              </div>

              <section className="panel">
                <h2>🌍 Mercados</h2>

                <p className="muted">
                  Escolhe o mercado que o Autopilot deve analisar.
                </p>

                <div className="marketList">
                  {markets.map((item) => (
                    <button
                      key={item}
                      className={
                        market === item
                          ? "market activeMarket"
                          : "market"
                      }
                      onClick={() => setMarket(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <div className="selected">
                  Mercado selecionado: <strong>{market}</strong>
                </div>
              </section>

              <section className="panel">
                <h2>🧠 Estado dos agentes</h2>

                <div className="agentGrid">
                  {menu.slice(1, 11).map((item) => (
                    <div className="agent" key={item.name}>
                      <span>{item.icon}</span>
                      <strong>{item.name}</strong>
                      <small>
                        {autopilotActive
                          ? "Pronto"
                          : "Pausado"}
                      </small>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {active === "Research AI" && (
            <>
              <Header
                title="🔎 Research AI"
                description="Encontrar produtos com potencial de venda."
              />

              <section className="panel">
                <h2>Pesquisa de produtos</h2>

                <p className="muted">
                  A IA deverá analisar procura, concorrência, preço,
                  margem, fornecedores, envio e possibilidade de anúncios.
                </p>

                <label>Mercado</label>

                <select
                  value={market}
                  onChange={(event) =>
                    setMarket(event.target.value)
                  }
                >
                  {markets.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                <button
                  className="primaryButton"
                  onClick={startResearch}
                  disabled={researchRunning}
                >
                  {researchRunning
                    ? "🔎 A pesquisar..."
                    : "🚀 Procurar produtos"}
                </button>

                {researchDone && (
                  <div className="results">
                    <h2>Produtos encontrados — simulação</h2>

                    {products.map((product) => (
                      <div className="product" key={product.name}>
                        <div>
                          <strong>{product.name}</strong>

                          <span>
                            {product.market} · Potencial{" "}
                            {product.score}/100
                          </span>
                        </div>

                        <button className="secondaryButton">
                          Analisar
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="warning">
                  ⚠️ Modo simulação ativo. Nenhuma compra ou encomenda
                  real será feita automaticamente.
                </div>
              </section>
            </>
          )}

          {active !== "Dashboard" &&
            active !== "Research AI" && (
              <>
                <Header
                  title={
                    (menu.find(
                      (item) => item.name === active
                    )?.icon || "🤖") +
                    " " +
                    active
                  }
                  description={getDescription(active)}
                />

                <section className="panel">
                  <div className="module">
                    <div className="moduleIcon">
                      {menu.find(
                        (item) => item.name === active
                      )?.icon}
                    </div>

                    <div>
                      <h2>{active}</h2>

                      <p className="muted">
                        Este módulo está preparado para integração
                        com o AI Business Autopilot.
                      </p>

                      <span className="ready">
                        ● SIMULAÇÃO ATIVA
                      </span>
                    </div>
                  </div>

                  <div className="moduleGrid">
                    <div>
                      <strong>Estado</strong>
                      <span>
                        {autopilotActive
                          ? "Preparado"
                          : "Pausado"}
                      </span>
                    </div>

                    <div>
                      <strong>Ações reais</strong>
                      <span>Bloqueadas</span>
                    </div>

                    <div>
                      <strong>Mercado</strong>
                      <span>{market}</span>
                    </div>

                    <div>
                      <strong>Supervisor</strong>
                      <span>
                        {autopilotActive
                          ? "Controlado"
                          : "Pausado"}
                      </span>
                    </div>
                  </div>
                </section>
              </>
            )}
        </div>
      </section>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: Arial, Helvetica, sans-serif;
          background: #f4f7fb;
          color: #111827;
        }

        button,
        input,
        select {
          font: inherit;
        }

        .app {
          min-height: 100vh;
          display: flex;
        }

        .sidebar {
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          width: 260px;
          padding: 20px 14px;
          background: #07111f;
          color: white;
          overflow-y: auto;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px;
          margin-bottom: 20px;
        }

        .logo {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #2563eb;
          font-weight: 800;
        }

        .brand strong,
        .brand span {
          display: block;
        }

        .brand span {
          margin-top: 4px;
          color: #94a3b8;
        }

        nav {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        nav button {
          width: 100%;
          border: 0;
          border-radius: 10px;
          background: transparent;
          color: #cbd5e1;
          padding: 12px;
          text-align: left;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        nav button:hover,
        nav button.active {
          background: #1d2b42;
          color: white;
        }

        nav button span {
          width: 24px;
          text-align: center;
        }

        .simulation {
          margin-top: 25px;
          padding: 15px;
          border-radius: 12px;
          border: 1px solid #26364d;
          background: #0d192b;
        }

        .simulation strong,
        .simulation small {
          display: block;
        }

        .simulation strong {
          margin-top: 8px;
        }

        .simulation small {
          margin-top: 5px;
          color: #94a3b8;
        }

        .content {
          width: calc(100% - 260px);
          margin-left: 260px;
        }

        .topbar {
          height: 70px;
          padding: 0 30px;
          background: white;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .online {
          padding: 8px 13px;
          border-radius: 20px;
          background: #dcfce7;
          color: #166534;
          font-size: 13px;
          font-weight: 700;
        }

        .online span {
          color: #16a34a;
        }

        .page {
          max-width: 1250px;
          margin: auto;
          padding: 30px;
        }

        .pageHeader {
          margin-bottom: 25px;
        }

        .eyebrow {
          color: #2563eb;
          font-weight: 800;
          font-size: 13px;
          letter-spacing: 1px;
        }

        h1 {
          margin: 8px 0;
          font-size: 34px;
        }

        h2 {
          margin-top: 0;
        }

        .muted {
          color: #64748b;
          line-height: 1.6;
        }

        .cards {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 20px;
        }

        .card {
          padding: 20px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 17px;
        }

        .card strong {
          display: block;
          margin-top: 12px;
          font-size: 24px;
        }

        .grid2 {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 20px;
        }

        .panel {
          padding: 22px;
          margin-bottom: 20px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 17px;
          box-shadow: 0 5px 25px rgba(15, 23, 42, 0.04);
        }

        .activity {
          display: flex;
          gap: 15px;
          padding: 18px;
          border-radius: 12px;
          background: #f8fafc;
        }

        .bigIcon {
          font-size: 30px;
        }

        .activity p {
          color: #64748b;
          line-height: 1.6;
        }

        .securityRow {
          display: flex;
          justify-content: space-between;
          padding: 13px 0;
          border-bottom: 1px solid #eef2f7;
        }

        .securityRow b {
          font-size: 11px;
          color: #b45309;
        }

        .marketList {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 15px;
        }

        .market {
          padding: 10px 14px;
          border-radius: 20px;
          border: 1px solid #dbe3ee;
          background: white;
          cursor: pointer;
        }

        .market:hover,
        .activeMarket {
          background: #2563eb;
          color: white;
          border-color: #2563eb;
        }

        .selected {
          margin-top: 18px;
          color: #475569;
        }

        label {
          display: block;
          margin-top: 20px;
          margin-bottom: 7px;
          font-weight: 700;
        }

        select {
          width: 100%;
          padding: 13px;
          border-radius: 10px;
          border: 1px solid #dbe3ee;
          background: white;
        }

        .primaryButton,
        .secondaryButton,
        .dangerButton {
          border: 0;
          border-radius: 10px;
          padding: 13px 17px;
          font-weight: 700;
          cursor: pointer;
        }

        .primaryButton {
          width: 100%;
          margin-top: 18px;
          background: #2563eb;
          color: white;
        }

        .dangerButton {
          background: #dc2626;
          color: white;
        }

        .primaryButton:disabled {
          opacity: 0.6;
        }

        .secondaryButton {
          background: #eef2ff;
          color: #3730a3;
        }

        .results {
          margin-top: 25px;
        }

        .product {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          padding: 16px;
          margin-top: 10px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
        }

        .product span {
          display: block;
          margin-top: 5px;
          color: #2563eb;
          font-size: 13px;
        }

        .warning {
          margin-top: 20px;
          padding: 15px;
          border-radius: 12px;
          background: #fff7ed;
          color: #9a3412;
        }

        .module {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .moduleIcon {
          width: 70px;
          height: 70px;
          border-radius: 18px;
          background: #eff6ff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
        }

        .ready {
          display: inline-block;
          margin-top: 8px;
          padding: 6px 10px;
          border-radius: 20px;
          background: #dcfce7;
          color: #166534;
          font-size: 11px;
          font-weight: 800;
        }

        .moduleGrid,
        .agentGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-top: 25px;
        }

        .moduleGrid div,
        .agent {
          padding: 15px;
          border-radius: 12px;
          background: #f8fafc;
        }

        .moduleGrid strong,
        .moduleGrid span {
          display: block;
        }

        .moduleGrid span {
          margin-top: 7px;
          color: #64748b;
          font-size: 13px;
        }

        .agent span,
        .agent strong,
        .agent small {
          display: block;
        }

        .agent span {
          font-size: 22px;
          margin-bottom: 8px;
        }

        .agent small {
          color: #16a34a;
          margin-top: 5px;
        }

        @media (max-width: 900px) {
          .sidebar {
            width: 220px;
          }

          .content {
            width: calc(100% - 220px);
            margin-left: 220px;
          }

          .cards {
            grid-template-columns: repeat(2, 1fr);
          }

          .moduleGrid,
       