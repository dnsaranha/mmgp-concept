"use client"

import { memo } from "react"
import { QuestionItem } from "@/components/question-item"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { QuestionResponse } from "@/lib/form-reducer"

interface Level4FormProps {
  data: Record<string, QuestionResponse>
  onChange: (questionId: string, value: QuestionResponse) => void
}

export const Level4Form = memo(function Level4Form({ data = {}, onChange }: Level4FormProps) {
  const questions = [
    {
      id: "q21",
      question:
        "21. Existe um processo formal para priorização e seleção de projetos alinhados às estratégias da organização?",
      detailFields: [
        "Qual critério é utilizado na priorização (ROI, impacto estratégico, etc.)?",
        "Quem participa da definição?",
        "Há revisão periódica dessas prioridades?",
      ],
    },
    {
      id: "q22",
      question: "22. Os projetos são agrupados e tratados como portfólios ou programas?",
      detailFields: [
        "Quais critérios definem o agrupamento (tipo, área, objetivo)?",
        "Como é feita a gestão integrada?",
        "Há gestores de portfólio ou programa?",
      ],
    },
    {
      id: "q23",
      question: "23. Existe controle centralizado e padronizado dos indicadores de desempenho dos projetos?",
      detailFields: [
        "Quais são os indicadores padronizados?",
        "Onde são registrados (dashboard, sistema)?",
        "Com que frequência são analisados?",
      ],
    },
    {
      id: "q24",
      question:
        "24. A organização realiza auditorias ou avaliações periódicas nos projetos para verificar aderência à metodologia?",
      detailFields: [
        "Qual a frequência dessas auditorias?",
        "Quem as realiza?",
        "Como os resultados são utilizados para melhoria?",
      ],
    },
    {
      id: "q25",
      question:
        "25. Existe um processo formal de gestão de mudanças nos projetos (controle de escopo, aprovações, impactos)?",
      detailFields: [
        "Há registro e análise formal das mudanças?",
        "Quem aprova as mudanças?",
        "Qual o impacto no cronograma, custo e escopo?",
      ],
    },
    {
      id: "q26",
      question: "26. Os planos de projeto incluem planejamento de recursos humanos, comunicações, riscos e aquisições?",
      detailFields: [
        "Todos os projetos incluem esses planos?",
        "Como são documentados e atualizados?",
        "Como esses planos são utilizados na execução?",
      ],
    },
    {
      id: "q27",
      question:
        "27. Existe um processo para gerenciamento de riscos, com identificação, análise, plano de resposta e monitoramento?",
      detailFields: [
        "Os riscos são classificados por impacto e probabilidade?",
        "Há plano de contingência documentado?",
        "Quem é responsável pelo monitoramento?",
      ],
    },
    {
      id: "q28",
      question:
        "28. Os projetos contam com patrocínio ativo (sponsor), apoiando decisões críticas e removendo barreiras?",
      detailFields: [
        "Quem atua como sponsor?",
        "Com que frequência participa das decisões?",
        "Como o apoio se manifesta (reuniões, decisões, recursos)?",
      ],
    },
    {
      id: "q29",
      question:
        "29. Existe capacitação regular para os gerentes de projeto e equipes, com foco técnico e comportamental?",
      detailFields: [
        "Quais temas são abordados nos treinamentos?",
        "Com que frequência são realizados?",
        "Quem ministra os treinamentos?",
      ],
    },
    {
      id: "q30",
      question:
        "30. A gestão de projetos é considerada crítica para o sucesso organizacional, sendo acompanhada pela alta direção?",
      detailFields: [
        "Quais mecanismos demonstram esse acompanhamento?",
        "A alta direção participa de reuniões ou relatórios periódicos?",
        "Há ações da alta direção com base nesses acompanhamentos?",
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Nível 4 – Gerenciado</CardTitle>
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
