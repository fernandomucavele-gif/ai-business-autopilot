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
              fontSize: "28px",
              color: "#101828",
            }}
          >
            Supplier AI
          </h1>

          <p
            style={{
              margin: "8px 0 0",
              color: "#667085",
            }}
          >
            Gestão e análise de fornecedores para os
            produtos encontrados pelo Autopilot.
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
              O sistema pode analisar fornecedores,
              mas não realiza compras reais.
            </p>
          </div>
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
            Fornecedores dos produtos
          </h2>

          {state.products.length === 0 ? (
            <div
              style={{
                marginTop: "16px",
                padding: "20px",
                borderRadius: "12px",
                background: "#f9fafb",
                border: "1px solid #eaecf0",
                color: "#667085",
              }}
            >
              Ainda não existem produtos registados.
              <br />
              Vai ao <strong>Research AI</strong> para
              adicionar produtos simulados.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "16px",
                marginTop: "20px",
              }}
            >
              {state.products.map((product) => (
                <div
                  key={product.id}
                  style={{
                    border: "1px solid #eaecf0",
                    borderRadius: "14px",
                    padding: "20px",
                    background: "#ffffff",
                  }}
                >
                  <h3
                    style={{
                      marginTop: 0,
                      marginBottom: "10px",
                      color: "#101828",
                    }}
                  >
                    {product.name}
                  </h3>

                  <div
                    style={{
                      display: "grid",
                      gap: "8px",
                      color: "#667085",
                      fontSize: "14px",
                    }}
                  >
                    <div>
                      <strong>Mercado:</strong>{" "}
                      {product.market}
                    </div>

                    <div>
                      <strong>Preço:</strong>{" "}
                      {product.price} MT
                    </div>

                    <div>
                      <strong>Score:</strong>{" "}
                      {product.score}/100
                    </div>

                    <div>
                      <strong>Estado:</strong>{" "}
                      {product.status}
                    </div>

                    <div>
                      <strong>Fornecedor:</strong>{" "}
                      {product.supplier ||
                        "Ainda não definido"}
                    </div>

                    <div>
                      <strong>País:</strong>{" "}
                      {product.supplierCountry ||
                        "Internacional"}
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled
                    style={{
                      width: "100%",
                      marginTop: "18px",
                      padding: "11px",
                      border: "1px solid #d0d5dd",
                      borderRadius: "10px",
                      background: "#f2f4f7",
                      color: "#98a2b3",
                      cursor: "not-allowed",
                      fontWeight: 600,
                    }}
                  >
                    Compra real bloqueada
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section
          style={{
            marginTop: "20px",
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
            🔎 Análise do fornecedor
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "14px",
            }}
          >
            <InfoCard
              title="Produtos analisados"
              value={String(state.products.length)}
            />

            <InfoCard
              title="Compras reais"
              value="BLOQUEADAS"
            />

            <InfoCard
              title="Modo"
              value="SIMULAÇÃO"
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function InfoCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div
      style={{
        padding: "18px",
        borderRadius: "12px",
        border: "1px solid #eaecf0",
        background: "#f9fafb",
      }}
    >
      <div
        style={{
          color: "#667085",
          fontSize: "14px",
          marginBottom: "8px",
        }}
      >
        {title}
      </div>

      <strong
        style={{
          color: "#101828",
          fontSize: "20px",
        }}
      >
        {value}
      </strong>
    </div>
  );
}