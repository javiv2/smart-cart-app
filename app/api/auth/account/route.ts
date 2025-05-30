import { type NextRequest, NextResponse } from "next/server"
import { deleteUser } from "@/lib/auth"
import { withAuth, withCors } from "@/lib/middleware"
import { supabase } from "@/lib/supabase"

async function deleteAccountHandler(req: NextRequest) {
  try {
    const userId = (req as any).userId

    // Eliminar todos los datos relacionados
    await Promise.all([
      supabase.from("refresh_tokens").delete().eq("user_id", userId),
      supabase.from("password_reset_tokens").delete().eq("user_id", userId),
      supabase.from("user_sessions").delete().eq("user_id", userId),
    ])

    // Eliminar usuario
    await deleteUser(userId)

    return NextResponse.json({
      message: "Cuenta eliminada exitosamente",
    })
  } catch (error: any) {
    console.error("Error eliminando cuenta:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export const DELETE = withCors(withAuth(deleteAccountHandler))
