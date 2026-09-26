"use client";

import { useState } from "react";

const suppliers = [
  {
    product: "Mini aspirador portátil USB",
    country: "China 🇨🇳",
    supplier: "Fornecedor internacional",
    price: "US$ 4,80",
    shipping: "US$ 2,50",
    delivery: "8–18 dias",
    dropshipping: "Sim",
    margin: "Alta",
  },
  {
    product: "Luz LED para quarto",
    country: "China 🇨🇳",
    supplier: "Fornecedor internacional",
    price: "US$ 3,20",
    shipping: "US$ 2,00",
    delivery: "8–20 dias",
    dropshipping: "Sim",
    margin: "Alta",
  },
  {
    product: "Garrafa térmica inteligente",
    country: "Turquia 🇹🇷",
    supplier: "Fornecedor internacional",
    price: "US$ 9,50",
    shipping: "US$ 4,00",
    delivery: "7–15 dias",
    dropshipping: "Consultar",
    margin: "Média",
  },
  {
    product: "Acessório automóvel",
    country: "África do Sul 🇿🇦",
    supplier: "Fornecedor regional",
    price: "US$ 7,00",
    shipping: "US$ 3,50",
    delivery: "3–10 dias",
    dropshipping: "Consultar",
    margin: "Alta",
  },
  {
    product: "Kit de organização doméstica",
    country: "Brasil 🇧🇷",
    supplier: "Fornecedor brasileiro",
    price: "US$ 6,50",
    shipping: "US$ 3,00",
    delivery: "5–12 dias",
    dropshipping: "Sim",
    margin: "Média",
  },
];

export default function SuppliersPage() {
  const [product, setProduct] = useState("");
  const [market, setMarket] = useState("Moçambique");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  function searchSuppliers() {
    setLoading(true);
    setSearched(false);

    setTimeout(() => {
      setLoading(false);
      setSearched(true);
    }, 1200);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        padding: "28px 18px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "auto" }}>
        <div style={{ marginBottom: 25 }}>
          <div
            style={{
              display: "inline-block",
              background: "#e8f0ff",
              color: "#2563eb",
              padding: "7px 12px",
              borderRadius: 20,
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            🏭 SUPPLIER AI
          </div>

          <h1
            style={{
              fontSize: 34,
              margin: "14px 0 8px",
              color: "#111827",
            }}
          >
            Encontrar fornecedores
          </h1>

          <p style={{ color: "#64748b", fontSize: 17 }}>
            Procure fornecedores internacionais para produtos físicos e
            oportunidades de venda.
          </p>
        </div>

        <section
          style={{
            background: "white",
            borderRadius: 18,
            padding: 22,
            boxShadow: "0 5px 25px rgba(0,0,0,0.06)",
            marginBottom: 25,
          }}
        >
          <h2 style={{ marginTop: 0 }}>🔎 Procurar fornecedor</h2>

          <label style={{ display: "block", marginBottom: 7 }}>
            Produto
          </label>

          <input
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="Ex.: mini aspirador portátil"
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: 14,
              border: "1px solid #dbe3ee",
              borderRadius: 10,
              fontSize: 16,
              marginBottom: 15,
            }}
          />

          <label style={{ display: "block", marginBottom: 7 }}>
            Mercado onde pretende vender
          </label>

          <select
            value={market}
            onChange={(e) => setMarket(e.target.value)}
            style={{
              width: "100%",
              padding: 14,
              border: "1px solid #dbe3ee",
              borderRadius: 10,
              fontSize: 16,
              marginBottom: 18,
              background: "white",
            }}
          >
            <option>Moçambique 🇲🇿</option>
            <option>Brasil 🇧🇷</option>
            <option>Portugal 🇵🇹</option>
            <option>África do Sul 🇿🇦</option>
            <option>EUA 🇺🇸</option>
            <option>Europa 🇪🇺</option>
            <option>Global 🌎</option>
          </select>

          <button
            onClick={searchSuppliers}
            disabled={loading}
            style={{
              width: "100%",
              padding: 15,
              border: 0,
              borderRadius: 10,
              background: "#2563eb",
              color: "white",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {loading ? "🔄 A pesquisar fornecedores..." : "🚀 Encontrar fornecedores"}
          </button>
        </section>

        {searched && (
          <section
            style={{
              background: "white",
              borderRadius: 18,
              padding: 22,
              boxShadow: "0 5px 25px rgba(0,0,0,0.06)",
            }}
          >
            <h2 style={{ marginTop: 0 }}>
              🌍 Fornecedores encontrados
            </h2>

            <p style={{ color: "#64748b" }}>
              Mercado selecionado: <strong>{market}</strong>
            </p>

            <div
              style={{
                background: "#fff7ed",
                padding: 
