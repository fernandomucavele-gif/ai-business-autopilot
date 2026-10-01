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
          {menu.map(([icon, name, path]) => (
            <button
              key={name}
              onClick={() => router.push(path)}
              style={{
                width: "100%",
                border: "none",
                cursor: "pointer",
              }}
            >
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
            <p className="eyebrow">
              PRIVATE AI SYSTEM
            </p>

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

            <strong>
              {metrics.revenue.toLocaleString("pt-PT")} MT
            </strong>

            <small>Modo simulação</small>
          </div>

          <div className="card">
            <span>📦 Produtos</span>

            <strong>
              {state.products.length}
            </strong>

            <small>
              Produtos pesquisados
            </small>
          </div>

          <div className="card">
            <span>📢 Campanhas</span>

            <strong>
              {state.campaigns.length}
            </strong>

            <small>
              Campanhas criadas
            </small>
          </div>

          <div className="card">
            <span>🛒 Pedidos</span>

            <strong>
              {state.orders.length}
            </strong>

            <small>
              Pedidos registados
            </small>
          </div>

          <div className="card">
            <span>⚡ Automação</span>

            <strong>
              {state.automation.simulationMode
                ? "SIMULAÇÃO"
                : "ATIVA"}
            </strong>

            <small>
              Ações reais bloqueadas
            </small>
          </div>
        </div>

        <div className="grid">
          <section className="panel large">
            <div className="panel-title">
              <div>
                <h2>
                  Centro de atividade
                </h2>

                <p>
                  Estado atual dos agentes do Autopilot.
                </p>
              </div>

              <span className="badge">
                SIMULAÇÃO
              </span>
            </div>

            <div className="agents">
              {menu.slice(1).map(
                ([icon, name, path]) => (
                  <button
                    className="agent"
                    key={name}
                    onClick={() =>
                      router.push(path)
                    }
                    style={{
                      border: "none",
                      width: "100%",
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    <span className="agent-icon">
                      {icon}
                    </span>

                    <div>
                      <strong>
                        {name}
                      </strong>

                      <small>
                        Disponível para execução
                      </small>
                    </div>

                    <b>READY</b>
                  </button>
                )
              )}
            </div>
          </section>

          <section className="panel">
            <h2>Segurança</h2>

            <div className="security">
              <div>
                🛡️
                <strong>
                  {" "}
                  Modo simulação
                </strong>

                <small>
                  {state.automation
                    .simulationMode
                    ? " ATIVO"
                    : " DESATIVADO"}
                </small>
              </div>

              <div>
                🛒
                <strong>
                  {" "}
                  Compras reais
                </strong>

                <small>
                  {state.automation
                    .realPurchasesEnabled
                    ? " ATIVAS"
                    : " BLOQUEADAS"}
                </small>
              </div>

              <div>
                📢
                <strong>
                  {" "}
                  Anúncios reais
                </strong>

                <small>
                  {state.automation
                    .realAdsEnabled
                    ? " ATIVOS"
                    : " BLOQUEADOS"}
                </small>
              </div>

              <div>
                💳
                <strong>
                  {" "}
                  Pagamentos
                </strong>

                <small>
                  {state.automation
                    .automaticPaymentsEnabled
                    ? " ATIVOS"
                    : " BLOQUEADOS"}
                </small>
              </div>

              <div>
                💸
                <strong>
                  {" "}
                  Levantamentos
                </strong>

                <small>
                  {" "}
                  BLOQUEADOS
                </small>
              </div>
            </div>
          </section>
        </div>

        <section className="panel metrics-panel">
          <div className="panel-title">
            <div>
              <h2>
                📊 Visão financeira
              </h2>

              <p>
                Dados partilhados entre os módulos do Autopilot.
              </p>
            </div>
          </div>

          <div className="finance-grid">
            <div>
              <span>Receita</span>

              <strong>
                {metrics.revenue.toLocaleString(
                  "pt-PT"
                )}{" "}
                MT
              </strong>
            </div>

            <div>
              <span>Custos</span>

              <strong>
                {metrics.costs.toLocaleString(
                  "pt-PT"
                )}{" "}
                MT
              </strong>
            </div>

            <div>
              <span>Lucro</span>

              <strong>
                {metrics.profit.toLocaleString(
                  "pt-PT"
                )}{" "}
                MT
              </strong>
            </div>

            <div>
              <span>ROAS</span>

              <strong>
                {metrics.roas.toFixed(2)}x
              </strong>
            </div>
          </div>
        </section>

        <section className="panel warning">
          <h2>
            🔒 Proteção do sistema
          </h2>

          <p>
            O AI Business Autopilot está atualmente em{" "}
            <strong>
              modo de simulação
            </strong>.
          </p>

          <p>
            Compras reais, publicação de anúncios,
            pagamentos automáticos e levantamentos
            permanecem bloqueados.
          </p>
        </section>
      </section>
    </main>
  );
}