import { type NextRequest, NextResponse } from "next/server"
import { forgotPasswordSchema } from "@/lib/validation"
import { findUserByEmail } from "@/lib/auth"
import { withRateLimit, withCors } from "@/lib/middleware"
import { sendPasswordResetEmail } from "@/lib/email"
import { supabase } from "@/lib/supabase"
import crypto from "crypto"

async function forgotPasswordHandler(req: NextRequest) {
  try {
    const body = await req.json()
    const validatedData = forgotPasswordSchema.parse(body)

    // Buscar usuario
    const user = await findUserByEmail(validatedData.email)
    if (!user) {
      // Por seguridad, siempre devolver éxito aunque el usuario no exista
      return NextResponse.json({
        message: "Si el email existe, recibirás un enlace de recuperación",
      })
    }

    // Generar token de recuperación
    const resetToken = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hora

    // Guardar token en la base de datos
    await supabase.from("password_reset_tokens").insert({
      user_id: user.id,
      token: resetToken,
      expires_at: expiresAt.toISOString(),
    })

    // Enviar email
    await sendPasswordResetEmail(user.email, resetToken)

    return NextResponse.json({
      message: "Si el email existe, recibirás un enlace de recuperación",
    })
  } catch (error: any) {
    console.error("Error en forgot password:", error)

    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 })
    }

    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export const POST = withCors(withRateLimit(forgotPasswordHandler, true))
