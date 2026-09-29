"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [simulationMode, setSimulationMode] = useState(true);
  const [realPurchases, setRealPurchases] = useState(false);
  const [realAds, setRealAds] = useState(false);
  const [automaticPayments, setAutomaticPayments] = useState(false);
  const [automaticWithdrawals, setAutomaticWithdrawals] = useState(false);

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
        <p
          style={{
            color: "#22d3ee",
            fontSize: "13px",
            fontWeight: "bold",
          }}
        >
          AI BUSINESS AUTOPILOT
        </p>

        <h1 style={{ fontSize: "34px", marginBottom: "8px" }}>
          ⚙️ Configurações
        </h1>

        <p style={{ color: "#94a3b8", marginBottom: "28px" }}>
          Controla o funcionamento e a segurança do teu Autopilot.
        </p>

        <section
          style={{
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: "16px",
            padding: "22px",
            marginBottom: "20px",
          }}
        >
          <h2>🛡️ Segurança</h2>

          <p style={{ color: "#94a3b8" }}>
            O sistema está protegido para testes. As ações reais permanecem
            desativadas.
          </p>

          <div
            style={{
              background: "#451a03",
              border: "1px solid #92400e",
              borderRadius: "12px",
              padding: "15px",
              marginTop: "15px",
            }}
          >
            ⚠️ MODO SIMULAÇÃO ATIVO
          </div>
        </section>

        <section
          style={{
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: "16px",
            padding: "22px",
            marginBottom: "20px",
          }}
        >
          <h2>🤖 Automação</h2>

          <Setting
            title="Modo simulação"
            description="Permite testar o sistema sem executar ações reais."
            enabled={simulationMode}
            onChange={setSimulationMode}
            locked={false}
          />

          <Setting
            title="Compras automáticas"
            description="Permitir que o sistema faça compras reais."
            enabled={realPurchases}
            onChange={setRealPurchases}
            locked={true}
          />

          <Setting
            title="Publicação de anúncios reais"
            description="Permitir publicação real de campanhas."
            enabled={realAds}
            onChange={setRealAds}
            locked={true}
          />

          <Setting
            title="Pagamentos automáticos"
            description="Permitir pagamentos automáticos reais."
            enabled={automaticPayments}
            onChange={setAutomaticPayments}
            locked={true}
          />

          <Setting
            title="Levantamentos automáticos"
            description="Permitir levantamentos automáticos de dinheiro."
            enabled={automaticWithdrawals}
            onChange={setAutomaticWithdrawals}
            locked={true}
          />
        </section>

        <section
          style={{
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: "16px",
            padding: "22px",
          }}
        >
          <h2>📊 Estado do sistema</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "12px",
              marginTop: "16px",
            }}
          >
            <Status title="Sistema" value="ONLINE" />
            <Status title="Modo" value="SIMULAÇÃO" />
            <Status title="Compras reais" value="BLOQUEADAS" />
            <Status title="Anúncios reais" value="BLOQUEADOS" />
            <Status title="Pagamentos" value="BLOQUEADOS" />
            <Status title="Levantamentos" value="BLOQUEADOS" />
          </div>
        </section>
      </div>
    </main>
  );
}

function Setting({
  title,
  description,
  enabled,
  onChange,
  locked,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
  locked: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "20px",
        padding: "18px 0",
        borderBottom: "1px solid #1e293b",
      }}
    >
      <div>
        <strong>{title}</strong>

        <p
          style={{
            color: "#94a3b8",
            margin: "6px 0 0",
            fontSize: "14px",
          }}
        >
          {description}
        </p>
      </div>

      <button
        disabled={locked}
        onClick={() => onChange(!enabled)}
        style={{
          minWidth: "90px",
          padding: "10px 14px",
          borderRadius: "10px",
          border: "none",
          cursor: locked ? "not-allowed" : "pointer",
          background: locked
            ? "#334155"
            : enabled
            ? "#16a34a"
            : "#475569",
          color: "#ffffff",
          fontWeight: "bold",
        }}
      >
        {locked ? "BLOQUEADO" : enabled ? "ATIVO" : "OFF"}
      </button>
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
        background: "#1e293b",
        borderRadius: "12px",
        padding: "16px",
      }}
    >
      <p
        style={{
          color: "#94a3b8",
          fontSize: "13px",
          margin: "0 0 6px",
        }}
      >
        {title}
      </p>

      <strong>{value}</strong>
    </div>
  );
}
