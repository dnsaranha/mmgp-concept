import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  try {
    const supabase = createMiddlewareClient({ req, res })

    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      console.error("Middleware auth error:", error)
    }

    // Permitir acesso a rotas de autenticação mesmo sem sessão
    const isAuthRoute = req.nextUrl.pathname.startsWith("/auth")
    const isCallbackRoute = req.nextUrl.pathname.startsWith("/auth/callback")
    const isResetPasswordRoute = req.nextUrl.pathname.startsWith("/auth/reset-password")

    // Se o usuário não estiver autenticado e estiver tentando acessar uma rota protegida
    if (!session && !isAuthRoute && !req.nextUrl.pathname.startsWith("/_next")) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = "/auth/login"
      redirectUrl.searchParams.set("redirectedFrom", req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Se o usuário estiver autenticado e estiver tentando acessar uma rota de autenticação
    // (exceto reset-password e callback)
    if (session && isAuthRoute && !isCallbackRoute && !isResetPasswordRoute) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = "/"
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
