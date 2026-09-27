
"use client";

import { useMemo, useState } from "react";

type Market =
  | "Moçambique"
  | "Brasil"
  | "Portugal"
  | "África do Sul"
  | "Europa"
  | "EUA"
  | "Global";

type Campaign = {
  product: string;
  market: Market;
  impressions: number;
  clicks: number;
  spend: number;
  sales: number;
  revenue: number;
};

const campaigns: Campaign[] = [
  {
    product: "Organizador inteligente para casa",
    market: "Moçambique",
    impressions: 12500,
    clicks: 640,
    spend: 3200,
    sales: 28,
    revenue: 8400,
  },
  {
    product: "Acessório portátil para automóvel",
    market: "Brasil",
    impressions: 18400,
    clicks: 920,
    spend: 4100,
    sales: 35,
    revenue: 12250,
  },
  {
    product: "Acessório para treino doméstico",
    market: "Europa",
    impressions: 22100,
    clicks: 1100,
    spend: 5200,
    sales: 41,
    revenue: 16400,
  },
  {
    product: "Infoproduto de desenvolvimento pessoal",
    market: "Moçambique",
    impressions: 9800,
    clicks: 710,
    spend: 1800,
    sales: 32,
    revenue: 9600,
  },
];

export default function AnalyticsPage() {
  const [market, setMarket] = useState<Market>("Global");
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const filteredCampaigns = useMemo(() => {
    if (market === "Global") {
      return campaigns;
    }

    return campaigns.filter((item) => item.market === market);
  }, [market]);

  const totals = useMemo(() => {
    const impressions = filteredCampaigns.reduce(
      (total, item) => total + item.impressions,
      0
    );

    const clicks = filteredCampaigns.reduce(
      (total, item) => total + item.clicks,
      0
    );

    const spend = filteredCampaigns.reduce(
      (total, item) => total + item.spend,
      0
    );

    const sales = filteredCampaigns.reduce(
      (total, item) => total + item.sales,
      0
    );

    const revenue = filteredCampaigns.reduce(
      (total, item) => total + item.revenue,
      0
    );

    const profit = revenue -
