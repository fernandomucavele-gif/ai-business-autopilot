"use client";

import { useState } from "react";
import { useAutopilot } from "../context/autopilot-context";
import type { Market } from "../../lib/autopilot";

const markets: Market[] = [
  "Moçambique",
  "Brasil",
  "Portugal",
  "África do Sul",
  "Europa",
  "EUA",
  "Global",
];

const ideas = [
  "Garrafa térmica inteligente",
  "Organizador multifuncional",
  "Luz LED portátil",
  "Acessório fitness",
  "Produto para cuidados pessoais",
  "Infoproduto de desenvolvimento pessoal",
];

export default function ResearchPage() {
  const { state, addProduct } = useAutopilot();

  const [market, setMarket] =
    useState<Market>("Moçambique");

  const [price, setPrice] =
    useState("500");

  const [searching, setSearching] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [results, setResults] =
    useState<string[]>([]);

  function runResearch() {
    setSearching(true);
    setMessage("");

    setTimeout(() => {
      const shuffled = [...ideas].sort(
        () => Math.random() - 0.5
      );

      setResults(shuffled.slice(0, 5));
      setSearching(false);
      setMessage(
        "Pesquisa simulada concluída."
      );
    }, 600);
  }

  function addResearchProduct(name: string) {
    const numericPrice =
      Number(price) || 500;

    addProduct(
      name,
      market,
      numericPrice
    );

    setMessage(
      `${name} foi adicionado ao Autopilot.`
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "24px",
        background: "#f4f7fb",
        color: "#101828",
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
            marginBottom: "24px",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "1px",
              color: "#667085",
            }}
          >
            AI BUSINESS AUTOPILOT
          </p>

          <h1
            style={{
              margin: "8px 0",
              fontSize: "32px",
            }}
          >
            🔎 Research AI
          </h1>

          <p
            style={{
              margin: 0,
              color: "#667085",
            }}
          >
            Pesquisa e descoberta de produtos
            com potencial de venda.
          </p>
        </header>

        <section
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            padding: "20px",
            marginBottom: "20px",
            border: "1px solid #e4e7ec",
          }}
        >
          <h2>Pesquisa de mercado</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
              marginTop: "16px",
            }}
          >
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              Mercado

              <select
                value={market}
                onChange={(event) =>
                  setMarket(
                    event.target.value as Market
                  )
                }
                style={{
                  padding: "12px",
                  borderRadius: "10px",
                  border: "1px solid #d0d5dd",
                  background: "#fff",
                }}
              >
                {markets.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              Preço de venda estimado

              <input
                type="number"
                value={price}
                onChange={(event) =>
                  setPrice(event.target.value)
                }
                style={{
                  padding: "12px",
                  borderRadius: "10px",
                  border: "1px solid #d0d5dd",
                }}
              />
            </label>
          </div>

          <button
            onClick={runResearch}
            disabled={searching}
            style={{
              marginTop: "20px",
              width: "100%",
              padding: "13px",
              border: "none",
              borderRadius: "10px",
              background: "#101828",
              color: "#ffffff",
              cursor: searching
                ? "wait"
                : "pointer",
              fontWeight: 700,
            }}
          >
            {searching
              ? "🔄 A pesquisar..."
              : "🔎 Pesquisar produtos"}
          </button>

          {message && (
            <p
              style={{
                marginTop: "14px",
                color: "#475467",
              }}
            >
              {message}
            </p>
          )}
        </section>

        {results.length > 0 && (
          <section
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              padding: "20px",
              marginBottom: "20px",
              border: "1px solid #e4e7ec",
            }}
          >
            <h2>
              Produtos encontrados
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "14px",
                marginTop: "16px",
              }}
            >
              {results.map((product) => (
                <div
                  key={product}
                  style={{
                    padding: "16px",
                    borderRadius: "12px",
                    border:
                      "1px solid #e4e7ec",
                  }}
                >
                  <h3
                    style={{
                      marginTop: 0,
                    }}
                  >
                    {product}
                  </h3>

                  <p
                    style={{
                      color: "#667085",
                    }}
                  >
                    Mercado: {market}
                  </p>

                  <p
                    style={{
                      color: "#667085",
                    }}
                  >
                    Preço: {price} MT
                  </p>

                  <button
                    onClick={() =>
                      addResearchProduct(
                        product
                      )
                    }
                    style={{
                      width: "100%",
                      padding: "11px",
                      border: "none",
                      borderRadius: "9px",
                      background: "#12b76a",
                      color: "#ffffff",
                      cursor: "pointer",
                      fontWeight: 700,
                    }}
                  >
                    ➕ Adicionar ao Autopilot
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        <section
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            padding: "20px",
            border: "1px solid #e4e7ec",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "12px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h2>
                Produtos no Autopilot
              </h2>

              <p
                style={{
                  color: "#667085",
                }}
              >
                Produtos adicionados pela
                pesquisa simulada.
              </p>
            </div>

            <strong>
              {state.products.length} produto(s)
            </strong>
          </div>

          {state.products.length === 0 ? (
            <p
              style={{
                color: "#667085",
                marginTop: "20px",
              }}
            >
              Ainda não existem produtos.
              Execute uma pesquisa para começar.
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gap: "10px",
                marginTop: "16px",
              }}
            >
              {state.products.map(
                (product) => (
                  <div
                    key={product.id}
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      gap: "12px",
                      padding: "14px",
                      borderRadius: "10px",
                      background: "#f9fafb",
                      flexWrap: "wrap",
                    }}
                  >
                    <strong>
                      {product.name}
                    </strong>

                    <span>
                      {product.market}
                    </span>

                    <span>
                      {product.price} MT
                    </span>

                    <span>
                      {product.status}
                    </span>
                  </div>
                )
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}