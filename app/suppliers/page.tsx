"use client";

import { useMemo, useState } from "react";

type Supplier = {
  name: string;
  country: string;
  region: string;
  price: number;
  currency: string;
  shipping: string;
  contact: string;
  rating: number;
};

const suppliers: Supplier[] = [
  {
    name: "Global Home Supply",
    country: "China",
    region: "Ásia",
    price: 6.5,
    currency: "USD",
    shipping: "Internacional",
    contact: "Contacto disponível para negociação",
    rating: 4.7,
  },
  {
    name: "Africa Trade Hub",
    country: "África do Sul",
    region: "África",
    price: 8.2,
    currency: "USD",
    shipping: "África Austral",
    contact: "Contacto comercial disponível",
    rating: 4.5,
  },
  {
    name: "Brasil Import Solutions",
    country: "Brasil",
    region: "América do Sul",
    price: 9.4,
    currency: "USD",
    shipping: "Internacional",
    contact: "Contacto comercial disponível",
    rating: 4.6,
  },
  {
    name: "Euro Market Supply",
    country: "Portugal",
    region: "Europa",
    price: 11.8,
    currency: "EUR",
    shipping: "Internacional",
    contact: "Contacto comercial disponível",
    rating: 4.4,
  },
  {
    name: "US Direct Wholesale",
    country: "EUA",
    region: "América do Norte",
    price: 13.5,
    currency: "USD",
    shipping: "Internacional",
    contact: "Contacto comercial disponível",
    rating: 4.3,
  },
];

export default function SuppliersPage() {
  const [product, setProduct] = useState("");
  const [country, setCountry] = useState("Todos");
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selected, setSelected] = useState<Supplier | null>(null);

  const countries = useMemo(
    () => ["Todos", ...Array.from(new Set(suppliers.map((s) => s.country)))],
    []
  );

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((supplier) => {
      const countryMatch =
        country === "Todos" || supplier.country === country;

      return countryMatch;
    });
  }, [country]);

  function searchSuppliers() {
    if (!product.trim()) {
      setSearched(false);
      return;
    }

    setSearching(true);
    setSearched(false);

    setTimeout(() => {
      setSearching(false);
      setSearched(true);
    }, 1200);
  }

  function openSupplier(supplier: Supplier) {
    setSelected(supplier);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        padding: "30px",
        color: "#172033",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            borderRadius: "20px",
            padding: "28px",
            marginBottom: "22px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "13px",
              fontWeight: 700,
              color: "#64748b",
              letterSpacing: "1px",
            }}
          >
            AI BUSINESS AUTOPILOT
          </p>

          <h1
            style={{
              fontSize: "34px",
              margin: "8