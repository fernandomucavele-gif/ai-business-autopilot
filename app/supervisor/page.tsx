"use client";

import { useAutopilot } from "../context/autopilot-context";

export default function SupervisorPage() {
  const { state, metrics } = useAutopilot();

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "#fff",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <p style={{ color: "#22d3ee", fontWeight: "bold" }}>
          AI BUSINESS AUTOPILOT
        </p>

        <h1>🧠 Supervisor AI</h1>

        <p style={{ color: "#94a3b8" }}>
          Centro de supervisão, segurança e controlo do sistema.
        </p>

        <section
          style={{
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: 16,
            padding: 20,
            marginTop: 20,
          }}
        >
          <h2>📊 Estado do sistema</h2>

          <InfoCard
            title="Produtos"
            value={String(state.products.length)}
          />

          <InfoCard
            title="Campanhas"
            value={String(state.campaigns.length)}
          />

          <InfoCard
            title="Pedidos"
            value={String(state.orders.length)}
          />

          <InfoCard
            title="Receita"
            value={`${metrics.revenue.toFixed(2)} MT`}
          />

          <InfoCard
            title="Custos"
            value={`${metrics.costs.toFixed(2)} MT`}
          />

          <InfoCard
            title="Lucro"
            value={`${metrics.profit.toFixed(2)} MT`}
          />

          <InfoCard
            title="ROAS"
            value={metrics.roas.toFixed(2)}
          />
        </section>

        <section
          style={{
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: 16,
            padding: 20,
            marginTop: 20,
          }}
        >
          <h2>🛡️ Segurança</h2>

          <Status
            title="Modo simulação"
            value={
              state.automation.simulationMode
                ? "ATIVO"
                : "DESATIVADO"
            }
          />

          <Status
            title="Compras reais"
            value={
              state.automation.realPurchasesEnabled
                ? "ATIVO"
                : "BLOQUEADO"
            }
          />

          <Status
            title="Anúncios reais"
            value={
              state.automation.realAdsEnabled
                ? "ATIVO"
                : "BLOQUEADO"
            }
          />

          <Status
            title="Pagamentos automáticos"
            value={
              state.automation.automaticPaymentsEnabled
                ? "ATIVO"
                : "BLOQUEADO"
            }
          />

          <Status
            title="Levantamentos"
            value="BLOQUEADO"
          />
        </section>

        <section
          style={{
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: 16,
            padding: 20,
            marginTop: 20,
          }}
        >
          <h2>🤖 Supervisor</h2>

          <p style={{ color: "#94a3b8" }}>
            O Supervisor AI está a monitorizar o sistema
            em modo de simulação.
          </p>

          <p style={{ color: "#22c55e" }}>
            ✓ Sistema protegido
          </p>

          <p style={{ color: "#22c55e" }}>
            ✓ Operações financeiras reais bloqueadas
          </p>

          <p style={{ color: "#22c55e" }}>
            ✓ Publicação de anúncios reais bloqueada
          </p>

          <p style={{ color: "#22c55e" }}>
            ✓ Compras reais bloqueadas
          </p>
        </section>
      </div>
    </main>
  );
}

function InfoCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div
      style={{
        background: "#1e293b",
        borderRadius: 12,
        padding: 16,
        marginTop: 12,
      }}
    >
      <span style={{ color: "#94a3b8" }}>
        {title}
      </span>

      <strong
        style={{
          display: "block",
          marginTop: 6,
          fontSize: 20,
        }}
      >
        {value}
      </strong>
    </div>
  );
}

function Status({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  const blocked = value === "BLOQUEADO";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
        padding: 14,
        marginTop: 10,
        background: "#1e293b",
        borderRadius: 10,
      }}
    >
      <span style={{ color: "#cbd5e1" }}>
        {title}
      </span>

      <strong
        style={{
          color: blocked ? "#22c55e" : "#fbbf24",
        }}
      >
        {value}
      </strong>
    </div>
  );
}