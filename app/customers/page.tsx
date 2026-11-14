"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useAutopilot } from "../context/autopilot-context";
import type { Customer, Market } from "../../lib/autopilot";

type Message = { from: "cliente" | "ia"; text: string };

const markets: Market[] = ["Moçambique", "Brasil", "Portugal", "África do Sul", "Europa", "EUA", "Global"];

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  market: "Moçambique" as Market,
  notes: "",
};

export default function CustomersPage() {
  const {
    state,
    addCustomer,
    updateCustomer,
    removeCustomer,
    addOrder,
  } = useAutopilot();

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Message[]>([
    { from: "ia", text: "Olá! Sou o assistente demonstrativo da loja. Posso apresentar informações que já estão registadas no Autopilot." },
  ]);

  useEffect(() => {
    if (!selectedCustomerId && state.customers.length > 0) {
      setSelectedCustomerId(state.customers[0].id);
    } else if (selectedCustomerId && !state.customers.some(item => item.id === selectedCustomerId)) {
      setSelectedCustomerId(state.customers[0]?.id || "");
    }
  }, [state.customers, selectedCustomerId]);

  useEffect(() => {
    if (!selectedProductId && state.products.length > 0) {
      setSelectedProductId(state.products[0].id);
    } else if (selectedProductId && !state.products.some(item => item.id === selectedProductId)) {
      setSelectedProductId(state.products[0]?.id || "");
    }
  }, [state.products, selectedProductId]);

  const filteredCustomers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return state.customers;
    return state.customers.filter(customer =>
      [customer.name, customer.phone, customer.email, customer.market, customer.notes]
        .some(value => value.toLowerCase().includes(term))
    );
  }, [state.customers, search]);

  const totalCustomerOrders = state.orders.length;
  const ordersForCustomer = (customer: Customer) => state.orders.filter(order =>
    order.customerId
      ? order.customerId === customer.id
      : order.customerName.trim().toLowerCase() === customer.name.trim().toLowerCase() &&
        state.customers.filter(item => item.name.trim().toLowerCase() === customer.name.trim().toLowerCase()).length === 1
  );
  const repeatCustomers = state.customers.filter(customer => ordersForCustomer(customer).length > 1).length;

  function saveCustomer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.name.trim()) {
      setMessage("Escreve o nome do cliente antes de guardar.");
      return;
    }

    if (editingId) {
      updateCustomer(editingId, form);
      setMessage("Dados do cliente atualizados no Autopilot. Aguarda a confirmação de gravação no indicador superior.");
      setEditingId("");
    } else {
      const customer: Customer = {
        id: `CUS-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
        ...form,
        name: form.name.trim(),
        createdAt: new Date().toISOString(),
      };
      addCustomer(customer);
      setSelectedCustomerId(customer.id);
      setMessage("Cliente registado no Autopilot. Aguarda a confirmação de gravação no indicador superior.");
    }
    setForm(emptyForm);
  }

  function startEdit(customer: Customer) {
    setEditingId(customer.id);
    setForm({
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      market: customer.market,
      notes: customer.notes,
    });
    setMessage("");
  }

  function cancelEdit() {
    setEditingId("");
    setForm(emptyForm);
    setMessage("");
  }

  function createSimulatedOrder() {
    const customer = state.customers.find(item => item.id === selectedCustomerId);
    const product = state.products.find(item => item.id === selectedProductId);
    if (!customer || !product) {
      setMessage("Regista ou seleciona um cliente e um produto primeiro.");
      return;
    }
    addOrder(product.id, customer.name, customer.market, product.price, undefined, customer.id);
    setMessage(`Pedido simulado criado para ${customer.name}. Nenhum pagamento ou envio real foi realizado.`);
  }

  function sendChatMessage() {
    const text = chatInput.trim();
    if (!text) return;
    const lower = text.toLowerCase();
    let reply = "Esta é uma resposta demonstrativa. O assistente ainda não está ligado a um modelo de IA nem a canais reais de atendimento.";

    if (lower.includes("produto")) {
      reply = `Existem ${state.products.length} produto(s) registado(s) no Autopilot. Os dados apresentados são os que estão guardados no sistema.`;
    } else if (lower.includes("pedido") || lower.includes("encomenda")) {
      reply = `Existem ${state.orders.length} pedido(s) registado(s). Para consultar um cliente específico, usa a lista de clientes e os respetivos pedidos.`;
    } else if (lower.includes("cliente")) {
      reply = `Existem ${state.customers.length} cliente(s) registado(s) no Autopilot.`;
    } else if (lower.includes("entrega") || lower.includes("envio")) {
      reply = "O estado de entrega só pode ser consultado quando existe uma encomenda registada. Não há ligação a transportadoras nesta versão.";
    } else if (lower.includes("preço") || lower.includes("preco")) {
      reply = "Os preços dos produtos registados podem ser consultados na secção de encomendas simuladas.";
    }

    setChatMessages(current => [...current, { from: "cliente", text }, { from: "ia", text: reply }]);
    setChatInput("");
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f4f7fb", padding: "26px 16px 44px", color: "#172033", fontFamily: "Arial, sans-serif" }}>
      <div style={{ maxWidth: 1100, margin: "auto" }}>
        <header style={{ marginBottom: 22 }}>
          <span style={{ display: "inline-block", padding: "7px 12px", borderRadius: 20, background: "#e0e7ff", color: "#3730a3", fontWeight: 800, fontSize: 12 }}>CUSTOMER AI</span>
          <h1 style={{ fontSize: 32, margin: "13px 0 7px" }}>Gestão de clientes</h1>
          <p style={{ color: "#64748b", lineHeight: 1.5 }}>Regista contactos, organiza o histórico e acompanha os pedidos associados a cada cliente.</p>
        </header>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12, marginBottom: 18 }}>
          <article style={statStyle}><span>Clientes registados</span><strong>{state.customers.length}</strong></article>
          <article style={statStyle}><span>Pedidos registados</span><strong>{totalCustomerOrders}</strong></article>
          <article style={statStyle}><span>Clientes com vários pedidos</span><strong>{repeatCustomers}</strong></article>
        </section>

        <section style={panelStyle}>
          <h2 style={headingStyle}>{editingId ? "Editar cliente" : "Registar novo cliente"}</h2>
          <form onSubmit={saveCustomer}>
            <div style={formGrid}>
              <label style={fieldStyle}>Nome completo *
                <input required value={form.name} onChange={event => setForm(current => ({ ...current, name: event.target.value }))} placeholder="Nome do cliente" style={inputStyle} />
              </label>
              <label style={fieldStyle}>Telefone
                <input value={form.phone} onChange={event => setForm(current => ({ ...current, phone: event.target.value }))} placeholder="+258..." style={inputStyle} />
              </label>
              <label style={fieldStyle}>Email
                <input type="email" value={form.email} onChange={event => setForm(current => ({ ...current, email: event.target.value }))} placeholder="cliente@email.com" style={inputStyle} />
              </label>
              <label style={fieldStyle}>Mercado
                <select value={form.market} onChange={event => setForm(current => ({ ...current, market: event.target.value as Market }))} style={inputStyle}>
                  {markets.map(market => <option key={market} value={market}>{market}</option>)}
                </select>
              </label>
            </div>
            <label style={fieldStyle}>Notas internas
              <textarea value={form.notes} onChange={event => setForm(current => ({ ...current, notes: event.target.value }))} placeholder="Preferências, observações ou detalhes importantes..." rows={3} style={{ ...inputStyle, resize: "vertical" }} />
            </label>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
              <button type="submit" style={primaryButton}>{editingId ? "Guardar alterações" : "Registar cliente"}</button>
              {editingId && <button type="button" onClick={cancelEdit} style={secondaryButton}>Cancelar edição</button>}
            </div>
          </form>
          {message && <p role="status" style={{ marginTop: 14, padding: 12, borderRadius: 10, background: "#eff6ff", color: "#1d4ed8" }}>{message}</p>}
        </section>

        <section style={panelStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <h2 style={headingStyle}>Lista e histórico de clientes</h2>
            <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Pesquisar nome, telefone, email..." style={{ ...inputStyle, maxWidth: 340, marginTop: 0 }} />
          </div>
          {filteredCustomers.length === 0 ? (
            <p style={emptyStyle}>{state.customers.length === 0 ? "Ainda não existem clientes registados. Usa o formulário acima para adicionar o primeiro." : "Não foram encontrados clientes com essa pesquisa."}</p>
          ) : filteredCustomers.map(customer => {
            const orders = ordersForCustomer(customer);
            const orderValue = orders.reduce((sum, order) => sum + order.amount, 0);
            return (
              <article key={customer.id} style={{ border: "1px solid #e2e8f0", borderRadius: 13, padding: 16, marginTop: 12, background: "#fff" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <div>
                    <h3 style={{ margin: "0 0 7px", fontSize: 18 }}>{customer.name}</h3>
                    <p style={detailStyle}>🌍 {customer.market} {customer.phone ? ` · ☎ ${customer.phone}` : ""}</p>
                    {customer.email && <p style={detailStyle}>✉ {customer.email}</p>}
                    {customer.notes && <p style={{ ...detailStyle, marginTop: 9 }}>Notas: {customer.notes}</p>}
                  </div>
                  <div style={{ minWidth: 145, textAlign: "right" }}>
                    <strong>{orders.length} pedido(s)</strong>
                    <p style={detailStyle}>{orderValue.toLocaleString("pt-MZ")} MT registados</p>
                  </div>
                </div>
                {orders.length > 0 && <div style={{ marginTop: 10, padding: 11, borderRadius: 9, background: "#f8fafc" }}>
                  {orders.map(order => <p key={order.id} style={{ ...detailStyle, margin: "4px 0" }}>{order.id} · {order.status} · {order.amount.toLocaleString("pt-MZ")} MT</p>)}
                </div>}
                <div style={{ display: "flex", gap: 9, flexWrap: "wrap", marginTop: 13 }}>
                  <button type="button" onClick={() => startEdit(customer)} style={secondaryButton}>Editar</button>
                  <button type="button" onClick={() => { removeCustomer(customer.id); if (editingId === customer.id) cancelEdit(); setMessage("Registo do cliente removido do Autopilot. Os pedidos existentes não foram apagados."); }} style={dangerButton}>Remover registo</button>
                </div>
              </article>
            );
          })}
        </section>

        <section style={panelStyle}>
          <h2 style={headingStyle}>Criar pedido simulado para um cliente</h2>
          {state.customers.length === 0 || state.products.length === 0 ? (
            <p style={emptyStyle}>Para criar um pedido, regista primeiro um cliente e adiciona um produto no Research AI.</p>
          ) : (
            <>
              <label style={fieldStyle}>Cliente
                <select value={selectedCustomerId} onChange={event => setSelectedCustomerId(event.target.value)} style={inputStyle}>
                  {state.customers.map(customer => <option key={customer.id} value={customer.id}>{customer.name}</option>)}
                </select>
              </label>
              <label style={fieldStyle}>Produto
                <select value={selectedProductId} onChange={event => setSelectedProductId(event.target.value)} style={inputStyle}>
                  {state.products.map(product => <option key={product.id} value={product.id}>{product.name} — {product.price.toLocaleString("pt-MZ")} MT</option>)}
                </select>
              </label>
              <button type="button" onClick={createSimulatedOrder} style={primaryButton}>Criar pedido simulado</button>
            </>
          )}
        </section>

        <section style={panelStyle}>
          <h2 style={headingStyle}>Assistente demonstrativo de atendimento</h2>
          <div style={{ minHeight: 180, maxHeight: 320, overflowY: "auto", background: "#f8fafc", borderRadius: 11, padding: 12 }}>
            {chatMessages.map((item, index) => <div key={index} style={{ display: "flex", justifyContent: item.from === "cliente" ? "flex-end" : "flex-start", marginBottom: 10 }}>
              <p style={{ maxWidth: "85%", margin: 0, padding: "10px 13px", borderRadius: 12, background: item.from === "cliente" ? "#2563eb" : "#e2e8f0", color: item.from === "cliente" ? "#fff" : "#172033" }}>{item.text}</p>
            </div>)}
          </div>
          <div style={{ display: "flex", gap: 9, marginTop: 12 }}>
            <input value={chatInput} onChange={event => setChatInput(event.target.value)} onKeyDown={event => { if (event.key === "Enter") sendChatMessage(); }} placeholder="Escreve uma pergunta..." style={{ ...inputStyle, flex: 1, marginTop: 0 }} />
            <button type="button" onClick={sendChatMessage} style={primaryButton}>Enviar</button>
          </div>
        </section>

        <aside style={{ padding: 14, borderRadius: 11, background: "#fff7ed", color: "#9a3412", lineHeight: 1.5 }}>
          <strong>Modo de simulação e privacidade:</strong> os registos são guardados no estado do Autopilot e sincronizados com Supabase quando existe sessão ativa. O assistente não envia mensagens, emails ou chamadas. Nenhum pagamento, compra ou envio real é executado.
        </aside>
      </div>
    </main>
  );
}

const panelStyle = { background: "#fff", border: "1px solid #e5eaf2", borderRadius: 16, padding: 20, marginBottom: 17, boxShadow: "0 4px 18px rgba(15,23,42,.04)" } as const;
const statStyle = { background: "#fff", border: "1px solid #e5eaf2", borderRadius: 14, padding: 17 } as const;
const headingStyle = { margin: "0 0 15px", fontSize: 20 } as const;
const formGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 12 } as const;
const fieldStyle = { display: "block", fontWeight: 700, fontSize: 14, marginBottom: 12 } as const;
const inputStyle = { display: "block", boxSizing: "border-box" as const, width: "100%", padding: 12, marginTop: 7, border: "1px solid #cbd5e1", borderRadius: 9, background: "#fff", fontSize: 15, color: "#172033" } as const;
const primaryButton = { border: 0, borderRadius: 9, padding: "12px 16px", background: "#2563eb", color: "#fff", fontWeight: 700, cursor: "pointer" } as const;
const secondaryButton = { border: "1px solid #cbd5e1", borderRadius: 9, padding: "10px 14px", background: "#fff", color: "#334155", fontWeight: 700, cursor: "pointer" } as const;
const dangerButton = { border: "1px solid #fecaca", borderRadius: 9, padding: "10px 14px", background: "#fff1f2", color: "#be123c", fontWeight: 700, cursor: "pointer" } as const;
const emptyStyle = { padding: 15, borderRadius: 10, background: "#f8fafc", color: "#64748b", lineHeight: 1.5 } as const;
const detailStyle = { color: "#64748b", fontSize: 13, margin: "4px 0" } as const;
