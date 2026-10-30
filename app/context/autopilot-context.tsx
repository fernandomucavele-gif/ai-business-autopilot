"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  AutopilotState,
  initialAutopilotState,
  Product,
  Campaign,
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

type AutopilotContextType = {
  state: AutopilotState;
  addProduct: (name: string, market: Product["market"], price: number, estimatedUnitCost?: number) => void;
  addCampaign: (productId: string, market: Campaign["market"], objective: Campaign["objective"], dailyBudget: number) => void;
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

  useEffect(() => {
    let mounted = true;
    async function loadState() {
      try {
        const savedState = await loadAutopilotState();
        if (mounted && savedState) setState(enforceSimulationSafety(savedState));
      } catch (error) {
        console.error("Não foi possível carregar os dados do Autopilot:", error);
      } finally {
        if (mounted) setLoaded(true);
      }
    }
    void loadState();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!loaded) return;
    void saveAutopilotState(enforceSimulationSafety(state));
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
    // Segurança fixa nesta versão: nenhum módulo pode ativar operações reais.
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

  return (
    <AutopilotContext.Provider value={{ state, addProduct, addCampaign, addOrder, updateOrder, addFinanceRecord, setAutomation, metrics }}>
      {children}
    </AutopilotContext.Provider>
  );
}

export function useAutopilot() {
  const context = useContext(AutopilotContext);
  if (!context) throw new Error("useAutopilot deve ser usado dentro de AutopilotProvider");
  return context;
}
