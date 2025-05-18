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
import { AlertCircle, ExternalLink } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase"

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [supabaseConfigured, setSupabaseConfigured] = useState(true)
  const router = useRouter()

  // Log da página carregada
  useEffect(() => {
    console.log("Página de login carregada, URL atual:", window.location.href);
  }, []);

  // Verificar se o Supabase está configurado
  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      setSupabaseConfigured(false)
      console.error("Variáveis de ambiente do Supabase não configuradas")
    } else {
      setSupabaseConfigured(true)
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      
      if (!supabaseConfigured) {
        throw new Error("Erro de conexão com o banco de dados. Verifique as variáveis de ambiente.")
      }
      console.log("Iniciando processo de login com email:", email)

      const supabase = getSupabaseClient()

      console.log("Cliente Supabase inicializado:", !!supabase)

      if (!supabase) {
        throw new Error("Erro de conexão com o banco de dados")
      }
      console.log("Tentando fazer login com Supabase")

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      console.log("Resposta do Supabase:", { data: !!data, error: error?.message })

      if (error) {
        console.error("Erro de login:", error.message)

        // Mensagens de erro mais amigáveis
        if (error.message.includes("Invalid login credentials")) {
          throw new Error("Email ou senha incorretos")
        }

        throw new Error(error.message)
      }

      if (data.user) {
        console.log("Login bem-sucedido, redirecionando para /")
        try {
          router.push("/");
          console.log("Redirecionamento iniciado");
        } catch (redirectError) {
          console.error("Erro ao redirecionar:", redirectError);
        }
      } else {
        throw new Error("Login falhou por motivo desconhecido")
      }
    } catch (err) {
      console.error("Erro capturado no catch:", err)
      setError(err instanceof Error ? err.message : "Erro ao fazer login")
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (!supabaseConfigured) {
        throw new Error("Erro de conexão com o banco de dados. Verifique as variáveis de ambiente.")
      }

      // Verificar se as senhas coincidem
      if (password !== confirmPassword) {
        throw new Error("As senhas não coincidem")
      }

      const supabase = getSupabaseClient()
      if (!supabase) {
        throw new Error("Erro de conexão com o banco de dados")
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        throw new Error(error.message)
      }

      // Se o cadastro for bem-sucedido, mostrar mensagem
      setMessage("Conta criada com sucesso! Verifique seu e-mail para confirmar.")
      setActiveTab("login")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar conta")
    } finally {
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
          {!supabaseConfigured && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Erro de conexão com o banco de dados. Verifique se as variáveis de ambiente estão configuradas
                corretamente.
                <div className="mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/env-check")}
                    className="flex items-center gap-1"
                  >
                    Verificar configuração <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

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
              <form 
                onSubmit={(e) => {
                  e.preventDefault(); // Impedir o comportamento padrão
                  handleLogin(e);
                }}
                className="space-y-4"
              >
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
                    <Link 
                        href="/auth/forgot-password" 
                        className="text-sm text-blue-600 hover:underline"
                        onClick={(e) => { 
                          // Impedir que o clique propague para o formulário 
                          e.stopPropagation();
                        }}
                    >
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
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                >
                  {loading ? "Entrando..." : "Entrar"}
                </Button>
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
                <Button type="submit" className="w-full" disabled={loading || !supabaseConfigured}>
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
