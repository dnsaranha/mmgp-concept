import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  // Ignorar rotas públicas e recursos estáticos
  if (
    req.nextUrl.pathname.startsWith("/auth") ||
    req.nextUrl.pathname.startsWith("/_next") ||
    req.nextUrl.pathname.startsWith("/env-check") ||
    req.nextUrl.pathname === "/favicon.ico"
  ) {
    return NextResponse.next()
  }

  const res = NextResponse.next()

  try {
    // Criar cliente Supabase para o middleware com configuração explícita
    const supabase = createMiddlewareClient({ 
      req, 
      res,
      options: {
        cookieOptions: {
          // Configurar opções de cookie para ambiente de produção
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/"
        }
      }
    })

    // Verificar se o usuário está autenticado
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error("Middleware session error:", error)
      const redirectUrl = new URL("/auth/login?error=session_error", req.url)
      return NextResponse.redirect(redirectUrl)
    }

    // Se não estiver autenticado, redirecionar para login
    if (!data.session) {
      console.log("No session found, redirecting to login")
      const redirectUrl = new URL("/auth/login", req.url)
      return NextResponse.redirect(redirectUrl)
    }
    
    // Adicionar cabeçalho para debug
    res.headers.set("x-middleware-cache", "no-cache")
  } catch (error) {
    console.error("Middleware exception:", error)
    // Em caso de erro, permitir o acesso à página de verificação de ambiente
    if (!req.nextUrl.pathname.startsWith("/env-check")) {
      const redirectUrl = new URL("/env-check", req.url)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return res
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
