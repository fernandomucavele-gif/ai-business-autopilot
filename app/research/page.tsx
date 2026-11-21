"use client";

import { useState } from "react";
import { useAutopilot } from "../context/autopilot-context";
import { classifyProductOpportunity, classifyMarketPotential, type MarketLevel } from "../../lib/autopilot";
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

  const [unitCost, setUnitCost] =
    useState("250");

  const [demand, setDemand] = useState<MarketLevel>("Por avaliar");
  const [competition, setCompetition] = useState<MarketLevel>("Por avaliar");
  const [evidenceNote, setEvidenceNote] = useState("");
  const [productQuery, setProductQuery] = useState("");
  const [liveTrends, setLiveTrends] = useState<{ title: string; traffic: string; publishedAt: string; link: string; geo: string }[]>([]);
  const [trendFeeds, setTrendFeeds] = useState<{ geo: string; ok: boolean; count: number }[]>([]);
  const [trendNote, setTrendNote] = useState("");
  const [trendLoading, setTrendLoading] = useState(false);
  const [trendCheckedAt, setTrendCheckedAt] = useState("");

  const [searching, setSearching] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [results, setResults] =
    useState<string[]>([]);

  async function loadLiveTrends() {
    setTrendLoading(true);
    setTrendNote("");
    setLiveTrends([]);
    try {
      const response = await fetch(`/api/research/trends?market=${encodeURIComponent(market)}&q=${encodeURIComponent(productQuery.trim())}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Não foi possível consultar as tendências.");
      setLiveTrends(data.trends || []);
      setTrendFeeds(data.feeds || []);
      setTrendNote(data.note || "Dados externos recebidos.");
      setTrendCheckedAt(data.checkedAt || "");
    } catch (error) {
      setTrendNote(error instanceof Error ? error.message : "Falha ao consultar a fonte externa.");
    } finally {
      setTrendLoading(false);
    }
  }

  function runResearch() {
    const numericPrice = Number(price);
    const numericCost = Number(unitCost);
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      setMessage("⚠️ Define um preço estimado válido, maior que zero.");
      return;
    }
    if (!Number.isFinite(numericCost) || numericCost < 0) {
      setMessage("⚠️ Define um custo estimado válido, igual ou superior a zero.");
      return;
    }
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
    const numericPrice = Number(price);
    const numericCost = Number(unitCost);
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      setMessage("⚠️ Define um preço estimado válido, maior que zero.");
      return;
    }
    if (!Number.isFinite(numericCost) || numericCost < 0) {
      setMessage("⚠️ Define um custo estimado válido, igual ou superior a zero.");
      return;
    }

    const alreadyExists = state.products.some(
      (product) =>
        product.name.trim().toLocaleLowerCase() === name.trim().toLocaleLowerCase() &&
        product.market === market
    );

    if (alreadyExists) {
      setMessage("⚠️ Este produto já existe no Autopilot para esse mercado.");
      return;
    }

    addProduct(
      name,
      market,
      numericPrice,
      numericCost,
      { demand, competition, evidenceNote: evidenceNote.trim() || undefined }
    );

    setMessage(
      `${name} foi adicionado ao ecrã do Autopilot. Aguarda a confirmação de gravação no indicador superior.`
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

          <p
            style={{
              marginTop: "12px",
              padding: "12px",
              borderRadius: "10px",
              background: "#fffaeb",
              border: "1px solid #fedf89",
              color: "#93370d",
              fontSize: "14px",
            }}
          >
            MODO DE DEMONSTRAÇÃO: as sugestões abaixo são exemplos ilustrativos,
            não resultados de pesquisa em tempo real. Confirma procura, concorrência,
            fornecedores, custos e impostos antes de investir.
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
                min="1"
                step="0.01"
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

            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              Custo estimado por unidade

              <input
                type="number"
                min="0"
                step="0.01"
                value={unitCost}
                onChange={(event) => setUnitCost(event.target.value)}
                style={{
                  padding: "12px",
                  borderRadius: "10px",
                  border: "1px solid #d0d5dd",
                }}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              Procura estimada (avaliação manual)
              <select value={demand} onChange={(event) => setDemand(event.target.value as MarketLevel)} style={{ padding: "12px", borderRadius: "10px", border: "1px solid #d0d5dd", background: "#fff" }}>
                <option>Por avaliar</option>
                <option>Baixa</option>
                <option>Média</option>
                <option>Alta</option>
              </select>
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              Concorrência estimada (avaliação manual)
              <select value={competition} onChange={(event) => setCompetition(event.target.value as MarketLevel)} style={{ padding: "12px", borderRadius: "10px", border: "1px solid #d0d5dd", background: "#fff" }}>
                <option>Por avaliar</option>
                <option>Baixa</option>
                <option>Média</option>
                <option>Alta</option>
              </select>
            </label>
          </div>

          <label style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "14px" }}>
            Produto ou termo a pesquisar no Google Trends
            <input value={productQuery} onChange={(event) => setProductQuery(event.target.value)} maxLength={80} placeholder="Ex.: garrafa térmica inteligente" style={{ padding: "12px", borderRadius: "10px", border: "1px solid #d0d5dd" }} />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "14px" }}>
            Fonte ou observações da pesquisa (opcional)
            <textarea value={evidenceNote} onChange={(event) => setEvidenceNote(event.target.value)} rows={2} maxLength={500} placeholder="Ex.: observação de lojas, inquérito a clientes, tendências consultadas..." style={{ padding: "12px", borderRadius: "10px", border: "1px solid #d0d5dd" }} />
          </label>

          <p style={{ color: "#475467", fontSize: "14px", marginTop: "14px" }}>
            Margem bruta estimada: {(Number(price) - Number(unitCost)).toFixed(2)} MT por unidade
            {Number(price) > 0 ? ` (${(((Number(price) - Number(unitCost)) / Number(price)) * 100).toFixed(1)}%)` : ""}.
            Não inclui transporte, impostos, taxas, devoluções, armazenamento nem publicidade.
          </p>
          <p style={{ color: "#475467", fontSize: "14px" }}>
            Potencial de mercado: <strong>{classifyMarketPotential({ demand, competition })}</strong>.
            Esta classificação usa apenas as tuas estimativas, não dados automáticos do mercado.
          </p>

          <button
            onClick={loadLiveTrends}
            disabled={trendLoading}
            style={{
              marginTop: "20px",
              width: "100%",
              padding: "13px",
              border: "1px solid #1570ef",
              borderRadius: "10px",
              background: "#eff8ff",
              color: "#175cd3",
              cursor: trendLoading ? "wait" : "pointer",
              fontWeight: 700,
            }}
          >
            {trendLoading ? "A consultar fonte externa..." : "Consultar tendências reais do Google Trends"}
          </button>

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

        <section style={{ background: "#ffffff", borderRadius: "16px", padding: "20px", marginBottom: "20px", border: "1px solid #e4e7ec" }}>
          <h2>Tendências externas — Google Trends</h2>
          <p style={{ color: "#667085", fontSize: "14px" }}>
            Mercado: {market}. Consulta do feed público de pesquisas em tendência. Para comparar um produto específico, abre também
            <a href={`https://trends.google.com/trends/explore?geo=${market === "Moçambique" ? "MZ" : market === "Brasil" ? "BR" : market === "Portugal" ? "PT" : market === "África do Sul" ? "ZA" : market === "EUA" ? "US" : "GB"}&q=${encodeURIComponent(productQuery.trim() || "produto")}`} target="_blank" rel="noreferrer" style={{ color: "#175cd3", marginLeft: "4px" }}>Google Trends Explore</a>.
          </p>
          {trendCheckedAt && <p style={{ color: "#667085", fontSize: "12px" }}>Última consulta: {new Date(trendCheckedAt).toLocaleString()}</p>}
          {trendFeeds.length > 0 && <p style={{ color: "#475467", fontSize: "13px" }}>Feeds consultados: {trendFeeds.map((feed) => `${feed.geo}: ${feed.ok ? `${feed.count} tendências` : "indisponível"}`).join(" · ")}</p>}
          {trendNote && <p style={{ background: "#fffaeb", border: "1px solid #fedf89", borderRadius: "8px", padding: "10px", color: "#93370d", fontSize: "13px" }}>{trendNote}</p>}
          {liveTrends.length === 0 && !trendLoading && <p style={{ color: "#667085" }}>Ainda sem tendências carregadas. Clica em “Consultar tendências reais” para obter os dados mais recentes disponíveis.</p>}
          {liveTrends.length > 0 && <div style={{ display: "grid", gap: "10px" }}>
            {liveTrends.map((trend, index) => <div key={`${trend.geo}-${trend.title}-${index}`} style={{ padding: "12px", border: "1px solid #e4e7ec", borderRadius: "10px" }}>
              <strong>{trend.title}</strong>
              <p style={{ margin: "5px 0", color: "#667085", fontSize: "13px" }}>País/região: {trend.geo} · Tráfego aproximado indicado pelo feed: {trend.traffic}</p>
              {trend.publishedAt && <p style={{ margin: "4px 0", color: "#667085", fontSize: "12px" }}>{trend.publishedAt}</p>}
              <a href={trend.link} target="_blank" rel="noreferrer" style={{ color: "#175cd3", fontSize: "13px" }}>Ver pesquisa relacionada</a>
            </div>)}
          </div>}
          <p style={{ color: "#667085", fontSize: "12px", marginTop: "12px" }}>Nota: o feed lista tendências gerais e não fornece volume de pesquisa por produto. Não encontrar o nome do produto na lista não significa que não exista procura.</p>
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
              Sugestões de produtos (exemplos)
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
                    Preço de venda: {price} MT
                  </p>

                  <p style={{ color: "#475467" }}>
                    Custo estimado: {unitCost} MT
                  </p>

                  <p style={{ fontWeight: 700, color: Number(price) > Number(unitCost) ? "#027a48" : "#b42318" }}>
                    Margem bruta: {(Number(price) - Number(unitCost)).toFixed(2)} MT
                    {Number(price) > 0 ? ` (${(((Number(price) - Number(unitCost)) / Number(price)) * 100).toFixed(1)}%)` : ""}
                  </p>
                  <p style={{ fontWeight: 700 }}>Classificação: {classifyProductOpportunity(Number(price), Number(unitCost))}</p>

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

                    <div style={{ display: "grid", gap: "4px", fontSize: "14px" }}>
                      <span>Venda: {product.price.toFixed(2)} MT</span>
                      {typeof product.estimatedUnitCost === "number" ? (
                        <>
                          <span>Custo estimado: {product.estimatedUnitCost.toFixed(2)} MT</span>
                          <strong style={{ color: product.price > product.estimatedUnitCost ? "#027a48" : "#b42318" }}>
                            Margem bruta: {(product.price - product.estimatedUnitCost).toFixed(2)} MT
                            {" "}({product.price > 0 ? (((product.price - product.estimatedUnitCost) / product.price) * 100).toFixed(1) : "0.0"}%)
                          </strong>
                        </>
                      ) : (
                        <span style={{ color: "#667085" }}>Custo estimado ainda não definido</span>
                      )}
                      <strong>Classificação financeira: {classifyProductOpportunity(product.price, product.estimatedUnitCost)}</strong>
                      <strong>Potencial de mercado: {classifyMarketPotential(product.marketAssessment)}</strong>
                      {product.marketAssessment && <span>Procura: {product.marketAssessment.demand} · Concorrência: {product.marketAssessment.competition}</span>}
                      {product.marketAssessment?.evidenceNote && <span>Notas: {product.marketAssessment.evidenceNote}</span>}
                    </div>

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