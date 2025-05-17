import { getSupabaseClient } from "./supabase"

export type AuthError = {
  message: string
}

export const authService = {
  // Login com email e senha
  async signIn(email: string, password: string): Promise<{ user: any | null; error: AuthError | null }> {
    try {
      console.log("Tentando fazer login com email:", email)
      const supabase = getSupabaseClient()
      if (!supabase) {
        console.error("Erro: Cliente Supabase não inicializado")
        return { user: null, error: { message: "Erro de conexão com o banco de dados" } }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Erro de autenticação Supabase:", error.message)
        // Mensagens de erro mais amigáveis baseadas no erro original
        if (error.message.includes("Invalid login credentials")) {
          return { user: null, error: { message: "Email ou senha incorretos" } }
        }
        if (error.message.includes("Email not confirmed")) {
          return { user: null, error: { message: "Email não confirmado. Verifique sua caixa de entrada." } }
        }
        return { user: null, error: { message: error.message } }
      }

      console.log("Login bem-sucedido para:", email)
      return { user: data.user, error: null }
    } catch (err) {
      console.error("Exceção ao fazer login:", err)
      return { user: null, error: { message: "Ocorreu um erro ao fazer login. Tente novamente." } }
    }
  },

  // Cadastro de novo usuário
  async signUp(email: string, password: string): Promise<{ user: any | null; error: AuthError | null }> {
    try {
      console.log("Tentando cadastrar novo usuário com email:", email)
      const supabase = getSupabaseClient()
      if (!supabase) {
        console.error("Erro: Cliente Supabase não inicializado")
        return { user: null, error: { message: "Erro de conexão com o banco de dados" } }
      }

      // Verificar se a senha atende aos requisitos mínimos
      if (password.length < 6) {
        return { user: null, error: { message: "A senha deve ter pelo menos 6 caracteres" } }
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        console.error("Erro de cadastro Supabase:", error.message)
        // Mensagens de erro mais amigáveis
        if (error.message.includes("already registered")) {
          return { user: null, error: { message: "Este email já está cadastrado" } }
        }
        return { user: null, error: { message: error.message } }
      }

      console.log("Cadastro bem-sucedido para:", email)
      return { user: data.user, error: null }
    } catch (err) {
      console.error("Exceção ao cadastrar:", err)
      return { user: null, error: { message: "Ocorreu um erro ao cadastrar. Tente novamente." } }
    }
  },

  // Verificar sessão atual
  async getSession() {
    try {
      const supabase = getSupabaseClient()
      if (!supabase) {
        console.error("Erro: Cliente Supabase não inicializado")
        return { session: null, error: { message: "Erro de conexão com o banco de dados" } }
      }

      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error("Erro ao verificar sessão:", error.message)
        return { session: null, error: { message: error.message } }
      }

      return { session: data.session, error: null }
    } catch (err) {
      console.error("Exceção ao verificar sessão:", err)
      return { session: null, error: { message: "Ocorreu um erro ao verificar a sessão." } }
    }
  },
}
