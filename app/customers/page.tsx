"use client";

import { useState } from "react";

type Message = {
  from: "cliente" | "ia";
  text: string;
};

export default function CustomersPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      from: "ia",
      text: "Olá! 👋 Sou o assistente da loja. Como posso ajudar?",
    },
  ]);

  function sendMessage() {
    if (!message.trim()) return;

    const customerMessage = message.trim();

    setMessages((current) => [
      ...current,
      { from: "cliente", text: customerMessage },
      {
        from: "ia",
        text: "Obrigado pela mensagem! 🤖 Esta resposta ainda está em modo de simulação. Na versão real, a IA poderá consultar produtos, preços, entregas e pedidos.",
      },
    ]);

    setMessage("");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        padding: "28px 18px",
        fontFamily: "Arial, sans-serif",
        color: "#111827",
      }}
    >
      <div style={{ maxWidth: 850, margin: "auto" }}>
        <div style={{ marginBottom: 25 }}>
          <div
            style={{
              display: "inline-block",
              padding: "7px 12px",
              borderRadius: 20,
              background: "#fef3c7",
              color: "#92400e",
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            👥 CUSTOMER AI
          </div>

          <h1 style={{ fontSize: 34, margin: "14px 0 8px" }}>
            Assistente de clientes
          </h1>

          <p style={{ color: "#64748b", fontSize: 17 }}>
            Atendimento, pedidos, entrega e suporte ao cliente.
          </p>
        </div>

        <section
          style={{
            background: "white",
            borderRadius: 18,
            padding: 20,
            boxShadow: "0 5px 25px rgba(0,0,0,.06)",
          }}
        >
          <div
            style={{
              height: 430,
              overflowY: "auto",
              padding: 10,
              background: "#f8fafc",
              borderRadius: 12,
            }}
          >
            {messages.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent:
                    item.from === "cliente" ? "flex-end" : "flex-start",
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    maxWidth: "80%",
                    padding: "12px 15px",
                    borderRadius: 14,
                    background:
                      item.from === "cliente" ? "#2563eb" : "#e5e7eb",
                    color: item.from === "cliente" ? "white" : "#111827",
                  }}
                >
                  {item.text}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 15,
            }}
          >
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              placeholder="Escreve a mensagem do cliente..."
              style={{
                flex: 1,
                padding: 14,
                borderRadius: 10,
                border: "1px solid #dbe3ee",
                fontSize: 16,
              }}
            />

            <button
              onClick={sendMessage}
              style={{
                padding: "12px 18px",
                border: 0,
                borderRadius: 10,
                background: "#2563eb",
                color: "white",
                fontWeight: 700,
              }}
            >
              Enviar
            </button>
          </div>

          <div
            style={{
              marginTop: 18,
              padding: 14,
              borderRadius: 10,
              background: "#fff7ed",
              color: "#9a3412",
            }}
          >
            ⚠️ <strong>Modo simulação:</strong> a IA ainda não está ligada a
            clientes reais, pagamentos ou pedidos.
          </div>
        </section>
      </div>
    </main>
  );
      }
