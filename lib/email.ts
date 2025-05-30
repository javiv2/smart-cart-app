import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export const sendPasswordResetEmail = async (email: string, resetToken: string) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`

  const mailOptions = {
    from: `"Smart Cart" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Restablecer Contraseña - Smart Cart",
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #2563eb, #3b82f6); padding: 40px; text-align: center;">
          <h1 style="color: white; margin: 0;">Smart Cart</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Compra inteligente, ahorra más</p>
        </div>
        
        <div style="padding: 40px; background: white;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Restablecer Contraseña</h2>
          
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 30px;">
            Recibimos una solicitud para restablecer la contraseña de tu cuenta. 
            Haz clic en el botón de abajo para crear una nueva contraseña.
          </p>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="${resetUrl}" 
               style="background: #3b82f6; color: white; padding: 16px 32px; 
                      text-decoration: none; border-radius: 8px; font-weight: 600;
                      display: inline-block;">
              Restablecer Contraseña
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
            Si no solicitaste este cambio, puedes ignorar este email. 
            Tu contraseña no será cambiada.
          </p>
          
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
            Este enlace expirará en 1 hora por seguridad.
          </p>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px; margin: 0;">
            © 2024 Smart Cart. Todos los derechos reservados.
          </p>
        </div>
      </div>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log("Email de recuperación enviado a:", email)
  } catch (error) {
    console.error("Error enviando email:", error)
    throw new Error("Error al enviar email de recuperación")
  }
}

export const sendWelcomeEmail = async (email: string, firstName: string) => {
  const mailOptions = {
    from: `"Smart Cart" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "¡Bienvenido a Smart Cart! 🎉",
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #2563eb, #3b82f6); padding: 40px; text-align: center;">
          <h1 style="color: white; margin: 0;">¡Bienvenido a Smart Cart!</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Tu viaje hacia la compra inteligente comienza aquí</p>
        </div>
        
        <div style="padding: 40px; background: white;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">¡Hola ${firstName}! 👋</h2>
          
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 30px;">
            Gracias por unirte a Smart Cart. Estamos emocionados de ayudarte a 
            gestionar tus compras de manera más inteligente y ahorrar dinero.
          </p>
          
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">¿Qué puedes hacer con Smart Cart?</h3>
            <ul style="color: #4b5563; line-height: 1.8;">
              <li>🛒 Crear listas de compras inteligentes</li>
              <li>💰 Comparar precios entre supermercados</li>
              <li>📍 Encontrar las mejores ofertas cerca de ti</li>
              <li>⭐ Guardar tus productos favoritos</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="${process.env.FRONTEND_URL}" 
               style="background: #3b82f6; color: white; padding: 16px 32px; 
                      text-decoration: none; border-radius: 8px; font-weight: 600;
                      display: inline-block;">
              Comenzar a Usar Smart Cart
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
            Si tienes alguna pregunta, no dudes en contactarnos. 
            ¡Estamos aquí para ayudarte!
          </p>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px; margin: 0;">
            © 2024 Smart Cart. Todos los derechos reservados.
          </p>
        </div>
      </div>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log("Email de bienvenida enviado a:", email)
  } catch (error) {
    console.error("Error enviando email de bienvenida:", error)
    // No lanzar error para no bloquear el registro
  }
}
