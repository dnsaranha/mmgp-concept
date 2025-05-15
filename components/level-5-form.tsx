"use client"

import { memo } from "react"
import { QuestionItem } from "@/components/question-item"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { QuestionResponse } from "@/lib/form-reducer"

interface Level5FormProps {
  data: Record<string, QuestionResponse>
  onChange: (questionId: string, value: QuestionResponse) => void
  unansweredQuestions?: string[] // Nova propriedade para destacar perguntas não respondidas
}

export const Level5Form = memo(function Level5Form({ data = {}, onChange, unansweredQuestions = [] }: Level5FormProps) {
  const questions = [
    {
      id: "q31",
      question: "31. Existe um processo formal de melhoria contínua da metodologia de gerenciamento de projetos?",
      detailFields: [
        "Com que frequência a metodologia é revisada?",
        "Quem participa da revisão?",
        "Quais melhorias recentes foram implementadas?",
      ],
    },
    {
      id: "q32",
      question: "32. As lições aprendidas são sistematicamente coletadas, analisadas e utilizadas em novos projetos?",
      detailFields: [
        "Onde são armazenadas as lições aprendidas?",
        "Como são disseminadas?",
        "Cite exemplos de reaproveitamento efetivo.",
      ],
    },
    {
      id: "q33",
      question:
        "33. Os indicadores de desempenho são utilizados para tomada de decisão e melhoria da gestão de projetos?",
      detailFields: [
        "Como os dados são analisados?",
        "Há ações corretivas com base nos resultados?",
        "Quem participa da análise?",
      ],
    },
    {
      id: "q34",
      question: "34. Há benchmark interno e externo para comparação da performance dos projetos?",
      detailFields: [
        "Com quem são feitas as comparações (internas ou empresas externas)?",
        "Que critérios são usados?",
        "Que melhorias surgiram a partir do benchmark?",
      ],
    },
    {
      id: "q35",
      question: "35. A cultura de gerenciamento de projetos está disseminada entre todas as áreas da organização?",
      detailFields: [
        "Quais áreas utilizam práticas formais de GP?",
        "Há incentivo ou obrigatoriedade de uso?",
        "Há resistência em algum setor?",
      ],
    },
    {
      id: "q36",
      question: "36. Existe um plano de carreira para profissionais de gerenciamento de projetos?",
      detailFields: [
        "O plano é estruturado por níveis de experiência?",
        "Quais competências são consideradas?",
        "Há avaliação de desempenho ligada ao plano?",
      ],
    },
    {
      id: "q37",
      question:
        "37. A organização possui certificações em gerenciamento de projetos ou exige isso de seus profissionais?",
      detailFields: [
        "Quais certificações são exigidas ou incentivadas (ex: PMP, CAPM)?",
        "Quantos profissionais certificados existem?",
        "Há apoio institucional (reembolso, tempo para estudo)?",
      ],
    },
    {
      id: "q38",
      question: "38. Existe uma comunidade de práticas ou fórum interno de discussão sobre gerenciamento de projetos?",
      detailFields: ["Qual a frequência dos encontros?", "Que temas são abordados?", "Quem participa?"],
    },
    {
      id: "q39",
      question:
        "39. A organização realiza autoavaliações periódicas do grau de maturidade em gerenciamento de projetos?",
      detailFields: [
        "Com que frequência são realizadas?",
        "Que metodologia é utilizada?",
        "Quais ações foram tomadas após as avaliações?",
      ],
    },
    {
      id: "q40",
      question: "40. O Escritório de Projetos (PMO) atua estrategicamente, influenciando decisões da alta direção?",
      detailFields: [
        "Em quais decisões o PMO influencia diretamente?",
        "Como a alta direção responde às recomendações do PMO?",
        "Cite exemplos de impacto estratégico.",
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Nível 5 – Otimizado</CardTitle>
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
              isHighlighted={unansweredQuestions.includes(q.id)}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  )
})
