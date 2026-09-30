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

type Ad = {
  name: string;
  platform: string;
  hook: string;
  headline: string;
  text: string;
  audience: string;
  budget: string;
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

const adTemplates: Ad[] = [
  {
    name: "Problema e solução",
    platform: "TikTok / Reels",
    hook: "Ainda tens este problema?",
    headline: "Uma solução simples para o teu dia",
    text:
      "Descobre uma forma prática de resolver este problema. Vê como funciona e conhece o produto.",
    audience:
      "Pessoas interessadas em casa e organização",
    budget: "Simulação: 500 MT/dia",
  },
  {
    name: "Demonstração rápida",
    platform: "TikTok",
    hook: "Olha como isto funciona.",
    headline: "Vê o produto em ação",
    text:
      "Demonstração rápida mostrando o produto, o funcionamento e o resultado final.",
    audience:
      "Público interessado em produtos práticos",
    budget: "Simulação: 400 MT/dia",
  },
  {
    name: "Benefícios",
    platform: "Facebook / Instagram",
    hook: "3 motivos para conhecer este produto",
    headline: "Mais praticidade no teu dia",
    text:
      "Conhece os principais benefícios e descobre porque este produto pode ser útil para ti.",
    audience:
      "Adultos interessados em soluções para o dia a dia",
    budget: "Simulação: 600 MT/dia",
  },
  {
    name: "Oferta",
    platform: "Facebook / Instagram",
    hook: "Uma oportunidade que vale a pena conhecer.",
    headline: "Conhece esta solução",
    text:
      "Apresentação visual do produto com benefício principal e chamada para ação.",
    audience:
      "Público amplo do mercado selecionado",
    budget: "Simulação: 500 MT/dia",
  },
];

export default function AdsPage() {
  const { state, addCampaign } = useAutopilot();

  const [product, setProduct] = useState(
    "Organizador inteligente para casa"
  );

  const [market, setMarket] =
    useState<Market>("Moçambique");

  const [platform, setPlatform] = useState("Todas");

  const [generating, setGenerating] =
    useState(false);

  const [generated, setGenerated] =
    useState(false);

  const [selectedAd, setSelectedAd] =
    useState<Ad | null>(null);

  const [sourceProductId, setSourceProductId] =
    useState("");

  const ads = useMemo(() => {
    if (platform === "Todas") {
      return adTemplates;
    }

    return adTemplates.filter((ad) =>
      ad.platform
        .toLowerCase()
        .includes(platform.toLowerCase())
    );
  }, [platform]);

  function selectAutopilotProduct(
    productId: string
  ) {
    const selectedProduct = state.products.find(
      (item) => item.id === productId
    );

    if (!selectedProduct) {
      return;
    }

    setSourceProductId(productId);
    setProduct(selectedProduct.name);
    setMarket(selectedProduct.market);
    setGenerated(false);
  }

  function generateAds() {
    if (!product.trim()) {
      return;
    }

    setGenerating(true);
    setGenerated(false);

    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);

      if (sourceProductId) {
        addCampaign(
          sourceProductId,
          market,
          "Vendas",
          500
        );
      }
    }, 1200);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        padding: "30px 18px",
        color: "#172033",
      }}
    >
      <div
        style={{
          maxWidth: "1150px",
          margin: "0 auto",
        }}
      >
        <section
          style={{
            background: "#ffffff",
            borderRadius: "20px",
            padding: "28px",
            marginBottom: "20px",
            boxShadow:
              "0 8px 25px rgba(0,0,0,0.06)",
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
            📢 Ads AI
          </h1>

          <p
            style={{
              color: "#64748b",
              lineHeight: 1.6,
            }}
          >
            Prepara campanhas e variações de anúncios
            com base nos produtos encontrados pelo
            Autopilot.
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
            🟢 Modo simulação ativo — publicação real
            de anúncios está bloqueada.
          </div>
        </section>

        <section
          style={{
            background: "#ffffff",
            borderRadius: "20px",
            padding: "24px",
            marginBottom: "20px",
            boxShadow:
              "0 8px 25px rgba(0,0,0,0.06)",
          }}
        >
          <h2 style={{ marginTop: 0 }}>
            📦 Produtos do Autopilot
          </h2>

          {state.products.length === 0 ? (
            <p style={{ color: "#64748b" }}>
              Ainda não existem produtos adicionados
              pelo Research AI.
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "12px",
              }}
            >
              {state.products.map((item) => (
                <button
                  key={item.id}
                  onClick={() =>
                    selectAutopilotProduct(item.id)
                  }
                  style={{
                    textAlign: "left",
                    padding: "15px",
                    borderRadius: "12px",
                    border:
                      sourceProductId === item.id
                        ? "2px solid #dc2626"
                        : "1px solid #e2e8f0",
                    background:
                      sourceProductId === item.id
                        ? "#fef2f2"
                        : "#fafcff",
                    cursor: "pointer",
                  }}
                >
                  <strong>{item.name}</strong>

                  <div
                    style={{
                      marginTop: "6px",
                      color: "#64748b",
                      fontSize: "13px",
                    }}
                  >
                    {item.market} • {item.price} MT
                  </div>

                  <div
                    style={{
                      marginTop: "6px",
                      color: "#dc2626",
                      fontSize: "13px",
                      fontWeight: 700,
                    }}
                  >
                    Criar campanha →
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        <section
          style={{
            background: "#ffffff",
            borderRadius: "20px",
            padding: "24px",
            marginBottom: "20px",
            boxShadow:
              "0 8px 25px rgba(0,0,0,0.06)",
          }}
        >
          <h2 style={{ marginTop: 0 }}>
            ⚙️ Criar campanha
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "minmax(220px, 2fr) minmax(180px, 1fr)",
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
                Produto
              </label>

              <input
                value={product}
                onChange={(event) =>
                  setProduct(event.target.value)
                }
                placeholder="Nome do produto"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "13px",
                  borderRadius: "10px",
                  border:
                    "1px solid #dbe2ea",
                }}
              />
            </div>

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
                  setMarket(
                    event.target.value as Market
                  )
                }
                style={{
                  width: "100%",
                  padding: "13px",
                  borderRadius: "10px",
                  border:
                    "1px solid #dbe2ea",
                  background: "#ffffff",
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
            </div>
          </div>

          <div style={{ marginTop: "14px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "7px",
                fontWeight: 700,
              }}
            >
              Plataforma
            </label>

            <select
              value={platform}
              onChange={(event) =>
                setPlatform(event.target.value)
              }
              style={{
                width: "100%",
                padding: "13px",
                borderRadius: "10px",
                border:
                  "1px solid #dbe2ea",
                background: "#ffffff",
              }}
            >
              <option>Todas</option>
              <option>TikTok</option>
              <option>Instagram</option>
              <option>Facebook</option>
            </select>
          </div>

          <button
            onClick={generateAds}
            disabled={generating}
            style={{
              width: "100%",
              marginTop: "18px",
              padding: "14px",
              border: "none",
              borderRadius: "12px",
              background: generating
                ? "#94a3b8"
                : "#dc2626",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: "15px",
              cursor: generating
                ? "not-allowed"
                : "pointer",
            }}
          >
            {generating
              ? "📢 A preparar anúncios..."
              : "🚀 Gerar campanha"}
          </button>

          {generated && (
            <div
              style={{
                marginTop: "15px",
                padding: "13px",
                borderRadius: "12px",
                background: "#fef2f2",
                color: "#b91c1c",
              }}
            >
              ✅ Campanha simulada criada para{" "}
              <strong>{product}</strong>.
              <br />
              Nenhum anúncio real foi publicado.
            </div>
          )}
        </section>

        <section
          style={{
            background: "#ffffff",
            borderRadius: "20px",
            padding: "24px",
            boxShadow:
              "0 8px 25px rgba(0,0,0,0.06)",
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
                📣 Anúncios preparados
              </h2>

              <p
                style={{
                  color: "#64748b",
                }}
              >
                Variações que o Supervisor poderá
                analisar posteriormente.
              </p>
            </div>

            <strong>
              {ads.length} variações
            </strong>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(270px, 1fr))",
              gap: "16px",
              marginTop: "20px",
            }}
          >
            {ads.map((ad) => (
              <article
                key={ad.name}
                style={{
                  border:
                    "1px solid #e2e8f0",
                  borderRadius: "16px",
                  padding: "18px",
                  background: "#fafcff",
                }}
              >
                <div style={{ fontSize: "30px" }}>
                  📢
                </div>

                <h3
                  style={{
                    margin: "10px 0",
                  }}
                >
                  {ad.name}
                </h3>

                <p style={{ margin: "7px 0" }}>
                  📱{" "}
                  <strong>
                    Plataforma:
                  </strong>{" "}
                  {ad.platform}
                </p>

                <p style={{ margin: "7px 0" }}>
                  🎯{" "}
                  <strong>
                    Público:
                  </strong>{" "}
                  {ad.audience}
                </p>

                <p style={{ margin: "7px 0" }}>
                  💰{" "}
                  <strong>
                    Orçamento:
                  </strong>{" "}
                  {ad.budget}
                </p>

                <div
                  style={{
                    marginTop: "12px",
                    padding: "12px",
                    borderRadius: "10px",
                    background: "#fef2f2",
                    color: "#991b1b",
                    fontWeight: 700,
                  }}
                >
                  “{ad.hook}”
                </div>

                <h4>
                  {ad.headline}
                </h4>

                <p
                  style={{
                    color: "#475569",
                    lineHeight: 1.5,
                    fontSize: "14px",
                  }}
                >
                  {ad.text}
                </p>

                <button
                  onClick={() =>
                    setSelectedAd(ad)
                  }
                  style={{
                    width: "100%",
                    padding: "11px",
                    border: "none",
                    borderRadius: "10px",
                    background: "#0f172a",
                    color: "#ffffff",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Ver anúncio
                </button>
              </article>
            ))}
          </div>
        </section>

        <section
          style={{
            marginTop: "20px",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "15px",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              padding: "20px",
            }}
          >
            <strong>📊 Métricas</strong>
            <p
              style={{
                color: "#64748b",
              }}
            >
              CTR, CPC, conversões e ROAS serão
              acompanhados quando os anúncios reais
              forem ativados.
            </p>
          </div>

          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              padding: "20px",
            }}
          >
            <strong>🤖 Otimização</strong>
            <p
              style={{
                color: "#64748b",
              }}
            >
              O Supervisor poderá identificar
              anúncios com melhor desempenho e
              preparar novas variações.
            </p>
          </div>

          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              padding: "20px",
            }}
          >
            <strong>🛑 Proteção</strong>
            <p
              style={{
                color: "#64748b",
              }}
            >
              Publicação e gastos reais continuam
              bloqueados nesta fase.
            </p>
          </div>
        </section>

        <section
          style={{
            marginTop: "20px",
            padding: "20px",
            borderRadius: "16px",
            background: "#fff7ed",
            border:
              "1px solid #fed7aa",
            color: "#9a3412",
          }}
        >
          ⚠️ <strong>Modo de teste:</strong>{" "}
          esta versão apenas prepara campanhas.
          Não publica anúncios nem gasta dinheiro.
        </section>

        <section
          style={{
            marginTop: "20px",
            background: "#ffffff",
            borderRadius: "16px",
            padding: "20px",
          }}
        >
          <h2 style={{ marginTop: 0 }}>
            📈 Campanhas no Autopilot
          </h2>

          {state.campaigns.length === 0 ? (
            <p
              style={{
                color: "#64748b",
              }}
            >
              Nenhuma campanha simulada criada ainda.
            </p>
          ) : (
            state.campaigns.map(
              (campaign) => (
                <div
                  key={campaign.id}
                  style={{
                    padding: "14px",
                    marginTop: "10px",
                    borderRadius: "12px",
                    background: "#f8fafc",
                    border:
                      "1px solid #e2e8f0",
                  }}
                >
                  <strong>
                    {campaign.id}
                  </strong>

                  <div
                    style={{
                      marginTop: "5px",
                      color: "#64748b",
                    }}
                  >
                    Mercado:{" "}
                    {campaign.market} •
                    Objetivo:{" "}
                    {campaign.objective} •
                    Orçamento:{" "}
                    {campaign.dailyBudget} MT/dia
                  </div>

                  <div
                    style={{
                      marginTop: "5px",
                      color: "#16a34a",
                      fontWeight: 700,
                    }}
                  >
                    🟢 Simulação
                  </div>
                </div>
              )
            )
          )}
        </section>

        {selectedAd && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background:
                "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "520px",
                maxHeight: "90vh",
                overflowY: "aut