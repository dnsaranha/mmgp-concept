import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    // Verificar variáveis de ambiente
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({
        status: "error",
        error: "Variáveis de ambiente não configuradas",
        details: {
          supabaseUrl: !!supabaseUrl,
          supabaseAnonKey: !!supabaseAnonKey,
        },
      })
    }

    // Tentar criar um cliente Supabase com timeout reduzido
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        fetch: (url, options) => {
          return fetch(url, { ...options, signal: AbortSignal.timeout(5000) })
        },
      },
    })

    // Testar conexão com uma consulta simples
    const startTime = Date.now()
    const { data, error, status } = await supabase.from("mmgp_responses").select("count").limit(1)
    const endTime = Date.now()
    const responseTime = endTime - startTime

    if (error) {
      return NextResponse.json({
        status: "error",
        error: error.message,
        details: {
          code: error.code,
          hint: error.hint,
          status: status,
          responseTime: `${responseTime}ms`,
        },
      })
    }

    // Verificar se a tabela existe
    if (status === 400 || status === 404) {
      return NextResponse.json({
        status: "error",
        error: "Tabela não encontrada",
        details: {
          status,
          message: "A tabela 'mmgp_responses' pode não existir no banco de dados",
          responseTime: `${responseTime}ms`,
        },
      })
    }

    // Verificar limites de conexão
    if (responseTime > 3000) {
      return NextResponse.json({
        status: "warning",
        message: "Conexão estabelecida, mas com tempo de resposta alto",
        details: {
          responseTime: `${responseTime}ms`,
          possibleCause: "O banco de dados pode estar com muitas conexões simultâneas ou sob carga elevada",
        },
      })
    }

    return NextResponse.json({
      status: "success",
      message: "Conexão estabelecida com sucesso",
      details: {
        responseTime: `${responseTime}ms`,
        status,
      },
    })
  } catch (error) {
    return NextResponse.json({
      status: "error",
      error: error instanceof Error ? error.message : "Erro desconhecido",
      details: {
        name: error instanceof Error ? error.name : "Unknown",
        stack: process.env.NODE_ENV === "development" ? error instanceof Error && error.stack : undefined,
      },
    })
  }
}
