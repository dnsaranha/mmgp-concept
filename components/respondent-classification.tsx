"use client"

import { memo } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface RespondentClassificationProps {
  data: {
    participatedInProjects?: string
    isPharmaceuticalIndustry?: string
    productType?: string
    companySize?: string
  }
  onChange: (field: string, value: string) => void
}

export const RespondentClassification = memo(function RespondentClassification({
  data = {},
  onChange,
}: RespondentClassificationProps) {
  const participatedInProjects = data.participatedInProjects || ""
  const isPharmaceuticalIndustry = data.isPharmaceuticalIndustry || ""
  const productType = data.productType || ""
  const companySize = data.companySize || ""

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Classificação do respondente</CardTitle>
          <CardDescription>
            Por favor, responda às seguintes perguntas para classificação do respondente.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>
              A - Nos últimos 12 meses, participou de projetos na instituição que trabalha e tem conhecimento das
              práticas realizadas no planejamento, desenvolvimento e encerramento do projeto?
            </Label>
            <RadioGroup
              value={participatedInProjects}
              onValueChange={(value) => onChange("participatedInProjects", value)}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sim" id="participatedInProjects-sim" />
                <Label htmlFor="participatedInProjects-sim">Sim</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nao" id="participatedInProjects-nao" />
                <Label htmlFor="participatedInProjects-nao">Não</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>B - A instituição onde trabalha é uma indústria farmacêutica?</Label>
            <RadioGroup
              value={isPharmaceuticalIndustry}
              onValueChange={(value) => onChange("isPharmaceuticalIndustry", value)}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sim" id="isPharmaceuticalIndustry-sim" />
                <Label htmlFor="isPharmaceuticalIndustry-sim">Sim</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nao" id="isPharmaceuticalIndustry-nao" />
                <Label htmlFor="isPharmaceuticalIndustry-nao">Não</Label>
              </div>
            </RadioGroup>
          </div>

          {isPharmaceuticalIndustry === "sim" && (
            <div className="space-y-3">
              <Label htmlFor="productType">Qual vertente de produtos se classifica a indústria farmacêutica?</Label>
              <Select value={productType} onValueChange={(value) => onChange("productType", value)}>
                <SelectTrigger id="productType">
                  <SelectValue placeholder="Selecione o tipo de produto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="biologico">Medicamento Biológico Não Novo</SelectItem>
                  <SelectItem value="especifico">Medicamento Específico</SelectItem>
                  <SelectItem value="generico">Medicamento Genérico</SelectItem>
                  <SelectItem value="mip">Medicamentos Liberados ou Isentos de Prescrição Médica (MIP)</SelectItem>
                  <SelectItem value="fitoterapico">Medicamento Fitoterápico</SelectItem>
                  <SelectItem value="novo">Medicamento Novo</SelectItem>
                  <SelectItem value="similar">Medicamento Similar</SelectItem>
                  <SelectItem value="terapia">Produtos de Terapia Avançada</SelectItem>
                  <SelectItem value="radiofarmacos">Radiofármacos</SelectItem>
                  <SelectItem value="outros">Outros Medicamentos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-3">
            <Label htmlFor="companySize">C - Qual o porte da indústria que trabalha?</Label>
            <Select value={companySize} onValueChange={(value) => onChange("companySize", value)}>
              <SelectTrigger id="companySize">
                <SelectValue placeholder="Selecione o porte da empresa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pequena">Pequena</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="grande">Grande</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  )
})
