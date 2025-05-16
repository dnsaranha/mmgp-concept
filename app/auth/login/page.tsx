"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase"

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()

  // Verificar se já está autenticado
  useEffect(() => {
    const checkSession = async () => {
      try {
        const supabase = getSupabaseClient()
        if (!supabase) return

        const { data } = await supabase.auth.getSession()
        if (data.session) {
          router.push("/")
        }
      } catch (err) {
        console.error("Error checking session:", err)
      }
    }

    checkSession()
  }, [router])

  // Função para lidar com o login diretamente, sem usar o contexto
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = getSupabaseClient()
      if (!supabase) {
        setError("Erro de conexão com o banco de dados")
        setLoading(false)
        return
      }

      console.log("Tentando login com:", email)

      // Definir um timeout para evitar que o usuário fique preso
      const loginTimeout = setTimeout(() => {
        setLoading(false)
        setError("O login está demorando muito. Por favor, tente novamente.")
      }, 10000) // 10 segundos de timeout

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      // Limpar o timeout já que a requisição foi completada
      clearTimeout(loginTimeout)

      if (error) {
        console.error("Erro de login:", error.message)
        setError(error.message)
        setLoading(false)
        return
      }

      if (data.user) {
        console.log("Login bem-sucedido para:", data.user.email)
        setMessage("Login bem-sucedido! Redirecionando...")

        // Redirecionar após um breve delay
        setTimeout(() => {
          router.push("/")
          router.refresh() // Forçar refresh para atualizar o estado da aplicação
        }, 1000)
      }
    } catch (err) {
      console.error("Exceção durante login:", err)
      setError("Ocorreu um erro ao fazer login. Tente novamente.")
      setLoading(false)
    }
  }

  // Função para lidar com o cadastro diretamente
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (password !== confirmPassword) {
      setError("As senhas não coincidem")
      setLoading(false)
      return
    }

    try {
      const supabase = getSupabaseClient()
      if (!supabase) {
        setError("Erro de conexão com o banco de dados")
        setLoading(false)
        return
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      setMessage("Verifique seu e-mail para confirmar o cadastro.")
      setActiveTab("login")
      setLoading(false)
    } catch (err) {
      setError("Ocorreu um erro ao criar a conta. Tente novamente.")
      console.error(err)
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">MMGP - Autoavaliação</CardTitle>
          <CardDescription>Faça login ou crie uma conta para acessar o formulário de autoavaliação.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {message && (
            <Alert className="mb-4">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Cadastro</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu.email@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Senha</Label>
                    <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
                      Esqueceu a senha?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Entrando..." : "Entrar"}
                </Button>

                {loading && (
                  <div className="text-center mt-4">
                    <p className="text-sm text-gray-500">Se o login estiver demorando muito, você pode:</p>
                    <Button
                      variant="link"
                      onClick={() => {
                        setLoading(false)
                        router.push("/")
                      }}
                      className="text-sm"
                    >
                      Tentar acessar a página inicial diretamente
                    </Button>
                  </div>
                )}
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-email">E-mail</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="seu.email@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Senha</Label>
                  <Input
                    id="register-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Senha</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Cadastrando..." : "Cadastrar"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            Ao fazer login ou cadastro, você concorda com os termos de uso e política de privacidade.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
