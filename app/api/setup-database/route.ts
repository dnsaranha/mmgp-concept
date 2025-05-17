import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST() {
  try {
    // Verificar variáveis de ambiente
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({
        success: false,
        error: "Variáveis de ambiente não configuradas",
      })
    }

    // Criar cliente Supabase
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Verificar se a tabela já existe
    const { data: existingTable, error: checkError } = await supabase
      .from("mmgp_responses")
      .select("id")
      .limit(1)
      .maybeSingle()

    if (!checkError) {
      return NextResponse.json({
        success: true,
        message: "A tabela já existe e está configurada corretamente",
      })
    }

    // Criar a tabela mmgp_responses
    const { error: createTableError } = await supabase.rpc("create_mmgp_table")

    if (createTableError) {
      console.error("Erro ao criar tabela:", createTableError)
      return NextResponse.json({
        success: false,
        error: "Erro ao criar tabela: " + createTableError.message,
      })
    }

    // Configurar políticas RLS
    const { error: rlsError } = await supabase.rpc("setup_mmgp_rls")

    if (rlsError) {
      console.error("Erro ao configurar RLS:", rlsError)
      return NextResponse.json({
        success: false,
        error: "Erro ao configurar políticas de segurança: " + rlsError.message,
      })
    }

    return NextResponse.json({
      success: true,
      message: "Banco de dados configurado com sucesso!",
    })
  } catch (error) {
    console.error("Erro ao configurar banco de dados:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    })
  }
}
