"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ArrowLeft, AlertTriangle } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { getResponseDetails } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import { ProtectedRoute } from "@/components/protected-route"

export default function ResponseDetailsPage({ params }: { params: { id: string } }) {
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    async function fetchResponseDetails() {
      try {
        setLoading(true)
        const { success, data, error } = await getResponseDetails(params.id)

        if (!success || !data) {
          throw new Error(error || "Não foi possível carregar os detalhes da avaliação")
        }

        setResponse(data)
      } catch (err) {
        console.error("Erro ao buscar detalhes da resposta:", err)
        setError(err instanceof Error ? err.message : "Erro ao carregar os detalhes da avaliação")
        toast({
          title: "Erro ao carregar detalhes",
          description: "Não foi possível carregar os detalhes desta avaliação.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchResponseDetails()
    }
  }, [params.id, toast])

  const getMaturityLevel = (index: number) => {
    if (index < 2) return "Inicial"
    if (index < 3) return "Conhecido"
    if (index < 4) return "Padronizado"
    if (index < 5) return "Gerenciado"
    return "Otimizado"
  }

  const getLevelDescription = (level: string, score: number) => {
    const descriptions: Record<string, string[]> = {
      level2: [
        "Nível muito fraco. Quase nenhuma iniciativa da organização.",
        "Iniciativas isoladas. Conhecimento introdutório de gerenciamento de projetos.",
        "Algum avanço. Treinamentos básicos de gerenciamento para os principais envolvidos.",
      ],
      level3: [
        "Nível muito fraco. Não existe metodologia.",
        "Metodologia desenvolvida, mas pouco utilizada.",
        "Metodologia estabelecida e em uso, com informatização parcial.",
      ],
      level4: [
        "Nível muito fraco. Não existe acompanhamento formal.",
        "Acompanhamento e controle parcial, em algumas áreas.",
        "Acompanhamento e controle em todas as áreas, com métricas e melhorias.",
      ],
      level5: [
        "Nível muito fraco. Não existem iniciativas de otimização.",
        "Algumas iniciativas isoladas de melhoria contínua.",
        "Otimização plena, com uso de benchmarking e melhoria contínua.",
      ],
    }

    if (score < 33) return descriptions[level][0]
    if (score < 66) return descriptions[level][1]
    return descriptions[level][2]
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto py-10">
          <Card>
            <CardHeader>
              <CardTitle>Carregando detalhes da avaliação</CardTitle>
              <CardDescription>Aguarde enquanto carregamos os dados...</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    )
  }

  if (error || !response) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto py-10">
          <div className="flex items-center justify-between mb-6">
            <Button variant="outline" onClick={() => router.push("/historico")} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar para o histórico
            </Button>
          </div>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error || "Não foi possível carregar os detalhes da avaliação"}</AlertDescription>
          </Alert>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={() => router.push("/historico")} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar para o histórico
          </Button>
          <h1 className="text-2xl font-bold">Detalhes da Avaliação</h1>
          <div className="w-[100px]"></div> {/* Espaçador para centralizar o título */}
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Informações Gerais</CardTitle>
              <CardDescription>
                Avaliação realizada em{" "}
                {format(new Date(response.submitted_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">E-mail</h3>
                  <p>{response.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Estado</h3>
                  <p>{response.estado || "Não informado"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Indústria Farmacêutica</h3>
                  <p>{response.classification?.isPharmaceuticalIndustry === "sim" ? "Sim" : "Não"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Porte da Empresa</h3>
                  <p>
                    {response.classification?.companySize === "pequena"
                      ? "Pequena"
                      : response.classification?.companySize === "media"
                        ? "Média"
                        : response.classification?.companySize === "grande"
                          ? "Grande"
                          : "Não informado"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resultados da Avaliação</CardTitle>
              <CardDescription>
                Índice de Maturidade:{" "}
                <strong>{response.maturity_index != null ? response.maturity_index.toFixed(2) : "N/A"}</strong> -{" "}
                <span className="font-medium">{getMaturityLevel(response.maturity_index)}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nível</TableHead>
                    <TableHead>Pontuação</TableHead>
                    <TableHead>Avaliação</TableHead>
                    <TableHead className="hidden md:table-cell">Descrição</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Nível 2 - Conhecido</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={response.level2_score ?? 0} className="w-20" />
                        <span>{response.level2_score != null ? response.level2_score.toFixed(0) : "0"}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {response.level2_score < 33 ? "Fraco" : response.level2_score < 66 ? "Regular" : "Bom"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {getLevelDescription("level2", response.level2_score)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Nível 3 - Padronizado</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={response.level3_score ?? 0} className="w-20" />
                        <span>{response.level3_score != null ? response.level3_score.toFixed(0) : "0"}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {response.level3_score < 33 ? "Fraco" : response.level3_score < 66 ? "Regular" : "Bom"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {getLevelDescription("level3", response.level3_score)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Nível 4 - Gerenciado</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={response.level4_score ?? 0} className="w-20" />
                        <span>{response.level4_score != null ? response.level4_score.toFixed(0) : "0"}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {response.level4_score < 33 ? "Fraco" : response.level4_score < 66 ? "Regular" : "Bom"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {getLevelDescription("level4", response.level4_score)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Nível 5 - Otimizado</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={response.level5_score ?? 0} className="w-20" />
                        <span>{response.level5_score != null ? response.level5_score.toFixed(0) : "0"}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {response.level5_score < 33 ? "Fraco" : response.level5_score < 66 ? "Regular" : "Bom"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {getLevelDescription("level5", response.level5_score)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <div className="p-4 bg-muted rounded-md mt-6">
                <h3 className="text-lg font-medium mb-2">Interpretação do Resultado</h3>
                <p className="text-sm">
                  {response.maturity_index < 2
                    ? "Nível Inicial (1-1.9): A organização está nos estágios iniciais de gerenciamento de projetos, com iniciativas isoladas e sem padronização. Recomenda-se investir em treinamentos básicos e conscientização sobre a importância do gerenciamento de projetos."
                    : response.maturity_index < 3
                      ? "Nível Conhecido (2-2.9): A organização reconhece a importância do gerenciamento de projetos, mas ainda não possui uma metodologia consolidada. Recomenda-se formalizar processos e investir em capacitação mais avançada."
                      : response.maturity_index < 4
                        ? "Nível Padronizado (3-3.9): A organização possui metodologia estabelecida, mas ainda há oportunidades de melhoria na implementação e no controle. Recomenda-se fortalecer o PMO e implementar métricas de desempenho."
                        : response.maturity_index < 5
                          ? "Nível Gerenciado (4-4.9): A organização possui processos consolidados e alinhados à estratégia. Recomenda-se focar em otimização e melhoria contínua dos processos existentes."
                          : "Nível Otimizado (5): A organização atingiu excelência em gerenciamento de projetos, com processos otimizados e cultura estabelecida. Recomenda-se manter o benchmark e a inovação contínua."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
