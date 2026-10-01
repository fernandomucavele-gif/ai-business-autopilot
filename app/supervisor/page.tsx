"use client";

import { useState } from "react";
import { useAutopilot } from "../context/autopilot-context";

export default function SupervisorPage() {
  const { state, metrics } =
    useAutopilot();

  const [running, setRunning] =
    useState(false);

  const [message, setMessage] =
    useState(
      "Supervisor pronto para monitorizar o sistema."
    );

  function runSupervisor() {
    setRunning(true);
    setMessage(
      "Supervisor está a analisar os módulos..."
    );

    setTimeout(() => {
      setRunning(false);

      if (
        state.automation.simulationMode
      ) {
        setMessage(
          "Análise concluída. Sistema protegido em modo de simulação."
        );
      } else {
        setMessage(
          "Análise concluída."
        );
      }
    }, 800);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "24px",
        background: "#f4f7fb",
        color: "#101828",
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
            marginBottom: "24px",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "1px",
              color: "#667085",
            }}
          >
            AI BUSINESS AUTOPILOT
          </p>

          <h1
            style={{
              margin: "8px 0",
              fontSize: "32px",
            }}
          >
            🤖 Supervisor AI
          </h1>

          <p
            style={{
              margin: 0,
              color: "#667085",
            }}
          >
            Agente responsável por supervisionar
            o estado geral do Autopilot.
          </p>
        </header>

        <section
          style={{
            background: "#ffffff",
            border:
              "1px solid #e4e7ec",
            borderRadius: "16px",
            padding: "20px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "