"use client";

import { useMemo, useState } from "react";

type Supplier = {
  name: string;
  country: string;
  region: string;
  price: string;
  shipping: string;
  rating: string;
};

const suppliers: Supplier[] = [
  {
    name: "Global Home Supply",
    country: "China",
    region: "Ásia",
    price: "US$ 6,50",
    shipping: "Internacional",
    rating: "4,7/5",
  },
  {
    name: "Africa Trade Hub",
    country: "África do Sul",
    region: "África",
    price: "US$ 8,20",
    shipping: "África Austral",
    rating: "4,5/5",
  },
  {
    name: "Brasil Import Solutions",
    country: "Brasil",
    region: "América do Sul",
    price: "US$ 9,40",
    shipping: "Internacional",
    rating: "4,6/5",
  },
  {
    name: "Euro Market Supply",
    country: "Portugal",
    region: "Europa",
    price: "€ 11,80",
    shipping: "Internacional",
    rating: "4,4/5",
  },
  {
    name: "US Direct Wholesale",
    country: "EUA",
    region: "América do Norte",
    price: "US$ 13,50",
    shipping: "Internacional",
    rating: "4,3/5",
  },
  {
    name: "Asia Direct Factory",
    country: "Vietname",
    region: "Ásia",
    price: "US$ 5,90",
    shipping: "Internacional",
    rating: "4,6/5",
  },
];

export default function SuppliersPage() {
  const [product, setProduct] = useState("");
  const [country, setCountry] = useState("Todos");
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selected, setSelected] = useState<Supplier | null>(null);

  const countries = useMemo(() => {
    return ["Todos", ...Array.from(new Set(suppliers.map((s) => s.country)))];
  }, []);

  const results = useMemo(() => {
    if (country === "Todos") {
      return suppliers;
    }

    return suppliers.filter((supplier) => supplier.country === country);
  }, [country]);

  function searchSuppliers() {
    if (!product.trim()) {
      return;
    }

    setSearching(true);
    setSearched(false);

    setTimeout(() => {
      setSearching(false);
      setSearched(true);
    }, 1000);
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
            🏭 Fornecedores AI
          </h1>

          <p
            style={{
              color: "#64748b",
              lineHeight: 1.6,
              marginBottom: "18px",
            }}
          >
            Pesquisa fornecedores internacionais para os produtos encontrados
            pelo Autopilot.
          </p>

          <div
            style={{
              background: "#ecfdf5",
              color: "#166534",
              padding: "12px 15px",
              borderRadius: "12px",
              fontWeight: 600,
            }}
          >
            🟢 Modo simulação ativo. Compras e pagamentos reais estão
            bloqueados.
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
          <h2 style={{ marginTop: 0 }}>🔎 Procurar fornecedores</h2>

          <p style={{ color: "#64748b" }}>
            O sistema pode procurar fornecedores em qualquer país.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(200px, 2fr) minmax(150px, 1fr)",
              gap: "12px",
              marginTop: "18px",
            }}
          >
            <input
              value={product}
              onChange={(event) => setProduct(event.target.value)}
              placeholder="Ex.: organizador inteligente para casa"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "14px",
                border: "1px solid #dbe2ea",
                borderRadius: "12px",
                fontSize: "15px",
              }}
            />

            <select
              value={country}
              onChange={(event) => setCountry(event.target.value)}
              style={{
                padding: "14px",
                border: "1px solid #dbe2ea",
                borderRadius: "12px",
                background: "#ffffff",
                fontSize: "15px",
              }}
            >
              {countries.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={searchSuppliers}
            disabled={searching}
            style={{
              marginTop: "12px",
              width: "100%",
              padding: "14px",
              border: "none",
              borderRadius: "12px",
              background: searching ? "#94a3b8" : "#2563eb",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: "15px",
            }}
          >
            {searching ? "🔎 A procurar..." : "🔎 Procurar fornecedores"}
          </button>

          {searched && (
            <div
              style={{
                marginTop: "15px",
                padding: "14px",
                borderRadius: "12px",
                background: "#eff6ff",
                color: "#1d4ed8",
              }}
            >
              ✅ Pesquisa simulada concluída para{" "}
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
              <h2 style={{ margin: 0 }}>🌍 Fornecedores encontrados</h2>

              <p style={{ color: "#64748b" }}>
                África, Ásia, Europa, América e outros mercados.
              </p>
            </div>

            <strong>{results.length} resultados</strong>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "16px",
              marginTop: "20px",
            }}
          >
            {results.map((supplier) => (
              <article
                key={supplier.name}
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: "16px",
                  padding: "18px",
                  background: "#fafcff",
                }}
              >
                <div style={{ fontSize: "30px" }}>🏭</div>

                <h3 style={{ margin: "10px 0 6px" }}>
                  {supplier.name}
                </h3>

                <p style={{ margin: "7px 0", color: "#475569" }}>
                  🌍 {supplier.country}
                </p>

                <p style={{ margin: "7px 0", color: "#475569" }}>
                  📍 {supplier.region}
                </p>

                <p style={{ margin: "7px 0" }}>
                  💵 {supplier.price}
                </p>

                <p style={{ margin: "7px 0" }}>
                  🚚 {supplier.shipping}
                </p>

                <p style={{ margin: "7px 0" }}>
                  ⭐ {supplier.rating}
                </p>

                <button
                  onClick={() => setSelected(supplier)}
                  style={{
                    width: "100%",
                    marginTop: "12px",
                    padding: "12px",
                    border: "none",
                    borderRadius: "10px",
                    background: "#0f172a",
                    color: "#ffffff",
                    fontWeight: 700,
                  }}
                >
                  Ver fornecedor
                </button>
              </article>
            ))}
          </div>
        </section>

        <section
          style={{
            marginTop: "20px",
            background: "#fff7ed",
            border: "1px solid #fed7aa",
            borderRadius: "18px",
            padding: "22px",
          }}
        >
          <h2 style={{ marginTop: 0 }}>🤖 Automação futura</h2>

          <p
            style={{
              color: "#7c2d12",
              lineHeight: 1.6,
            }}
          >
            Futuramente o Autopilot poderá comunicar com fornecedores,
            negociar condições, comunicar com clientes e preparar encomendas
            automaticamente.
          </p>

          <strong style={{ color: "#9a3412" }}>
            ⚠️ Compras, pagamentos e encomendas reais continuam bloqueados
            durante os testes.
          </strong>
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
                maxWidth: "500px",
                background: "#ffffff",
                borderRadius: "20px",
                padding: "25px",
              }}
            >
              <h2>🏭 {selected.name}</h2>

              <p>
                <strong>País:</strong> {selected.country}
              </p>

              <p>
                <strong>Região:</strong> {selected.region}
              </p>

              <p>
                <strong>Preço:</strong> {selected.price}
              </p>

              <p>
                <strong>Envio:</strong> {selected.shipping}
              </p>

              <p>
                <strong>Avaliação:</strong> ⭐ {selected.rating}
              </p>

              <div
                style={{
                  background: "#f1f5f9",
                  padding: "14px",
                  borderRadius: "12px",
                  marginTop: "15px",
                }}
              >
                💬 Comunicação automática com o fornecedor será ativada
                somente numa fase posterior de testes.
              </div>

              <button
                onClick={() => setSelected(null)}
                style={{
                  width: "100%",
                  marginTop: "18px",
                  padding: "13px",
                  border: "none",
                  borderRadius: "10px",
                  background: "#2563eb",
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