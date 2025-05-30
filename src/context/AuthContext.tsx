"use client"

import type React from "react"
import { createContext, useReducer, useEffect, type ReactNode } from "react"
import { Alert } from "react-native"

import { AuthService } from "../services/AuthService"
import { SecureStorageService } from "../services/SecureStorageService"
import { sendLocalNotification } from "../services/NotificationService"

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

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  biometricEnabled: boolean
  firstTimeUser: boolean
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (token: string, newPassword: string) => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<void>
  enableBiometric: () => Promise<void>
  disableBiometric: () => Promise<void>
  loginWithBiometric: () => Promise<void>
  refreshToken: () => Promise<void>
  deleteAccount: () => Promise<void>
  clearError: () => void
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  acceptTerms: boolean
  acceptMarketing?: boolean
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  biometricEnabled: false,
  firstTimeUser: true,
}

type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGOUT" }
  | { type: "UPDATE_USER"; payload: Partial<User> }
  | { type: "SET_BIOMETRIC_ENABLED"; payload: boolean }
  | { type: "SET_FIRST_TIME_USER"; payload: boolean }

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }

    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false }

    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        firstTimeUser: false,
      }

    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      }

    case "UPDATE_USER":
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      }

    case "SET_BIOMETRIC_ENABLED":
      return { ...state, biometricEnabled: action.payload }

    case "SET_FIRST_TIME_USER":
      return { ...state, firstTimeUser: action.payload }

    default:
      return state
  }
}

export const AuthContext = createContext<AuthContextType>({
  ...initialState,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  forgotPassword: async () => {},
  resetPassword: async () => {},
  updateProfile: async () => {},
  enableBiometric: async () => {},
  disableBiometric: async () => {},
  loginWithBiometric: async () => {},
  refreshToken: async () => {},
  deleteAccount: async () => {},
  clearError: () => {},
})

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })

      const token = await SecureStorageService.getToken()
      const biometricEnabled = await SecureStorageService.getBiometricEnabled()
      const firstTimeUser = await SecureStorageService.getFirstTimeUser()

      dispatch({ type: "SET_BIOMETRIC_ENABLED", payload: biometricEnabled })
      dispatch({ type: "SET_FIRST_TIME_USER", payload: firstTimeUser })

      if (token) {
        try {
          const user = await AuthService.getCurrentUser()
          dispatch({ type: "LOGIN_SUCCESS", payload: user })
        } catch (error) {
          // Token inválido, limpiar storage
          await SecureStorageService.clearAuthData()
          dispatch({ type: "LOGOUT" })
        }
      } else {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    } catch (error) {
      console.error("Error verificando estado de autenticación:", error)
      dispatch({ type: "SET_ERROR", payload: "Error verificando autenticación" })
    }
  }

  const login = async (email: string, password: string, rememberMe = false) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      dispatch({ type: "SET_ERROR", payload: null })

      const response = await AuthService.login(email, password)

      await SecureStorageService.saveAuthData(response.token, response.refreshToken, rememberMe)

      dispatch({ type: "LOGIN_SUCCESS", payload: response.user })

      // Notificación de bienvenida
      sendLocalNotification({
        title: "¡Bienvenido de vuelta! 👋",
        message: `Hola ${response.user.firstName}, tu presupuesto te está esperando`,
        data: { type: "welcome_back" },
      })
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Error al iniciar sesión"
      dispatch({ type: "SET_ERROR", payload: errorMessage })
      throw error
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      dispatch({ type: "SET_ERROR", payload: null })

      const response = await AuthService.register(userData)

      await SecureStorageService.saveAuthData(response.token, response.refreshToken, true)
      await SecureStorageService.setFirstTimeUser(false)

      dispatch({ type: "LOGIN_SUCCESS", payload: response.user })

      // Notificación de bienvenida para nuevo usuario
      sendLocalNotification({
        title: "¡Bienvenido a Smart Budget! 🎉",
        message: "Tu cuenta ha sido creada exitosamente. ¡Comienza a ahorrar!",
        data: { type: "welcome_new_user" },
      })
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Error al crear cuenta"
      dispatch({ type: "SET_ERROR", payload: errorMessage })
      throw error
    }
  }

  const logout = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })

      await AuthService.logout()
      await SecureStorageService.clearAuthData()

      dispatch({ type: "LOGOUT" })
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
      // Limpiar datos locales aunque falle la llamada al servidor
      await SecureStorageService.clearAuthData()
      dispatch({ type: "LOGOUT" })
    }
  }

  const forgotPassword = async (email: string) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      dispatch({ type: "SET_ERROR", payload: null })

      await AuthService.forgotPassword(email)

      Alert.alert(
        "Email Enviado",
        "Te hemos enviado un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada.",
      )
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Error al enviar email de recuperación"
      dispatch({ type: "SET_ERROR", payload: errorMessage })
      throw error
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      dispatch({ type: "SET_ERROR", payload: null })

      await AuthService.resetPassword(token, newPassword)

      Alert.alert("Contraseña Actualizada", "Tu contraseña ha sido cambiada exitosamente.")
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Error al restablecer contraseña"
      dispatch({ type: "SET_ERROR", payload: errorMessage })
      throw error
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const updateProfile = async (updates: Partial<User>) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      dispatch({ type: "SET_ERROR", payload: null })

      const updatedUser = await AuthService.updateProfile(updates)
      dispatch({ type: "UPDATE_USER", payload: updatedUser })
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Error al actualizar perfil"
      dispatch({ type: "SET_ERROR", payload: errorMessage })
      throw error
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const enableBiometric = async () => {
    try {
      const success = await AuthService.enableBiometric()
      if (success) {
        await SecureStorageService.setBiometricEnabled(true)
        dispatch({ type: "SET_BIOMETRIC_ENABLED", payload: true })
      }
    } catch (error) {
      console.error("Error habilitando biometría:", error)
      throw error
    }
  }

  const disableBiometric = async () => {
    try {
      await SecureStorageService.setBiometricEnabled(false)
      await SecureStorageService.clearBiometricData()
      dispatch({ type: "SET_BIOMETRIC_ENABLED", payload: false })
    } catch (error) {
      console.error("Error deshabilitando biometría:", error)
      throw error
    }
  }

  const loginWithBiometric = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })

      const success = await AuthService.authenticateWithBiometric()
      if (success) {
        const user = await AuthService.getCurrentUser()
        dispatch({ type: "LOGIN_SUCCESS", payload: user })
      }
    } catch (error: any) {
      dispatch({ type: "SET_ERROR", payload: "Error en autenticación biométrica" })
      throw error
    }
  }

  const refreshToken = async () => {
    try {
      const newToken = await AuthService.refreshToken()
      await SecureStorageService.updateToken(newToken)
    } catch (error) {
      console.error("Error refrescando token:", error)
      await logout()
      throw error
    }
  }

  const deleteAccount = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })

      await AuthService.deleteAccount()
      await SecureStorageService.clearAllData()

      dispatch({ type: "LOGOUT" })

      Alert.alert("Cuenta Eliminada", "Tu cuenta ha sido eliminada permanentemente.")
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Error al eliminar cuenta"
      dispatch({ type: "SET_ERROR", payload: errorMessage })
      throw error
    }
  }

  const clearError = () => {
    dispatch({ type: "SET_ERROR", payload: null })
  }

  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
    enableBiometric,
    disableBiometric,
    loginWithBiometric,
    refreshToken,
    deleteAccount,
    clearError,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}
