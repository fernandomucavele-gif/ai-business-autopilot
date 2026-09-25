"use client";

import { useState } from "react";

export default function ResearchPage() {
  const [idea, setIdea] = useState("");
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState("");

  function startResearch() {
    if (!idea.trim()) return;

    setSearching(true);
    setResult("");

    setTimeout(() => {
      setSearching(false);
      setResult(
        "Pesquisa simulada concluída. O próximo passo será conectar este agente a fontes reais de tendências, produtos e concorrentes."
      );
    }, 1200);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        padding: "35px",
        fontFamily: "Arial, sans-serif",
        color: "#101828",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "auto" }}>
        <p
          style={{
            color: "#2563eb",
            fontWeight: "bold",
            letterSpacing: "1px",
          }}
        >
          AI BUSINESS AUTOPILOT
        </p>

        <h1>🔎 Research AI</h1>

        <p style={{ color: "#667085" }}>
          Encontre e avalie oportunidades de produtos para vender online.
        </p>

        <section
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "16px",
            border: "1px solid #e4e7ec",
            marginTop: "25px",
          }}
        >
          <label style={{ fontWeight: "bold" }}>
            O que queres que a IA pesquise?
          </label>

          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Ex.: Encontrar produtos com potencial para vender em Moçambique"
            style={{
              width: "100%",
              minHeight: "130px",
              marginTop: "12px",
              padding: "14px",
              borderRadius: "10px",
              border: "1px solid #d0d5dd",
              fontSize: "15px",
              resize: "vertical",
            }}
          />

          <button
            onClick={startResearch}
            disabled={searching}
            style={{
              marginTop: "15px",
              padding: "13px 20px",
              border: "none",
              borderRadius: "10px",
              background: "#2563eb",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {searching ? "🔎 Pesquisando..." : "🚀 Iniciar pesquisa"}
          </button>
        </section>

        {result && (
          <section
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "16px",
              border: "1px solid #e4e7ec",
              marginTop: "20px",
            }}
          >
            <h2>Resultado</h2>

            <p style={{ color: "#475467", lineHeight: 1.6 }}>
              {result}
            </p>

            <div
              style={{
                marginTop: "20px",
                padding: "15px",
                background: "#f8fafc",
                borderRadius: "10px",
              }}
            >
              🟢 <strong>Modo simulação ativo</strong>
              <br />
              <small>
                Nenhum produto será comprado e nenhum anúncio será publicado.
              </small>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
