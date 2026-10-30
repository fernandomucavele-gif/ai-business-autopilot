"use client";

import { useMemo, useState } from "react";
import { useAutopilot } from "../context/autopilot-context";
import type { Campaign } from "../../lib/autopilot";

const objectives: Campaign["objective"][] = ["Vendas", "Leads", "Tráfego", "Reconhecimento"];

export default function AdsPage() {
  const { state, addCampaign } = useAutopilot();
  const [productId, setProductId] = useState("");
  const [market, setMarket] = useState<Campaign["market"]>("Moçambique");
  const [objective, setObjective] = useState<Campaign["objective"]>("Vendas");
  const [budget, setBudget] = useState("0");
  const [message, setMessage] = useState("");

  const selectedProduct = useMemo(
    () => state.products.find(product => product.id === productId),
    [state.products, productId]
  );

  function createCampaign() {
    const dailyBudget = Number(budget);
    if (!selectedProduct) {
      setMessage("Adiciona ou seleciona primeiro um produto no Research AI.");
      return;
    }
    if (!Number.isFinite(dailyBudget) || dailyBudget < 0) {
      setMessage("Introduz um orçamento de teste válido (zero ou superior).");
      return;
    }

    addCampaign(selectedProduct.id, market, objective, dailyBudget);
    setMessage("Campanha guardada no Autopilot em modo de simulação. Nenhum anúncio foi publicado.");
    setBudget("0");
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f4f7fb", padding: 24, fontFamily: "Arial, sans-serif", color: "#111827" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <h1>📢 Ads AI</h1>
        <p style={{ color: "#667085" }}>Planeamento e acompanhamento de campanhas publicitárias.</p>

        <div style={{ background: "#fffaeb", color: "#92400e", padding: 16, borderRadius: 12, marginBottom: 20 }}>
          <strong>🛡️ Modo simulação permanentemente ativo</strong>
          <p style={{ marginBottom: 0 }}>As campanhas ficam guardadas no Autopilot, mas nenhum anúncio real é publicado e nenhum orçamento é gasto.</p>
        </div>

        <section style={{ background: "#fff", padding: 20, borderRadius: 16, marginBottom: 20 }}>
          <h2>➕ Nova campanha de teste</h2>
          {state.products.length === 0 ? (
            <p style={{ color: "#667085" }}>Ainda não existem produtos. Vai ao Research AI e adiciona um produto antes de criar uma campanha.</p>
          ) : (
            <>
              <label style={{ display: "block", marginBottom: 12, fontWeight: 600 }}>
                Produto
                <select value={productId} onChange={event => { setProductId(event.target.value); setMessage(""); }} style={fieldStyle}>
                  <option value="">Selecionar produto...</option>
                  {state.products.map(product => <option key={product.id} value={product.id}>{product.name}</option>)}
                </select>
              </label>

              <label style={{ display: "block", marginBottom: 12, fontWeight: 600 }}>
                Mercado
                <select value={market} onChange={event => setMarket(event.target.value as Campaign["market"])} style={fieldStyle}>
                  {["Moçambique", "Brasil", "Portugal", "África do Sul", "Europa", "EUA", "Global"].map(item => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>

              <label style={{ display: "block", marginBottom: 12, fontWeight: 600 }}>
                Objetivo
                <select value={objective} onChange={event => setObjective(event.target.value as Campaign["objective"])} style={fieldStyle}>
                  {objectives.map(item => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>

              <label style={{ display: "block", marginBottom: 12, fontWeight: 600 }}>
                Orçamento diário ilustrativo (MT)
                <input type="number" min="0" step="0.01" value={budget} onChange={event => setBudget(event.target.value)} style={fieldStyle} />
              </label>

              <button onClick={createCampaign} style={{ width: "100%", padding: 14, border: 0, borderRadius: 10, background: "#2563eb", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
                Guardar campanha simulada
              </button>
            </>
          )}
          {message && <p role="status" style={{ marginTop: 14, color: "#1d4ed8" }}>{message}</p>}
        </section>

        <section style={{ background: "#fff", padding: 20, borderRadius: 16 }}>
          <h2>📊 Campanhas do Autopilot ({state.campaigns.length})</h2>
          {state.campaigns.length === 0 ? (
            <p style={{ color: "#667085" }}>Nenhuma campanha registada. As campanhas criadas aqui também ficam disponíveis para os outros módulos.</p>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {state.campaigns.map(campaign => {
                const product = state.products.find(item => item.id === campaign.productId);
                return (
                  <article key={campaign.id} style={{ border: "1px solid #e4e7ec", borderRadius: 12, padding: 15 }}>
                    <h3 style={{ marginTop: 0 }}>{product?.name ?? "Produto não encontrado"}</h3>
                    <p>🌍 Mercado: {campaign.market}</p>
                    <p>🎯 Objetivo: {campaign.objective}</p>
                    <p>💰 Orçamento diário planeado: {campaign.dailyBudget.toLocaleString("pt-PT")} MT</p>
                    <p style={{ color: "#92400e", fontWeight: 700, marginBottom: 0 }}>🛡️ Estado: Simulação — não publicado</p>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

const fieldStyle = {
  display: "block",
  width: "100%",
  boxSizing: "border-box" as const,
  padding: 13,
  marginTop: 7,
  border: "1px solid #dbe3ee",
  borderRadius: 10,
  background: "#fff",
  fontSize: 16,
};
