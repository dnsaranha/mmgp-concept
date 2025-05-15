import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

const inter = Inter({ subsets: ["latin"] })

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <title>Autoavaliação MMGP</title>
        <meta
          name="description"
          content="Formulário de autoavaliação de maturidade em gerenciamento de projetos baseado no modelo Prado-MMGP"
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}