import { createClient } from "@supabase/supabase-js"

// Usar as variáveis de ambiente que foram adicionadas ao projeto
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.API_KEY || "" // Atualizado para usar API_KEY

// Verificar se as variáveis de ambiente estão configuradas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase environment variables are not set correctly")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function saveFormData(formData: any) {
  try {
    // Verificar se o cliente Supabase foi inicializado corretamente
    if (!supabase) {
      console.error("Supabase client not initialized")
      return { success: false, error: "Database connection not available" }
    }

    // Verificar se os dados necessários estão presentes
    if (!formData.respondent?.email) {
      return { success: false, error: "Email is required" }
    }

    // Preparar os dados para inserção
    const dataToInsert = {
      email: formData.respondent.email,
      classification: formData.classification || {},
      level2: formData.level2 || {},
      level3: formData.level3 || {},
      level4: formData.level4 || {},
      level5: formData.level5 || {},
      submitted_at: new Date().toISOString(),
    }

    // Tentar inserir os dados
    const { data, error } = await supabase.from("mmgp_responses").insert([dataToInsert]).select()

    if (error) {
      console.error("Supabase error:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Exception in saveFormData:", error)
    return { success: false, error: String(error) }
  }
}
