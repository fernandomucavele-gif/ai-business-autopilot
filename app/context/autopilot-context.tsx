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

  addProduct: (
    name: string,
    market: Product["market"],
    price: number
  ) => void;

  addCampaign: (
    productId: string,
    market: Campaign["market"],
    objective: Campaign["objective"],
    dailyBudget: number
  ) => void;

  addOrder: (
    productId: string,
    customerName: string,
    market: Order["market"],
    amount: number
  ) => void;

  addFinanceRecord: (
    record: FinanceRecord
  ) => void;

  setAutomation: (
    key: keyof AutopilotState["automation"],
    value: boolean
  ) => void;

  metrics: {
    revenue: number;
    costs: number;
    profit: number;
    roas: number;
  };
};

const AutopilotContext =
  createContext<AutopilotContextType | undefined>(
    undefined
  );

export function AutopilotProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, setState] =
    useState<AutopilotState>(
      initialAutopilotState
    );

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadState() {
      const savedState =
        await loadAutopilotState();

      if (savedState) {
        setState(savedState);
      }

      setLoaded(true);
    }

    loadState();
  }, []);

  useEffect(() => {
    if (!loaded) return;

    saveAutopilotState(state);
  }, [state, loaded]);

  function addProduct(
    name: string,
    market: Product["market"],
    price: number
  ) {
    const product = createProduct(
      name,
      market,
      price
    );

    setState((current) => ({
      ...current,
      products: [
        ...current.products,
        product,
      ],
    }));
  }

  function addCampaign(
    productId: string,
    market: Campaign["market"],
    objective: Campaign["objective"],
    dailyBudget: number
  ) {
    const campaign = createCampaign(
      productId,
      market,
      objective,
      dailyBudget
    );

    setState((current) => ({
      ...current,
      campaigns: [
        ...current.campaigns,
        campaign,
      ],
    }));
  }

  function addOrder(
    productId: string,
    customerName: string,
    market: Order["market"],
    amount: number
  ) {
    const order = createOrder(
      productId,
      customerName,
      market,
      amount
    );

    setState((current) => ({
      ...current,
      orders: [
        ...current.orders,
        order,
      ],
    }));
  }

  function addFinanceRecord(
    record: FinanceRecord
  ) {
    setState((current) => ({
      ...current,
      finance: [
        ...current.finance,
        record,
      ],
    }));
  }

  function setAutomation(
    key: keyof AutopilotState["automation"],
    value: boolean
  ) {
    setState((current) => ({
      ...current,
      automation: {
        ...current.automation,
        [key]: value,
      },
    }));
  }

  const metrics = {
    revenue: calculateRevenue(
      state.finance
    ),

    costs: calculateCosts(
      state.finance
    ),

    profit: calculateProfit(
      state.finance
    ),

    roas: calculateROAS(
      state.finance
    ),
  };

  return (
    <AutopilotContext.Provider
      value={{
        state,
        addProduct,
        addCampaign,
        addOrder,
        addFinanceRecord,
        setAutomation,
        metrics,
      }}
    >
      {children}
    </AutopilotContext.Provider>
  );
}

export function useAutopilot() {
  const context =
    useContext(AutopilotContext);

  if (!context) {
    throw new Error(
      "useAutopilot deve ser usado dentro de AutopilotProvider"
    );
  }

  return context;
}