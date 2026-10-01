"use client";

export default function SuppliersPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
        color: "#101828",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <h1>Supplier AI</h1>

        <p style={{ color: "#667085" }}>
          Gestão e análise de fornecedores.
        </p>

        <div
          style={{
            background: "#fffaeb",
            border: "1px solid #fedf89",
            borderRadius: "12px",
            padding: "16px",
            marginTop: "20px",
          }}
        >
          <strong>🛡️ Modo simulação ativo</strong>

          <p>
            Compras reais estão bloqueadas.
          </p>
        </div>

        <section
          style={{
            background: "#ffffff",
            border: "1px solid #e4e7ec",
            borderRadius: "16px",
            padding: "20px",
            marginTop: "20px",
          }}
        >
          <h2>Produtos e fornecedores</h2>

          <p style={{ color: "#667085" }}>
            Nenhum fornecedor registado ainda.
          </p>
        </section>
      </div>
    </main>
  );
}