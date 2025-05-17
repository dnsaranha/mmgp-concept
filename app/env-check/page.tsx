"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, ArrowLeft, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"

export default function EnvCheckPage() {
  const [status, setStatus] = useState<"loading" | "success" | "warning" | "error">("loading")
  const [message, setMessage] = useState("")
  const [details, setDetails] = useState<any>(null)
  const [envVars, setEnvVars] = useState<{
    supabaseUrl: string | null
    supabaseAnonKey: string | null
  }>({
    supabaseUrl: null,
    supabaseAnonKey: null,
  })
  const router = useRouter()

  const checkConnection = async () => {
    setStatus("loading")
    setMessage("Verificando conexão...")

    try {
      // Verificar variáveis de ambiente
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      setEnvVars({
        supabaseUrl: supabaseUrl || null,
        supabaseAnonKey: supabaseAnonKey || null,
      })

      if (!supabaseUrl || !supabaseAnonKey) {
        setStatus("error")
        setMessage("Variáveis de ambiente do Supabase não estão configuradas corretamente")
        return
      }

      // Testar conexão com o Supabase usando o novo endpoint
      const response = await fetch("/api/connection-test")
      const data = await response.json()

      if (data.status === "success") {
        setStatus("success")
        setMessage(data.message)
        setDetails(data.details)
      } else if (data.status === "warning") {
        setStatus("warning")
        setMessage(data.message)
        setDetails(data.details)
      } else {
        setStatus("error")
        setMessage(data.error || "Erro ao conectar com o Supabase")
        setDetails(data.details)
      }
    } catch (error) {
      setStatus("error")
      setMessage("Erro ao verificar conexão com o Supabase")
      setDetails({ error: String(error) })
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  const getConnectionSolution = () => {
    if (!details) return null

    if (details.responseTime && Number.parseInt(details.responseTime) > 3000) {
      return (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <h4 className="font-medium text-yellow-800">Possível problema de limite de conexões</h4>
          <p className="text-sm text-yellow-700 mt-1">
            O tempo de resposta está alto ({details.responseTime}), o que pode indicar que o banco de dados está com
            muitas conexões simultâneas. O plano gratuito do Supabase tem limite de 10 conexões simultâneas.
          </p>
          <ul className="list-disc list-inside text-sm text-yellow-700 mt-2">
            <li>Tente novamente mais tarde quando houver menos usuários conectados</li>
            <li>Considere otimizar o código para usar menos conexões simultâneas</li>
            <li>Se possível, faça upgrade para um plano pago do Supabase</li>
          </ul>
        </div>
      )
    }

    if (details.code === "PGRST301") {
      return (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <h4 className="font-medium text-yellow-800">Tabela não encontrada</h4>
          <p className="text-sm text-yellow-700 mt-1">
            A tabela 'mmgp_responses' não foi encontrada no banco de dados. Você precisa criar a tabela antes de usar a
            aplicação.
          </p>
          <div className="mt-2">
            <Button variant="outline" size="sm" onClick={() => router.push("/setup-database")}>
              Configurar banco de dados
            </Button>
          </div>
        </div>
      )
    }

    if (details.code === "PGRST401") {
      return (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <h4 className="font-medium text-yellow-800">Problema de autenticação</h4>
          <p className="text-sm text-yellow-700 mt-1">
            Há um problema com as credenciais de acesso ao banco de dados. Verifique se a chave anônima está correta e
            se as políticas RLS estão configuradas adequadamente.
          </p>
        </div>
      )
    }

    return null
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={() => router.push("/")} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar para o início
        </Button>
        <Button variant="outline" onClick={checkConnection} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Verificar novamente
        </Button>
      </div>

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Verificação de Ambiente</CardTitle>
          <CardDescription>
            Verificando a configuração das variáveis de ambiente e conexão com o Supabase
          </CardDescription>
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
              <AlertDescription className="text-green-700">
                {message}
                {details && details.responseTime && (
                  <div className="mt-1 text-xs">Tempo de resposta: {details.responseTime}</div>
                )}
              </AlertDescription>
            </Alert>
          )}

          {status === "warning" && (
            <Alert className="mb-4 bg-yellow-50 border-yellow-200">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertTitle className="text-yellow-800">Atenção</AlertTitle>
              <AlertDescription className="text-yellow-700">
                {message}
                {details && details.responseTime && (
                  <div className="mt-1 text-xs">Tempo de resposta: {details.responseTime}</div>
                )}
              </AlertDescription>
            </Alert>
          )}

          {status === "error" && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro de conexão</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {getConnectionSolution()}

          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-medium">Variáveis de ambiente:</h3>
            <div className="space-y-2">
              <p className="text-sm">
                NEXT_PUBLIC_SUPABASE_URL: {envVars.supabaseUrl ? "✅ Configurado" : "❌ Não configurado"}
              </p>
              <p className="text-sm">
                NEXT_PUBLIC_SUPABASE_ANON_KEY: {envVars.supabaseAnonKey ? "✅ Configurado" : "❌ Não configurado"}
              </p>
            </div>

            {details && (
              <div className="mt-4">
                <h3 className="text-lg font-medium">Detalhes técnicos:</h3>
                <div className="bg-gray-100 p-4 rounded-md mt-2 overflow-auto max-h-60">
                  <pre className="text-xs">{JSON.stringify(details, null, 2)}</pre>
                </div>
              </div>
            )}

            <div className="bg-gray-100 p-4 rounded-md mt-4">
              <h4 className="font-medium mb-2">Limites do plano gratuito do Supabase:</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Máximo de 10 conexões simultâneas</li>
                <li>500 MB de armazenamento</li>
                <li>2 GB de transferência de dados</li>
                <li>2 projetos por organização</li>
              </ul>
              <p className="text-sm mt-2">
                Se você estiver enfrentando problemas de conexão, pode ser devido ao limite de conexões simultâneas.
                Considere fazer upgrade para um plano pago ou otimizar o uso de conexões.
              </p>
            </div>

            <div className="bg-gray-100 p-4 rounded-md mt-4">
              <h4 className="font-medium mb-2">Como configurar as variáveis de ambiente:</h4>
              <ol className="list-decimal list-inside text-sm space-y-2">
                <li>
                  <strong>Em desenvolvimento local:</strong> Crie um arquivo <code>.env.local</code> na raiz do projeto
                  com as variáveis:
                  <pre className="bg-gray-200 p-2 mt-1 rounded text-xs overflow-x-auto">
                    NEXT_PUBLIC_SUPABASE_URL=https://epbagajzokcjkvbymely.supabase.co
                    <br />
                    NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwYmFnYWp6b2tjamt2YnltZWx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1MDQ5MDksImV4cCI6MjA1ODA4MDkwOX0.FZT8wgnaYl7gEJtjryeGHHhj_N304qZUEK6Dpn-5Pss
                  </pre>
                </li>
                <li>
                  <strong>Em produção (Vercel):</strong> Adicione as variáveis de ambiente no painel da Vercel:
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>Vá para o painel do projeto na Vercel</li>
                    <li>Acesse Settings &gt; Environment Variables</li>
                    <li>Adicione as variáveis NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
                    <li>Clique em "Save" e faça um novo deploy</li>
                  </ul>
                </li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
