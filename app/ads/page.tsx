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

export default function AdsPage() {
  const { state, addCampaign } = useAutopilot();

  const [selectedProduct, setSelectedProduct] = useState("");
  const [market, setMarket] = useState<Market>("Moçambique");
  const [budget, setBudget] = useState("100");
  const [message, setMessage] = useState("");

  function createSimulation() {
    if (!selectedProduct) {
      setMessage("Seleciona primeiro um produto.");
      return;
    }

    const numericBudget = Number(budget);

    if (!numericBudget || numericBudget <= 0) {
      setMessage("Introduz um orçamento diário válido.");
      return;
    }

    addCampaign(
      selectedProduct,
      market,
      "Vendas",
      numericBudget
    );

    setMessage(
      "Campanha criada em modo de simulação."
    );
  }

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
        <header
          style={{
            background: "#ffffff",
            border: "1px solid #e4e7ec",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "20px",
          }}
        >
          <h1
            style={{
              margin: 0,
              color: "#101828",
              fontSize: "28px",
            }}
          >
            Ads AI
          </h1>

          <p
            style={{
              margin: "8px 0 0",
              color: "#667085",
            }}
          >
            Criação e gestão de campanhas publicitárias
            em ambiente de simulação.
          </p>
        </header>

        <section
          style={{
            background: "#ffffff",
            border: "1px solid #e4e7ec",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              padding: "14px 16px",
              borderRadius: "12px",
              background: "#fffaeb",
              border: "1px solid #fedf89",
              marginBottom: "24px",
            }}
          >
            <strong style={{ color: "#b54708" }}>
              🛡️ Modo simulação
            </strong>

            <p
              style={{
                margin: "6px 0 0",
                color: "#667085",
                fontSize: "14px",
              }}
            >
              A campanha será apenas registada no
              sistema. Nenhum anúncio real será publicado
              e nenhum dinheiro será gasto.
            </p>
          </div>

          <h2
            style={{
              marginTop: 0,
              color: "#101828",
            }}
          >
            Criar campanha
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "18px",
              marginTop: "20px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: 600,
                  color: "#344054",
                }}
              >
                Produto
              </label>

              <select
                value={selectedProduct}
                onChange={(event) =>
                  setSelectedProduct(event.target.value)
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "10px",
                  border: "1px solid #d0d5dd",
                  background: "#ffffff",
                }}
              >
                <option value="">
                  Selecionar produto
                </option>

                {state.products.map((product) => (
                  <option
                    key={product.id}
                    value={product.id}
                  >
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: 600,
                  color: "#344054",
                }}
              >
                Mercado
              </label>

              <select
                value={market}
                onChange={(event) =>
                  setMarket(
                    event.target.value as Market
                  )
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "10px",
                  border: "1px solid #d0d5dd",
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
                  marginBottom: "8px",
                  fontWeight: 600,
                  color: "#344054",
                }}
              >
                Orçamento diário (MT)
              </label>

              <input
                type="number"
                min="1"
                value={budget}
                onChange={(event) =>
                  setBudget(event.target.value)
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "10px",
                  border: "1px solid #d0d5dd",
                }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={createSimulation}
            style={{
              marginTop: "24px",
              padding: "13px 20px",
              border: "none",
              borderRadius: "10px",
              background: "#101828",
              color: "#ffffff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Criar campanha simulada
          </button>

          {message && (
            <div
              style={{
                marginTop: "16px",
                padding: "12px 14px",
                borderRadius: "10px",
                background: "#eff8ff",
                border: "1px solid #b2ddff",
                color: "#175cd3",
              }}
            >
              {message}
            </div>
          )}
        </section>

        <section
          style={{
            background: "#ffffff",
            border: "1px solid #e4e7ec",
            borderRadius: "16px",
            padding: "24px",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              color: "#101828",
            }}
          >
            Campanhas
          </h2>

          {state.campaigns.length === 0 ? (
            <p style={{ color: "#667085" }}>
              Ainda não existem campanhas simuladas.
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gap: "14px",
              }}
            >
              {state.campaigns.map((campaign) => {
                const product = state.products.find(
                  (item) =>
                    item.id === campaign.productId
                );

                return (
                  <div
                    key={campaign.id}
                    style={{
                      border: "1px solid #eaecf0",
                      borderRadius: "12px",
                      padding: "18px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "16px",
                        flexWrap: "wrap",
                      }}
                    >
                      <div>
                        <strong
                          style={{
                            color: "#101828",
                            fontSize: "17px",
                          }}
                        >
                          {product?.name ||
                            "Produto desconhecido"}
                        </strong>

                        <p
                          style={{
                            margin: "6px 0 0",
                            color: "#667085",
                          }}
                        >
                          Mercado: {campaign.market}
                        </p>

                        <p
                          style={{
                            margin: "4px 0 0",
                            color: "#667085",
                          }}
                        >
                          Objetivo: {campaign.objective}
                        </p>
                      </div>

                      <div
                        style={{
                          textAlign: "right",
                        }}
                      >
                        <strong
                          style={{
                           