import { type NextRequest, NextResponse } from "next/server"
import { findUserById } from "@/lib/auth"
import { withAuth, withCors } from "@/lib/middleware"

async function meHandler(req: NextRequest) {
  try {
    const userId = (req as any).userId

    const user = await findUserById(userId)
    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error: any) {
    console.error("Error obteniendo usuario:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export const GET = withCors(withAuth(meHandler))
