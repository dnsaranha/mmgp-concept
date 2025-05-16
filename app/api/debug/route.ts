import { NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase"

export async function GET() {
  try {
    // Verificar se as variáveis de ambiente estão configuradas
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        {
          status: "error",
          message: "Variáveis de ambiente do Supabase não configuradas",
          env: {
            supabaseUrl: !!supabaseUrl,
            supabaseAnonKey: !!supabaseAnonKey,
          },
        },
        { status: 500 },
      )
    }

    // Obter cliente Supabase
    const supabase = getSupabaseClient()
    if (!supabase) {
      return NextResponse.json(
        {
          status: "error",
          message: "Não foi possível inicializar o cliente Supabase",
        },
        { status: 500 },
      )
    }

    // Testar conexão com o banco de dados
    const { data, error } = await supabase.from("mmgp_responses").select("count").limit(1)

    if (error) {
      return NextResponse.json(
        {
          status: "error",
          message: "Erro ao conectar ao banco de dados",
          error: error.message,
        },
        { status: 500 },
      )
    }

    // Verificar sessão atual
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

    if (sessionError) {
      return NextResponse.json(
        {
          status: "error",
          message: "Erro ao verificar sessão",
          error: sessionError.message,
          dbConnection: "ok",
        },
        { status: 500 },
      )
    }

    // Retornar status
    return NextResponse.json({
      status: "ok",
      message: "Conexão com o banco de dados estabelecida com sucesso",
      authenticated: !!sessionData.session,
      user: sessionData.session?.user?.email,
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Erro interno",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
