import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    try {
      const cookieStore = cookies()
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
      
      // Adicionar logs para depuração
      console.log("Exchanging code for session, URL:", requestUrl.toString())
      
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error("Error exchanging code for session:", error)
        // Redirecionar para uma página de erro em caso de falha
        return NextResponse.redirect(new URL("/auth/login?error=auth_callback_error", requestUrl.origin))
      }
      
      console.log("Session exchange successful, user:", data?.user?.email)
    } catch (error) {
      console.error("Exception in auth callback:", error)
      // Redirecionar para uma página de erro em caso de exceção
      return NextResponse.redirect(new URL("/auth/login?error=auth_exception", requestUrl.origin))
    }
  }

  // URL para redirecionar após a autenticação
  return NextResponse.redirect(new URL("/", requestUrl.origin))
}
