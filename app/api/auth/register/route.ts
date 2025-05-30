import { type NextRequest, NextResponse } from "next/server"
import { registerSchema } from "@/lib/validation"
import { createUser, generateTokens } from "@/lib/auth"
import { withRateLimit, withCors } from "@/lib/middleware"
import { sendWelcomeEmail } from "@/lib/email"
import { supabase } from "@/lib/supabase"

async function registerHandler(req: NextRequest) {
  try {
    const body = await req.json()
    const validatedData = registerSchema.parse(body)

    // Crear usuario
    const user = await createUser({
      email: validatedData.email,
      password: validatedData.password,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      phone: validatedData.phone,
    })

    // Generar tokens
    const { accessToken, refreshToken } = generateTokens(user.id)

    // Guardar refresh token
    await supabase.from("refresh_tokens").insert({
      user_id: user.id,
      token: refreshToken,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      device_info: validatedData.deviceInfo,
    })

    // Guardar sesión del dispositivo
    if (validatedData.deviceInfo) {
      await supabase.from("user_sessions").insert({
        user_id: user.id,
        device_id: validatedData.deviceInfo.deviceId,
        device_info: validatedData.deviceInfo,
        ip_address: req.ip,
        user_agent: req.headers.get("user-agent"),
        last_activity: new Date().toISOString(),
      })
    }

    // Enviar email de bienvenida (no bloquear si falla)
    try {
      await sendWelcomeEmail(user.email, user.firstName)
    } catch (emailError) {
      console.error("Error enviando email de bienvenida:", emailError)
    }

    return NextResponse.json(
      {
        user,
        token: accessToken,
        refreshToken,
        expiresIn: 7 * 24 * 60 * 60,
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Error en registro:", error)

    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Datos inválidos", details: error.errors }, { status: 400 })
    }

    if (error.message.includes("ya está registrado")) {
      return NextResponse.json({ error: error.message }, { status: 409 })
    }

    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export const POST = withCors(withRateLimit(registerHandler, true))
