import type { Metadata } from "next";
import "./globals.css";
import { AutopilotProvider } from "./context/autopilot-context";
import { AuthGate } from "./components/auth-gate";

export const metadata: Metadata = {
  title: "AI Business Autopilot",
  description: "Sistema inteligente de automação de negócios",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body>
        <AutopilotProvider>
          <AuthGate>{children}</AuthGate>
        </AutopilotProvider>
      </body>
    </html>
  );
}
