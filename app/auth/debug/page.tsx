"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function DebugPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const [details, setDetails] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    async function checkSupabaseConnection() {
      try {
        const response = await fetch("/api/debug")
        const data = await response.json()

        if (data.status === "ok") {
          setStatus("success")
          setMessage("Conexão com o Supabase estabelecida com sucesso")
          setDetails(data)
        } else {
          setStatus("error")
          setMessage(data.message || "Erro ao conectar com o Supabase")
          setDetails(data)
        }
      } catch (error) {
        setStatus("error")
        setMessage("Erro ao verificar conexão com o Supabase")
        setDetails({ error: String(error) })
      }
    }

    checkSupabaseConnection()
  }, [])

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-6">
        <Button variant="outline" onClick={() => router.push("/auth/login")} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar para o login
        </Button>
      </div>

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Diagnóstico de Autenticação</CardTitle>
          <CardDescription>Verificando a configuração do Supabase e autenticação</CardDescription>
        </CardHeader>
        <CardContent>
          {status === "loading" && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          )}

          {status === "success" && (
            <Alert className="mb-4 bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Conexão estabelecida</AlertTitle>
              <AlertDescription className="text-green-700">{message}</AlertDescription>
            </Alert>
          )}

          {status === "error" && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro de conexão</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {details && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-medium">Detalhes da conexão:</h3>
              <div className="bg-gray-100 p-4 rounded-md overflow-auto">
                <pre className="text-sm">{JSON.stringify(details, null, 2)}</pre>
              </div>

              <div className="space-y-2 mt-6">
                <h3 className="text-lg font-medium">Variáveis de ambiente:</h3>
                <p className="text-sm">
                  NEXT_PUBLIC_SUPABASE_URL:{" "}
                  {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Configurado" : "❌ Não configurado"}
                </p>
                <p className="text-sm">
                  NEXT_PUBLIC_SUPABASE_ANON_KEY:{" "}
                  {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Configurado" : "❌ Não configurado"}
                </p>
              </div>

              <div className="space-y-2 mt-6">
                <h3 className="text-lg font-medium">Recomendações:</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Verifique se as variáveis de ambiente estão configuradas corretamente</li>
                  <li>Verifique se o projeto Supabase está ativo e acessível</li>
                  <li>Verifique se a autenticação está habilitada no projeto Supabase</li>
                  <li>Ative a proteção contra senhas vazadas no painel do Supabase</li>
                  <li>Verifique as políticas de RLS (Row Level Security) no Supabase</li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
