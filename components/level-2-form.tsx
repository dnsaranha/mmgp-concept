"use client"

import { memo } from "react"
import { QuestionItem } from "@/components/question-item"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { QuestionResponse } from "@/lib/form-reducer"

interface Level2FormProps {
  data: Record<string, QuestionResponse>
  onChange: (questionId: string, value: QuestionResponse) => void
}

export const Level2Form = memo(function Level2Form({ data = {}, onChange }: Level2FormProps) {
  const questions = [
    {
      id: "q1",
      question:
        "1. Nos últimos 12 meses, os profissionais do setor participaram de treinamentos internos ou externos relacionados a aspectos básicos de gerenciamento de projetos?",
      detailFields: [
        "Quais foram os temas abordados nos treinamentos?",
        "Quantos profissionais participaram?",
        "Com que frequência os treinamentos ocorreram?",
      ],
    },
    {
      id: "q2",
      question:
        "2. O setor utilizou softwares para gerenciamento de tempo (como sequenciamento de tarefas, cronogramas, gráficos de Gantt) nos últimos 12 meses?",
      detailFields: [
        "Quais softwares foram utilizados?",
        "Quantos profissionais foram treinados para utilizá-los?",
        "Em quantos projetos esses softwares foram aplicados?",
      ],
    },
    {
      id: "q3",
      question:
        "3. Os profissionais do setor têm experiência recente no planejamento, acompanhamento e encerramento de projetos, utilizando padrões reconhecidos (como PMBOK) e ferramentas computacionais?",
      detailFields: [
        "Quantos projetos foram gerenciados com base nesses padrões?",
        "Quais ferramentas computacionais foram utilizadas?",
        "Quais foram os principais resultados obtidos?",
      ],
    },
    {
      id: "q4",
      question:
        "4. A alta administração do setor reconhece a importância do gerenciamento de projetos e tem promovido iniciativas para seu desenvolvimento nos últimos 12 meses?",
      detailFields: [
        "Quais iniciativas foram promovidas?",
        "Quantos membros da alta administração participaram?",
        "Quais foram os principais resultados dessas iniciativas?",
      ],
    },
    {
      id: "q5",
      question:
        "5. A alta administração do setor reconhece a importância de possuir uma metodologia de gerenciamento de projetos e tem promovido iniciativas para seu desenvolvimento nos últimos 12 meses?",
      detailFields: [
        "Quais iniciativas foram promovidas?",
        "Quantos membros da alta administração participaram?",
        "Quais foram os principais resultados dessas iniciativas?",
      ],
    },
    {
      id: "q6",
      question:
        "6. A alta administração do setor reconhece a importância de possuir um sistema informatizado para o gerenciamento de projetos e tem promovido iniciativas para seu desenvolvimento nos últimos 12 meses?",
      detailFields: [
        "Quais iniciativas foram promovidas?",
        "Quantos membros da alta administração participaram?",
        "Quais foram os principais resultados dessas iniciativas?",
      ],
    },
    {
      id: "q7",
      question:
        "7. A alta administração do setor reconhece a importância dos componentes da estrutura organizacional (como Gerentes de Projeto, PMO, Comitês, Sponsor) e tem promovido iniciativas para seu desenvolvimento nos últimos 12 meses?",
      detailFields: [
        "Quais iniciativas foram promovidas?",
        "Quantos membros da alta administração participaram?",
        "Quais foram os principais resultados dessas iniciativas?",
      ],
    },
    {
      id: "q8",
      question:
        "8. A alta administração do setor reconhece a importância de alinhar os projetos com as estratégias e prioridades da organização e tem promovido iniciativas para esse alinhamento nos últimos 12 meses?",
      detailFields: [
        "Quais iniciativas foram promovidas?",
        "Quantos membros da alta administração participaram?",
        "Quais foram os principais resultados dessas iniciativas?",
      ],
    },
    {
      id: "q9",
      question:
        "9. A alta administração do setor reconhece a importância de desenvolver competências comportamentais (como liderança, negociação, comunicação, resolução de conflitos) e tem promovido iniciativas para esse desenvolvimento nos últimos 12 meses?",
      detailFields: [
        "Quais iniciativas foram promovidas?",
        "Quantos membros da alta administração participaram?",
        "Quais foram os principais resultados dessas iniciativas?",
      ],
    },
    {
      id: "q10",
      question:
        "10. A alta administração do setor reconhece a importância de desenvolver competências técnicas e contextuais (relacionadas ao produto, negócios, estratégia da organização, clientes) e tem promovido iniciativas para esse desenvolvimento nos últimos 12 meses?",
      detailFields: [
        "Quais iniciativas foram promovidas?",
        "Quantos membros da alta administração participaram?",
        "Quais foram os principais resultados dessas iniciativas?",
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Nível 2 – Conhecido (Iniciativas Isoladas)</CardTitle>
          <CardDescription>
            Para cada uma das questões abaixo, selecione se o requisito é atendido ou não. Caso o requisito seja
            atendido, forneça detalhes adicionais conforme solicitado.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {questions.map((q) => (
            <QuestionItem
              key={q.id}
              id={q.id}
              question={q.question}
              detailFields={q.detailFields}
              value={data[q.id] || {}}
              onChange={onChange}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  )
})
