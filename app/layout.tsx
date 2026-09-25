import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Business Autopilot",
  description: "Sistema privado de automação inteligente para negócios.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body>{children}</body>
    </html>
  );
  }
