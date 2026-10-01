"use client";

import { useAutopilot } from "../context/autopilot-context";

export default function SupervisorPage() {
  const { state, metrics } = useAutopilot();

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "#ffffff",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <p style={{ color: "#22d3ee", fontWeight: "bold" }}>
          AI BUSINESS AUTOPILOT
        </p>

        <h1>Supervisor AI</h1>

        <p style={{ color: "#94a3b8" }}>
          Centro de supervisão, segurança e controlo do sistema.
        </p>

        <section
          style={{
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: "16px",
            padding: "20px",
            marginTop: "20px",
          }}
        >
          <h2>Estado do sistema</h2>

          <Card title="Produtos" value={String(state.products.length)} />
          <Card title="Campanhas" value={String(state.campaigns.length)} />
          <Card title="Pedidos" value={String(state.orders.length)} />
          <Card title="Receita" value={`${metrics.revenue.toFixed(2)} MT`} />
          <Card title="Custos" value={`${metrics.costs.toFixed(2)} MT`} />
          <Card title="Lucro" value={`${metrics.profit.toFixed(2)} MT`} />
          <Card title="ROAS" value={metrics.roas.toFixed(2)} />
        </section>

        <section
          style={{
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: "16px",
            padding: "20px",
            marginTop: "20px",
          }}
        >
          <h2>Segurança</h2>

          <Status
            title="Modo simulação"
            value={
              state.automation.simulationMode ? "ATIVO" : "DESATIVADO"
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
              state.automation.realAdsEnabled ? "ATIVO" : "BLOQUEADO"
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

          <Status title="Levantamentos" value="BLOQUEADO" />
        </section>

        <section
          style={{
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: "16px",
            padding: "20px",
            marginTop: "20px",
          }}
        >
          <h2>Supervisor</h2>

          <p style={{ color: "#22c55e" }}>
            Sistema protegido.
          </p>

          <p style={{ color: "#22c55e" }}>
            Operações financeiras reais bloqueadas.
          </p>

          <p style={{ color: "#22c55e" }}>
            Publicação de anúncios reais bloqueada.
          </p>

          <p style={{ color: "#22c55e" }}>
            Compras reais bloqueadas.
          </p>
        </section>
      </div>
    </main>
  );
}

function Card({
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
        borderRadius: "12px",
        padding: "16px",
        marginTop: "12px",
      }}
    >
      <span style={{ color: "#94a3b8" }}>{title}</span>

      <strong
        style={{
          display: "block",
          marginTop: "6px",
          fontSize: "20px",
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
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "14px",
        marginTop: "10px",
        background: "#1e293b",
        borderRadius: "10px",
      }}
    >
      <span style={{ color: "#cbd5e1" }}>{title}</span>

      <strong style={{ color: "#22c55e" }}>{value}</strong>
    </div>
  );
}