"use client";

import { useState } from "react";

type Campaign = {
  id: number;
  name: string;
  market: string;
  budget: number;
  status: "Simulação" | "Pausada";
};

export default function AdsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [name, setName] = useState("");
  const [market, setMarket] = useState("Moçambique");
  const [budget, setBudget] = useState("");

  function createCampaign() {
    if (!name.trim()) return;

    const campaign: Campaign = {
      id: Date.now(),
      name: name.trim(),
      market,
      budget: Number(budget) || 0,
      status: "Simulação",
    };

    setCampaigns((current) => [campaign, ...current]);
    setName("");
    setBudget("");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
        color: "#111827",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <h1>📢 Ads AI</h1>

        <p style={{ color: "#667085" }}>
          Criação e gestão de campanhas publicitárias.
        </p>

        <div
          style={{
            background: "#fffaeb",
            padding: "16px",
            borderRadius: "12px",
            marginBottom: "20px",
          }}
        >
          <strong>🛡️ Modo simulação ativo</strong>
          <p>
            Nenhum anúncio real será publicado e nenhum dinheiro será gasto.
          </p>
        </div>

        <section
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "16px",
            marginBottom: "20px",
          }}
        >
          <h2>➕ Nova campanha</h2>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome da campanha"
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "13px",
              marginBottom: "12px",
            }}
          />

          <select
            value={market}
            onChange={(e) => setMarket(e.target.value)}
            style={{
              width: "100%",
              padding: "13px",
              marginBottom: "12px",
            }}
          >
            <option>Moçambique</option>
            <option>Brasil</option>
            <option>Portugal</option>
            <option>África do Sul</option>
            <option>Europa</option>
            <option>EUA</option>
            <option>Global</option>
          </select>

          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="Orçamento de teste (MT)"
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "13px",
              marginBottom: "12px",
            }}
          />

          <button
            onClick={createCampaign}
            style={{
              width: "100%",
              padding: "14px",
              border: "none",
              borderRadius: "10px",
              background: "#2563eb",
              color: "white",
              fontWeight: "bold",
            }}
          >
            Criar campanha
          </button>
        </section>

        <section
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "16px",
          }}
        >
          <h2>📊 Campanhas</h2>

          {campaigns.length === 0 ? (
            <p>Nenhuma campanha criada.</p>
          ) : (
            campaigns.map((campaign) => (
              <div
                key={campaign.id}
                style={{
                  border: "1px solid #e4e7ec",
                  borderRadius: "12px",
                  padding: "15px",
                  marginTop: "12px",
                }}
              >
                <h3>{campaign.name}</h3>
                <p>🌍 Mercado: {campaign.market}</p>
                <p>💰 Orçamento: {campaign.budget} MT</p>
                <p>🛡️ Estado: {campaign.status}</p>
              </div>
            ))
          )}
        </section>
      </div>
    </main>
  );
}