import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  // Ignorar rotas públicas e recursos estáticos
  if (
    req.nextUrl.pathname.startsWith("/auth") ||
    req.nextUrl.pathname.startsWith("/_next") ||
    req.nextUrl.pathname === "/favicon.ico"
  ) {
    return NextResponse.next()
  }

  const res = NextResponse.next()

  try {
    // Criar cliente Supabase para o middleware
    const supabase = createMiddlewareClient({ req, res })

    // Verificar se o usuário está autenticado
    const { data } = await supabase.auth.getSession()

    // Se não estiver autenticado, redirecionar para login
    if (!data.session) {
      const redirectUrl = new URL("/auth/login", req.url)
      return NextResponse.redirect(redirectUrl)
    }
  } catch (error) {
    console.error("Middleware error:", error)
  }

  return res
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
