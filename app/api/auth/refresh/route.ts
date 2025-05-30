import { type NextRequest, NextResponse } from "next/server"
import { generateTokens } from "@/lib/auth"
import { withRateLimit, withCors } from "@/lib/middleware"
import { supabase } from "@/lib/supabase"

async function refreshHandler(req: NextRequest) {
  try {
    const body = await req.json()
    const { refreshToken } = body

    if (!refreshToken) {
      return NextResponse.json({ error: "Refresh token requerido" }, { status: 400 })
    }

    // Verificar refresh token en la base de datos
    const { data: tokenData, error: tokenError } = await supabase
      .from("refresh_tokens")
      .select("*")
      .eq("token", refreshToken)
      .gt("expires_at", new Date().toISOString())
      .single()

    if (tokenError || !tokenData) {
      return NextResponse.json({ error: "Refresh token inválido o expirado" }, { status: 401 })
    }

    // Generar nuevo access token
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(tokenData.user_id)

    // Actualizar refresh token en la base de datos
    await supabase
      .from("refresh_tokens")
      .update({
        token: newRefreshToken,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .eq("id", tokenData.id)

    return NextResponse.json({
      token: accessToken,
      refreshToken: newRefreshToken,
      expiresIn: 7 * 24 * 60 * 60,
    })
  } catch (error: any) {
    console.error("Error en refresh:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export const POST = withCors(withRateLimit(refreshHandler))
