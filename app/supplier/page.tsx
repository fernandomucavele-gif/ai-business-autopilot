"use client";

import { useMemo, useState } from "react";
import {
  Truck, Search, Star, MapPin,
  PackageCheck, ShieldCheck, Clock3
} from "lucide-react";

const initialSuppliers = [
  {
    id: 1,
    name: "Fornecedor Demonstração A",
    country: "Moçambique",
    category: "Acessórios",
    rating: 4.6,
    status: "Por verificar",
  },
  {
    id: 2,
    name: "Fornecedor Demonstração B",
    country: "África do Sul",
    category: "Casa e organização",
    rating: 4.3,
    status: "Por verificar",
  },
  {
    id: 3,
    name: "Fornecedor Demonstração C",
    country: "China",
    category: "Eletrónica",
    rating: 4.1,
    status: "Por verificar",
  },
];

export default function SupplierPage() {
  const [search, setSearch] = useState("");
  const [showDemo, setShowDemo] = useState(true);
  const [category, setCategory] = useState("Todas");

  const suppliers = useMemo(
    () =>
      (showDemo ? initialSuppliers : []).filter((supplier) => {
        const matchesSearch = `${supplier.name} ${supplier.country} ${supplier.category}`
          .toLowerCase()
          .includes(search.toLowerCase());

        const matchesCategory =
          category === "Todas" || supplier.category === category;

        return matchesSearch && matchesCategory;
      }),
    [search, showDemo, category]
  );

  const cardStyle = {
    background: "#fff",
    border: "1px solid #e5eaf2",
    borderRadius: 16,
    padding: 18,
  } as const;

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 24, color: "#17233c" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
        <div>
          <p style={{ color: "#64748b", marginBottom: 6 }}>AI BUSINESS AUTOPILOT / FORNECEDORES</p>
          <h1 style={{ fontSize: 30, margin: 0 }}>Supplier AI</h1>
          <p style={{ color: "#64748b" }}>Pesquisa e organização de fornecedores.</p>
        </div>
        <span style={{ background: "#fff4d6", color: "#8a5a00", padding: "8px 12px", borderRadius: 20 }}>
          Modo demonstração
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14, margin: "24px 0" }}>
        {[
          { title: "Fornecedores listados", value: suppliers.length, icon: <Truck /> },
          { title: "Categorias de exemplo", value: 3, icon: <PackageCheck /> },
          { title: "Verificações reais", value: 0, icon: <ShieldCheck /> },
        ].map((item) => (
          <section key={item.title} style={cardStyle}>
            <div style={{ color: "#4768d8" }}>{item.icon}</div>
            <p style={{ color: "#64748b", marginBottom: 6 }}>{item.title}</p>
            <strong style={{ fontSize: 28 }}>{item.value}</strong>
          </section>
        ))}
      </div>

      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <h2 style={{ margin: 0, fontSize: 20 }}>Diretório de fornecedores</h2>
          <button
            onClick={() => setShowDemo((value) => !value)}
            style={{ border: 0, borderRadius: 10, padding: "10px 14px", background: "#2447c6", color: "#fff", cursor: "pointer" }}
          >
            {showDemo ? "Ocultar demonstração" : "Mostrar demonstração"}
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, border: "1px solid #dbe2ed", borderRadius: 10, padding: "10px 12px", margin: "18px 0" }}>
          <Search size={18} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Pesquisar fornecedor, país ou categoria..."
            aria-label="Pesquisar fornecedores"
            style={{ width: "100%", border: 0, outline: "none", fontSize: 15 }}
          />
        </div>

        <label htmlFor="supplier-category" style={{ display: "block", marginBottom: 8, color: "#64748b" }}>
          Filtrar por categoria
        </label>
        <select
          id="supplier-category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          style={{ width: "100%", padding: 12, border: "1px solid #dbe2ed", borderRadius: 10, marginBottom: 18, background: "#fff" }}
        >
          <option>Todas</option>
          <option>Acessórios</option>
          <option>Casa e organização</option>
          <option>Eletrónica</option>
        </select>

        {suppliers.length === 0 ? (
          <div style={{ textAlign: "center", padding: 28, color: "#64748b" }}>
            <Truck size={32} />
            <p>Não existem fornecedores para mostrar.</p>
            <p>Os registos apresentados nesta versão são apenas demonstrativos.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {suppliers.map((supplier) => (
              <article key={supplier.id} style={{ border: "1px solid #e5eaf2", borderRadius: 12, padding: 14, display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <strong>{supplier.name}</strong>
                  <p style={{ margin: "8px 0", color: "#64748b" }}>
                    <MapPin size={15} style={{ verticalAlign: "middle" }} /> {supplier.country}
                  </p>
                  <p style={{ margin: "8px 0", color: "#64748b" }}>
                    Categoria: {supplier.category}
                  </p>
                  <span style={{ color: "#8a5a00" }}>
                    <Star size={15} style={{ verticalAlign: "middle" }} /> {supplier.rating} / 5 — classificação ilustrativa
                  </span>
                </div>
                <span style={{ alignSelf: "center", background: "#fff4d6", color: "#8a5a00", padding: "6px 10px", borderRadius: 20 }}>
                  {supplier.status}
                </span>
              </article>
            ))}
          </div>
        )}
      </section>

      <p style={{ fontSize: 13, color: "#64748b", marginTop: 18 }}>
        <Clock3 size={14} style={{ verticalAlign: "middle" }} /> Demonstração local. Os fornecedores e as classificações não foram verificados e não há contactos ou encomendas reais.
      </p>
    </main>
  );
      }
