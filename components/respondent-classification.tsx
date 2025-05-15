"use client"

import { memo } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"

// Lista de estados brasileiros
const estados = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" },
]

interface RespondentClassificationProps {
  data: {
    participatedInProjects?: string
    isPharmaceuticalIndustry?: string
    productType?: string
    companySize?: string
    estado?: string
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
  const estado = data.estado || ""

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
            <div className="flex items-center gap-2">
              <Label htmlFor="companySize">C - Qual o porte da indústria que trabalha?</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon" className="h-6 w-6 rounded-full p-0">
                    <HelpCircle className="h-4 w-4" />
                    <span className="sr-only">Informações sobre porte de empresa</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="font-medium">Definições de porte de empresa</h4>
                    <p className="text-sm">
                      <strong>Pequena:</strong> Até 99 funcionários para indústria ou até 49 para comércio e serviços.
                      Faturamento anual até R$ 4,8 milhões.
                    </p>
                    <p className="text-sm">
                      <strong>Média:</strong> De 100 a 499 funcionários para indústria ou de 50 a 99 para comércio e
                      serviços. Faturamento anual entre R$ 4,8 milhões e R$ 300 milhões.
                    </p>
                    <p className="text-sm">
                      <strong>Grande:</strong> Mais de 500 funcionários para indústria ou mais de 100 para comércio e
                      serviços. Faturamento anual acima de R$ 300 milhões.
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
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

          <div className="space-y-3">
            <Label htmlFor="estado">D - Em qual estado está localizada a empresa?</Label>
            <Select value={estado} onValueChange={(value) => onChange("estado", value)}>
              <SelectTrigger id="estado">
                <SelectValue placeholder="Selecione o estado" />
              </SelectTrigger>
              <SelectContent>
                {estados.map((estado) => (
                  <SelectItem key={estado.value} value={estado.value}>
                    {estado.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  )
})
