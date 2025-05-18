"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase"

export default function HomePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function checkUser() {
      try {
        const supabase = getSupabaseClient()
        if (!supabase) {
          router.push("/auth/login")
          return
        }

        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error("Erro ao verificar sessão:", error)
          router.push("/auth/login")
          return
        }

        if (!data.session) {
          router.push("/auth/login")
          return
        }

        setUser(data.session.user)
      } catch (error) {
        console.error("Erro ao verificar usuário:", error)
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">Página Inicial</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Bem-vindo!</h2>
        
        {user && (
          <div className="mb-4">
            <p className="mb-2"><strong>Email:</strong> {user.email}</p>
            <p className="mb-2"><strong>ID:</strong> {user.id}</p>
          </div>
        )}
        
        <button
          onClick={async () => {
            const supabase = getSupabaseClient()
            if (supabase) {
              await supabase.auth.signOut()
              router.push("/auth/login")
            }
          }}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
        >
          Sair
        </button>
      </div>
    </div>
  )
}
