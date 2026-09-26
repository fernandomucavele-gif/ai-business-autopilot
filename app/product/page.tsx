"use client";

import { useState } from "react";

const markets = ["Moçambique", "Brasil", "Europa"];

export default function ProductAI() {
  const [market, setMarket] = useState("Moçambique");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const products = [
    {
      name: "Mini aspirador portátil",
      market: "Moçambique / Brasil / Europa",
      cost: "300–700 MT",
      price: "1.200–2.500 MT",
      margin: "Potencialmente alta",
      audience: "Casa, carros e escritório",
      competition: "Média",
      ad: "Vídeo curto mostrando antes e depois",
    },
    {
      name: "Luz LED com sensor de movimento",
      market: "Moçambique / Brasil / Europa",
      cost: "200–500 MT",
      price: "900–1.800 MT",
      margin: "Potencialmente alta",
      audience: "Casa, corredores e segurança",
      competition: "Média",
      ad: "Demonstração noturna antes/depois",
    },
    {
      name: "Organizador multifuncional",
      market: "Moçambique / Brasil / Europa",
      cost: "250–600 MT",
      price: "1.000–2.000 MT",
      margin: "Potencialmente média/alta",
      audience: "Pessoas interessadas em organização",
      competition: "Média",
      ad: "Transformação de espaço desorganizado",
    },
    {
      name: "Acessório para limpeza de carros",
      market: "Moçambique / Brasil / Europa",
      cost: "200–600 MT",
      price: "900–2.200 MT",
      margin: "Potencialmente alta",
      audience: "Motoristas e donos de carros",
      competition: "Média",
      ad: "Vídeo demonstrando a limpeza",
    },
    {
      name: "Garrafa térmica portátil",
      market: "Moçambique / Brasil / Europa",
      cost: "300–800 MT",
      price: "1.200–2.500 MT",
      margin: "Potencialmente média",
      audience: "Estudantes, trabalhadores e viajantes",
      competition: "Média",
      ad: "Teste de temperatura e praticidade",
    },
  ];

  function startResearch() {
    setLoading(true);
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
        padding: "24px",
        color: "#101828",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h1 style={{ fontSize: 38, marginBottom: 8 }}>
          📦 Product AI
        </h1>

        <p style={{ fontSize: 18, color: "#667085" }}>
          Encontra e analisa produtos com potencial para vender online.
        </p>

        <section
          style={{
            background: "white",
            borderRadius: 18,
            padding: 24,
            marginTop: 24,
            boxShadow: "0 4px 20px rgba(0,0,0,.06)",
          }}
        >
          <h2>🌍 Escolhe o mercado</h2>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {markets.map((item) => (
              <button
                key={item}
                onClick={() => setMarket(item)}
                style={{
                  padding: "12px 18px",
                  borderRadius: 10,
                  border: "1px solid #ddd",
                  background: market === item ? "#2563eb" : "white",
                  color: market === item ? "white" : "#111",
                  fontWeight: 600,
                }}
              >
                {item}
              </button>
            ))}
          </div>

          <button
            onClick={startResearch}
            style={{
              marginTop: 22,
              padding: "14px 22px",
              border: 0,
              borderRadius: 10,
              background: "#2563eb",
              color: "white",
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            {loading ? "🔎 A analisar..." : "🚀 Encontrar produtos"}
          </button>
        </section>

        {searched && (
          <section style={{ marginTop: 24 }}>
            <h2>
              🔎 Oportunidades encontradas — {market}
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(280px,1fr))",
                gap: 18,
              }}
            >
              {products.map((product) => (
                <article
                  key={product.name}
                  style={{
                    background: "white",
                    borderRadius: 18,
                    padding: 20,
                    boxShadow: "0 4px 18px rgba(0,0,0,.06)",
                  }}
                >
                  <h3>{product.name}</h3>

                  <p>
                    <strong>🌍 Mercado:</strong> {product.market}
                  </p>

                  <p>
                    <strong>💰 Custo:</strong> {product.cost}
                  </p>

                  <p>
                    <strong>🏷️ Venda:</strong> {product.price}
                  </p>

                  <p>
                    <strong>📈 Margem:</strong> {product.margin}
                  </p>

                  <p>
                    <strong>👥 Público:</strong> {product.audience}
                  </p>

                  <p>
                    <strong>⚔️ Concorrência:</strong>{" "}
                    {product.competition}
                  </p>

                  <p>
                    <strong>📢 Anúncio:</strong> {product.ad}
                  </p>
                </article>
              ))}
            </div>

            <div
              style={{
                marginTop: 24,
                padding: 18,
                background: "#ecfdf3",
                borderRadius: 14,
              }}
            >
              🟢 <strong>Modo simulação</strong>
              <br />
              Estes produtos são exemplos para testar o sistema.
              Nenhuma compra será realizada.
            </div>
          </section>
        )}
      </div>
    </main>
  );
      }
