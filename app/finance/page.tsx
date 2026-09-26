"use client";

import { useState } from "react";

export default function FinancePage() {
  const [revenue, setRevenue] = useState("");
  const [productCost, setProductCost] = useState("");
  const [ads, setAds] = useState("");
  const [shipping, setShipping] = useState("");

  const r = Number(revenue) || 0;
  const p = Number(productCost) || 0;
  const a = Number(ads) || 0;
  const s = Number(shipping) || 0;

  const costs = p + a + s;
  const profit = r - costs;
  const roas = a > 0 ? r / a : 0;

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
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
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

        <h1 style={{ fontSize: "34px", margin: "14px 0 8px" }}>
          Finance AI
        </h1>

        <p style={{ color: "#64748b", fontSize: "17px" }}>
          Analisa receitas, custos, lucro e publicidade.
        </p>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
            gap: "15px",
            marginTop: "25px",
          }}
        >
          <Card title="💵 Receita" value={r} />
          <Card title="💸 Custos" value={costs} />
          <Card title="📈 Lucro" value={profit} />
          <Card title="📊 ROAS" value={roas} suffix="x" />
        </section>

        <section
          style={{
            background: "#ffffff",
            padding: "24px",
            borderRadius: "18px",
            marginTop: "20px",
          }}
        >
          <h2>🧮 Simulador financeiro</h2>

          <p style={{ color: "#64748b" }}>
            Introduz valores de teste. Nenhuma operação financeira real será
            executada.
          </p>

          <Input
            label="Receita"
            value={revenue}
            setValue={setRevenue}
          />

          <Input
            label="Custo do produto"
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
          Pagamentos, transferências e ações financeiras reais continuam
          bloqueados.
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
      <div style={{ color: "#64748b" }}>{title}</div>
      <strong style={{ display: "block", fontSize: "25px", marginTop: "8px" }}>
        {value.toFixed(2)}{suffix}
      </strong>
    </div>
  );
}

function Input({
  label,
  value,
  setValue,
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
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
        min="0"
        value={value}
        onChange={(e) => setValue(e.target.value)}
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
