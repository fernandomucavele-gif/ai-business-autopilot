"use client";

import { useState } from "react";

const markets = [
  "Moçambique 🇲🇿",
  "Brasil 🇧🇷",
  "Portugal 🇵🇹",
  "África do Sul 🇿🇦",
  "Europa 🇪🇺",
  "EUA 🇺🇸",
  "Global 🌎",
];

const objectives = [
  "Vendas",
  "Leads",
  "Tráfego",
  "Reconhecimento",
];

export default function AdsPage() {
  const [product, setProduct] = useState("");
  const [market, setMarket] = useState("Moçambique 🇲🇿");
  const [objective, setObjective] = useState("Vendas");
  const [budget, setBudget] = useState("500");
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(false);

  function createCampaign() {
    if (!product.trim()) return;

    setLoading(true);
    setCreated(false);

    setTimeout(() => {
      setLoading(false);
      setCreated(true);
    }, 1200);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        padding: "28px 18px",
        fontFamily: "Arial, sans-serif",
        color: "#111827",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "auto" }}>
        <div style={{ marginBottom: 25 }}>
          <div
            style={{
              display: "inline-block",
              padding: "7px 12px",
              borderRadius: 20,
              background: "#e0f2fe",
              color: "#0369a1",
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            📢 ADS AI
          </div>

          <h1 style={{ fontSize: 34, margin: "14px 0 8px" }}>
            Criador de campanhas
          </h1>

          <p style={{ color: "#64748b", fontSize: 17 }}>
            Prepara campanhas, públicos e variações de anúncios para diferentes
            mercados.
          </p>
        </div>

        <section
          style={{
            background: "white",
            padding: 22,
            borderRadius: 18,
            boxShadow: "0 5px 25px rgba(0,0,0,.06)",
          }}
        >
          <h2 style={{ marginTop: 0 }}>🚀 Nova campanha</h2>

          <label>Produto</label>

          <input
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="Ex.: Mini aspirador portátil"
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: 14,
              marginTop: 8,
              marginBottom: 18,
              borderRadius: 10,
              border: "1px solid #dbe3ee",
              fontSize: 16,
            }}
          />

          <label>Mercado</label>

          <select
            value={market}
            onChange={(e) => setMarket(e.target.value)}
            style={{
              width: "100%",
              padding: 14,
              marginTop: 8,
              marginBottom: 18,
              borderRadius: 10,
              border: "1px solid #dbe3ee",
              background: "white",
              fontSize: 16,
            }}
          >
            {markets.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <label>Objetivo</label>

          <select
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            style={{
              width: "100%",
              padding: 14,
              marginTop: 8,
              marginBottom: 18,
              borderRadius: 10,
              border: "1px solid #dbe3ee",
              background: "white",
              fontSize: 16,
            }}
          >
            {objectives.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <label>Orçamento diário de teste (MT)</label>

          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: 14,
              marginTop: 8,
              borderRadius: 10,
              border: "1px solid #dbe3ee",
              fontSize: 16,
            }}
          />

          <button
            onClick={createCampaign}
            disabled={loading}
            style={{
              width: "100%",
              marginTop: 20,
              padding: 15,
              border: 0,
              borderRadius: 10,
              background: "#0369a1",
              color: "white",
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            {loading
              ? "📊 A preparar campanha..."
              : "🚀 Preparar campanha"}
          </button>
        </section>

        {created && (
          <section
            style={{
              marginTop: 24,
              background: "white",
              padding: 22,
              borderRadius: 18,
              boxShadow: "0 5px 25px rgba(0,0,0,.06)",
            }}
          >
            <h2>📋 Campanha preparada</h2>

            <p>
              <strong>Produto:</strong> {product}
            </p>

            <p>
              <strong>Mercado:</strong> {market}
            </p>

            <p>
              <strong>Objetivo:</strong> {objective}
            </p>

            <p>
              <strong>Orçamento de teste:</strong> {budget} MT/dia
            </p>

            <hr />

            <h3>👥 Público sugerido</h3>
            <p>
              Pessoas interessadas no problema que o produto resolve,
              segmentadas de acordo com o mercado selecionado.
            </p>

            <h3>📱 Posicionamentos</h3>
            <p>
              Feed, Stories e Reels — a distribuição real deverá ser definida
              depois com base nos dados da campanha.
            </p>

            <h3>🧪 Teste A/B</h3>
            <p>
              Criar pelo menos 3 variações de criativo e comparar CTR,
              conversão, custo por resultado e ROAS.
            </p>

            <h3>📈 Métricas</h3>
            <p>
              Impressões · Cliques · CTR · CPC · Conversões · CPA · Receita ·
              ROAS
            </p>

            <div
              style={{
                marginTop: 20,
                padding: 14,
                borderRadius: 10,
                background: "#fff7ed",
                color: "#9a3412",
              }}
            >
              ⚠️ <strong>Modo simulação:</strong> esta campanha não será
              publicada e nenhum orçamento será gasto.
            </div>
          </section>
        )}
      </div>
    </main>
  );
         }
