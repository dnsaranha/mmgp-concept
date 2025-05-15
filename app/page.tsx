"use client"

import { useReducer, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { RespondentEmail } from "@/components/respondent-email"
import { RespondentClassification } from "@/components/respondent-classification"
import { Level2Form } from "@/components/level-2-form"
import { Level3Form } from "@/components/level-3-form"
import { Level4Form } from "@/components/level-4-form"
import { Level5Form } from "@/components/level-5-form"
import { ResultsView } from "@/components/results-view"
import { formReducer, initialFormState, type QuestionResponse } from "@/lib/form-reducer"
import { useToast } from "@/components/ui/use-toast"
import { DatabaseError } from "@/components/database-error"

export default function Home() {
  const [activeTab, setActiveTab] = useState("email")
  const [formState, dispatch] = useReducer(formReducer, initialFormState)
  const [progress, setProgress] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  // Verificar se as variáveis de ambiente do Supabase estão configuradas
  const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.API_KEY

  // Resto do código permanece o mesmo...

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value)

    // Update progress based on active tab
    const progressMap: Record<string, number> = {
      email: 0,
      classification: 14,
      level2: 28,
      level3: 42,
      level4: 56,
      level5: 70,
      results: 100,
    }

    setProgress(progressMap[value] || 0)
  }, [])

  const handleEmailChange = useCallback((email: string) => {
    dispatch({ type: "UPDATE_EMAIL", email })
  }, [])

  const handleClassificationChange = useCallback((field: string, value: string) => {
    dispatch({ type: "UPDATE_CLASSIFICATION", field, value })
  }, [])

  const handleQuestionChange = useCallback((level: string, questionId: string, value: QuestionResponse) => {
    dispatch({ type: "UPDATE_QUESTION", level, questionId, value })
  }, [])

  const saveFormData = async () => {
    if (!formState.respondent.email) {
      toast({
        title: "E-mail obrigatório",
        description: "Por favor, informe seu e-mail antes de prosseguir.",
        variant: "destructive",
      })
      setActiveTab("email")
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch("/api/save-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      })

      // Verificar se a resposta é bem-sucedida
      if (!response.ok) {
        const errorText = await response.text()
        console.error("API error response:", errorText)
        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }

      // Tentar analisar a resposta como JSON
      let result
      try {
        result = await response.json()
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError)
        throw new Error("Falha ao processar resposta do servidor")
      }

      if (result.success) {
        dispatch({ type: "SET_SUBMITTED", value: true })
        toast({
          title: "Dados salvos com sucesso",
          description: "Suas respostas foram registradas no banco de dados.",
        })
      } else {
        toast({
          title: "Erro ao salvar dados",
          description: result.message || "Ocorreu um erro ao salvar suas respostas.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving form data:", error)
      toast({
        title: "Erro ao salvar dados",
        description: "Ocorreu um erro ao salvar suas respostas. Tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleNext = useCallback(async () => {
    const tabOrder = ["email", "classification", "level2", "level3", "level4", "level5", "results"]
    const currentIndex = tabOrder.indexOf(activeTab)

    // Se estamos indo para a página de resultados, salvar os dados
    if (currentIndex === tabOrder.length - 2) {
      await saveFormData()
    }

    if (currentIndex < tabOrder.length - 1) {
      setActiveTab(tabOrder[currentIndex + 1])
      setProgress(((currentIndex + 1) / (tabOrder.length - 1)) * 100)
    }
  }, [activeTab])

  const handlePrevious = useCallback(() => {
    const tabOrder = ["email", "classification", "level2", "level3", "level4", "level5", "results"]
    const currentIndex = tabOrder.indexOf(activeTab)
    if (currentIndex > 0) {
      setActiveTab(tabOrder[currentIndex - 1])
      setProgress(((currentIndex - 1) / (tabOrder.length - 1)) * 100)
    }
  }, [activeTab])

  // Validar se podemos avançar para a próxima etapa
  const canProceed = useCallback(() => {
    if (activeTab === "email" && !formState.respondent.email) {
      return false
    }
    return true
  }, [activeTab, formState.respondent.email])

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Autoavaliação de Maturidade em Gerenciamento de Projetos - MMGP</CardTitle>
          <CardDescription>
            Este formulário tem como objetivo avaliar o nível de maturidade em gerenciamento de projetos da sua
            organização, com base no modelo Prado-MMGP.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isSupabaseConfigured && <DatabaseError />}

          <div className="mb-6">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>Início</span>
              <span>Progresso: {Math.round(progress)}%</span>
              <span>Conclusão</span>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid grid-cols-7 mb-8">
              <TabsTrigger value="email">E-mail</TabsTrigger>
              <TabsTrigger value="classification">Classificação</TabsTrigger>
              <TabsTrigger value="level2">Nível 2</TabsTrigger>
              <TabsTrigger value="level3">Nível 3</TabsTrigger>
              <TabsTrigger value="level4">Nível 4</TabsTrigger>
              <TabsTrigger value="level5">Nível 5</TabsTrigger>
              <TabsTrigger value="results">Resultados</TabsTrigger>
            </TabsList>

            <TabsContent value="email">
              <RespondentEmail email={formState.respondent.email} onChange={handleEmailChange} />
            </TabsContent>

            <TabsContent value="classification">
              <RespondentClassification data={formState.classification} onChange={handleClassificationChange} />
            </TabsContent>

            <TabsContent value="level2">
              <Level2Form
                data={formState.level2}
                onChange={(questionId, value) => handleQuestionChange("level2", questionId, value)}
              />
            </TabsContent>

            <TabsContent value="level3">
              <Level3Form
                data={formState.level3}
                onChange={(questionId, value) => handleQuestionChange("level3", questionId, value)}
              />
            </TabsContent>

            <TabsContent value="level4">
              <Level4Form
                data={formState.level4}
                onChange={(questionId, value) => handleQuestionChange("level4", questionId, value)}
              />
            </TabsContent>

            <TabsContent value="level5">
              <Level5Form
                data={formState.level5}
                onChange={(questionId, value) => handleQuestionChange("level5", questionId, value)}
              />
            </TabsContent>

            <TabsContent value="results">
              <ResultsView formData={formState} />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handlePrevious} disabled={activeTab === "email"}>
            Anterior
          </Button>
          <Button onClick={handleNext} disabled={activeTab === "results" || !canProceed() || isSaving}>
            {isSaving ? "Salvando..." : activeTab === "level5" ? "Finalizar e Ver Resultados" : "Próximo"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
