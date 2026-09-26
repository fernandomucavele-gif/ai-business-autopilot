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

export default function CreativePage() {
  const [product, setProduct] = useState("");
  const [market, setMarket] = useState("Moçambique 🇲🇿");
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(false);

  function generateCreative() {
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
              background: "#ede9fe",
              color: "#6d28d9",
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            🎨 CREATIVE AI
          </div>

          <h1 style={{ fontSize: 34, margin: "14px 0 8px" }}>
            Criador de anúncios com IA
          </h1>

          <p style={{ color: "#64748b", fontSize: 17 }}>
            Cria ofertas, textos, roteiros e ideias de criativos para diferentes
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
          <h2 style={{ marginTop: 0 }}>🚀 Criar anúncio</h2>

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
              borderRadius: 10,
              border: "1px solid #dbe3ee",
              fontSize: 16,
              background: "white",
            }}
          >
            {markets.map((item) => (
              <option key={
