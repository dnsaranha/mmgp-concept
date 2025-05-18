import { getSupabaseClient } from "./supabase"

export type AuthError = {
  message: string
}

export const authService = {
  // Login com email e senha
  async signIn(email: string, password: string): Promise<{ user: any | null; error: AuthError | null }> {
    try {
      const supabase = getSupabaseClient()
      if (!supabase) {
        return { user: null, error: { message: "Erro de conexão com o banco de dados" } }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { user: null, error: { message: error.message } }
      }

      return { user: data.user, error: null }
    } catch (err) {
      console.error("Erro ao fazer login:", err)
      return { user: null, error: { message: "Ocorreu um erro ao fazer login. Tente novamente." } }
    }
  },

  // Cadastro de novo usuário
  async signUp(email: string, password: string): Promise<{ user: any | null; error: AuthError | null }> {
    try {
      const supabase = getSupabaseClient()
      if (!supabase) {
        return { user: null, error: { message: "Erro de conexão com o banco de dados" } }
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        return { user: null, error: { message: error.message } }
      }

      return { user: data.user, error: null }
    } catch (err) {
      console.error("Erro ao cadastrar:", err)
      return { user: null, error: { message: "Ocorreu um erro ao cadastrar. Tente novamente." } }
    }
  },

  // Recuperação de senha
  async resetPassword(email: string): Promise<{ success: boolean; error: AuthError | null }> {
    try {
      const supabase = getSupabaseClient()
      if (!supabase) {
        return { success: false, error: { message: "Erro de conexão com o banco de dados" } }
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        return { success: false, error: { message: error.message } }
      }

      return { success: true, error: null }
    } catch (err) {
      console.error("Erro ao solicitar recuperação de senha:", err)
      return {
        success: false,
        error: { message: "Ocorreu um erro ao solicitar a recuperação de senha. Tente novamente." },
      }
    }
  },

  // Definir nova senha
  async updatePassword(newPassword: string): Promise<{ success: boolean; error: AuthError | null }> {
    try {
      const supabase = getSupabaseClient()
      if (!supabase) {
        return { success: false, error: { message: "Erro de conexão com o banco de dados" } }
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) {
        return { success: false, error: { message: error.message } }
      }

      return { success: true, error: null }
    } catch (err) {
      console.error("Erro ao atualizar senha:", err)
      return {
        success: false,
        error: { message: "Ocorreu um erro ao atualizar a senha. Tente novamente." },
      }
    }
  },

  // Logout
  async signOut(): Promise<{ error: AuthError | null }> {
    try {
      const supabase = getSupabaseClient()
      if (!supabase) {
        return { error: { message: "Erro de conexão com o banco de dados" } }
      }

      const { error } = await supabase.auth.signOut()

      if (error) {
        return { error: { message: error.message } }
      }

      return { error: null }
    } catch (err) {
      console.error("Erro ao fazer logout:", err)
      return { error: { message: "Ocorreu um erro ao fazer logout. Tente novamente." } }
    }
  },

  // Verificar sessão atual
  async getSession() {
    try {
      const supabase = getSupabaseClient()
      if (!supabase) {
        return { session: null, error: { message: "Erro de conexão com o banco de dados" } }
      }

      const { data, error } = await supabase.auth.getSession()

      if (error) {
        return { session: null, error: { message: error.message } }
      }

      return { session: data.session, error: null }
    } catch (err) {
      console.error("Erro ao verificar sessão:", err)
      return { session: null, error: { message: "Ocorreu um erro ao verificar a sessão." } }
    }
  },
}
