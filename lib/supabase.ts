import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Configuração do Supabase em falta na Vercel."
  );
}

// Keep the browser session in cookies so Next.js middleware can validate
// the same authenticated user when navigating to protected routes.
export const supabase = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey
);
