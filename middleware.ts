import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  try {
    const supabase = createMiddlewareClient({ req, res })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Se o usuário não estiver autenticado e estiver tentando acessar uma rota protegida
    if (!session && !req.nextUrl.pathname.startsWith("/auth")) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = "/auth/login"
      return NextResponse.redirect(redirectUrl)
    }

    // Se o usuário estiver autenticado e estiver tentando acessar uma rota de autenticação
    if (
      session &&
      req.nextUrl.pathname.startsWith("/auth") &&
      !req.nextUrl.pathname.startsWith("/auth/reset-password") &&
      !req.nextUrl.pathname.startsWith("/auth/callback")
    ) {
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
