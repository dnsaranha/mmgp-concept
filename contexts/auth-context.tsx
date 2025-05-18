"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { getSupabaseClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import type { Session, User } from "@supabase/supabase-js"

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: string | null }>
  updatePassword: (password: string) => Promise<{ error: string | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Verificar sessão atual
    const getSession = async () => {
      setIsLoading(true)
      try {
        const supabase = getSupabaseClient()
        if (!supabase) {
          console.error("Supabase client not initialized")
          setIsLoading(false)
          return
        }

        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Error getting session:", error)
        } else {
          setSession(data.session)
          setUser(data.session?.user || null)
        }
      } catch (error) {
        console.error("Error getting session:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getSession()

    // Configurar listener para mudanças de autenticação
    const supabase = getSupabaseClient()
    if (!supabase) {
      console.error("Supabase client not initialized")
      setIsLoading(false)
      return
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user || null)
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const supabase = getSupabaseClient()
      if (!supabase) {
        return { error: "Erro de conexão com o banco de dados" }
      }

      const { data, error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        return { error: error.message }
      }

      return { error: null }
    } catch (error) {
      console.error("Sign in error:", error)
      return { error: "Ocorreu um erro ao fazer login. Tente novamente." }
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      const supabase = getSupabaseClient()
      if (!supabase) {
        return { error: "Erro de conexão com o banco de dados" }
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        return { error: error.message }
      }

      return { error: null }
    } catch (error) {
      console.error("Sign up error:", error)
      return { error: "Ocorreu um erro ao criar a conta. Tente novamente." }
    }
  }

  const signOut = async () => {
    try {
      const supabase = getSupabaseClient()
      if (!supabase) {
        console.error("Supabase client not initialized")
        return
      }

      await supabase.auth.signOut()
      router.push("/auth/login")
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const supabase = getSupabaseClient()
      if (!supabase) {
        return { error: "Erro de conexão com o banco de dados" }
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email)

      if (error) {
        return { error: error.message }
      }

      return { error: null }
    } catch (error) {
      console.error("Reset password error:", error)
      return { error: "Ocorreu um erro ao solicitar a recuperação de senha. Tente novamente." }
    }
  }

  const updatePassword = async (password: string) => {
    try {
      const supabase = getSupabaseClient()
      if (!supabase) {
        return { error: "Erro de conexão com o banco de dados" }
      }

      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        return { error: error.message }
      }

      return { error: null }
    } catch (error) {
      console.error("Update password error:", error)
      return { error: "Ocorreu um erro ao atualizar a senha. Tente novamente." }
    }
  }

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
