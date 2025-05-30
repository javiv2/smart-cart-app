import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { supabase } from "./supabase"

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key"
const JWT_EXPIRES_IN = "7d"
const REFRESH_TOKEN_EXPIRES_IN = "30d"

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  avatar?: string
  preferences: UserPreferences
  createdAt: Date
  lastLoginAt: Date
}

export interface UserPreferences {
  currency: string
  notifications: {
    budgetAlerts: boolean
    priceAlerts: boolean
    shoppingReminders: boolean
    promotions: boolean
  }
  privacy: {
    shareLocation: boolean
    shareUsageData: boolean
  }
  theme: "light" | "dark" | "system"
  language: string
}

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12)
}

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash)
}

export const generateTokens = (userId: string) => {
  const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
  const refreshToken = jwt.sign({ userId, type: "refresh" }, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  })

  return { accessToken, refreshToken }
}

export const verifyToken = (token: string): { userId: string } => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return { userId: decoded.userId }
  } catch (error) {
    throw new Error("Token inválido")
  }
}

export const createUser = async (userData: {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}): Promise<User> => {
  const hashedPassword = await hashPassword(userData.password)

  const defaultPreferences: UserPreferences = {
    currency: "CLP",
    notifications: {
      budgetAlerts: true,
      priceAlerts: true,
      shoppingReminders: true,
      promotions: false,
    },
    privacy: {
      shareLocation: true,
      shareUsageData: false,
    },
    theme: "system",
    language: "es",
  }

  const { data, error } = await supabase
    .from("users")
    .insert({
      email: userData.email.toLowerCase(),
      password_hash: hashedPassword,
      first_name: userData.firstName,
      last_name: userData.lastName,
      phone: userData.phone,
      preferences: defaultPreferences,
      created_at: new Date().toISOString(),
      last_login_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    if (error.code === "23505") {
      // Unique violation
      throw new Error("El email ya está registrado")
    }
    throw new Error("Error al crear usuario: " + error.message)
  }

  return {
    id: data.id,
    email: data.email,
    firstName: data.first_name,
    lastName: data.last_name,
    phone: data.phone,
    avatar: data.avatar,
    preferences: data.preferences,
    createdAt: new Date(data.created_at),
    lastLoginAt: new Date(data.last_login_at),
  }
}

export const findUserByEmail = async (email: string) => {
  const { data, error } = await supabase.from("users").select("*").eq("email", email.toLowerCase()).single()

  if (error) {
    if (error.code === "PGRST116") {
      // No rows returned
      return null
    }
    throw new Error("Error al buscar usuario: " + error.message)
  }

  return data
}

export const findUserById = async (id: string): Promise<User | null> => {
  const { data, error } = await supabase.from("users").select("*").eq("id", id).single()

  if (error) {
    if (error.code === "PGRST116") {
      return null
    }
    throw new Error("Error al buscar usuario: " + error.message)
  }

  return {
    id: data.id,
    email: data.email,
    firstName: data.first_name,
    lastName: data.last_name,
    phone: data.phone,
    avatar: data.avatar,
    preferences: data.preferences,
    createdAt: new Date(data.created_at),
    lastLoginAt: new Date(data.last_login_at),
  }
}

export const updateUserLastLogin = async (userId: string) => {
  const { error } = await supabase.from("users").update({ last_login_at: new Date().toISOString() }).eq("id", userId)

  if (error) {
    console.error("Error actualizando último login:", error)
  }
}

export const updateUserProfile = async (userId: string, updates: Partial<User>): Promise<User> => {
  const updateData: any = {}

  if (updates.firstName) updateData.first_name = updates.firstName
  if (updates.lastName) updateData.last_name = updates.lastName
  if (updates.phone !== undefined) updateData.phone = updates.phone
  if (updates.avatar !== undefined) updateData.avatar = updates.avatar
  if (updates.preferences) updateData.preferences = updates.preferences

  const { data, error } = await supabase.from("users").update(updateData).eq("id", userId).select().single()

  if (error) {
    throw new Error("Error al actualizar perfil: " + error.message)
  }

  return {
    id: data.id,
    email: data.email,
    firstName: data.first_name,
    lastName: data.last_name,
    phone: data.phone,
    avatar: data.avatar,
    preferences: data.preferences,
    createdAt: new Date(data.created_at),
    lastLoginAt: new Date(data.last_login_at),
  }
}

export const deleteUser = async (userId: string) => {
  const { error } = await supabase.from("users").delete().eq("id", userId)

  if (error) {
    throw new Error("Error al eliminar usuario: " + error.message)
  }
}
