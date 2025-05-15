"use client"

import { memo } from "react"
import { QuestionItem } from "@/components/question-item"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { QuestionResponse } from "@/lib/form-reducer"

interface Level3FormProps {
  data: Record<string, QuestionResponse>
  onChange: (questionId: string, value: QuestionResponse) => void
}

export const Level3Form = memo(function Level3Form({ data = {}, onChange }: Level3FormProps) {
  const questions = [
    {
      id: "q11",
      question: "11. A organização possui metodologia de gerenciamento de projetos formalizada e divulgada?",
      detailFields: [
        "A metodologia é baseada em algum referencial (ex: PMBOK, PRINCE2)?",
        "Desde quando está formalizada?",
        "Como e com que frequência é divulgada?",
      ],
    },
    {
      id: "q12",
      question: "12. A metodologia de gerenciamento de projetos é aplicada em grande parte dos projetos do setor?",
      detailFields: [
        "Qual o percentual de projetos que seguem a metodologia?",
        "Há auditorias ou verificações para garantir a aplicação?",
      ],
    },
    {
      id: "q13",
      question:
        "13. A metodologia de gerenciamento de projetos contempla processos de iniciação, planejamento, execução, controle e encerramento?",
      detailFields: [
        "Quais desses processos são mais consolidados?",
        "Há documentos ou templates padronizados para cada fase?",
      ],
    },
    {
      id: "q14",
      question:
        "14. A organização possui um sistema informatizado de gerenciamento de projetos que apoia a aplicação da metodologia?",
      detailFields: [
        "Qual sistema é utilizado?",
        "Quais funcionalidades estão em uso (ex: cronograma, riscos, custos)?",
        "Há integração com outros sistemas corporativos?",
      ],
    },
    {
      id: "q15",
      question: "15. Existe um Escritório de Projetos (PMO) com papel definido para apoiar a gestão dos projetos?",
      detailFields: [
        "Quais são as principais atribuições do PMO?",
        "Qual a estrutura (equipe, hierarquia)?",
        "O PMO atua de forma consultiva, diretiva ou controladora?",
      ],
    },
    {
      id: "q16",
      question: "16. O setor realiza reuniões de lições aprendidas no encerramento dos projetos?",
      detailFields: [
        "Qual a frequência das reuniões?",
        "Como as lições aprendidas são registradas e disseminadas?",
        "Elas são reutilizadas em projetos futuros?",
      ],
    },
    {
      id: "q17",
      question:
        "17. Existem indicadores de desempenho utilizados para avaliação de projetos (ex: prazo, custo, escopo, qualidade)?",
      detailFields: [
        "Quais indicadores são utilizados?",
        "Como são medidos e com que periodicidade?",
        "Quem analisa os resultados?",
      ],
    },
    {
      id: "q18",
      question: "18. Existe padronização de documentos, relatórios e templates para os projetos?",
      detailFields: [
        "Quais documentos estão padronizados?",
        "Onde estão armazenados e como são acessados?",
        "Quem é responsável pela atualização?",
      ],
    },
    {
      id: "q19",
      question: "19. Os papéis e responsabilidades das partes interessadas nos projetos estão claramente definidos?",
      detailFields: [
        "Há matriz de responsabilidades (ex: RACI)?",
        "Os papéis são comunicados aos envolvidos?",
        "Existem conflitos de atribuições?",
      ],
    },
    {
      id: "q20",
      question: "20. Os projetos são formalmente autorizados antes de iniciar?",
      detailFields: [
        "Quem é responsável pela autorização?",
        "Que tipo de documento é utilizado (termo de abertura, e-mail, etc.)?",
        "Esse processo é obrigatório para todos os projetos?",
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Nível 3 – Padronizado</CardTitle>
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
