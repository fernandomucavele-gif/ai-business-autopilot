"use client";

import { useAutopilot } from "../context/autopilot-context";

export default function SupervisorPage() {
  const { state, metrics } = useAutopilot();

  const securityItems = [
    {
      title: "Modo simulação",
      value: state.automation.simulationMode
        ? "ATIVO"
        : "DESATIVADO",
      safe: state.automation.simulationMode,
    },
    {
      title: "Compras reais",
      value: state.automation.realPurchasesEnabled
        ? "ATIVO"
        : "BLOQUEADO",
      safe: !state.automation.realPurchasesEnabled,
    },
    {
      title: "Anúncios reais",
      value: state.automation.realAdsEnabled
        ? "ATIVO"
        : "BLOQUEADO",
      safe: !state.automation.realAdsEnabled,
    },
    {
      title: "Pagamentos automáticos",
      value: state.automation.automaticPaymentsEnabled
        ? "ATIVO"
        : "BLOQUEADO",
      safe: !state.automation.automaticPaymentsEnabled,
    },
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <header
          style={{
            background: "#ffffff",
            border: "1px solid #e4e7ec",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "20px",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              color: "#101828",
            }}
          >
            Supervisor AI
          </h1>

          <p
            style={{
              margin: "8px 0 0",
              color: "#667085",
            }}
          >
            Centro de supervisão e segurança do AI
            Business Autopilot.
          </p>
        </header>

        <section
          style={{
            background: "#ffffff",
            border: "1px solid #e4e7ec",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              color: "#101828",
            }}
          >
            🧠 Estado do sistema
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
              marginTop: "18px",
            }}
          >
            <MetricCard
              title="Produtos"
              value={String(state.products.length)}
            />

            <MetricCard
              title="Campanhas"
              value={String(state.campaigns.length)}
            />

            <MetricCard
              title="Pedidos"
              value={String(state.orders.length)}
            />

            <MetricCard
              title="Receita"
              value={`${metrics.revenue.toFixed(2)} MT`}
            />

            <MetricCard
              title="Custos"
              value={`${metrics.costs.toFixed(2)} MT`}
            />

            <MetricCard
              title="Lucro"
              value={`${metrics.profit.toFixed(2)} MT`}
            />

            <MetricCard
              title="ROAS"
              value={metrics.roas.toFixed(2)}
            />
          </div>
        </section>

        <section
          style={{
            background: "#ffffff",
            border: "1px solid #e4e7ec",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              color: "#101828",
            }}
          >
            🛡️ Segurança
          </h2>

          <div
            style={{
              display: "grid",
              gap: "12px",
              marginTop: "18px",
            }}
          >
            {securityItems.map((item) => (
              <div
                key={item.title}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "16px",
                  padding: "16px",
                  borderRadius: "12px",
                  background: item.safe
                    ? "#ecfdf3"
                    : "#fef3f2",
                  border: item.safe
                    ? "1px solid #abefc6"
                    : "1px solid #fecdca",
                }}
              >
                <div>
                  <strong
                    style={{
                      display: "block",
                      color: "#101828",
                    }}
                  >
                    {item.title}
                  </strong>

                  <span
                    style={{
                      color: "#667085",
                      fontSize: "14px",
                    }}
                  >
                    Proteção contra operações reais.
                  </span>
                </div>

                <strong
                  style={{
                    color: item.safe
                      ? "#067647"
                      : "#b42318",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.value}
                </strong>
              </div>
            ))}
          </div>
        </section>

        <section
          style={{
            background: "#ffffff",
            border: "1px solid #e4e7ec",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              color: "#101828",
            }}
          >
            🤖 Ações do Supervisor
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "16px",
              marginTop: "18px",
            }}
          >
            <ActionCard
              title="Verificar produtos"
              description={`${state.products.length} produto(s) registado(s).`}
            />

            <ActionCard
              title="Verificar campanhas"
              description={`${state.campaigns.length} campanha(s) em simulação.`}
            />

            <ActionCard
              title="Verificar pedidos"
              description={`${state.orders.length} pedido(s) no sistema.`}
           