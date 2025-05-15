"use client"

import { memo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface RespondentEmailProps {
  email: string
  onChange: (email: string) => void
}

export const RespondentEmail = memo(function RespondentEmail({ email, onChange }: RespondentEmailProps) {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Identificação do Respondente</CardTitle>
          <CardDescription>
            Por favor, informe seu e-mail para identificação. Este e-mail será usado para associar suas respostas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => onChange(e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
})
