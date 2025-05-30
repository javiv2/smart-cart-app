import { type NextRequest, NextResponse } from "next/server"
import { withAuth, withCors } from "@/lib/middleware"
import { supabase } from "@/lib/supabase"

async function logoutHandler(req: NextRequest) {
  try {
    const userId = (req as any).userId

    // Obtener refresh token del header o body
    const authHeader = req.headers.get("authorization")
    const refreshToken = req.headers.get("x-refresh-token")

    if (refreshToken) {
      // Eliminar refresh token específico
      await supabase.from("refresh_tokens").delete().eq("token", refreshToken)
    } else {
      // Eliminar todos los refresh tokens del usuario
      await supabase.from("refresh_tokens").delete().eq("user_id", userId)
    }

    return NextResponse.json({
      message: "Sesión cerrada exitosamente",
    })
  } catch (error: any) {
    console.error("Error en logout:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export const POST = withCors(withAuth(logoutHandler))
