import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  // Permitir acesso a rotas públicas sem verificação
  if (
    req.nextUrl.pathname.startsWith("/auth") ||
    req.nextUrl.pathname.startsWith("/_next") ||
    req.nextUrl.pathname.startsWith("/api") ||
    req.nextUrl.pathname === "/favicon.ico"
  ) {
    return NextResponse.next()
  }

  const res = NextResponse.next()

  try {
    const supabase = createMiddlewareClient({ req, res })
    const { data } = await supabase.auth.getSession()

    // Se não estiver autenticado, redirecionar para login
    if (!data.session) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = "/auth/login"
      return NextResponse.redirect(redirectUrl)
    }
  } catch (error) {
    console.error("Middleware error:", error)
    // Em caso de erro, permitir que a solicitação continue
  }

  return res
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
