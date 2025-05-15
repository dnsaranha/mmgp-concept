// Tipos para o estado do formulário
export type FormState = {
  respondent: {
    email: string
  }
  classification: {
    participatedInProjects?: string
    isPharmaceuticalIndustry?: string
    productType?: string
    companySize?: string
    estado?: string
  }
  level2: Record<string, QuestionResponse>
  level3: Record<string, QuestionResponse>
  level4: Record<string, QuestionResponse>
  level5: Record<string, QuestionResponse>
  results?: {
    maturityIndex: number
    level2Score: number
    level3Score: number
    level4Score: number
    level5Score: number
  }
  submitted: boolean
}

export type QuestionResponse = {
  meetsRequirement?: string
  details?: Record<string, string>
}

// Tipos para as ações do reducer
export type FormAction =
  | { type: "UPDATE_EMAIL"; email: string }
  | { type: "UPDATE_CLASSIFICATION"; field: string; value: string }
  | { type: "UPDATE_QUESTION"; level: string; questionId: string; value: QuestionResponse }
  | { type: "SET_RESULTS"; results: FormState["results"] }
  | { type: "SET_SUBMITTED"; value: boolean }

// Função reducer
export function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "UPDATE_EMAIL":
      return {
        ...state,
        respondent: {
          ...state.respondent,
          email: action.email,
        },
      }
    case "UPDATE_CLASSIFICATION":
      return {
        ...state,
        classification: {
          ...state.classification,
          [action.field]: action.value,
        },
      }
    case "UPDATE_QUESTION":
      return {
        ...state,
        [action.level]: {
          ...state[action.level as keyof FormState],
          [action.questionId]: action.value,
        },
      }
    case "SET_RESULTS":
      return {
        ...state,
        results: action.results,
      }
    case "SET_SUBMITTED":
      return {
        ...state,
        submitted: action.value,
      }
    default:
      return state
  }
}

// Estado inicial
export const initialFormState: FormState = {
  respondent: {
    email: "",
  },
  classification: {},
  level2: {},
  level3: {},
  level4: {},
  level5: {},
  submitted: false,
}
