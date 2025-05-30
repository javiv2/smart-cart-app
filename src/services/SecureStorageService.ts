import { Platform } from "react-native"
import Keychain from "react-native-keychain"
import AsyncStorage from "@react-native-async-storage/async-storage"

interface AuthData {
  token: string
  refreshToken: string
  rememberMe: boolean
}

interface BiometricData {
  token: string
  enabled: boolean
}

class SecureStorageServiceClass {
  private readonly AUTH_KEY = "smart_budget_auth"
  private readonly BIOMETRIC_KEY = "smart_budget_biometric"
  private readonly SETTINGS_KEY = "smart_budget_settings"

  // Métodos para datos de autenticación
  async saveAuthData(token: string, refreshToken: string, rememberMe = false): Promise<void> {
    try {
      const authData: AuthData = {
        token,
        refreshToken,
        rememberMe,
      }

      if (Platform.OS === "ios" || Platform.OS === "android") {
        // Usar Keychain para almacenamiento seguro
        await Keychain.setInternetCredentials(this.AUTH_KEY, "user", JSON.stringify(authData))
      } else {
        // Fallback para otras plataformas
        await AsyncStorage.setItem(this.AUTH_KEY, JSON.stringify(authData))
      }
    } catch (error) {
      console.error("Error guardando datos de autenticación:", error)
      throw error
    }
  }

  async getToken(): Promise<string | null> {
    try {
      const authData = await this.getAuthData()
      return authData?.token || null
    } catch (error) {
      console.error("Error obteniendo token:", error)
      return null
    }
  }

  async getRefreshToken(): Promise<string | null> {
    try {
      const authData = await this.getAuthData()
      return authData?.refreshToken || null
    } catch (error) {
      console.error("Error obteniendo refresh token:", error)
      return null
    }
  }

  async updateToken(newToken: string): Promise<void> {
    try {
      const authData = await this.getAuthData()
      if (authData) {
        await this.saveAuthData(newToken, authData.refreshToken, authData.rememberMe)
      }
    } catch (error) {
      console.error("Error actualizando token:", error)
      throw error
    }
  }

  async getAuthData(): Promise<AuthData | null> {
    try {
      if (Platform.OS === "ios" || Platform.OS === "android") {
        const credentials = await Keychain.getInternetCredentials(this.AUTH_KEY)
        if (credentials && credentials.password) {
          return JSON.parse(credentials.password)
        }
      } else {
        const data = await AsyncStorage.getItem(this.AUTH_KEY)
        if (data) {
          return JSON.parse(data)
        }
      }
      return null
    } catch (error) {
      console.error("Error obteniendo datos de autenticación:", error)
      return null
    }
  }

  async clearAuthData(): Promise<void> {
    try {
      if (Platform.OS === "ios" || Platform.OS === "android") {
        await Keychain.resetInternetCredentials(this.AUTH_KEY)
      } else {
        await AsyncStorage.removeItem(this.AUTH_KEY)
      }
    } catch (error) {
      console.error("Error limpiando datos de autenticación:", error)
    }
  }

  // Métodos para datos biométricos
  async saveBiometricData(token: string): Promise<void> {
    try {
      const biometricData: BiometricData = {
        token,
        enabled: true,
      }

      if (Platform.OS === "ios" || Platform.OS === "android") {
        await Keychain.setInternetCredentials(this.BIOMETRIC_KEY, "biometric_user", JSON.stringify(biometricData), {
          accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
          authenticationType: Keychain.AUTHENTICATION_TYPE.BIOMETRICS,
        })
      }
    } catch (error) {
      console.error("Error guardando datos biométricos:", error)
      throw error
    }
  }

  async getBiometricData(): Promise<BiometricData | null> {
    try {
      if (Platform.OS === "ios" || Platform.OS === "android") {
        const credentials = await Keychain.getInternetCredentials(this.BIOMETRIC_KEY)
        if (credentials && credentials.password) {
          return JSON.parse(credentials.password)
        }
      }
      return null
    } catch (error) {
      console.error("Error obteniendo datos biométricos:", error)
      return null
    }
  }

  async clearBiometricData(): Promise<void> {
    try {
      if (Platform.OS === "ios" || Platform.OS === "android") {
        await Keychain.resetInternetCredentials(this.BIOMETRIC_KEY)
      }
    } catch (error) {
      console.error("Error limpiando datos biométricos:", error)
    }
  }

  async setBiometricEnabled(enabled: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(`${this.SETTINGS_KEY}_biometric_enabled`, enabled.toString())
    } catch (error) {
      console.error("Error configurando biometría:", error)
    }
  }

  async getBiometricEnabled(): Promise<boolean> {
    try {
      const enabled = await AsyncStorage.getItem(`${this.SETTINGS_KEY}_biometric_enabled`)
      return enabled === "true"
    } catch (error) {
      console.error("Error obteniendo configuración biométrica:", error)
      return false
    }
  }

  // Métodos para configuraciones de usuario
  async setFirstTimeUser(isFirstTime: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(`${this.SETTINGS_KEY}_first_time`, isFirstTime.toString())
    } catch (error) {
      console.error("Error configurando primer uso:", error)
    }
  }

  async getFirstTimeUser(): Promise<boolean> {
    try {
      const isFirstTime = await AsyncStorage.getItem(`${this.SETTINGS_KEY}_first_time`)
      return isFirstTime !== "false" // Por defecto es true si no existe
    } catch (error) {
      console.error("Error obteniendo configuración de primer uso:", error)
      return true
    }
  }

  async saveUserPreferences(preferences: any): Promise<void> {
    try {
      await AsyncStorage.setItem(`${this.SETTINGS_KEY}_preferences`, JSON.stringify(preferences))
    } catch (error) {
      console.error("Error guardando preferencias:", error)
      throw error
    }
  }

  async getUserPreferences(): Promise<any> {
    try {
      const preferences = await AsyncStorage.getItem(`${this.SETTINGS_KEY}_preferences`)
      return preferences ? JSON.parse(preferences) : null
    } catch (error) {
      console.error("Error obteniendo preferencias:", error)
      return null
    }
  }

  // Método para limpiar todos los datos
  async clearAllData(): Promise<void> {
    try {
      await Promise.all([
        this.clearAuthData(),
        this.clearBiometricData(),
        AsyncStorage.removeItem(`${this.SETTINGS_KEY}_biometric_enabled`),
        AsyncStorage.removeItem(`${this.SETTINGS_KEY}_first_time`),
        AsyncStorage.removeItem(`${this.SETTINGS_KEY}_preferences`),
      ])
    } catch (error) {
      console.error("Error limpiando todos los datos:", error)
    }
  }

  // Método para verificar si hay datos almacenados
  async hasStoredCredentials(): Promise<boolean> {
    try {
      const authData = await this.getAuthData()
      return authData !== null && authData.token !== undefined
    } catch (error) {
      return false
    }
  }

  // Método para verificar si el usuario eligió "recordarme"
  async shouldRememberUser(): Promise<boolean> {
    try {
      const authData = await this.getAuthData()
      return authData?.rememberMe || false
    } catch (error) {
      return false
    }
  }
}

export const SecureStorageService = new SecureStorageServiceClass()
