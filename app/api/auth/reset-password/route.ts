import { type NextRequest, NextResponse } from "next/server"
import { resetPasswordSchema } from "@/lib/validation"
import { hashPassword } from "@/lib/auth"
import { withRateLimit, withCors } from "@/lib/middleware"
import { supabase } from "@/lib/supabase"

async function resetPasswordHandler(req: NextRequest) {
  try {
    const body = await req.json()
    const validatedData = resetPasswordSchema.parse(body)

    // Verificar token
    const { data: tokenData, error: tokenError } = await supabase
      .from("password_reset_tokens")
      .select("*")
      .eq("token", validatedData.token)
      .eq("used", false)
      .gt("expires_at", new Date().toISOString())
      .single()

    if (tokenError || !tokenData) {
      return NextResponse.json({ error: "Token inválido o expirado" }, { status: 400 })
    }

    // Hash de la nueva contraseña
    const hashedPassword = await hashPassword(validatedData.password)

    // Actualizar contraseña del usuario
    const { error: updateError } = await supabase
      .from("users")
      .update({ password_hash: hashedPassword })
      .eq("id", tokenData.user_id)

    if (updateError) {
      throw new Error("Error actualizando contraseña")
    }

    // Marcar token como usado
    await supabase.from("password_reset_tokens").update({ used: true }).eq("id", tokenData.id)

    // Invalidar todos los refresh tokens del usuario por seguridad
    await supabase.from("refresh_tokens").delete().eq("user_id", tokenData.user_id)

    return NextResponse.json({
      message: "Contraseña actualizada exitosamente",
    })
  } catch (error: any) {
    console.error("Error en reset password:", error)

    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Datos inválidos", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export const POST = withCors(withRateLimit(resetPasswordHandler, true))
