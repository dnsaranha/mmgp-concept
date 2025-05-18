"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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

  const handleSignOut = async () => {
    try {
      const supabase = getSupabaseClient()
      if (supabase) {
        await supabase.auth.signOut()
        router.push("/auth/login")
      }
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Bem-vindo à Autoavaliação MMGP</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {user && (
            <div className="space-y-2">
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>ID:</strong> {user.id}
              </p>
            </div>
          )}

          <div className="flex justify-between">
            <Button onClick={() => router.push("/")}>Ir para o formulário</Button>

            <Button variant="destructive" onClick={handleSignOut}>
              Sair
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
