"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserResponsesPanel } from "@/components/user-responses-panel"
import { useAuth } from "@/contexts/auth-context"
import { ArrowLeft } from "lucide-react"

export default function HistoricoPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [selectedResponseId, setSelectedResponseId] = useState<string | null>(null)

  const handleViewDetails = (responseId: string) => {
    setSelectedResponseId(responseId)
    router.push(`/historico/${responseId}`)
  }

  // Verificar se o usuário está autenticado
  if (!user) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Acesso Restrito</CardTitle>
            <CardDescription>Você precisa estar logado para acessar esta página.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/auth/login")}>Fazer Login</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={() => router.push("/")} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar para o formulário
        </Button>
        <h1 className="text-2xl font-bold">Histórico de Avaliações</h1>
        <div className="w-[100px]"></div> {/* Espaçador para centralizar o título */}
      </div>

      {user?.email ? (
        <UserResponsesPanel userEmail={user.email} onViewDetails={handleViewDetails} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Carregando...</CardTitle>
            <CardDescription>Aguarde enquanto carregamos seus dados.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
