import { NextResponse } from "next/server"
import { saveFormData } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    // Tentar analisar o corpo da requisição
    let formData
    try {
      formData = await request.json()
    } catch (error) {
      console.error("Error parsing request body:", error)
      return NextResponse.json({ success: false, message: "Erro ao processar dados do formulário" }, { status: 400 })
    }

    // Validar se o e-mail foi fornecido
    if (!formData.respondent?.email) {
      return NextResponse.json({ success: false, message: "E-mail é obrigatório" }, { status: 400 })
    }

    // Tentar salvar os dados
    try {
      const result = await saveFormData(formData)

      if (!result.success) {
        return NextResponse.json(
          { success: false, message: "Erro ao salvar os dados", error: result.error },
          { status: 500 },
        )
      }

      return NextResponse.json({ success: true, data: result.data })
    } catch (saveError) {
      console.error("Error saving data:", saveError)
      return NextResponse.json(
        { success: false, message: "Erro ao salvar dados no banco de dados", error: String(saveError) },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Unhandled error in API route:", error)
    return NextResponse.json(
      { success: false, message: "Erro interno do servidor", error: String(error) },
      { status: 500 },
    )
  }
}
