import { type NextRequest, NextResponse } from "next/server"
import { updateProfileSchema } from "@/lib/validation"
import { updateUserProfile } from "@/lib/auth"
import { withAuth, withCors } from "@/lib/middleware"

async function updateProfileHandler(req: NextRequest) {
  try {
    const userId = (req as any).userId
    const body = await req.json()
    const validatedData = updateProfileSchema.parse(body)

    const updatedUser = await updateUserProfile(userId, validatedData)

    return NextResponse.json(updatedUser)
  } catch (error: any) {
    console.error("Error actualizando perfil:", error)

    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Datos inválidos", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export const PUT = withCors(withAuth(updateProfileHandler))
