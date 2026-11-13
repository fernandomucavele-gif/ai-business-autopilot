"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "../../lib/supabase";

import {
  AutopilotState,
  initialAutopilotState,
  Product,
  Campaign,
  CreativeRecord,
  Order,
  FinanceRecord,
  createProduct,
  createCampaign,
  createOrder,
  calculateRevenue,
  calculateCosts,
  calculateProfit,
  calculateROAS,
} from "../../lib/autopilot";

import {
  loadAutopilotState,
  saveAutopilotState,
} from "../../lib/autopilot-storage";

type SaveStatus = "loading" | "idle" | "saving" | "saved" | "error";

type AutopilotContextType = {
  state: AutopilotState;
  saveStatus: SaveStatus;
  addProduct: (name: string, market: Product["market"], price: number, estimatedUnitCost?: number) => void;
  addCampaign: (productId: string, market: Campaign["market"], objective: Campaign["objective"], dailyBudget: number) => void;
  addCreative: (creative: CreativeRecord) => void;
  addOrder: (productId: string, customerName: string, market: Order["market"], amount: number) => void;
  updateOrder: (id: string, status: Order["status"]) => void;
  addFinanceRecord: (record: FinanceRecord) => void;
  setAutomation: (key: keyof AutopilotState["automation"], value: boolean) => void;
  metrics: { revenue: number; costs: number; profit: number; roas: number };
};

const AutopilotContext = createContext<AutopilotContextType | undefined>(undefined);

function enforceSimulationSafety(saved: AutopilotState): AutopilotState {
  return {
    ...initialAutopilotState,
    ...saved,
    products: Array.isArray(saved.products) ? saved.products : [],
    campaigns: Array.isArray(saved.campaigns) ? saved.campaigns : [],
    creatives: Array.isArray(saved.creatives) ? saved.creatives : [],
    orders: Array.isArray(saved.orders) ? saved.orders : [],
    finance: Array.isArray(saved.finance) ? saved.finance : [],
    automation: {
      simulationMode: true,
      realPurchasesEnabled: false,
      realAdsEnabled: false,
      automaticPaymentsEnabled: false,
    },
  };
}

export function AutopilotProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AutopilotState>(initialAutopilotState);
  const [loaded, setLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("loading");
  const saveQueueRef = useRef<Promise<void>>(Promise.resolve());
  const saveAttemptRef = useRef(0);

  useEffect(() => {
    let mounted = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      if (event === "SIGNED_OUT" || !session) {
        setLoaded(false);
        setState(initialAutopilotState);
        setSaveStatus("idle");
        return;
      }

      if (event === "INITIAL_SESSION" || event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        setLoaded(false);
        setSaveStatus("loading");
        Promise.resolve().then(async () => {
          try {
            const savedState = await loadAutopilotState();
            if (mounted && savedState) setState(enforceSimulationSafety(savedState));
          } catch (error) {
            console.error("Não foi possível carregar os dados do Autopilot:", error);
          } finally {
            if (mounted) setLoaded(true);
          }
        });
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!loaded) return;

    const attempt = ++saveAttemptRef.current;
    const snapshot = enforceSimulationSafety(state);
    setSaveStatus("saving");

    // Serializa as gravações para impedir que uma atualização antiga termine
    // depois de uma mais recente e sobrescreva os dados novos.
    saveQueueRef.current = saveQueueRef.current
      .then(async () => {
        const saved = await saveAutopilotState(snapshot);
        if (attempt === saveAttemptRef.current) {
          setSaveStatus(saved ? "saved" : "error");
        }
      })
      .catch((error) => {
        console.error("Erro inesperado ao guardar o Autopilot:", error);
        if (attempt === saveAttemptRef.current) setSaveStatus("error");
      });
  }, [state, loaded]);

  function addProduct(name: string, market: Product["market"], price: number, estimatedUnitCost?: number) {
    if (!name.trim() || !Number.isFinite(price) || price <= 0) return;
    if (estimatedUnitCost !== undefined && (!Number.isFinite(estimatedUnitCost) || estimatedUnitCost < 0)) return;
    const product = createProduct(name.trim(), market, price, estimatedUnitCost);
    setState(current => ({ ...current, products: [...current.products, product] }));
  }

  function addCampaign(productId: string, market: Campaign["market"], objective: Campaign["objective"], dailyBudget: number) {
    if (!state.products.some(product => product.id === productId)) return;
    if (!Number.isFinite(dailyBudget) || dailyBudget < 0) return;
    const campaign = createCampaign(productId, market, objective, dailyBudget);
    setState(current => ({ ...current, campaigns: [...current.campaigns, campaign] }));
  }

  function addCreative(creative: CreativeRecord) {
    if (!creative.id || !creative.name.trim() || !creative.headline.trim()) return;
    if (!state.campaigns.some(campaign => campaign.id === creative.campaignId)) return;
    if (!state.products.some(product => product.id === creative.productId)) return;
    setState(current => ({
      ...current,
      creatives: current.creatives.some(item => item.id === creative.id)
        ? current.creatives.map(item => item.id === creative.id ? { ...creative, status: "draft" } : item)
        : [...current.creatives, { ...creative, status: "draft" }],
    }));
  }

  function addOrder(productId: string, customerName: string, market: Order["market"], amount: number) {
    if (!state.products.some(product => product.id === productId)) return;
    if (!customerName.trim() || !Number.isFinite(amount) || amount <= 0) return;
    const order = createOrder(productId, customerName.trim(), market, amount);
    setState(current => ({ ...current, orders: [...current.orders, order] }));
  }

  function updateOrder(id: string, status: Order["status"]) {
    setState(current => ({
      ...current,
      orders: current.orders.map(order => order.id === id ? { ...order, status } : order),
    }));
  }

  function addFinanceRecord(record: FinanceRecord) {
    if (!record.id || !Number.isFinite(record.amount) || record.amount <= 0) return;
    setState(current => ({ ...current, finance: [...current.finance, record] }));
  }

  function setAutomation(_key: keyof AutopilotState["automation"], _value: boolean) {
    setState(current => ({
      ...current,
      automation: {
        simulationMode: true,
        realPurchasesEnabled: false,
        realAdsEnabled: false,
        automaticPaymentsEnabled: false,
      },
    }));
  }

  const metrics = {
    revenue: calculateRevenue(state.finance),
    costs: calculateCosts(state.finance),
    profit: calculateProfit(state.finance),
    roas: calculateROAS(state.finance),
  };

  const saveMessage = {
    loading: "A carregar dados do Autopilot…",
    idle: "Sessão não iniciada. Os dados não estão a ser sincronizados.",
    saving: "A guardar dados no Supabase…",
    saved: "Dados guardados e sincronizados com sucesso.",
    error: "Não foi possível confirmar a gravação completa. Verifica a ligação e tenta novamente.",
  }[saveStatus];

  return (
    <AutopilotContext.Provider value={{ state, saveStatus, addProduct, addCampaign, addCreative, addOrder, updateOrder, addFinanceRecord, setAutomation, metrics }}>
      <div
        role="status"
        aria-live="polite"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          padding: "7px 14px",
          textAlign: "center",
          fontSize: "12px",
          fontWeight: 600,
          background: saveStatus === "saved" ? "#ecfdf3" : saveStatus === "error" ? "#fef3f2" : saveStatus === "idle" ? "#f2f4f7" : "#fffaeb",
          color: saveStatus === "saved" ? "#027a48" : saveStatus === "error" ? "#b42318" : saveStatus === "idle" ? "#475467" : "#93370d",
          borderBottom: "1px solid #e4e7ec",
        }}
      >
        {saveMessage}
      </div>
      {children}
    </AutopilotContext.Provider>
  );
}

export function useAutopilot() {
  const context = useContext(AutopilotContext);
  if (!context) throw new Error("useAutopilot deve ser usado dentro de AutopilotProvider");
  return context;
}
