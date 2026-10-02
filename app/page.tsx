"use client";

import { useRouter } from "next/navigation";
import { useAutopilot } from "./context/autopilot-context";

const menu = [
  ["🏠", "Dashboard", "/"],
  ["🔎", "Research AI", "/research"],
  ["🏭", "Supplier AI", "/suppliers"],
  ["🎨", "Creative AI", "/creative"],
  ["📢", "Ads AI", "/ads"],
  ["📊", "Analytics AI", "/analytics"],
  ["💰", "Finance AI", "/finance"],
  ["🤝", "Customer AI", "/customers"],
  ["📦", "Orders AI", "/orders"],
  ["🤖", "Supervisor AI", "/supervisor"],
  ["👁️", "Monitoramento", "/monitoring"],
  ["⚙️", "Configurações", "/settings/app/settings"],
];

export default function Home() {
  const router = useRouter();
  const { state, metrics } = useAutopilot();

  return (
    <main className="dashboard">
      <aside className="sidebar">
        <div className="brand">
          <div className="logo">AI</div>
          <div>
            <strong>Business</strong>
            <span>Autopilot</span>
          </div>
        </div>

        <nav>
          {menu.map(([icon, name, path], index) => (
            <button
              key={name}
              onClick={() => router.push(path)}
              className={index === 0 ? "active" : ""}
            >
              <span>{icon}</span>
              {name}
            </button>
          ))}
        </nav>

        <div className="safe">
          🟢
          <strong>Modo simulação</strong>
          <small>Ações reais bloqueadas</small>
        </div>
      </aside>

      <section className="content">
        <header className="header">
          <div>
            <span className="eyebrow">PRIVATE AI SYSTEM</span>
            <h1>AI Business Autopilot</h1>
            <p>Centro de controlo do teu sistema de automação.</p>
          </div>

          <div className="online">● Sistema online</div>
        </header>

        <div className="banner">
          <div>
            <strong>🛡️ Ambiente seguro de testes</strong>
            <p>
              O Autopilot está atualmente a funcionar em modo de
              simulação.
            </p>
          </div>

          <span>SIMULAÇÃO ATIVA</span>
        </div>

        <div className="cards">
          <Card
            icon="💰"
            title="Receita"
            value={`${metrics.revenue.toLocaleString("pt-PT")} MT`}
            note="Simulada"
          />

          <Card
            icon="📦"
            title="Produtos"
            value={String(state.products.length)}
            note="Pesquisados"
          />

          <Card
            icon="📢"
            title="Campanhas"
            value={String(state.campaigns.length)}
            note="Simuladas"
          />

          <Card
            icon="🛒"
            title="Pedidos"
            value={String(state.orders.length)}
            note="Registados"
          />

          <Card
            icon="⚡"
            title="Automação"
            value={
              state.automation.simulationMode
                ? "SIMULAÇÃO"
                : "ATIVA"
            }
            note="Protegida"
          />
        </div>

        <div className="main-grid">
          <section className="panel">
            <div className="panel-head">
              <div>
                <h2>Centro de atividade</h2>
                <p>Agentes disponíveis no Autopilot.</p>
              </div>

              <span className="badge">SIMULAÇÃO</span>
            </div>

            <div className="agents">
              {menu.slice(1).map(([icon, name, path]) => (
                <button
                  key={name}
                  className="agent"
                  onClick={() => router.push(path)}
                >
                  <span className="agent-icon">{icon}</span>

                  <span className="agent-text">
                    <strong>{name}</strong>
                    <small>Agente disponível</small>
                  </span>

                  <b>READY</b>
                </button>
              ))}
            </div>
          </section>

          <section className="panel">
            <h2>🛡️ Segurança</h2>

            <Security
              title="Modo simulação"
              value={
                state.automation.simulationMode
                  ? "ATIVO"
                  : "DESATIVADO"
              }
            />

            <Security
              title="Compras reais"
              value={
                state.automation.realPurchasesEnabled
                  ? "ATIVAS"
                  : "BLOQUEADAS"
              }
            />

            <Security
              title="Anúncios reais"
              value={
                state.automation.realAdsEnabled
                  ? "ATIVOS"
                  : "BLOQUEADOS"
              }
            />

            <Security
              title="Pagamentos"
              value={
                state.automation.automaticPaymentsEnabled
                  ? "ATIVOS"
                  : "BLOQUEADOS"
              }
            />

            <Security
              title="Levantamentos"
              value="BLOQUEADOS"
            />
          </section>
        </div>

        <section className="panel finance">
          <h2>📊 Visão financeira</h2>
          <p>Dados simulados partilhados pelo Autopilot.</p>

          <div className="finance-grid">
            <Finance
              title="Receita"
              value={`${metrics.revenue.toLocaleString(
                "pt-PT"
              )} MT`}
            />

            <Finance
              title="Custos"
              value={`${metrics.costs.toLocaleString(
                "pt-PT"
              )} MT`}
            />

            <Finance
              title="Lucro"
              value={`${metrics.profit.toLocaleString(
                "pt-PT"
              )} MT`}
            />

            <Finance
              title="ROAS"
              value={`${metrics.roas.toFixed(2)}x`}
            />
          </div>
        </section>

        <div className="footer">
          AI Business Autopilot • Private System • Simulation Mode
        </div>
      </section>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .dashboard {
          min-height: 100vh;
          display: flex;
          background:
            radial-gradient(
              circle at top right,
              #172554,
              #09090b 40%,
              #020617
            );
          color: #f8fafc;
          font-family: Arial, sans-serif;
        }

        .sidebar {
          width: 250px;
          min-height: 100vh;
          padding: 22px 15px;
          background: rgba(15, 23, 42, 0.92);
          border-right: 1px solid rgba(255,255,255,.08);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 11px;
          margin-bottom: 28px;
        }

        .logo {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 13px;
          background: linear-gradient(135deg,#22d3ee,#6366f1);
          font-weight: 900;
          box-shadow: 0 8px 30px rgba(34,211,238,.2);
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
          gap: 5px;
        }

        nav button {
          border: 1px solid transparent;
          border-radius: 10px;
          padding: 11px;
          background: transparent;
          color: #cbd5e1;
          text-align: left;
          cursor: pointer;
          font-size: 13px;
        }

        nav button span {
          margin-right: 10px;
        }

        nav button:hover,
        nav button.active {
          background: rgba(34,211,238,.1);
          border-color: rgba(34,211,238,.2);
          color: #67e8f9;
        }

        .safe {
          margin-top: 25px;
          padding: 14px;
          border-radius: 13px;
          background: rgba(34,197,94,.07);
          border: 1px solid rgba(34,197,94,.15);
        }

        .safe strong,
        .safe small {
          display: block;
          margin-top: 6px;
        }

        .safe small {
          color: #64748b;
        }

        .content {
          flex: 1;
          width: 100%;
          max-width: 1400px;
          padding: 30px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          align-items: flex-start;
          margin-bottom: 25px;
        }

        .eyebrow {
          color: #22d3ee;
          font-size: 10px;
          font-weight: bold;
          letter-spacing: 2px;
        }

        h1 {
          font-size: clamp(28px,5vw,44px);
          margin: 8px 0;
          letter-spacing: -1px;
        }

        h2 {
          margin: 0;
          font-size: 18px;
        }

        p {
          color: #94a3b8;
        }

        .online {
          padding: 9px 13px;
          border-radius: 999px;
          color: #86efac;
          background: rgba(34,197,94,.08);
          border: 1px solid rgba(34,197,94,.16);
          font-size: 11px;
          white-space: nowrap;
        }

        .banner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          padding: 17px;
          margin-bottom: 18px;
          border-radius: 17px;
          background: linear-gradient(
            135deg,
            rgba(34,211,238,.1),
            rgba(99,102,241,.08)
          );
          border: 1px solid rgba(34,211,238,.14);
        }

        .banner p {
          margin: 5px 0 0;
          font-size: 12px;
        }

        .banner > span {
          color: #fde68a;
          background: rgba(250,204,21,.1);
          border-radius: 999px;
          padding: 8px 12px;
          font-size: 10px;
          font-weight: bold;
        }

        .cards {
          display: grid;
          grid-template-columns: repeat(auto-fit,minmax(170px,1fr));
          gap: 12px;
          margin-bottom: 18px;
        }

        .card,
        .panel {
          background: rgba(15,23,42,.85);
          border: 1px solid rgba(255,255,255,.07);
          box-shadow: 0 18px 50px rgba(0,0,0,.14);
        }

        .card {
          padding: 17px;
          border-radius: 17px;
        }

        .card-icon {
          font-size: 20px;
        }

        .card-title {
          color: #64748b;
          font-size: 11px;
          margin: 10px 0 5px;
        }

        .card-value {
          font-size: 20px;
          font-weight: bold;
        }

        .card-note {
          color: #475569;
          display: block;
          margin-top: 5px;
          font-size: 10px;
        }

        .main-grid {
          display: grid;
          grid-template-columns: minmax(0,2fr) minmax(280px,1fr);
          gap: 17px;
        }

        .panel {
          padding: 20px;
          border-radius: 19px;
        }

        .panel-head {
          display: flex;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 17px;
        }

        .panel-head p,
        .finance > p {
          margin: 5px 0 0;
          font-size: 12px;
        }

        .badge {
          color: #fde68a;
          font-size: 9px;
          padding: 7px 10px;
          border-radius: 999px;
          background: rgba(250,204,21,.08);
          height: fit-content;
        }

        .agents {
          display: grid;
          gap: 7px;
        }

        .agent {
          display: flex;
          align-items: center;
          gap: 11px;
          width: 100%;
          padding: 11px;
          border: 1px solid rgba(255,255,255,.05);
          border-radius: 11px;
          background: rgba(30,41,59,.5);
          color: white;
          text-align: left;
          cursor: pointer;
        }

        .agent:hover {
          background: rgba(34,211,238,.08);
        }

        .agent-icon {
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          background: rgba(255,255,255,.06);
        }

        .agent-text {
          flex: 1;
        }

        .agent-text strong,
        .agent-text small {
          display: block;
        }

        .agent-text small {
          color: #64748b;
          margin-top: 3px;
          font-size: 10px;
        }

        .agent b {
          color: #86efac;
          font-size: 9px;
        }

        .finance {
          margin-top: 17px;
        }

        .finance-grid {
          display: grid;
          grid-template-columns: repeat(4,1fr);
          gap: 10px;
          margin-top: 15px;
        }

        .finance-grid > div {
          padding: 14px;
          border-radius: 12px;
          background: rgba(30,41,59,.55);
        }

        .finance-grid span {
          color: #64748b;
          font-size: 10px;
        }

        .finance-grid strong {
          display: block;
          margin-top: 7px;
          font-size: 17px;
        }

        .security-row {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255,255,255,.05);
          font-size: 12px;
        }

        .security-row strong {
          color: #86efac;
          font-size: 9px;
        }

        .footer {
          text-align: center;
          color: #475569;
          padding: 24px 5px 5px;
          font-size: 10px;
        }

        @media (max-width: 900px) {
          .main-grid {
            grid-template-columns: 1fr;
          }

          .sidebar {
            width: 210px;
          }

          .finance-grid {
            grid-template-columns: repeat(2,1fr);
          }
        }

        @media (max-width: 700px) {
          .dashboard {
            display: block;
          }

          .sidebar {
            width: 100%;
            min-height: auto;
            border-right: none;
            border-bottom: 1px solid rgba(255,255,255,.08);
          }

          nav {
            display: flex;
            overflow-x: auto;
            padding-bottom: 5px;
          }

          nav button {
            min-width: 120px;
          }

          .safe {
            margin-top: 15px;
          }

          .content {
            padding: 18px 14px;
          }

          .header {
            display: block;
          }

          .online {
            display: inline-block;
            margin-top: 12px;
          }

          .banner {
            display: block;
          }

          .banner > span {
            display: inline-block;
            margin-top: 12px;
          }

          .finance-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 430px) {
          .cards {
            grid-template-columns: 1fr 1fr;
          }

          .finance-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}

function Card({
  icon,
  title,
  value,
  note,
}: {
  icon: string;
  title: string;
  value: string;
  note: string;
}) {
  return (
    <div className="card">
      <div className="card-icon">{icon}</div>
      <div className="card-title">{title}</div>
      <div className="card-value">{value}</div>
      <small className="card-note">{note}</small>
    </div>
  );
}

function Security({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="security-row">
      <span>{title}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Finance({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div>
      <span>{title}</span>
      <strong>{value}</strong>
    </div>
  );
}