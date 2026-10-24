"use client";

import { useMemo, useState } from "react";
import {
  Users, Search, UserPlus, Mail, Phone,
  ShoppingBag, Clock3, CheckCircle2
} from "lucide-react";

const initialCustomers = [
  { id: 1, name: "Cliente Demonstração 1", email: "cliente1@example.com", orders: 3, status: "Ativo" },
  { id: 2, name: "Cliente Demonstração 2", email: "cliente2@example.com", orders: 1, status: "Novo" },
  { id: 3, name: "Cliente Demonstração 3", email: "cliente3@example.com", orders: 0, status: "Potencial" },
];

export default function CustomerPage() {
  const [search, setSearch] = useState("");
  const [showDemo, setShowDemo] = useState(true);

  const customers = useMemo(
    () =>
      (showDemo ? initialCustomers : []).filter((customer) =>
        `${customer.name} ${customer.email}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [search, showDemo]
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
          <p style={{ color: "#64748b", marginBottom: 6 }}>AI BUSINESS AUTOPILOT / CLIENTES</p>
          <h1 style={{ fontSize: 30, margin: 0 }}>Customer AI</h1>
          <p style={{ color: "#64748b" }}>Gestão e acompanhamento de clientes.</p>
        </div>
        <span style={{ background: "#fff4d6", color: "#8a5a00", padding: "8px 12px", borderRadius: 20 }}>
          Modo demonstração
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14, margin: "24px 0" }}>
        {[
          { title: "Clientes listados", value: customers.length, icon: <Users /> },
          { title: "Pedidos ilustrativos", value: showDemo ? 4 : 0, icon: <ShoppingBag /> },
          { title: "Clientes ativos", value: showDemo ? 1 : 0, icon: <CheckCircle2 /> },
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
          <h2 style={{ margin: 0, fontSize: 20 }}>Lista de clientes</h2>
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
            placeholder="Pesquisar nome ou email..."
            aria-label="Pesquisar clientes"
            style={{ width: "100%", border: 0, outline: "none", fontSize: 15 }}
          />
        </div>

        {customers.length === 0 ? (
          <div style={{ textAlign: "center", padding: 28, color: "#64748b" }}>
            <Users size={32} />
            <p>Não existem clientes para mostrar.</p>
            <p>Os registos apresentados nesta versão são apenas demonstrativos.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {customers.map((customer) => (
              <article key={customer.id} style={{ border: "1px solid #e5eaf2", borderRadius: 12, padding: 14, display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <strong>{customer.name}</strong>
                  <p style={{ margin: "8px 0", color: "#64748b", display: "flex", gap: 8, alignItems: "center" }}>
                    <Mail size={15} /> {customer.email}
                  </p>
                  <small style={{ color: "#64748b" }}>
                    <ShoppingBag size={14} style={{ verticalAlign: "middle" }} /> {customer.orders} pedidos ilustrativos
                  </small>
                </div>
                <span style={{ alignSelf: "center", background: "#edf2ff", color: "#2447c6", padding: "6px 10px", borderRadius: 20 }}>
                  {customer.status}
                </span>
              </article>
            ))}
          </div>
        )}
      </section>

      <p style={{ fontSize: 13, color: "#64748b", marginTop: 18 }}>
        <Clock3 size={14} style={{ verticalAlign: "middle" }} /> Demonstração local. Não há clientes reais ligados a esta lista nem contactos enviados.
      </p>
    </main>
  );
  }
