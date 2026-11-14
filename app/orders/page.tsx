"use client";

import { useMemo, useState } from "react";
import { useAutopilot } from "../context/autopilot-context";
import type { Order } from "../../lib/autopilot";

const statuses: Order["status"][] = [
  "Novo",
  "Pagamento pendente",
  "Pago",
  "Enviado ao fornecedor",
  "Em trânsito",
  "Entregue",
];

const markets = ["Moçambique", "Brasil", "Portugal", "África do Sul", "Europa", "EUA", "Global"] as const;

export default function OrdersPage() {
  const { state, addOrder, updateOrder, updateOrderDetails } = useAutopilot();
  const [productId, setProductId] = useState("");
  const [customer, setCustomer] = useState("");
  const [market, setMarket] = useState<Order["market"]>("Moçambique");
  const [amount, setAmount] = useState("");
  const [supplier, setSupplier] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [message, setMessage] = useState("");

  const selectedProductId = state.products.some(p => p.id === productId) ? productId : state.products[0]?.id ?? "";

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();
    return state.orders.filter(order => {
      const product = state.products.find(item => item.id === order.productId);
      const matchesText = !term || [order.id, order.customerName, order.market, order.supplierName ?? "", product?.name ?? ""]
        .some(value => value.toLowerCase().includes(term));
      const matchesStatus = statusFilter === "Todos" || order.status === statusFilter;
      return matchesText && matchesStatus;
    });
  }, [state.orders, state.products, search, statusFilter]);

  const totalValue = state.orders.reduce((sum, order) => sum + order.amount, 0);
  const delivered = state.orders.filter(order => order.status === "Entregue").length;
  const inProgress = state.orders.filter(order => order.status !== "Entregue").length;

  function createOrder() {
    if (!selectedProductId || !customer.trim() || !amount.trim()) {
      setMessage("Preenche o produto, o nome do cliente e o valor.");
      return;
    }
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setMessage("O valor deve ser um número maior que zero.");
      return;
    }
    addOrder(selectedProductId, customer.trim(), market, numericAmount, supplier);
    setMessage("Encomenda simulada registada. Aguarda a confirmação de gravação no indicador superior.");
    setCustomer("");
    setAmount("");
    setSupplier("");
  }

  function changeStatus(id: string, status: Order["status"]) {
    updateOrder(id, status);
    setMessage("Estado atualizado no registo simulado. Nenhum pagamento, compra ou envio foi executado.");
  }

  function updateDelivery(id: string, value: string) {
    updateOrderDetails(id, { revisedDeliveryAt: value ? new Date(value + "T12:00:00").toISOString() : undefined });
  }

  function formatDate(value?: string) {
    if (!value) return "Não definida";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "Data inválida" : date.toLocaleDateString("pt-PT");
  }

  function dateInputValue(value?: string) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toISOString().slice(0, 10);
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f4f7fb", padding: "26px 16px", color: "#172033", fontFamily: "Arial, sans-serif" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <div style={{ marginBottom: 22 }}>
          <span style={{ display: "inline-block", padding: "7px 12px", borderRadius: 20, background: "#dbeafe", color: "#1d4ed8", fontWeight: 700, fontSize: 13 }}>ORDERS AI · SIMULAÇÃO</span>
          <h1 style={{ fontSize: 32, margin: "13px 0 7px" }}>Gestão de encomendas</h1>
          <p style={{ color: "#64748b", margin: 0 }}>Regista pedidos, acompanha estados e controla datas previstas de entrega.</p>
        </div>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 22 }}>
          {[
            ["Total de encomendas", String(state.orders.length)],
            ["Valor registado", totalValue.toLocaleString("pt-PT") + " MT"],
            ["Em acompanhamento", String(inProgress)],
            ["Entregues", String(delivered)],
          ].map(([label, value]) => (
            <div key={label} style={{ background: "#fff", borderRadius: 14, padding: 17, border: "1px solid #e5eaf1" }}>
              <div style={{ color: "#64748b", fontSize: 13 }}>{label}</div>
              <strong style={{ display: "block", fontSize: 23, marginTop: 7 }}>{value}</strong>
            </div>
          ))}
        </section>

        <section style={{ background: "#fff", border: "1px solid #e5eaf1", borderRadius: 16, padding: 20, marginBottom: 22 }}>
          <h2 style={{ margin: "0 0 16px", fontSize: 20 }}>＋ Nova encomenda simulada</h2>
          {state.products.length === 0 ? (
            <p style={{ background: "#fff7ed", color: "#9a3412", padding: 14, borderRadius: 10 }}>Ainda não existem produtos. Adiciona primeiro uma sugestão no Research AI.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
              <label style={{ fontWeight: 600, fontSize: 14 }}>Produto
                <select value={selectedProductId} onChange={e => setProductId(e.target.value)} style={fieldStyle}>
                  {state.products.map(product => <option key={product.id} value={product.id}>{product.name} — {product.price} MT</option>)}
                </select>
              </label>
              <label style={{ fontWeight: 600, fontSize: 14 }}>Cliente
                <input value={customer} onChange={e => setCustomer(e.target.value)} placeholder="Nome do cliente" style={fieldStyle} />
              </label>
              <label style={{ fontWeight: 600, fontSize: 14 }}>Mercado / destino
                <select value={market} onChange={e => setMarket(e.target.value as Order["market"])} style={fieldStyle}>
                  {markets.map(item => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <label style={{ fontWeight: 600, fontSize: 14 }}>Valor da encomenda (MT)
                <input type="number" min="0.01" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Ex.: 2500" style={fieldStyle} />
              </label>
              <label style={{ fontWeight: 600, fontSize: 14 }}>Fornecedor (opcional)
                <input value={supplier} onChange={e => setSupplier(e.target.value)} placeholder="Nome do fornecedor" style={fieldStyle} />
              </label>
              <div style={{ display: "flex", alignItems: "end" }}>
                <button onClick={createOrder} style={primaryButton}>Registar encomenda</button>
              </div>
            </div>
          )}
          {message && <p role="status" style={{ margin: "14px 0 0", padding: 12, background: "#eff6ff", color: "#1d4ed8", borderRadius: 9 }}>{message}</p>}
        </section>

        <section style={{ background: "#fff", border: "1px solid #e5eaf1", borderRadius: 16, padding: 20 }}>
          <h2 style={{ margin: "0 0 15px", fontSize: 20 }}>Lista e acompanhamento</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 10, marginBottom: 16 }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Pesquisar código, cliente, produto…" style={fieldStyle} />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={fieldStyle}>
              <option value="Todos">Todos os estados</option>
              {statuses.map(status => <option key={status} value={status}>{status}</option>)}
            </select>
          </div>

          {filteredOrders.length === 0 ? (
            <p style={{ padding: 16, background: "#f8fafc", borderRadius: 10, color: "#64748b" }}>
              {state.orders.length === 0 ? "Ainda não existem encomendas registadas." : "Não foram encontradas encomendas com estes filtros."}
            </p>
          ) : filteredOrders.map(order => {
            const product = state.products.find(item => item.id === order.productId);
            const expected = order.revisedDeliveryAt || order.estimatedDeliveryAt;
            return (
              <article key={order.id} style={{ border: "1px solid #e2e8f0", borderRadius: 13, padding: 16, marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                  <strong style={{ fontSize: 17 }}>{order.id}</strong>
                  <span style={{ background: order.status === "Entregue" ? "#dcfce7" : order.status === "Em trânsito" ? "#fef3c7" : "#eff6ff", color: "#334155", borderRadius: 20, padding: "6px 10px", fontSize: 12, fontWeight: 700 }}>{order.status}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 8, margin: "13px 0", color: "#475569", fontSize: 14 }}>
                  <div><strong>Produto:</strong> {product?.name || order.productId}</div>
                  <div><strong>Cliente:</strong> {order.customerName}</div>
                  <div><strong>Destino:</strong> {order.market}</div>
                  <div><strong>Valor:</strong> {order.amount.toLocaleString("pt-PT")} MT</div>
                  <div><strong>Fornecedor:</strong> {order.supplierName || "Não indicado"}</div>
                  <div><strong>Entrega prevista:</strong> {formatDate(expected)}</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 10 }}>
                  <label style={{ fontSize: 13, fontWeight: 600 }}>Atualizar estado
                    <select value={order.status} onChange={e => changeStatus(order.id, e.target.value as Order["status"])} style={fieldStyle}>
                      {statuses.map(status => <option key={status} value={status}>{status}</option>)}
                    </select>
                  </label>
                  <label style={{ fontSize: 13, fontWeight: 600 }}>Nova data prevista (opcional)
                    <input type="date" value={dateInputValue(order.revisedDeliveryAt)} onChange={e => updateDelivery(order.id, e.target.value)} style={fieldStyle} />
                  </label>
                  <label style={{ fontSize: 13, fontWeight: 600 }}>Aviso / nota de atraso
                    <input value={order.delayNotice || ""} onChange={e => updateOrderDetails(order.id, { delayNotice: e.target.value })} placeholder="Ex.: atraso informado pelo fornecedor" style={fieldStyle} />
                  </label>
                </div>
                {order.delayNotice && <p style={{ margin: "10px 0 0", color: "#9a3412", background: "#fff7ed", padding: 10, borderRadius: 8, fontSize: 13 }}>Nota: {order.delayNotice}</p>}
              </article>
            );
          })}
        </section>

        <p style={{ marginTop: 18, padding: 13, borderRadius: 10, background: "#fff7ed", color: "#9a3412", fontSize: 13 }}>
          Segurança: esta área é apenas demonstrativa. Alterar o estado para “Pago”, “Enviado ao fornecedor” ou “Entregue” não realiza pagamentos, compras, contactos nem entregas reais.
        </p>
      </div>
    </main>
  );
}

const fieldStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  marginTop: 7,
  padding: "12px 13px",
  border: "1px solid #d5deea",
  borderRadius: 9,
  background: "#fff",
  color: "#172033",
  fontSize: 14,
};

const primaryButton: React.CSSProperties = {
  width: "100%",
  padding: "13px 15px",
  border: 0,
  borderRadius: 9,
  background: "#2563eb",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};
