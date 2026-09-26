"use client";

import { useState } from "react";

const markets = [
  "Moçambique",
  "Brasil",
  "Portugal",
  "África do Sul",
  "Europa",
  "EUA",
  "Global",
];

export default function CreativePage() {
  const [market, setMarket] = useState("Moçambique");
  const [product, setProduct] = useState("");
  const [type, setType] = useState("Vídeo");
  const [created, setCreated] = useState(false);

  function createCreative() {
    setCreated(true);
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
      <div style={{ maxWidth: 1000, margin: "auto" }}>
        <div style={{ marginBottom: 25 }}>
          <div
            style={{
              display: "inline-block",
              padding: "7px 12px",
              borderRadius: 20,
              background: "#ede9fe",
              color: "#6d28d9",
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            🎨 CREATIVE AI
          </div>

          <h1 style={{ fontSize: 34, margin: "14px 0 8px" }}>
            Creative AI
          </h1>

          <p style={{ color: "#64748b", fontSize: 17 }}>
            Cria ideias de anúncios, vídeos, imagens, textos e ofertas para
            produtos.
          </p>
        </div>

        <section
          style={{
            background: "white",
            padding: 24,
            borderRadius: 18,
            boxShadow: "0 5px 25px rgba(0,0,0,.06)",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Criar novo criativo</h2>

          <label
            style={{
              display: "block",
              marginTop: 18,
              marginBottom: 7,
              fontWeight: 700,
            }}
          >
            Produto
          </label>

          <input
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="Ex.: Organizador inteligente para casa"
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 10,
              border: "1px solid #dbe3ee",
              fontSize: 16,
            }}
          />

          <label
            style={{
              display: "block",
              marginTop: 18,
              marginBottom: 7,
              fontWeight: 700,
            }}
          >
            Mercado
          </label>

          <select
            value={market}
            onChange={(e) => setMarket(e.target.value)}
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 10,
              border: "1px solid #dbe3ee",
              background: "white",
              fontSize: 16,
            }}
          >
            {markets.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <label
            style={{
              display: "block",
              marginTop: 18,
              marginBottom: 7,
              fontWeight: 700,
            }}
          >
            Tipo de criativo
          </label>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 10,
              border: "1px solid #dbe3ee",
              background: "white",
              fontSize: 16,
            }}
          >
            <option>Vídeo</option>
            <option>Imagem</option>
            <option>Carrossel</option>
            <option>Texto do anúncio</option>
            <option>Oferta</option>
          </select>

          <button
            onClick={createCreative}
            style={{
              width: "100%",
              marginTop: 22,
              padding: 15,
              border: 0,
              borderRadius: 10,
              background: "#6d28d9",
              color: "white",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            🎨 Criar criativo
          </button>

          {created && (
            <div
              style={{
                marginTop: 20,
                padding: 18,
                borderRadius: 12,
                background: "#ecfdf5",
                color: "#166534",
              }}
            >
              <strong>✅ Criativo preparado em simulação</strong>

              <p style={{ marginBottom: 0 }}>
                Produto: {product || "Produto não especificado"}
                <br />
                Mercado: {market}
                <br />
                Formato: {type}
              </p>
            </div>
          )}
        </section>

        <section
          style={{
            marginTop: 20,
            padding: 16,
            borderRadius: 12,
            background: "#fff7ed",
            color: "#9a3412",
          }}
        >
          ⚠️ <strong>Modo simulação:</strong> o Creative AI prepara a estrutura
          do anúncio, mas ainda não publica anúncios reais.
        </section>
      </div>
    </main>
  );
            }
