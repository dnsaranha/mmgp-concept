// lib/score-utils.ts

import type { FormState } from "./form-reducer"

// Função para calcular o score de um nível
export function calculateLevelScore(levelData: Record<string, any> = {}) {
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

// Função para calcular o índice de maturidade
export function calculateMaturityIndex(formData: FormState) {
  const level2Score = calculateLevelScore(formData.level2)
  const level3Score = calculateLevelScore(formData.level3)
  const level4Score = calculateLevelScore(formData.level4)
  const level5Score = calculateLevelScore(formData.level5)

  // Cálculo do índice de maturidade conforme fórmula do modelo Prado-MMGP
  // IM = (100 + Pontuação Nível 2 + Pontuação Nível 3 + Pontuação Nível 4 + Pontuação Nível 5) / 100
  return (100 + level2Score + level3Score + level4Score + level5Score) / 100
}
