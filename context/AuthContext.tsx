"use client"

import type React from "react"

import { createContext, useReducer, useEffect, type ReactNode } from "react"
import { AuthService } from "@/lib/auth-client"

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
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<void>
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
}

type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGOUT" }
  | { type: "UPDATE_USER"; payload: Partial<User> }

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
  updateProfile: async () => {},
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

      const token = localStorage.getItem("smart_cart_token")
      if (token) {
        try {
          const user = await AuthService.getCurrentUser()
          dispatch({ type: "LOGIN_SUCCESS", payload: user })
        } catch (error) {
          localStorage.removeItem("smart_cart_token")
          localStorage.removeItem("smart_cart_refresh_token")
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

      localStorage.setItem("smart_cart_token", response.token)
      localStorage.setItem("smart_cart_refresh_token", response.refreshToken)

      dispatch({ type: "LOGIN_SUCCESS", payload: response.user })
    } catch (error: any) {
      const errorMessage = error.message || "Error al iniciar sesión"
      dispatch({ type: "SET_ERROR", payload: errorMessage })
      throw error
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      dispatch({ type: "SET_ERROR", payload: null })

      const response = await AuthService.register(userData)

      localStorage.setItem("smart_cart_token", response.token)
      localStorage.setItem("smart_cart_refresh_token", response.refreshToken)

      dispatch({ type: "LOGIN_SUCCESS", payload: response.user })
    } catch (error: any) {
      const errorMessage = error.message || "Error al crear cuenta"
      dispatch({ type: "SET_ERROR", payload: errorMessage })
      throw error
    }
  }

  const logout = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })

      await AuthService.logout()
      localStorage.removeItem("smart_cart_token")
      localStorage.removeItem("smart_cart_refresh_token")

      dispatch({ type: "LOGOUT" })
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
      localStorage.removeItem("smart_cart_token")
      localStorage.removeItem("smart_cart_refresh_token")
      dispatch({ type: "LOGOUT" })
    }
  }

  const forgotPassword = async (email: string) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      dispatch({ type: "SET_ERROR", payload: null })

      await AuthService.forgotPassword(email)
    } catch (error: any) {
      const errorMessage = error.message || "Error al enviar email de recuperación"
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
      const errorMessage = error.message || "Error al actualizar perfil"
      dispatch({ type: "SET_ERROR", payload: errorMessage })
      throw error
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
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
    updateProfile,
    clearError,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}
