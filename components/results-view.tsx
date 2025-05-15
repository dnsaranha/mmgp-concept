"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import type { FormState } from "@/lib/form-reducer"

interface ResultsViewProps {
  formData: FormState
  unansweredQuestions?: {
    level2: string[]
    level3: string[]
    level4: string[]
    level5: string[]
  }
}

export function ResultsView({
  formData,
  unansweredQuestions = { level2: [], level3: [], level4: [], level5: [] },
}: ResultsViewProps) {
  const calculateLevelScore = (level: keyof FormState) => {
    if (
      !formData ||
      level === "classification" ||
      level === "respondent" ||
      level === "results" ||
      level === "submitted"
    )
      return 0

    const levelData = formData[level] as Record<string, any>
    if (!levelData) return 0

    let totalPoints = 0
    let answeredQuestions = 0

    Object.entries(levelData).forEach(([_, question]) => {
      if (question && question.meetsRequirement === "sim") {
        totalPoints += 5 // Atribuindo 5 pontos para cada resposta "sim"
        answeredQuestions++
      } else if (question && question.meetsRequirement === "nao") {
        answeredQuestions++
      }
    })

    // Retorna a pontuação em percentual (de 0 a 100)
    return answeredQuestions > 0 ? (totalPoints / (answeredQuestions * 5)) * 100 : 0
  }

  // Use useMemo para calcular os scores apenas quando formData mudar
  const scores = useMemo(() => {
    return {
      level2: calculateLevelScore("level2"),
      level3: calculateLevelScore("level3"),
      level4: calculateLevelScore("level4"),
      level5: calculateLevelScore("level5"),
    }
  }, [formData])

  // Use useMemo para calcular o índice de maturidade apenas quando scores mudar
  const maturityIndex = useMemo(() => {
    // Cálculo do índice de maturidade conforme fórmula do modelo Prado-MMGP
    // IM = (100 + Pontuação Nível 2 + Pontuação Nível 3 + Pontuação Nível 4 + Pontuação Nível 5) / 100
    return (100 + scores.level2 + scores.level3 + scores.level4 + scores.level5) / 100
  }, [scores])

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

  // Verificar se há perguntas não respondidas
  const totalUnansweredQuestions =
    unansweredQuestions.level2.length +
    unansweredQuestions.level3.length +
    unansweredQuestions.level4.length +
    unansweredQuestions.level5.length

  return (
    <div className="space-y-8">
      {totalUnansweredQuestions > 0 && (
        <Alert variant="warning" className="bg-yellow-50 border-yellow-200">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800">Atenção: Perguntas não respondidas</AlertTitle>
          <AlertDescription className="text-yellow-700">
            Existem {totalUnansweredQuestions} perguntas que não foram respondidas. Para uma avaliação mais precisa,
            recomendamos responder todas as perguntas.
            <ul className="mt-2 list-disc list-inside">
              {unansweredQuestions.level2.length > 0 && (
                <li>Nível 2: {unansweredQuestions.level2.length} pergunta(s) não respondida(s)</li>
              )}
              {unansweredQuestions.level3.length > 0 && (
                <li>Nível 3: {unansweredQuestions.level3.length} pergunta(s) não respondida(s)</li>
              )}
              {unansweredQuestions.level4.length > 0 && (
                <li>Nível 4: {unansweredQuestions.level4.length} pergunta(s) não respondida(s)</li>
              )}
              {unansweredQuestions.level5.length > 0 && (
                <li>Nível 5: {unansweredQuestions.level5.length} pergunta(s) não respondida(s)</li>
              )}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Resultados da Avaliação de Maturidade</CardTitle>
          <CardDescription>
            Abaixo estão os resultados da sua autoavaliação de maturidade em gerenciamento de projetos, baseado no
            modelo Prado-MMGP.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Índice de Maturidade Global</h3>
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold">{maturityIndex.toFixed(2)}</div>
                <div className="text-lg">{getMaturityLevel(maturityIndex)}</div>
              </div>
            </div>

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
                      <Progress value={scores.level2} className="w-20" />
                      <span>{scores.level2.toFixed(0)}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{scores.level2 < 33 ? "Fraco" : scores.level2 < 66 ? "Regular" : "Bom"}</TableCell>
                  <TableCell className="hidden md:table-cell">{getLevelDescription("level2", scores.level2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Nível 3 - Padronizado</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={scores.level3} className="w-20" />
                      <span>{scores.level3.toFixed(0)}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{scores.level3 < 33 ? "Fraco" : scores.level3 < 66 ? "Regular" : "Bom"}</TableCell>
                  <TableCell className="hidden md:table-cell">{getLevelDescription("level3", scores.level3)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Nível 4 - Gerenciado</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={scores.level4} className="w-20" />
                      <span>{scores.level4.toFixed(0)}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{scores.level4 < 33 ? "Fraco" : scores.level4 < 66 ? "Regular" : "Bom"}</TableCell>
                  <TableCell className="hidden md:table-cell">{getLevelDescription("level4", scores.level4)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Nível 5 - Otimizado</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={scores.level5} className="w-20" />
                      <span>{scores.level5.toFixed(0)}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{scores.level5 < 33 ? "Fraco" : scores.level5 < 66 ? "Regular" : "Bom"}</TableCell>
                  <TableCell className="hidden md:table-cell">{getLevelDescription("level5", scores.level5)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <div className="p-4 bg-muted rounded-md">
              <h3 className="text-lg font-medium mb-2">Interpretação do Resultado</h3>
              <p className="text-sm">
                {maturityIndex < 2
                  ? "Nível Inicial (1-1.9): A organização está nos estágios iniciais de gerenciamento de projetos, com iniciativas isoladas e sem padronização. Recomenda-se investir em treinamentos básicos e conscientização sobre a importância do gerenciamento de projetos."
                  : maturityIndex < 3
                    ? "Nível Conhecido (2-2.9): A organização reconhece a importância do gerenciamento de projetos, mas ainda não possui uma metodologia consolidada. Recomenda-se formalizar processos e investir em capacitação mais avançada."
                    : maturityIndex < 4
                      ? "Nível Padronizado (3-3.9): A organização possui metodologia estabelecida, mas ainda há oportunidades de melhoria na implementação e no controle. Recomenda-se fortalecer o PMO e implementar métricas de desempenho."
                      : maturityIndex < 5
                        ? "Nível Gerenciado (4-4.9): A organização possui processos consolidados e alinhados à estratégia. Recomenda-se focar em otimização e melhoria contínua dos processos existentes."
                        : "Nível Otimizado (5): A organização atingiu excelência em gerenciamento de projetos, com processos otimizados e cultura estabelecida. Recomenda-se manter o benchmark e a inovação contínua."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
