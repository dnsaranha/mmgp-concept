"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ArrowLeft, Database, CheckCircle, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SetupDatabasePage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const router = useRouter()

  const setupDatabase = async () => {
    setStatus("loading")
    setMessage("Configurando banco de dados...")

    try {
      const response = await fetch("/api/setup-database", { method: "POST" })
      const data = await response.json()

      if (data.success) {
        setStatus("success")
        setMessage(data.message || "Banco de dados configurado com sucesso!")
      } else {
        setStatus("error")
        setMessage(data.error || "Erro ao configurar banco de dados")
      }
    } catch (error) {
      setStatus("error")
      setMessage(error instanceof Error ? error.message : "Erro ao configurar banco de dados")
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center mb-6">
        <Button variant="outline" onClick={() => router.push("/env-check")} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar para verificação de ambiente
        </Button>
      </div>

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Configuração do Banco de Dados</CardTitle>
          <CardDescription>Configure o banco de dados para a aplicação MMGP - Autoavaliação</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Alert className="bg-blue-50 border-blue-200">
              <Database className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800">Configuração do banco de dados</AlertTitle>
              <AlertDescription className="text-blue-700">
                Esta página irá criar a tabela necessária para a aplicação funcionar. Clique no botão abaixo para
                configurar o banco de dados.
              </AlertDescription>
            </Alert>

            {status === "loading" && (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
              </div>
            )}

            {status === "success" && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Sucesso!</AlertTitle>
                <AlertDescription className="text-green-700">{message}</AlertDescription>
              </Alert>
            )}

            {status === "error" && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-center">
              <Button
                onClick={setupDatabase}
                disabled={status === "loading" || status === "success"}
                className="flex items-center gap-2"
              >
                <Database className="h-4 w-4" />
                {status === "success" ? "Banco de dados configurado" : "Configurar banco de dados"}
              </Button>
            </div>

            <div className="bg-gray-100 p-4 rounded-md">
              <h4 className="font-medium mb-2">O que esta configuração faz:</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Cria a tabela 'mmgp_responses' se ela não existir</li>
                <li>Configura as políticas de segurança (RLS) para a tabela</li>
                <li>Adiciona os índices necessários para melhorar a performance</li>
              </ul>
            </div>

            <div className="bg-gray-100 p-4 rounded-md">
              <h4 className="font-medium mb-2">Problemas comuns:</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>
                  <strong>Limite de conexões:</strong> O plano gratuito do Supabase tem limite de 10 conexões
                  simultâneas. Se muitos usuários estiverem acessando ao mesmo tempo, pode haver problemas de conexão.
                </li>
                <li>
                  <strong>Permissões:</strong> A chave anônima pode não ter permissões suficientes para criar tabelas.
                  Neste caso, você precisará criar a tabela manualmente no painel do Supabase.
                </li>
                <li>
                  <strong>Políticas RLS:</strong> As políticas de segurança podem estar impedindo o acesso à tabela.
                  Verifique as políticas no painel do Supabase.
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
