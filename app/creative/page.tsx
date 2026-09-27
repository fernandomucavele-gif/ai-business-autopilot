"use client";

import { useMemo, useState } from "react";

type Market =
  | "Moçambique"
  | "Brasil"
  | "Portugal"
  | "África do Sul"
  | "Europa"
  | "EUA"
  | "Global";

type Creative = {
  title: string;
  type: string;
  hook: string;
  script: string;
  caption: string;
  angle: string;
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

const creativeTemplates: Creative[] = [
  {
    title: "Problema → Solução",
    type: "Vídeo curto",
    hook: "Ainda tens este problema todos os dias?",
    script:
      "Mostra o problema nos primeiros segundos. Apresenta o produto como solução. Demonstra rapidamente como funciona e termina com uma chamada para ação.",
    caption:
      "Uma solução simples para tornar o teu dia mais fácil. Descobre como funciona.",
    angle: "Demonstração prática",
  },
  {
    title: "Antes e Depois",
    type: "Vídeo curto",
    hook: "Olha a diferença depois de usar isto.",
    script:
      "Mostra a situação antes. Apresenta o produto. Mostra o resultado depois. Finaliza com uma chamada para ação.",
    caption:
      "Pequena mudança, grande diferença. Vê como este produto pode ajudar.",
    angle: "Transformação",
  },
  {
    title: "3 razões para experimentar",
    type: "Vídeo curto",
    hook: "3 razões para conhecer este produto.",
    script:
      "Apresenta três benefícios de forma rápida. Mostra imagens do produto enquanto explicas cada ponto.",
    caption:
      "3 motivos para conhecer este produto. Qual deles seria mais útil para ti?",
    angle: "Benefícios",
  },
  {
    title: "Oferta visual",
    type: "Imagem + anúncio",
    hook: "Uma solução prática para o teu dia.",
    script:
      "Criar uma imagem limpa do produto, destacar o principal benefício e colocar uma chamada para ação clara.",
    caption:
      "Conhece uma solução prática, simples e fácil de utilizar.",
    angle: "Venda direta",
  },
];

export default function CreativePage() {
  const [product, setProduct] = useState(
    "Organizador inteligente para casa"
  );
  const [market, setMarket] = useState<Market>("Moçambique");
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selected, setSelected] = useState<Creative | null>(null);

  const creatives = useMemo(() => {
    return creativeTemplates.map((creative) => ({
      ...creative,
      caption:
        creative.caption +
        ` Mercado: ${market}. Produto: ${product}.`,
    }));
  }, [market, product]);

  function generateCreatives() {
    if (!product.trim()) {
      return;
    }

    setGenerating(true);
    setGenerated(false);

    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
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
            🎨 Creative AI
          </h1>

          <p
            style={{
              color: "#64748b",
              lineHeight: 1.6,
            }}
          >
            Cria ideias de vídeos, imagens e textos de anúncios para os
            produtos encontrados pelo Research AI.
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
            🟢 Modo simulação ativo — os anúncios não serão publicados.
          </div>
        </section>

        <section
          style={{
            background: "#ffffff",
            borderRadius: "20px",
            padding: "24px",
            marginBottom: "20px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
          }}
        >
          <h2 style={{ marginTop: 0 }}>⚙️ Configurar criativos</h2>

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
                  border: "1px solid #dbe2ea",
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
          </div>

          <button
            onClick={generateCreatives}
            disabled={generating}
            style={{
              width: "100%",
              marginTop: "18px",
              padding: "14px",
              border: "none",
              borderRadius: "12px",
              background: generating ? "#94a3b8" : "#7c3aed",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: "15px",
            }}
          >
            {generating
              ? "🎨 A criar criativos..."
              : "✨ Gerar criativos"}
          </button>

          {generated && (
            <div
              style={{
                marginTop: "15px",
                padding: "13px",
                borderRadius: "12px",
                background: "#f5f3ff",
                color: "#6d28d9",
              }}
            >
              ✅ Criativos simulados gerados para{" "}
              <strong>{product}</strong>.
            </div>
          )}
        </section>

        <section
          style={{
            background: "#ffffff",
            borderRadius: "20px",
            padding: "24px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
          }}
        >
          <h2 style={{ marginTop: 0 }}>🎬 Biblioteca de criativos</h2>

          <p style={{ color: "#64748b" }}>
            Ideias preparadas para vídeos e anúncios.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(270px, 1fr))",
              gap: "16px",
              marginTop: "20px",
            }}
          >
            {creatives.map((creative) => (
              <article
                key={creative.title}
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: "16px",
                  padding: "18px",
                  background: "#fafcff",
                }}
              >
                <div style={{ fontSize: "30px" }}>🎬</div>

                <h3 style={{ margin: "10px 0" }}>
                  {creative.title}
                </h3>

                <p style={{ margin: "7px 0" }}>
                  📱 <strong>Tipo:</strong> {creative.type}
                </p>

                <p style={{ margin: "7px 0" }}>
                  🎯 <strong>Ângulo:</strong> {creative.angle}
                </p>

                <div
                  style={{
                    marginTop: "12px",
                    padding: "12px",
                    borderRadius: "10px",
                    background: "#f5f3ff",
                    color: "#5b21b6",
                    fontWeight: 700,
                  }}
                >
                  “{creative.hook}”
                </div>

                <p
                  style={{
                    color: "#475569",
                    lineHeight: 1.5,
                    fontSize: "14px",
                  }}
                >
                  {creative.script}
                </p>

                <button
                  onClick={() => setSelected(creative)}
                  style={{
                    width: "100%",
                    padding: "11px",
                    border: "none",
                    borderRadius: "10px",
                    background: "#0f172a",
                    color: "#ffffff",
                    fontWeight: 700,
                  }}
                >
                  Ver criativo
                </button>
              </article>
            ))}
          </div>
        </section>

        <section
          style={{
            marginTop: "20px",
            padding: "20px",
            borderRadius: "16px",
            background: "#fff7ed",
            border: "1px solid #fed7aa",
            color: "#9a3412",
          }}
        >
          ⚠️ <strong>Modo de teste:</strong> o Creative AI apenas prepara
          conteúdos. Nenhum anúncio é publicado automaticamente.
        </section>

        {selected && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "520px",
                background: "#ffffff",
                borderRadius: "20px",
                padding: "25px",
              }}
            >
              <h2>🎨 {selected.title}</h2>

              <p>
                <strong>Produto:</strong> {product}
              </p>

              <p>
                <strong>Mercado:</strong> {market}
              </p>

              <p>
                <strong>Hook:</strong> {selected.hook}
              </p>

              <p>
                <strong>Roteiro:</strong> {selected.script}
              </p>

              <p>
                <strong>Texto:</strong> {selected.caption}
              </p>

              <p>
                <strong>Ângulo:</strong> {selected.angle}
              </p>

              <button
                onClick={() => setSelected(null)}
                style={{
                  width: "100%",
                  marginTop: "15px",
                  padding: "13px",
                  border: "none",
                  borderRadius: "10px",
                  background: "#7c3aed",
                  color: "#ffffff",
                  fontWeight: 700,
                }}
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
  }
