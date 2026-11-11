import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

const isPublicPath = (pathname: string) =>
  pathname === "/login" ||
  pathname.startsWith("/login/") ||
  pathname === "/shop" ||
  pathname.startsWith("/shop/reset-password") ||
  pathname.startsWith("/shop/security");

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return new NextResponse("Configuração de autenticação indisponível.", {
      status: 503,
    });
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // Always validate with the Auth server; do not authorize from client state
  // or user-editable user_metadata.
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  const redirectWithCookies = (url: URL) => {
    const redirect = NextResponse.redirect(url);
    response.cookies.getAll().forEach((cookie) => {
      redirect.cookies.set(cookie);
    });
    return redirect;
  };

  if (error || !user) {
    const loginUrl = new URL("/login", request.url);
    return redirectWithCookies(loginUrl);
  }

  if (!user.email_confirmed_at) {
    const verifyUrl = new URL(
      "/login?mode=verify&email=" + encodeURIComponent(user.email ?? ""),
      request.url
    );
    return redirectWithCookies(verifyUrl);
  }

  if (user.app_metadata?.role !== "admin") {
    return redirectWithCookies(new URL("/shop?access=admin-required", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
