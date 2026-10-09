
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

        <nav aria-label="Menu principal">
          {menu.map(([icon, name, path], index) => (
            <button
              key={path}
              type="button"
              onClick={() => router.push(path)}
              className={index === 0 ? "nav-link active" : "nav-link"}
              aria-current={index === 0 ? "page" : undefined}
            >
              <span className="nav-icon">{icon}</span>
              <span>{name}</span>
            </button>
          ))}
        </nav>

        <div className="safe">
          <span className="safe-dot" />
          <div>
            <strong>Modo simulação</strong>
            <small>Ações reais bloqueadas</small>
          </div>
        </div>
      </aside>

      <section className="content">
        <header className="header">
          <div className="heading">
            <span className="eyebrow">PRIVATE AI SYSTEM</span>
            <h1>AI Business Autopilot</h1>
            <p>Centro de controlo do teu sistema de automação.</p>
          </div>
          <div className="online">
            <span /> Sistema online
          </div>
        </header>

        <section className="banner">
          <div className="banner-icon">🛡️</div>
          <div className="banner-copy">
            <strong>Ambiente seguro de testes</strong>
            <p>
              O Autopilot está em modo de simulação. As operações reais
              permanecem bloqueadas.
            </p>
          </div>
          <span className="simulation-tag">SIMULAÇÃO ATIVA</span>
        </section>

        <section className="cards" aria-label="Indicadores principais">
          <Card
            icon="💰"
            title="Receita"
            value={`${metrics.revenue.toLocaleString("pt-PT")} MT`}
            note="Valor simulado"
          />
          <Card
            icon="📦"
            title="Produtos"
            value={String(state.products.length)}
            note="No sistema"
          />
          <Card
            icon="📢"
            title="Campanhas"
            value={String(state.campaigns.length)}
            note="Registadas"
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
              state.automation.simulationMode ? "SIMULAÇÃO" : "ATIVA"
            }
            note="Estado do sistema"
          />
        </section>

        <div className="main-grid">
          <section className="panel">
            <div className="panel-head">
              <div>
                <h2>Centro de atividade</h2>
                <p>Acede rapidamente aos módulos do Autopilot.</p>
              </div>
              <span className="badge">12 MÓDULOS</span>
            </div>

            <div className="agents">
              {menu.slice(1).map(([icon, name, path]) => (
                <button
                  key={path}
                  type="button"
                  className="agent"
                  onClick={() => router.push(path)}
                >
                  <span className="agent-icon">{icon}</span>
                  <span className="agent-text">
                    <strong>{name}</strong>
                    <small>Abrir módulo</small>
                  </span>
                  <span className="agent-arrow" aria-hidden="true">›</span>
                </button>
              ))}
            </div>
          </section>

          <section className="panel security-panel">
            <div className="panel-head">
              <div>
                <h2>🛡️ Segurança</h2>
                <p>Estado das operações protegidas.</p>
              </div>
            </div>

            <Security
              title="Modo simulação"
              value={state.automation.simulationMode ? "ATIVO" : "DESATIVADO"}
              safe={state.automation.simulationMode}
            />
            <Security
              title="Compras reais"
              value={state.automation.realPurchasesEnabled ? "ATIVAS" : "BLOQUEADAS"}
              safe={!state.automation.realPurchasesEnabled}
            />
            <Security
              title="Anúncios reais"
              value={state.automation.realAdsEnabled ? "ATIVOS" : "BLOQUEADOS"}
              safe={!state.automation.realAdsEnabled}
            />
            <Security
              title="Pagamentos automáticos"
              value={state.automation.automaticPaymentsEnabled ? "ATIVOS" : "BLOQUEADOS"}
              safe={!state.automation.automaticPaymentsEnabled}
            />
            <Security title="Levantamentos" value="BLOQUEADOS" safe />

            <div className="security-note">
              Não atives operações reais antes de concluir os testes.
            </div>
          </section>
        </div>

        <section className="panel finance">
          <div className="panel-head">
            <div>
              <h2>📊 Visão financeira</h2>
              <p>Indicadores fornecidos pelo Autopilot.</p>
            </div>
            <span className="badge">DADOS DO SISTEMA</span>
          </div>

          <div className="finance-grid">
            <Finance
              title="Receita"
              value={`${metrics.revenue.toLocaleString("pt-PT")} MT`}
            />
            <Finance
              title="Custos"
              value={`${metrics.costs.toLocaleString("pt-PT")} MT`}
            />
            <Finance
              title="Lucro"
              value={`${metrics.profit.toLocaleString("pt-PT")} MT`}
            />
            <Finance
              title="ROAS"
              value={`${metrics.roas.toFixed(2)}x`}
            />
          </div>
          <p className="finance-disclaimer">
            Os valores não representam receita real confirmada.
          </p>
        </section>

        <footer className="footer">
          AI Business Autopilot <span>•</span> Sistema privado
          <span>•</span> Modo de simulação
        </footer>
      </section>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .dashboard {
          --bg: #080d19;
          --panel: #101a2c;
          --border: rgba(148, 163, 184, 0.14);
          --muted: #94a3b8;
          --cyan: #67e8f9;
          min-height: 100vh;
          display: flex;
          color: #f8fafc;
          background:
            radial-gradient(ellipse at 90% 0%, rgba(30, 64, 175, .2), transparent 38%),
            var(--bg);
          font-family: Arial, Helvetica, sans-serif;
        }

        .sidebar {
          flex: 0 0 244px;
          width: 244px;
          min-height: 100vh;
          padding: 22px 14px;
          background: rgba(12, 20, 35, .96);
          border-right: 1px solid var(--border);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 11px;
          margin: 0 4px 28px;
        }

        .logo {
          flex: 0 0 44px;
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          background: linear-gradient(135deg, #22d3ee, #6366f1);
          color: #07111f;
          font-weight: 900;
          box-shadow: 0 8px 28px rgba(34, 211, 238, .17);
        }

        .brand strong, .brand span { display: block; }
        .brand strong { font-size: 15px; }
        .brand span { margin-top: 4px; color: var(--muted); font-size: 12px; }

        nav { display: grid; gap: 5px; }

        .nav-link {
          width: 100%;
          min-height: 43px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          border: 1px solid transparent;
          border-radius: 10px;
          background: transparent;
          color: #cbd5e1;
          text-align: left;
          font-size: 13px;
          cursor: pointer;
        }

        .nav-icon { width: 22px; text-align: center; }
        .nav-link:hover, .nav-link.active {
          background: rgba(34, 211, 238, .09);
          border-color: rgba(34, 211, 238, .2);
          color: var(--cyan);
        }

        .safe {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-top: 24px;
          padding: 13px 10px;
          border: 1px solid rgba(34, 197, 94, .2);
          border-radius: 12px;
          background: rgba(34, 197, 94, .06);
        }

        .safe-dot, .online span {
          flex: 0 0 8px;
          width: 8px;
          height: 8px;
          margin-top: 4px;
          border-radius: 50%;
          background: #4ade80;
        }

        .safe strong, .safe small { display: block; }
        .safe strong { font-size: 12px; }
        .safe small { margin-top: 5px; color: var(--muted); font-size: 10px; }

        .content {
          flex: 1;
          min-width: 0;
          width: 0;
          max-width: 1500px;
          margin: 0 auto;
          padding: 30px clamp(16px, 2.5vw, 36px);
        }

        .header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 23px;
        }

        .heading { min-width: 0; }
        .eyebrow {
          color: var(--cyan);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2px;
        }

        h1 {
          max-width: 100%;
          margin: 9px 0;
          font-size: clamp(25px, 3.1vw, 42px);
          line-height: 1.12;
          letter-spacing: -1.2px;
          overflow-wrap: anywhere;
        }

        h2 { margin: 0; font-size: 17px; line-height: 1.4; }
        p { color: var(--muted); line-height: 1.55; }
        .heading p { margin: 8px 0 0; font-size: 13px; }

        .online {
          flex: 0 0 auto;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 12px;
          border: 1px solid rgba(34, 197, 94, .2);
          border-radius: 999px;
          background: rgba(34, 197, 94, .06);
          color: #86efac;
          font-size: 11px;
          white-space: nowrap;
        }

        .online span { margin: 0; }

        .banner {
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 17px;
          margin-bottom: 17px;
          border: 1px solid rgba(34, 211, 238, .17);
          border-radius: 15px;
          background: linear-gradient(115deg, rgba(34, 211, 238, .08), rgba(99, 102, 241, .07));
        }

        .banner-icon { font-size: 24px; }
        .banner-copy { flex: 1; min-width: 0; }
        .banner-copy strong { font-size: 13px; }
        .banner-copy p { margin: 5px 0 0; font-size: 12px; }
        .simulation-tag, .badge {
          flex: 0 0 auto;
          align-self: center;
          padding: 7px 9px;
          border-radius: 999px;
          background: rgba(250, 204, 21, .08);
          color: #fde68a;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: .3px;
        }

        .cards {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 17px;
        }

        .card, .panel {
          min-width: 0;
          border: 1px solid var(--border);
          background: rgba(16, 26, 44, .9);
          box-shadow: 0 12px 35px rgba(0, 0, 0, .12);
        }

        .card { padding: 16px; border-radius: 15px; }
        .card-icon { font-size: 21px; }
        .card-title { margin: 12px 0 6px; color: var(--muted); font-size: 11px; }
        .card-value { font-size: clamp(16px, 1.7vw, 22px); font-weight: 700; overflow-wrap: anywhere; }
        .card-note { display: block; margin-top: 7px; color: #64748b; font-size: 10px; }

        .main-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.7fr) minmax(250px, 1fr);
          align-items: start;
          gap: 16px;
        }

        .panel { padding: 19px; border-radius: 17px; }
        .panel-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 16px;
        }

        .panel-head p { margin: 5px 0 0; font-size: 12px; }
        .agents { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }

        .agent {
          display: flex;
          align-items: center;
          gap: 9px;
          width: 100%;
          min-width: 0;
          min-height: 62px;
          padding: 10px;
          border: 1px solid rgba(148, 163, 184, .1);
          border-radius: 11px;
          background: rgba(30, 41, 59, .45);
          color: white;
          text-align: left;
          cursor: pointer;
        }

        .agent:hover { border-color: rgba(34, 211, 238, .3); background: rgba(34, 211, 238, .06); }
        .agent-icon {
          flex: 0 0 34px;
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border-radius: 9px;
          background: rgba(255, 255, 255, .05);
        }

        .agent-text { flex: 1; min-width: 0; }
        .agent-text strong, .agent-text small { display: block; overflow-wrap: anywhere; }
        .agent-text strong { font-size: 11px; }
        .agent-text small { margin-top: 4px; color: var(--muted); font-size: 10px; }
        .agent-arrow { color: var(--cyan); font-size: 20px; }

        .security-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
          padding: 13px 0;
          border-bottom: 1px solid rgba(148, 163, 184, .1);
          font-size: 12px;
        }

        .security-row span { min-width: 0; color: #cbd5e1; }
        .security-row strong { flex: 0 0 auto; font-size: 9px; text-align: right; }
        .security-row strong.safe-value { color: #86efac; }
        .security-row strong.warning-value { color: #fbbf24; }
        .security-note {
          margin-top: 14px;
          padding: 11px;
          border-radius: 10px;
          background: rgba(250, 204, 21, .05);
          color: #cbd5e1;
          font-size: 11px;
          line-height: 1.5;
        }

        .finance { margin-top: 16px; }
        .finance-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px;
          margin-top: 16px;
        }

        .finance-grid > div {
          min-width: 0;
          padding: 14px;
          border: 1px solid rgba(148, 163, 184, .08);
          border-radius: 11px;
          background: rgba(30, 41, 59, .4);
        }

        .finance-grid span { color: var(--muted); font-size: 11px; }
        .finance-grid strong { display: block; margin-top: 8px; font-size: clamp(15px, 1.8vw, 19px); overflow-wrap: anywhere; }
        .finance-disclaimer { margin: 13px 0 0; font-size: 10px; }
        .footer { padding: 22px 5px 5px; color: #64748b; text-align: center; font-size: 10px; line-height: 1.8; }
        .footer span { padding: 0 5px; color: #475569; }

        @media (max-width: 1150px) {
          .sidebar { flex-basis: 215px; width: 215px; }
          .content { padding: 24px 18px; }
          .cards { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          .main-grid { grid-template-columns: minmax(0, 1.3fr) minmax(230px, 1fr); }
          .agents { grid-template-columns: 1fr; }
        }

        @media (max-width: 800px) {
          .dashboard { display: block; }
          .sidebar {
            width: 100%;
            min-height: 0;
            padding: 14px;
            border-right: 0;
            border-bottom: 1px solid var(--border);
          }

          .brand { margin-bottom: 14px; }
          nav {
            display: flex;
            gap: 7px;
            overflow-x: auto;
            padding: 2px 0 8px;
            scrollbar-width: thin;
          }

          .nav-link { flex: 0 0 auto; width: auto; min-height: 40px; white-space: nowrap; }
          .safe { margin-top: 9px; padding: 10px; }
          .content { width: 100%; padding: 20px 14px; }
          .main-grid { grid-template-columns: 1fr; }
          .agents { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .header { gap: 12px; }
        }

        @media (max-width: 520px) {
          .content { padding: 18px 12px; }
          .header { display: block; }
          h1 { font-size: clamp(25px, 7vw, 32px); letter-spacing: -.7px; }
          .heading p { font-size: 12px; }
          .online { margin-top: 13px; }
          .banner { align-items: flex-start; flex-wrap: wrap; padding: 14px; }
          .banner-copy { flex-basis: calc(100% - 42px); }
          .simulation-tag { margin-left: 37px; }
          .cards { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 9px; }
          .card { padding: 13px; }
          .card-value { font-size: clamp(15px, 4.4vw, 20px); }
          .panel { padding: 14px; }
          .agents { grid-template-columns: 1fr; }
          .finance-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .finance-grid > div { padding: 12px; }
          .panel-head { gap: 8px; }
          .badge { font-size: 8px; }
        }

        @media (prefers-reduced-motion: no-preference) {
          .nav-link, .agent { transition: background .15s ease, border-color .15s ease; }
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
    <article className="card">
      <div className="card-icon">{icon}</div>
      <div className="card-title">{title}</div>
      <div className="card-value">{value}</div>
      <small className="card-note">{note}</small>
    </article>
  );
}

function Security({
  title,
  value,
  safe,
}: {
  title: string;
  value: string;
  safe: boolean;
}) {
  return (
    <div className="security-row">
      <span>{title}</span>
      <strong className={safe ? "safe-value" : "warning-value"}>{value}</strong>
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
