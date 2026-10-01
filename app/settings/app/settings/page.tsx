"use client";

import { useAutopilot } from "../../../context/autopilot-context";

export default function SettingsPage() {
  const { state, setAutomation } = useAutopilot();

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
        <div
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            padding: "24px",
            border: "1px solid #e4e7ec",
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
            Configurações
          </h1>

          <p
            style={{
              marginTop: "8px",
              color: "#667085",
            }}
          >
            Controle as configurações do AI Business Autopilot.
          </p>
        </div>

        <div
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            padding: "24px",
            border: "1px solid #e4e7ec",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              color: "#101828",
            }}
          >
            🛡️ Segurança e automação
          </h2>

          <div
            style={{
              padding: "16px",
              borderRadius: "12px",
              background: "#ecfdf3",
              border: "1px solid #abefc6",
              marginBottom: "20px",
            }}
          >
            <strong style={{ color: "#067647" }}>
              Modo simulação ativo
            </strong>

            <p
              style={{
                marginBottom: 0,
                color: "#475467",
              }}
            >
              O sistema continua protegido. Nenhuma compra,
              publicação de anúncio ou pagamento real será executado.
            </p>
          </div>

          <SettingRow
            title="Modo simulação"
            description="Mantém as operações do sistema em ambiente de teste."
            enabled={state.automation.simulationMode}
            locked={false}
            onChange={(value) =>
              setAutomation("simulationMode", value)
            }
          />

          <SettingRow
            title="Compras reais"
            description="Permite que o sistema faça compras reais com fornecedores."
            enabled={false}
            locked={true}
          />

          <SettingRow
            title="Anúncios reais"
            description="Permite publicar campanhas reais em plataformas de anúncios."
            enabled={false}
            locked={true}
          />

          <SettingRow
            title="Pagamentos automáticos"
            description="Permite executar pagamentos automaticamente."
            enabled={false}
            locked={true}
          />

          <SettingRow
            title="Levantamentos"
            description="Transferência de receitas para contas externas."
            enabled={false}
            locked={true}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >
          <InfoCard
            title="Produtos"
            value={String(state.products.length)}
           