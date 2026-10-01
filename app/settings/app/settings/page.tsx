"use client";

import { useAutopilot } from "../../../context/autopilot-context";

export default function SettingsPage() {
  const { state } = useAutopilot();

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

        <h1>⚙️ Configurações</h1>

        <p style={{ color: "#94a3b8" }}>
          Configurações e segurança do sistema.
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
          <h2>🛡️ Segurança</h2>

          <div
            style={{
              background: "#451a03",
              border: "1px solid #92400e",
              borderRadius: 12,
              padding: 16,
              marginTop: 15,
            }}
          >
            ⚠️ MODO SIMULAÇÃO ATIVO
          </div>

          <p style={{ color: "#94a3b8" }}>
            Compras, pagamentos, anúncios reais e levantamentos continuam
            bloqueados.
          </p>
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
            title="Modo"
            value="SIMULAÇÃO"
          />

          <InfoCard
            title="Compras reais"
            value="BLOQUEADAS"
          />

          <InfoCard
            title="Pagamentos"
            value="BLOQUEADOS"
          />

          <InfoCard
            title="Levantamentos"
            value="BLOQUEADOS"
          />
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