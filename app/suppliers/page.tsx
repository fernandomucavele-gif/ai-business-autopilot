"use client";

import { useAutopilot } from "../context/autopilot-context";

export default function SuppliersPage() {
  const { state } = useAutopilot();

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <h1 style={{ color: "#101828" }}>
          Supplier AI
        </h1>

        <p style={{ color: "#667085" }}>
          Gestão e análise de fornecedores.
        </p>

        <div
          style={{
            background: "#fffaeb",
            border: "1px solid #fedf89",
            borderRadius: "12px",
            padding: "16px",
            marginBottom: "20px",
          }}
        >
          <strong>🛡️ Modo simulação ativo</strong>
          <p>
            Compras reais estão bloqueadas.
          </p>
        </div>

        <section
          style={{
            background: "#fff",
            border: "1px solid #e4e7ec",
            borderRadius: "16px",
            padding: "20px",
          }}
        >
          <h2>Produtos e fornecedores</h2>

          {state.products.length === 0 ? (
            <p style={{ color: "#667085" }}>
              Nenhum produto registado.
            </p>
          ) : (
            state.products.map((product) => (
              <div
                key={product.id}
                style={{
                  border: "1px solid #eaecf0",
                  borderRadius: "12px",
                  padding: "16px",
                  marginTop: "12px",
                }}
              >
                <h3>{product.name}</h3>

                <p>
                  Mercado: {product.market}
                </p>

                <p>
                  Preço: {product.price} MT
                </p>

                <p>
                  Score: {product.score}/100
                </p>

                <p>
                  Fornecedor:{" "}
                  {product.supplier ||
                    "Ainda não definido"}
                </p>

                <p>
                  País:{" "}
                  {product.supplierCountry ||
                    "Internacional"}
                </p>

                <button
                  disabled
                  style={{
                    padding: "10px",
                    border: "none",
                    borderRadius: "8px",
                    background: "#eaecf0",
                    color: "#667085",
                  }}
                >
                  Compra real bloqueada
                </button>
              </div>
            ))
          )}
        </section>
      </div>
    </main>
  );
}