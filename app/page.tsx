"use client"

import { useReducer, useState, useCallback, useMemo, useEffect } from "react"
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, History } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export default function Home() {
  const [activeTab, setActiveTab] = useState("email")
  const [formState, dispatch] = useReducer(formReducer, initialFormState)
  const [progress, setProgress] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(true)
  const { toast } = useToast()
  const { user, signOut } = useAuth()
  const router = useRouter()

  // Verificar se as variáveis de ambiente do Supabase estão configuradas
  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      setIsSupabaseConfigured(false)
      console.error("Supabase environment variables are not set correctly")
    } else {
      setIsSupabaseConfigured(true)
    }
  }, [])

  // Preencher o email do usuário autenticado
  useEffect(() => {
    if (user?.email && !formState.respondent.email) {
      dispatch({ type: "UPDATE_EMAIL", email: user.email })
    }
  }, [user, formState.respondent.email])

  // Verificar perguntas não respondidas
  const unansweredQuestions = useMemo(() => {
    const checkLevel = (level: string, questionCount: number) => {
      const levelData = formState[level as keyof typeof formState] as Record<string, QuestionResponse>
      const unanswered: string[] = []

      for (let i = 1; i <= questionCount; i++) {
        const questionId = `q${i + (level === "level2" ? 0 : level === "level3" ? 10 : level === "level4" ? 20 : 30)}`
        if (!levelData[questionId]?.meetsRequirement) {
          unanswered.push(questionId)
        }
      }

      return unanswered
    }

    return {
      level2: checkLevel("level2", 10),
      level3: checkLevel("level3", 10),
      level4: checkLevel("level4", 10),
      level5: checkLevel("level5", 10),
    }
  }, [formState])

  const totalUnansweredQuestions = useMemo(() => {
    return (
      unansweredQuestions.level2.length +
      unansweredQuestions.level3.length +
      unansweredQuestions.level4.length +
      unansweredQuestions.level5.length
    )
  }, [unansweredQuestions])

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

    // Verificar se há perguntas não respondidas
    if (totalUnansweredQuestions > 0) {
      const confirmSave = window.confirm(
        `Existem ${totalUnansweredQuestions} perguntas não respondidas. Deseja continuar mesmo assim?`,
      )
      if (!confirmSave) {
        return
      }
    }

    setIsSaving(true)
    try {
      console.log("Sending form data to API...")
      const response = await fetch("/api/save-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      })

      // Verificar se a resposta é bem-sucedida
      if (!response.ok) {
        let errorMessage = `API error: ${response.status} ${response.statusText}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
          console.error("API error response:", errorData)
        } catch (e) {
          const errorText = await response.text()
          console.error("API error response (text):", errorText)
        }
        throw new Error(errorMessage)
      }

      // Tentar analisar a resposta como JSON
      let result
      try {
        result = await response.json()
        console.log("API response:", result)
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
        description:
          error instanceof Error
            ? error.message
            : "Ocorreu um erro ao salvar suas respostas. Tente novamente mais tarde.",
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

  // Verificar se há perguntas não respondidas no nível atual
  const currentLevelUnansweredCount = useMemo(() => {
    if (activeTab === "level2") return unansweredQuestions.level2.length
    if (activeTab === "level3") return unansweredQuestions.level3.length
    if (activeTab === "level4") return unansweredQuestions.level4.length
    if (activeTab === "level5") return unansweredQuestions.level5.length
    return 0
  }, [activeTab, unansweredQuestions])

  const handleViewHistory = useCallback(() => {
    router.push("/historico")
  }, [router])

  // Verificar se o usuário está autenticado
  if (!user) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Acesso Restrito</CardTitle>
            <CardDescription>Você precisa estar logado para acessar esta página.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/auth/login")}>Fazer Login</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between mb-4">
        <Button variant="outline" onClick={handleViewHistory} className="flex items-center gap-2">
          <History className="h-4 w-4" />
          Ver histórico de avaliações
        </Button>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Logado como: {user?.email}</span>
          <Button variant="outline" size="sm" onClick={signOut}>
            Sair
          </Button>
        </div>
      </div>

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

          {currentLevelUnansweredCount > 0 && ["level2", "level3", "level4", "level5"].includes(activeTab) && (
            <Alert variant="warning" className="mb-4 bg-yellow-50 border-yellow-200">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertTitle className="text-yellow-800">Perguntas não respondidas</AlertTitle>
              <AlertDescription className="text-yellow-700">
                Existem {currentLevelUnansweredCount} pergunta(s) não respondida(s) neste nível. As perguntas não
                respondidas estão destacadas abaixo.
              </AlertDescription>
            </Alert>
          )}

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
                unansweredQuestions={unansweredQuestions.level2}
              />
            </TabsContent>

            <TabsContent value="level3">
              <Level3Form
                data={formState.level3}
                onChange={(questionId, value) => handleQuestionChange("level3", questionId, value)}
                unansweredQuestions={unansweredQuestions.level3}
              />
            </TabsContent>

            <TabsContent value="level4">
              <Level4Form
                data={formState.level4}
                onChange={(questionId, value) => handleQuestionChange("level4", questionId, value)}
                unansweredQuestions={unansweredQuestions.level4}
              />
            </TabsContent>

            <TabsContent value="level5">
              <Level5Form
                data={formState.level5}
                onChange={(questionId, value) => handleQuestionChange("level5", questionId, value)}
                unansweredQuestions={unansweredQuestions.level5}
              />
            </TabsContent>

            <TabsContent value="results">
              <ResultsView formData={formState} unansweredQuestions={unansweredQuestions} />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handlePrevious} disabled={activeTab === "email"}>
            Anterior
          </Button>

          {activeTab === "results" ? (
            <Button variant="outline" onClick={handleViewHistory} className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Ver histórico
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={!canProceed() || isSaving}>
              {isSaving ? "Salvando..." : activeTab === "level5" ? "Finalizar e Ver Resultados" : "Próximo"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
