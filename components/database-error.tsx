import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function DatabaseError() {
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Erro de configuração</AlertTitle>
      <AlertDescription>
        O banco de dados não está configurado corretamente. Por favor, verifique as variáveis de ambiente
        NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.
      </AlertDescription>
    </Alert>
  )
}
