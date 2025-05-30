import axios from "axios"
import { Platform } from "react-native"
import TouchID from "react-native-touch-id"

import type { User, RegisterData } from "../context/AuthContext"
import { SecureStorageService } from "./SecureStorageService"

export interface LoginResponse {
  user: User
  token: string
  refreshToken: string
  expiresIn: number
}

export interface RegisterResponse {
  user: User
  token: string
  refreshToken: string
  expiresIn: number
}

class AuthServiceClass {
  private baseURL = process.env.API_BASE_URL || "https://api.smartbudget.cl"
  private axiosInstance = axios.create({
    baseURL: this.baseURL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  })

  constructor() {
    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor para agregar token
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        const token = await SecureStorageService.getToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error),
    )

    // Response interceptor para manejar errores de autenticación
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          try {
            await this.refreshToken()
            // Reintentar la petición original
            return this.axiosInstance.request(error.config)
          } catch (refreshError) {
            // Token refresh falló, cerrar sesión
            await SecureStorageService.clearAuthData()
            throw refreshError
          }
        }
        return Promise.reject(error)
      },
    )
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await this.axiosInstance.post("/auth/login", {
        email: email.toLowerCase().trim(),
        password,
        platform: Platform.OS,
        deviceInfo: await this.getDeviceInfo(),
      })

      return {
        ...response.data,
        user: {
          ...response.data.user,
          createdAt: new Date(response.data.user.createdAt),
          lastLoginAt: new Date(),
        },
      }
    } catch (error) {
      console.error("Error en login:", error)
      throw this.handleError(error)
    }
  }

  async register(userData: RegisterData): Promise<RegisterResponse> {
    try {
      const response = await this.axiosInstance.post("/auth/register", {
        ...userData,
        email: userData.email.toLowerCase().trim(),
        platform: Platform.OS,
        deviceInfo: await this.getDeviceInfo(),
      })

      return {
        ...response.data,
        user: {
          ...response.data.user,
          createdAt: new Date(response.data.user.createdAt),
          lastLoginAt: new Date(),
        },
      }
    } catch (error) {
      console.error("Error en registro:", error)
      throw this.handleError(error)
    }
  }

  async logout(): Promise<void> {
    try {
      await this.axiosInstance.post("/auth/logout")
    } catch (error) {
      console.error("Error en logout:", error)
      // No lanzar error para permitir logout local
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      await this.axiosInstance.post("/auth/forgot-password", {
        email: email.toLowerCase().trim(),
      })
    } catch (error) {
      console.error("Error en forgot password:", error)
      throw this.handleError(error)
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await this.axiosInstance.post("/auth/reset-password", {
        token,
        password: newPassword,
      })
    } catch (error) {
      console.error("Error en reset password:", error)
      throw this.handleError(error)
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await this.axiosInstance.get("/auth/me")
      return {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
        lastLoginAt: new Date(response.data.lastLoginAt),
      }
    } catch (error) {
      console.error("Error obteniendo usuario actual:", error)
      throw this.handleError(error)
    }
  }

  async updateProfile(updates: Partial<User>): Promise<User> {
    try {
      const response = await this.axiosInstance.put("/auth/profile", updates)
      return {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
        lastLoginAt: new Date(response.data.lastLoginAt),
      }
    } catch (error) {
      console.error("Error actualizando perfil:", error)
      throw this.handleError(error)
    }
  }

  async refreshToken(): Promise<string> {
    try {
      const refreshToken = await SecureStorageService.getRefreshToken()
      if (!refreshToken) {
        throw new Error("No refresh token available")
      }

      const response = await axios.post(`${this.baseURL}/auth/refresh`, {
        refreshToken,
      })

      return response.data.token
    } catch (error) {
      console.error("Error refrescando token:", error)
      throw this.handleError(error)
    }
  }

  async deleteAccount(): Promise<void> {
    try {
      await this.axiosInstance.delete("/auth/account")
    } catch (error) {
      console.error("Error eliminando cuenta:", error)
      throw this.handleError(error)
    }
  }

  // Métodos de autenticación biométrica
  async isBiometricAvailable(): Promise<boolean> {
    try {
      if (Platform.OS === "ios") {
        const biometryType = await TouchID.isSupported()
        return biometryType !== false
      } else {
        // Android - verificar disponibilidad
        return await TouchID.isSupported()
      }
    } catch (error) {
      console.error("Error verificando biometría:", error)
      return false
    }
  }

  async getBiometricType(): Promise<string | null> {
    try {
      if (Platform.OS === "ios") {
        const biometryType = await TouchID.isSupported()
        return biometryType as string
      } else {
        const isSupported = await TouchID.isSupported()
        return isSupported ? "Fingerprint" : null
      }
    } catch (error) {
      return null
    }
  }

  async enableBiometric(): Promise<boolean> {
    try {
      const isAvailable = await this.isBiometricAvailable()
      if (!isAvailable) {
        throw new Error("Biometric authentication not available")
      }

      // Verificar biometría
      await TouchID.authenticate("Habilitar autenticación biométrica para Smart Budget", {
        title: "Autenticación Biométrica",
        subtitle: "Usa tu huella dactilar o Face ID para acceder rápidamente",
        description: "Coloca tu dedo en el sensor o mira a la cámara",
        fallbackLabel: "Usar contraseña",
        cancelLabel: "Cancelar",
      })

      // Guardar credenciales de forma segura para biometría
      const token = await SecureStorageService.getToken()
      if (token) {
        await SecureStorageService.saveBiometricData(token)
      }

      return true
    } catch (error) {
      console.error("Error habilitando biometría:", error)
      throw error
    }
  }

  async authenticateWithBiometric(): Promise<boolean> {
    try {
      await TouchID.authenticate("Acceder a Smart Budget", {
        title: "Autenticación Biométrica",
        subtitle: "Usa tu huella dactilar o Face ID",
        description: "Coloca tu dedo en el sensor o mira a la cámara",
        fallbackLabel: "Usar contraseña",
        cancelLabel: "Cancelar",
      })

      return true
    } catch (error) {
      console.error("Error en autenticación biométrica:", error)
      throw error
    }
  }

  // Métodos auxiliares
  private async getDeviceInfo() {
    const { DeviceInfo } = await import("react-native-device-info")

    return {
      platform: Platform.OS,
      version: Platform.Version,
      deviceId: await DeviceInfo.getUniqueId(),
      appVersion: DeviceInfo.getVersion(),
      buildNumber: DeviceInfo.getBuildNumber(),
    }
  }

  private handleError(error: any) {
    if (error.response) {
      // Error de respuesta del servidor
      return {
        message: error.response.data?.message || "Error del servidor",
        status: error.response.status,
        data: error.response.data,
      }
    } else if (error.request) {
      // Error de red
      return {
        message: "Error de conexión. Verifica tu internet.",
        status: 0,
      }
    } else {
      // Error de configuración
      return {
        message: error.message || "Error inesperado",
        status: -1,
      }
    }
  }

  // Validaciones del lado cliente
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  static validatePassword(password: string): {
    isValid: boolean
    errors: string[]
  } {
    const errors: string[] = []

    if (password.length < 8) {
      errors.push("La contraseña debe tener al menos 8 caracteres")
    }

    if (!/(?=.*[a-z])/.test(password)) {
      errors.push("Debe contener al menos una letra minúscula")
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push("Debe contener al menos una letra mayúscula")
    }

    if (!/(?=.*\d)/.test(password)) {
      errors.push("Debe contener al menos un número")
    }

    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.push("Debe contener al menos un carácter especial (@$!%*?&)")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  static validatePhone(phone: string): boolean {
    // Validación para números chilenos
    const phoneRegex = /^(\+56|56)?[2-9]\d{8}$/
    return phoneRegex.test(phone.replace(/\s/g, ""))
  }
}

export const AuthService = new AuthServiceClass()
