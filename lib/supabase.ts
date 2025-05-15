import { createClient } from "@supabase/supabase-js"
import type { FormState } from "./form-reducer"

// Singleton pattern for Supabase client
let supabaseInstance: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  if (supabaseInstance) return supabaseInstance

  // Usar as variáveis de ambiente que foram adicionadas ao projeto
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Verificar se as variáveis de ambiente estão configuradas
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase environment variables are not set correctly")
    return null
  }

  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
    return supabaseInstance
  } catch (error) {
    console.error("Error initializing Supabase client:", error)
    return null
  }
}

// Backward compatibility
export const supabase = getSupabaseClient()

// Função para calcular o score de um nível
function calculateLevelScore(levelData: Record<string, any> = {}) {
  let totalPoints = 0
  let answeredQuestions = 0

  Object.entries(levelData).forEach(([_, question]) => {
    if (question && question.meetsRequirement === "sim") {
      totalPoints += 5 // Atribuindo 5 pontos para cada resposta "sim"
      answeredQuestions++
    } else if (question && question.meetsRequirement === "nao") {
      answeredQuestions++
    }
  })

  // Retorna a pontuação em percentual (de 0 a 100)
  return answeredQuestions > 0 ? (totalPoints / (answeredQuestions * 5)) * 100 : 0
}

// Função para calcular o índice de maturidade
function calculateMaturityIndex(formData: FormState) {
  // Verificar se os dados necessários estão presentes
  if (!formData.level2 || !formData.level3 || !formData.level4 || !formData.level5) {
    console.error("Dados de níveis incompletos para cálculo do índice de maturidade")
    return 1.0 // Valor padrão mínimo
  }

  const level2Score = calculateLevelScore(formData.level2)
  const level3Score = calculateLevelScore(formData.level3)
  const level4Score = calculateLevelScore(formData.level4)
  const level5Score = calculateLevelScore(formData.level5)

  // Cálculo do índice de maturidade conforme fórmula do modelo Prado-MMGP
  // IM = (100 + Pontuação Nível 2 + Pontuação Nível 3 + Pontuação Nível 4 + Pontuação Nível 5) / 100
  return (100 + level2Score + level3Score + level4Score + level5Score) / 100
}

export async function saveFormData(formData: FormState) {
  try {
    // Get Supabase client
    const supabaseClient = getSupabaseClient()

    // Verificar se o cliente Supabase foi inicializado corretamente
    if (!supabaseClient) {
      console.error("Supabase client not initialized")
      return { success: false, error: "Database connection not available" }
    }

    // Verificar se os dados necessários estão presentes
    if (!formData.respondent?.email) {
      return { success: false, error: "Email is required" }
    }

    // Inicializar os objetos de dados se não existirem
    const level2 = formData.level2 || {}
    const level3 = formData.level3 || {}
    const level4 = formData.level4 || {}
    const level5 = formData.level5 || {}

    // Calcular os scores e o índice de maturidade
    const level2Score = calculateLevelScore(level2)
    const level3Score = calculateLevelScore(level3)
    const level4Score = calculateLevelScore(level4)
    const level5Score = calculateLevelScore(level5)
    const maturityIndex = calculateMaturityIndex({
      ...formData,
      level2,
      level3,
      level4,
      level5,
    })

    // Obter a sessão atual para verificar se o usuário está autenticado
    const { data: sessionData } = await supabaseClient.auth.getSession()
    const session = sessionData?.session

    // Preparar os dados para inserção
    const dataToInsert = {
      email: formData.respondent.email,
      classification: formData.classification || {},
      level2: level2,
      level3: level3,
      level4: level4,
      level5: level5,
      submitted_at: new Date().toISOString(),
      // Adicionar os resultados calculados
      maturity_index: maturityIndex,
      level2_score: level2Score,
      level3_score: level3Score,
      level4_score: level4Score,
      level5_score: level5Score,
      estado: formData.classification?.estado || null,
      // Adicionar o ID do usuário se estiver autenticado
      ...(session?.user?.id && { user_id: session.user.id }),
    }

    console.log("Saving data to Supabase:", JSON.stringify(dataToInsert))

    // Tentar inserir os dados
    const { data, error } = await supabaseClient.from("mmgp_responses").insert([dataToInsert]).select()

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

export async function getUserResponses(userEmail: string) {
  try {
    const supabaseClient = getSupabaseClient()
    if (!supabaseClient) {
      return { success: false, error: "Database connection not available" }
    }

    const { data, error } = await supabaseClient
      .from("mmgp_responses")
      .select("id, email, submitted_at, maturity_index, level2_score, level3_score, level4_score, level5_score")
      .eq("email", userEmail)
      .order("submitted_at", { ascending: false })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Exception in getUserResponses:", error)
    return { success: false, error: String(error) }
  }
}

export async function getResponseDetails(responseId: string) {
  try {
    const supabaseClient = getSupabaseClient()
    if (!supabaseClient) {
      return { success: false, error: "Database connection not available" }
    }

    const { data, error } = await supabaseClient.from("mmgp_responses").select("*").eq("id", responseId).single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Exception in getResponseDetails:", error)
    return { success: false, error: String(error) }
  }
}
