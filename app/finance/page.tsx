"use client";

import { useState } from "react";
import { useAutopilot } from "../context/autopilot-context";

export default function FinancePage() {
  const { state, metrics, addFinanceRecord } = useAutopilot();

  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [revenue, setRevenue] = useState("");
  const [productCost, setProductCost] = useState("");
  const [ads, setAds] = useState("");
  const [shipping, setShipping] = useState("");
  const [message, setMessage] = useState("");

  const simulatedQuantity = Number(quantity) || 0;
  const revenuePerUnit = Number(revenue) || 0;
  const productCostPerUnit = Number(productCost) || 0;
  const simulatedRevenue = revenuePerUnit * simulatedQuantity;
  const simulatedProductCost = productCostPerUnit * simulatedQuantity;
  const simulatedAds = Number(ads) || 0;
  const simulatedShipping = Number(shipping) || 0;

  const simulatedCosts =
    simulatedProductCost +
    simulatedAds +
    simulatedShipping;

  const simulatedProfit =
    simulatedRevenue - simulatedCosts;

  const simulatedMarginPercent =
    simulatedRevenue > 0
      ? (simulatedProfit / simulatedRevenue) * 100
      : 0;

  const simulatedROAS =
    simulatedAds > 0
      ? simulatedRevenue / simulatedAds
      : 0;

  function selectProduct(productId: string) {
    setSelectedProductId(productId);
    const product = state.products.find((item) => item.id === productId);
    if (!product) return;
    setRevenue(String(product.price));
    setProductCost(typeof product.estimatedUnitCost === "number" ? String(product.estimatedUnitCost) : "");
    setMessage(product.estimatedUnitCost === undefined
      ? "Produto selecionado. O custo ainda não está definido; introduz uma estimativa."
      : "Preço e custo estimado preenchidos a partir do produto guardado.");
  }

  function addSimulation() {
    const rawValues = [quantity, revenue, productCost, ads, shipping];
    const values = rawValues.map((value) => value.trim() === "" ? 0 : Number(value));

    if (values.some((value) => !Number.isFinite(value) || value < 0) || !Number.isInteger(simulatedQuantity) || simulatedQuantity < 1) {
      setMessage("⚠️ Introduz apenas valores numéricos válidos e não negativos.");
      return;
    }

    if (
      simulatedRevenue === 0 &&
      simulatedProductCost === 0 &&
      simulatedAds === 0 &&
      simulatedShipping === 0
    ) {
      setMessage("⚠️ Introduz pelo menos um valor maior que zero.");
      return;
    }

    if (simulatedRevenue > 0) {
      addFinanceRecord({
        id: `FIN-${Date.now()}-R`,
        type: "revenue",
        amount: simulatedRevenue,
        currency: "MT",
        description: `Registo manual de receita (${simulatedQuantity} unidade${simulatedQuantity === 1 ? "" : "s"})`,
      });
    }

    if (simulatedProductCost > 0) {
      addFinanceRecord({
        id: `FIN-${Date.now()}-P`,
        type: "product_cost",
        amount: simulatedProductCost,
        currency: "MT",
        description: `Registo manual de custo de produto (${simulatedQuantity} unidade${simulatedQuantity === 1 ? "" : "s"})`,
      });
    }

    if (simulatedAds > 0) {
      addFinanceRecord({
        id: `FIN-${Date.now()}-A`,
        type: "ad_cost",
        amount: simulatedAds,
        currency: "MT",
        description: "Registo manual de custo de anúncios",
      });
    }

    if (simulatedShipping > 0) {
      addFinanceRecord({
        id: `FIN-${Date.now()}-S`,
        type: "shipping",
        amount: simulatedShipping,
        currency: "MT",
        description: "Registo manual de custo de envio",
      });
    }

    setMessage(
      "✅ Registos manuais guardados no Autopilot. Confirma se cada valor é real ou estimado; este ecrã não valida documentos nem executa pagamentos."
    );

    setQuantity("1");
    setRevenue("");
    setProductCost("");
    setAds("");
    setShipping("");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        padding: "30px 18px",
        fontFamily: "Arial, sans-serif",
        color: "#111827",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "7px 12px",
            borderRadius: "20px",
            background: "#dcfce7",
            color: "#166534",
            fontWeight: 700,
          }}
        >
          💰 FINANCE AI
        </div>

        <h1
          style={{
            fontSize: "34px",
            margin: "14px 0 8px",
          }}
        >
          Finance AI
        </h1>

        <p
          style={{
            color: "#64748b",
            fontSize: "17px",
          }}
        >
          Analisa receitas, custos, lucro e publicidade.
        </p>

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(200px,1fr))",
            gap: "15px",
            marginTop: "25px",
          }}
        >
          <Card
            title="💵 Receita Autopilot"
            value={metrics.revenue}
          />

          <Card
            title="💸 Custos Autopilot"
            value={metrics.costs}
          />

          <Card
            title="📈 Lucro Autopilot"
            value={metrics.profit}
          />

          <Card
            title="📊 ROAS Autopilot"
            value={metrics.roas}
            suffix="x"
          />
        </section>

        <section
          style={{
            background: "#ffffff",
            padding: "24px",
            borderRadius: "18px",
            marginTop: "20px",
            boxShadow:
              "0 5px 25px rgba(0,0,0,.05)",
          }}
        >
          <h2>🧮 Simulador financeiro</h2>

          <p style={{ color: "#64748b" }}>
            Introduz valores reais já confirmados ou estimativas. Os registos são apenas lançados no Autopilot: não validam extratos/faturas nem executam pagamentos, transferências ou cobranças. Identifica mentalmente quais valores são reais e quais são estimativas.
          </p>

          <label style={{ display: "block", marginTop: "16px", fontWeight: 700 }}>
            Produto guardado (opcional)
            <select
              value={selectedProductId}
              onChange={(event) => selectProduct(event.target.value)}
              style={{ display: "block", width: "100%", boxSizing: "border-box", marginTop: "7px", padding: "13px", borderRadius: "10px", border: "1px solid #dbe3ee", fontSize: "16px", background: "#fff" }}
            >
              <option value="">Selecionar produto...</option>
              {state.products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} — {product.price.toFixed(2)} MT
                </option>
              ))}
            </select>
            {state.products.length === 0 && <small style={{ display: "block", marginTop: "6px", color: "#64748b" }}>Adiciona primeiro um produto no Research AI.</small>}
          </label>

          <Input
            label="Quantidade de unidades"
            value={quantity}
            setValue={setQuantity}
            integer
          />

          <Input
            label="Preço de venda por unidade (MT)"
            value={revenue}
            setValue={setRevenue}
          />

          <Input
            label="Custo do produto por unidade (MT)"
            value={productCost}
            setValue={setProductCost}
          />

          <Input
            label="Custo de anúncios"
            value={ads}
            setValue={setAds}
          />

          <Input
            label="Custo de envio"
            value={shipping}
            setValue={setShipping}
          />

          <div
            style={{
              marginTop: 20,
              padding: 16,
              borderRadius: 12,
              background: "#f8fafc",
            }}
          >
            <strong>
              Resultado desta simulação
            </strong>

            <p>
              Unidades: {simulatedQuantity}
            </p>

            <p>
              Receita total:{" "}
              {simulatedRevenue.toFixed(2)} MT
            </p>

            <p>
              Custos:{" "}
              {simulatedCosts.toFixed(2)} MT
            </p>

            <p>
              Lucro estimado:{" "}
              {simulatedProfit.toFixed(2)} MT
            </p>

            <p>
              Margem líquida estimada:{" "}
              {simulatedMarginPercent.toFixed(1)}%
            </p>

            <p>
              ROAS:{" "}
              {simulatedROAS.toFixed(2)}x
            </p>
          </div>

          <button
            onClick={addSimulation}
            style={{
              width: "100%",
              marginTop: 18,
              padding: 15,
              border: 0,
              borderRadius: 10,
              background: "#16a34a",
              color: "white",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            ➕ Adicionar simulação ao Autopilot
          </button>

          {message && (
            <div
              style={{
                marginTop: 15,
                padding: 14,
                borderRadius: 10,
                background: "#eff6ff",
                color: "#1d4ed8",
                fontWeight: 600,
              }}
            >
              {message}
            </div>
          )}
        </section>

        <section
          style={{
            background: "#ffffff",
            padding: "24px",
            borderRadius: "18px",
            marginTop: "20px",
            boxShadow:
              "0 5px 25px rgba(0,0,0,.05)",
          }}
        >
          <h2>📋 Registos financeiros</h2>

          {state.finance.length === 0 ? (
            <p style={{ color: "#64748b" }}>
              Ainda não existem registos financeiros.
            </p>
          ) : (
            state.finance.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: 14,
                  borderBottom:
                    "1px solid #e2e8f0",
                }}
              >
                <strong>
                  {item.description}
                </strong>

                <div
                  style={{
                    marginTop: 5,
                    color:
                      item.type === "revenue"
                        ? "#16a34a"
                        : "#dc2626",
                    fontWeight: 700,
                  }}
                >
                  {item.type === "revenue"
                    ? "+"
                    : "-"}
                  {item.amount.toLocaleString()}{" "}
                  {item.currency}
                </div>
              </div>
            ))
          )}
        </section>

        <section
          style={{
            marginTop: 20,
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(180px,1fr))",
            gap: 12,
          }}
        >
          <div
            style={{
              background: "white",
              padding: 18,
              borderRadius: 14,
            }}
          >
            <strong>📦 Produtos</strong>
            <div
              style={{
                fontSize: 24,
                marginTop: 7,
              }}
            >
              {state.products.length}
            </div>
          </div>

          <div
            style={{
              background: "white",
              padding: 18,
              borderRadius: 14,
            }}
          >
            <strong>📢 Campanhas</strong>
            <div
              style={{
                fontSize: 24,
                marginTop: 7,
              }}
            >
              {state.campaigns.length}
            </div>
          </div>

          <div
            style={{
              background: "white",
              padding: 18,
              borderRadius: 14,
            }}
          >
            <strong>📦 Pedidos</strong>
            <div
              style={{
                fontSize: 24,
                marginTop: 7,
              }}
            >
              {state.orders.length}
            </div>
          </div>

          <div
            style={{
              background: "white",
              padding: 18,
              borderRadius: 14,
            }}
          >
            <strong>🔒 Segurança</strong>
            <div
              style={{
                marginTop: 7,
                color: "#16a34a",
                fontWeight: 700,
              }}
            >
              Simulação ativa
            </div>
          </div>
        </section>

        <div
          style={{
            marginTop: "20px",
            padding: "16px",
            borderRadius: "12px",
            background: "#fff7ed",
            color: "#9a3412",
          }}
        >
          ⚠️ <strong>Modo simulação ativo.</strong>
          <br />
          Pagamentos, transferências,
          compras, anúncios pagos e levantamentos
          continuam bloqueados.
        </div>
      </div>
    </main>
  );
}

function Card({
  title,
  value,
  suffix = " MT",
}: {
  title: string;
  value: number;
  suffix?: string;
}) {
  return (
    <div
      style={{
        background: "#ffffff",
        padding: "20px",
        borderRadius: "17px",
        border: "1px solid #e2e8f0",
      }}
    >
      <div style={{ color: "#64748b" }}>
        {title}
      </div>

      <strong
        style={{
          display: "block",
          fontSize: "25px",
          marginTop: "8px",
        }}
      >
        {value.toFixed(2)}
        {suffix}
      </strong>
    </div>
  );
}

function Input({
  label,
  value,
  setValue,
  integer = false,
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
  integer?: boolean;
}) {
  return (
    <label
      style={{
        display: "block",
        marginTop: "16px",
        fontWeight: 700,
      }}
    >
      {label}

      <input
        type="number"
        min={integer ? "1" : "0"}
        step={integer ? "1" : "any"}
        value={value}
        onChange={(e) =>
          setValue(e.target.value)
        }
        placeholder="0"
        style={{
          display: "block",
          width: "100%",
          boxSizing: "border-box",
          marginTop: "7px",
          padding: "13px",
          borderRadius: "10px",
          border: "1px solid #dbe3ee",
          fontSize: "16px",
        }}
      />
    </label>
  );
}