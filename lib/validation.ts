import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  platform: z.string().optional(),
  deviceInfo: z
    .object({
      platform: z.string(),
      version: z.union([z.string(), z.number()]),
      deviceId: z.string(),
      appVersion: z.string(),
      buildNumber: z.string(),
    })
    .optional(),
})

export const registerSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/(?=.*[a-z])/, "Debe contener al menos una letra minúscula")
    .regex(/(?=.*[A-Z])/, "Debe contener al menos una letra mayúscula")
    .regex(/(?=.*\d)/, "Debe contener al menos un número")
    .regex(/(?=.*[@$!%*?&])/, "Debe contener al menos un carácter especial"),
  firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  phone: z
    .string()
    .regex(/^(\+56|56)?[2-9]\d{8}$/, "Número de teléfono chileno inválido")
    .optional(),
  acceptTerms: z.boolean().refine((val) => val === true, "Debes aceptar los términos y condiciones"),
  acceptMarketing: z.boolean().optional(),
  platform: z.string().optional(),
  deviceInfo: z
    .object({
      platform: z.string(),
      version: z.union([z.string(), z.number()]),
      deviceId: z.string(),
      appVersion: z.string(),
      buildNumber: z.string(),
    })
    .optional(),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email("Email inválido"),
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token requerido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/(?=.*[a-z])/, "Debe contener al menos una letra minúscula")
    .regex(/(?=.*[A-Z])/, "Debe contener al menos una letra mayúscula")
    .regex(/(?=.*\d)/, "Debe contener al menos un número")
    .regex(/(?=.*[@$!%*?&])/, "Debe contener al menos un carácter especial"),
})

export const updateProfileSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  phone: z
    .string()
    .regex(/^(\+56|56)?[2-9]\d{8}$/)
    .optional(),
  avatar: z.string().url().optional(),
  preferences: z
    .object({
      currency: z.string(),
      notifications: z.object({
        budgetAlerts: z.boolean(),
        priceAlerts: z.boolean(),
        shoppingReminders: z.boolean(),
        promotions: z.boolean(),
      }),
      privacy: z.object({
        shareLocation: z.boolean(),
        shareUsageData: z.boolean(),
      }),
      theme: z.enum(["light", "dark", "system"]),
      language: z.string(),
    })
    .optional(),
})
