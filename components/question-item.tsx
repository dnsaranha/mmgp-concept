"use client"

import { memo } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import type { QuestionResponse } from "@/lib/form-reducer"
import { cn } from "@/lib/utils"

interface QuestionItemProps {
  id: string
  question: string
  detailFields?: string[]
  value: QuestionResponse
  onChange: (id: string, value: QuestionResponse) => void
  isHighlighted?: boolean // Nova propriedade para destacar perguntas não respondidas
}

export const QuestionItem = memo(function QuestionItem({
  id,
  question,
  detailFields = [],
  value = {},
  onChange,
  isHighlighted = false,
}: QuestionItemProps) {
  const meetsRequirement = value.meetsRequirement || ""
  const details = value.details || {}

  const handleRequirementChange = (newValue: string) => {
    onChange(id, {
      meetsRequirement: newValue,
      details,
    })
  }

  const handleDetailChange = (field: string, detail: string) => {
    onChange(id, {
      meetsRequirement,
      details: {
        ...details,
        [field]: detail,
      },
    })
  }

  return (
    <Card className={cn("mb-6", isHighlighted && "border-red-500 shadow-md")}>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <Label className={cn("text-base font-medium", isHighlighted && "text-red-500")}>
              {question}
              {isHighlighted && <span className="ml-2 text-sm font-normal text-red-500">(Resposta obrigatória)</span>}
            </Label>
          </div>

          <RadioGroup
            value={meetsRequirement}
            onValueChange={handleRequirementChange}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sim" id={`${id}-sim`} />
              <Label htmlFor={`${id}-sim`}>Atende ao requisito</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="nao" id={`${id}-nao`} />
              <Label htmlFor={`${id}-nao`}>Não atende ao requisito</Label>
            </div>
          </RadioGroup>

          {meetsRequirement === "sim" && detailFields.length > 0 && (
            <div className="space-y-4 mt-4 p-4 bg-muted rounded-md">
              <p className="font-medium">Se "Atende ao requisito", por favor, detalhe:</p>

              {detailFields.map((field, index) => (
                <div key={index} className="space-y-2">
                  <Label htmlFor={`${id}-detail-${index}`}>{field}</Label>
                  <Textarea
                    id={`${id}-detail-${index}`}
                    value={details[field] || ""}
                    onChange={(e) => handleDetailChange(field, e.target.value)}
                    placeholder="Forneça detalhes adicionais..."
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
})
