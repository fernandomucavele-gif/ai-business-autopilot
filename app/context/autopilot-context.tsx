"use client";

import { createContext, useContext, useState } from "react";
import {
  initialAutopilotState,
  type AutopilotState,
} from "@/lib/autopilot";

type AutopilotContextType = {
  autopilot: AutopilotState;
  setAutopilot: React.Dispatch<React.SetStateAction<AutopilotState>>;
};

const AutopilotContext = createContext<AutopilotContextType | undefined>(
  undefined
);

export function AutopilotProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [autopilot, setAutopilot] = useState<AutopilotState>(
    initialAutopilotState
  );

  return (
    <AutopilotContext.Provider value={{ autopilot, setAutopilot }}>
      {children}
    </AutopilotContext.Provider>
  );
}

export function useAutopilot() {
  const context = useContext(AutopilotContext);

  if (!context) {
    throw new Error(
      "useAutopilot deve ser usado dentro de AutopilotProvider"
    );
  }

  return context;
}
