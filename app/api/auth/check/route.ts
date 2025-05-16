import { NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ authenticated: false, error: "Supabase client not initialized" }, { status: 500 })
    }

    const { data, error } = await supabase.auth.getSession()

    if (error) {
      return NextResponse.json({ authenticated: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      authenticated: !!data.session,
      user: data.session?.user
        ? {
            id: data.session.user.id,
            email: data.session.user.email,
          }
        : null,
    })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ authenticated: false, error: "Internal server error" }, { status: 500 })
  }
}
