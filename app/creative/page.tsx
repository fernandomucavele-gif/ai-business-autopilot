"use client";

import { useMemo, useState } from "react";
import type { CreativeRecord } from "../../lib/autopilot";
import { useAutopilot } from "../context/autopilot-context";

type CreativeTemplate = {
  key: string;
  title: string;
  format: CreativeRecord["format"];
  hook: string;
  script: string;
  caption: string;
  angle: string;
  headline: string;
};

const templates: CreativeTemplate[] = [
  {
    key: "problem-solution",
    title: "Problema → Solução",
    format: "video",
    hook: "Ainda tens este problema todos os dias?",
    script: "Mostra o problema nos primeiros segundos. Apresenta o produto como solução. Demonstra como funciona e termina com uma chamada para ação.",
    caption: "Uma solução simples para tornar o teu dia mais fácil. Descobre como funciona.",
    angle: "Demonstração prática",
    headline: "Descobre uma forma mais simples",
  },
  {
    key: "before-after",
    title: "Antes e Depois",
    format: "video",
    hook: "Olha a diferença depois de usar isto.",
    script: "Mostra a situação inicial, apresenta o produto e demonstra o resultado. Usa apenas resultados reais e comprováveis.",
    caption: "Pequena mudança, grande diferença. Vê como este produto pode ajudar.",
    angle: "Transformação",
    headline: "Vê a diferença",
  },
  {
    key: "three-reasons",
    title: "3 razões para experimentar",
    format: "video",
    hook: "3 razões para conhecer este produto.",
    script: "Apresenta três benefícios verificáveis de forma rápida. Mostra o produto enquanto explicas cada ponto.",
    caption: "3 motivos para conhecer este produto. Qual deles seria mais útil para ti?",
    angle: "Benefícios",
    headline: "3 motivos para conhecer",
  },
  {
    key: "visual-offer",
    title: "Oferta visual",
    format: "image",
    hook: "Uma solução prática para o teu dia.",
    script: "Cria uma imagem limpa do produto, destaca um benefício comprovável e coloca uma chamada para ação clara.",
    caption: "Conhece uma solução prática, simples e fácil de utilizar.",
    angle: "Apresentação do produto",
    headline: "Conhece o produto",
  },
];

const panel: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e5eaf1",
  borderRadius: 16,
  padding: 20,
  marginBottom: 18,
};

const field: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: 12,
  border: "1px solid #d7dfeb",
  borderRadius: 10,
  background: "#fff",
  fontSize: 15,
  marginTop: 7,
};

export default function CreativePage() {
  const { state, addCreative } = useAutopilot();
  const [productId, setProductId] = useState("");
  const [campaignId, setCampaignId] = useState("");
  const [notice, setNotice] = useState("");

  const product = state.products.find((item) => item.id === productId);
  const campaigns = useMemo(
    () => state.campaigns.filter((item) => item.productId === productId),
    [state.campaigns, productId]
  );
  const savedForCampaign = state.creatives.filter((item) => item.campaignId === campaignId);

  function chooseProduct(id: string) {
    setProductId(id);
    setCampaignId("");
    setNotice("");
  }

  function saveTemplate(template: CreativeTemplate) {
    if (!product || !campaignId) {
      setNotice("Seleciona primeiro um produto e uma campanha desse produto no modo de simulação.");
      return;
    }

    const record: CreativeRecord = {
      id: `CREATIVE-${campaignId}-${template.key}`,
      campaignId,
      productId: product.id,
      name: template.title,
      format: template.format,
      headline: `${template.headline} — ${product.name}`,
      primaryText: `${template.caption} Mercado: ${product.market}.`,
      callToAction: "Saber mais",
      hook: template.hook,
      script: template.script,
      angle: template.angle,
      status: "draft",
    };

    addCreative(record);
    setNotice(`Criativo "${template.title}" guardado como rascunho na campanha simulada.`);
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f4f7fb", padding: "26px 16px", color: "#172033", fontFamily: "Arial, sans-serif" }}>
      <div style={{ maxWidth: 1050, margin: "0 auto" }}>
        <header style={panel}>
          <div style={{ color: "#64748b", fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>AI BUSINESS AUTOPILOT</div>
          <h1 style={{ fontSize: 30, margin: "8px 0" }}>🎨 Creative AI</h1>
          <p style={{ color: "#64748b", lineHeight: 1.6, marginBottom: 0 }}>
            Prepara textos, títulos e roteiros e guarda cada criativo na campanha correspondente.
          </p>
          <div style={{ marginTop: 16, padding: 13, borderRadius: 10, background: "#fff7e6", color: "#8a4b08", fontWeight: 600 }}>
            Modo simulação permanente: os criativos ficam como rascunhos. Nenhum anúncio é publicado.
          </div>
        </header>

        <section style={panel}>
          <h2 style={{ marginTop: 0 }}>1. Escolher produto e campanha</h2>
          {state.products.length === 0 ? (
            <p style={{ color: "#64748b" }}>Ainda não existem produtos. Adiciona primeiro um produto no Research AI.</p>
          ) : (
            <>
              <label style={{ display: "block", fontWeight: 700 }}>
                Produto
                <select value={productId} onChange={(event) => chooseProduct(event.target.value)} style={field}>
                  <option value="">Selecionar produto...</option>
                  {state.products.map((item) => (
                    <option key={item.id} value={item.id}>{item.name} — {item.market}</option>
                  ))}
                </select>
              </label>
              <label style={{ display: "block", fontWeight: 700, marginTop: 14 }}>
                Campanha simulada
                <select value={campaignId} onChange={(event) => { setCampaignId(event.target.value); setNotice(""); }} style={field} disabled={!productId}>
                  <option value="">Selecionar campanha...</option>
                  {campaigns.map((item) => (
                    <option key={item.id} value={item.id}>{item.objective} — {item.market} — {item.id}</option>
                  ))}
                </select>
              </label>
              {productId && campaigns.length === 0 && (
                <p style={{ color: "#a15c00" }}>Este produto ainda não tem campanha. Cria uma campanha no Ads AI, sem a publicar, e volta aqui.</p>
              )}
            </>
          )}
        </section>

        <section style={panel}>
          <h2 style={{ marginTop: 0 }}>2. Biblioteca de modelos</h2>
          <p style={{ color: "#64748b" }}>Escolhe um modelo para o produto e guarda-o como rascunho associado à campanha selecionada.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 14 }}>
            {templates.map((template) => (
              <article key={template.key} style={{ border: "1px solid #e2e8f0", borderRadius: 13, padding: 16, background: "#fbfcfe" }}>
                <div style={{ color: "#7c3aed", fontWeight: 700, fontSize: 12 }}>{template.format === "video" ? "VÍDEO" : "IMAGEM"}</div>
                <h3>{template.title}</h3>
                <p><strong>Gancho:</strong> {template.hook}</p>
                <p style={{ color: "#526071", fontSize: 14, lineHeight: 1.5 }}>{template.script}</p>
                <p style={{ color: "#526071", fontSize: 14 }}><strong>Texto:</strong> {template.caption}</p>
                <button
                  type="button"
                  onClick={() => saveTemplate(template)}
                  disabled={!campaignId}
                  style={{ width: "100%", padding: 12, border: 0, borderRadius: 9, background: campaignId ? "#6d35c5" : "#aeb6c2", color: "#fff", fontWeight: 700, cursor: campaignId ? "pointer" : "not-allowed" }}
                >
                  Guardar rascunho
                </button>
              </article>
            ))}
          </div>
          {notice && <p role="status" style={{ marginTop: 16, color: "#175c36", fontWeight: 600 }}>{notice}</p>}
        </section>

        <section style={panel}>
          <h2 style={{ marginTop: 0 }}>3. Criativos guardados ({state.creatives.length})</h2>
          {state.creatives.length === 0 ? (
            <p style={{ color: "#64748b" }}>Ainda não guardaste criativos.</p>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {state.creatives.map((creative) => {
                const linkedProduct = state.products.find((item) => item.id === creative.productId);
                const linkedCampaign = state.campaigns.find((item) => item.id === creative.campaignId);
                return (
                  <article key={creative.id} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 14 }}>
                    <strong>{creative.name}</strong>
                    <p style={{ margin: "6px 0" }}>{creative.headline}</p>
                    <p style={{ color: "#64748b", fontSize: 13, margin: "5px 0" }}>
                      Produto: {linkedProduct?.name ?? "Não encontrado"} · Campanha: {linkedCampaign?.objective ?? "Não encontrada"} · Formato: {creative.format}
                    </p>
                    <span style={{ color: "#8a4b08", fontWeight: 700, fontSize: 13 }}>Rascunho — simulação</span>
                  </article>
                );
              })}
            </div>
          )}
          {campaignId && <p style={{ color: "#64748b", marginBottom: 0 }}>Rascunhos associados à campanha selecionada: {savedForCampaign.length}</p>}
        </section>
      </div>
    </main>
  );
}
