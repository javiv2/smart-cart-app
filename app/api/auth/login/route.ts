import { type NextRequest, NextResponse } from "next/server"
import { loginSchema } from "@/lib/validation"
import { findUserByEmail, comparePassword, generateTokens, updateUserLastLogin } from "@/lib/auth"
import { withRateLimit, withCors } from "@/lib/middleware"
import { supabase } from "@/lib/supabase"

async function loginHandler(req: NextRequest) {
  try {
    const body = await req.json()
    const validatedData = loginSchema.parse(body)

    // Buscar usuario por email
    const user = await findUserByEmail(validatedData.email)
    if (!user) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    // Verificar contraseña
    const isValidPassword = await comparePassword(validatedData.password, user.password_hash)
    if (!isValidPassword) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    // Generar tokens
    const { accessToken, refreshToken } = generateTokens(user.id)

    // Guardar refresh token en la base de datos
    await supabase.from("refresh_tokens").insert({
      user_id: user.id,
      token: refreshToken,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días
      device_info: validatedData.deviceInfo,
    })

    // Actualizar último login
    await updateUserLastLogin(user.id)

    // Guardar sesión del dispositivo
    if (validatedData.deviceInfo) {
      await supabase.from("user_sessions").upsert(
        {
          user_id: user.id,
          device_id: validatedData.deviceInfo.deviceId,
          device_info: validatedData.deviceInfo,
          ip_address: req.ip,
          user_agent: req.headers.get("user-agent"),
          last_activity: new Date().toISOString(),
        },
        {
          onConflict: "user_id,device_id",
        },
      )
    }

    const userResponse = {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      avatar: user.avatar,
      preferences: user.preferences,
      createdAt: user.created_at,
      lastLoginAt: new Date().toISOString(),
    }

    return NextResponse.json({
      user: userResponse,
      token: accessToken,
      refreshToken,
      expiresIn: 7 * 24 * 60 * 60, // 7 días en segundos
    })
  } catch (error: any) {
    console.error("Error en login:", error)

    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Datos inválidos", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export const POST = withCors(withRateLimit(loginHandler, true))
