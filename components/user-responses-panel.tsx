"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { getSupabaseClient } from "@/lib/supabase"
import { Eye, FileBarChart } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useToast } from "@/components/ui/use-toast"

type UserResponse = {
  id: string
  email: string
  submitted_at: string
  maturity_index: number
  level2_score: number
  level3_score: number
  level4_score: number
  level5_score: number
}

interface UserResponsesPanelProps {
  userEmail: string
  onViewDetails?: (responseId: string) => void
}

export function UserResponsesPanel({ userEmail, onViewDetails }: UserResponsesPanelProps) {
  const [responses, setResponses] = useState<UserResponse[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchUserResponses() {
      try {
        setLoading(true)
        const supabase = getSupabaseClient()
        if (!supabase) {
          throw new Error("Erro de conexão com o banco de dados")
        }

        const { data, error } = await supabase
          .from("mmgp_responses")
          .select("id, email, submitted_at, maturity_index, level2_score, level3_score, level4_score, level5_score")
          .eq("email", userEmail)
          .order("submitted_at", { ascending: false })

        if (error) {
          throw error
        }

        setResponses(data || [])
      } catch (error) {
        console.error("Erro ao buscar respostas:", error)
        toast({
          title: "Erro ao carregar histórico",
          description: "Não foi possível carregar seu histórico de respostas.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (userEmail) {
      fetchUserResponses()
    }
  }, [userEmail, toast])

  const getMaturityLevel = (index: number) => {
    if (index < 2) return "Inicial"
    if (index < 3) return "Conhecido"
    if (index < 4) return "Padronizado"
    if (index < 5) return "Otimizado"
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Seu histórico de avaliações</CardTitle>
          <CardDescription>Carregando suas avaliações anteriores...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
        </CardContent>
      </Card>
    )
  }

  if (responses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Seu histórico de avaliações</CardTitle>
          <CardDescription>Você ainda não possui avaliações salvas.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            Complete e salve uma avaliação para visualizá-la aqui.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seu histórico de avaliações</CardTitle>
        <CardDescription>Veja suas avaliações anteriores e acompanhe sua evolução.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Índice de Maturidade</TableHead>
              <TableHead className="hidden md:table-cell">Nível 2</TableHead>
              <TableHead className="hidden md:table-cell">Nível 3</TableHead>
              <TableHead className="hidden md:table-cell">Nível 4</TableHead>
              <TableHead className="hidden md:table-cell">Nível 5</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {responses.map((response) => (
              <TableRow key={response.id}>
                <TableCell>{format(new Date(response.submitted_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {response.maturity_index != null ? response.maturity_index.toFixed(2) : "N/A"}
                    </span>
                    <span className="text-xs text-muted-foreground">{getMaturityLevel(response.maturity_index)}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <Progress value={response.level2_score ?? 0} className="w-16 h-2" />
                    <span className="text-xs">
                      {response.level2_score != null ? response.level2_score.toFixed(0) : "0"}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <Progress value={response.level3_score ?? 0} className="w-16 h-2" />
                    <span className="text-xs">
                      {response.level3_score != null ? response.level3_score.toFixed(0) : "0"}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <Progress value={response.level4_score ?? 0} className="w-16 h-2" />
                    <span className="text-xs">
                      {response.level4_score != null ? response.level4_score.toFixed(0) : "0"}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <Progress value={response.level5_score ?? 0} className="w-16 h-2" />
                    <span className="text-xs">
                      {response.level5_score != null ? response.level5_score.toFixed(0) : "0"}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails && onViewDetails(response.id)}
                      title="Ver detalhes"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" title="Exportar relatório">
                      <FileBarChart className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
