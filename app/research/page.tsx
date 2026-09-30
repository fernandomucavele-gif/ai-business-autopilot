"use client";

import { useMemo, useState } from "react";
import { useAutopilot } from "../context/autopilot-context";

type Market =
  | "Moçambique"
  | "Brasil"
  | "Portugal"
  | "África do Sul"
  | "Europa"
  | "EUA"
  | "Global";

type SimulatedProduct = {
  name: string;
  market: Market;
  score: number;
  demand: string;
  competition: string;
  margin: string;
  reason: string;
  price: number;
  type: "Físico" | "Infoproduto";
};

const markets: Market[] = [
  "Moçambique",
  "Brasil",
  "Portugal",
  "África do Sul",
  "Europa",
  "EUA",
  "Global",
];

const simulatedProducts: SimulatedProduct[] = [
  {
    name: "Organizador inteligente para casa",
    market: "Moçambique",
    score: 91,
    demand: "Alta",
    competition: "Média",
    margin: "Boa",
    reason:
      "Produto fácil de demonstrar em vídeo e adequado para venda online.",
    price: 850,
    type: "Físico",
  },
  {
    name: "Acessório portátil para automóvel",
    market: "Brasil",
    score: 87,
    demand: "Alta",
    competition: "Média",
    margin: "Boa",
    reason:
      "Tem público amplo e pode ser apresentado através de vídeos curtos.",
    price: 1200,
    type: "Físico",
  },
  {
    name: "Acessório para treino doméstico",
    market: "Europa",
    score: 84,
    demand: "Alta",
    competition: "Alta",
    margin: "Boa",
    reason:
      "Categoria com procura e várias possibilidades de conteúdo.",
    price: 1800,
    type: "Físico",
  },
  {
    name: "Produto de organização pessoal",
    market: "Portugal",
    score: 82,
    demand: "Média",
    competition: "Média",
    margin: "Boa",
    reason:
      "Pode ser vendido através de demonstrações simples e conteúdo educativo.",
    price: 950,
    type: "Físico",
  },
  {
    name: "Acessório para telemóvel",
    market: "África do Sul",
    score: 80,
    demand: "Alta",
    competition: "Alta",
    margin: "Média",
    reason:
      "Mercado amplo e possibilidade de venda por impulso.",
    price: 700,
    type: "Físico",
  },
  {
    name: "Infoproduto de desenvolvimento pessoal",
    market: "Moçambique",
    score: 89,
    demand: "Média",
    competition: "Média",
    margin: "Muito alta",
    reason:
      "Não necessita de stock físico e pode ser entregue digitalmente.",
    price: 155,
    type: "Infoproduto",
  },
];

export default function ResearchPage() {
  const { state, addProduct } = useAutopilot();

  const [market, setMarket] = useState<Market>("Moçambique");
  const [category, setCategory] = useState("Todos");
  const [keyword, setKeyword] = useState("");
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [addedProduct, setAddedProduct] = useState("");

  const products = useMemo(() => {
    let result = simulatedProducts.filter((product) => {
      const marketMatch =
        market === "Global" || product.market === market;

      const keywordMatch =
        keyword.trim() === "" ||
        product.name
          .toLowerCase()
          .includes(keyword.toLowerCase());

      return marketMatch && keywordMatch;
    });

    if (category === "Infoprodutos") {
      result = result.filter(
        (product) => product.type === "Infoproduto"
      );
    }

    if (category === "Produtos físicos") {
      result = result.filter(
        (product) => product.type === "Físico"
      );
    }

    return result.sort((a, b) => b.score - a.score);
  }, [market, keyword, category]);

  function runResearch() {
    setRunning(true);
    setCompleted(false);
    setAddedProduct("");

    setTimeout(() => {
      setRunning(false);
      setCompleted(true);
    }, 1600);
  }

  function addToAutopilot(product: SimulatedProduct) {
    addProduct(product.name, product.market, product.price);
    setAddedProduct(product.name);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        padding: "30px 18px",
        color: "#172033",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1150px",
          margin: "0 auto",
        }}
      >
        {/* CABEÇALHO */}
        <section
          style={{
            background: "#ffffff",
            borderRadius: "20px",
            padding: "28px",
            marginBottom: "20px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              color: "#64748b",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "1px",
            }}
          >
            AI BUSINESS AUTOPILOT
          </div>

          <h1
            style={{
              fontSize: "34px",
              margin: "8px 0",
            }}
          >
            🔎 Research AI
          </h1>

          <p
            style={{
              color: "#64748b",
              lineHeight: 1.6,
            }}
          >
            Pesquisa oportunidades e produtos com potencial
            de venda em diferentes mercados.
          </p>

          <div
            style={{
              marginTop: "18px",
              padding: "13px",
              borderRadius: "12px",
              background: "#ecfdf5",
              color: "#166534",
              fontWeight: 600,
            }}
          >
            🟢 Modo simulação ativo — nenhuma compra ou
            campanha real será executada.
          </div>
        </section>

        {/* CONFIGURAÇÃO */}
        <section
          style={{
            background: "#ffffff",
            borderRadius: "20px",
            padding: "24px",
            marginBottom: "20px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
          }}
        >
          <h2 style={{ marginTop: 0 }}>
            🌍 Configurar pesquisa
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "14px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "7px",
                  fontWeight: 700,
                }}
              >
                Mercado
              </label>

              <select
                value={market}
                onChange={(event) =>
                  setMarket(event.target.value as Market)
                }
                style={{
                  width: "100%",
                  padding: "13px",
                  borderRadius: "10px",
                  border: "1px solid #dbe2ea",
                  background: "#ffffff",
                }}
              >
                {markets.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "7px",
                  fontWeight: 700,
                }}
              >
                Tipo
              </label>

              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
                style={{
                  width: "100%",
                  padding: "13px",
                  borderRadius: "10px",
                  border: "1px solid #dbe2ea",
                  background: "#ffffff",
                }}
              >
                <option>Todos</option>
                <option>Produtos físicos</option>
                <option>Infoprodutos</option>
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "7px",
                  fontWeight: 700,
                }}
              >
                Palavra-chave
              </label>

              <input
                value={keyword}
                onChange={(event) =>
                  setKeyword(event.target.value)
                }
                placeholder="Ex.: fitness"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "13px",
                  borderRadius: "10px",
                  border: "1px solid #dbe2ea",
                }}
              />
            </div>
          </div>

          <button
            onClick={runResearch}
            disabled={running}
            style={{
              width: "100%",
              marginTop: "18px",
              padding: "14px",
              border: "none",
              borderRadius: "12px",
              background: running ? "#94a3b8" : "#2563eb",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: "15px",
            }}
          >
            {running
              ? "🔎 A analisar mercados..."
              : "🚀 Iniciar pesquisa"}
          </button>

          {completed && (
            <div
              style={{
                marginTop: "15px",
                padding: "13px",
                borderRadius: "12px",
                background: "#eff6ff",
                color: "#1d4ed8",
              }}
            >
              ✅ Pesquisa simulada concluída.
            </div>
          )}
        </section>

        {/* RESULTADOS */}
        <section
          style={{
            background: "#ffffff",
            borderRadius: "20px",
            padding: "24px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <div>
              <h2 style={{ margin: 0 }}>
                📦 Produtos encontrados
              </h2>

              <p style={{ color: "#64748b" }}>
                Resultados simulados organizados por potencial.
              </p>
            </div>

            <strong>{products.length} resultados</strong>
          </div>

          {products.length === 0 ? (
            <div
              style={{
                marginTop: "20px",
                padding: "20px",
                borderRadius: "12px",
                background: "#f8fafc",
                color: "#64748b",
              }}
            >
              Nenhum produto encontrado com estes filtros.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(270px, 1fr))",
                gap: "16px",
                marginTop: "20px",
              }}
            >
              {products.map((product) => {
                const alreadyAdded = state.products.some(
                  (item) => item.name === product.name
                );

                return (
                  <article
                    key={product.name}
                    style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: "16px",
                      padding: "18px",
                      background: "#fafcff",
                    }}
                  >
                    <div style={{ fontSize: "30px" }}>
                      {product.type === "Infoproduto"
                        ? "📘"
                        : "📦"}
                    </div>

                    <h3
                      style={{
                        margin: "10px 0",
                        lineHeight: 1.4,
                      }}
                    >
                      {product.name}
                    </h3>

                    <p style={{ margin: "7px 0" }}>
                      🌍 <strong>Mercado:</strong>{" "}
                      {product.market}
                    </p>

                    <p style={{ margin: "7px 0" }}>
                      🏷️ <strong>Tipo:</strong>{" "}
                      {product.type}
                    </p>

                    <p style={{ margin: "7px 0" }}>
                      🔥 <strong>Procura:</strong>{" "}
                      {product.demand}
                    </p>

                    <p style={{ margin: "7px 0" }}>
                      🏁 <strong>Concorrência:</strong>{" "}
                      {product.competition}
                    </p>

                    <p style={{ margin: "7px 0" }}>
                      💰 <strong>Preço simulado:</strong>{" "}
                      {product.price.toLocaleString("pt-PT")} MT
                    </p>

                    <div
                      style={{
                        marginTop: "12px",
                        padding: "10px",
                        borderRadius: "10px",
                        background: "#eff6ff",
                        color: "#1d4ed8",
                        fontWeight: 800,
                      }}
                    >
                      Score: {product.score}/100
                    </div>

                    <p
                      style={{
                        color: "#64748b",
                        lineHeight: 1.5,
                        fontSize: "14px",
                      }}
                    >
                      {product.reason}
                    </p>

                    <button
                      onClick={() =>
                        addToAutopilot(product)
                      }
                      disabled={alreadyAdded}
                      style={{
                        width: "100%",
                        padding: "11px",
                        border: "none",
                        border