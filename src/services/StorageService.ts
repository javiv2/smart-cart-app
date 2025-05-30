import AsyncStorage from "@react-native-async-storage/async-storage"

export interface StorageKeys {
  USER_PREFERENCES: string
  SHOPPING_LISTS: string
  PRICE_ALERTS: string
  OFFLINE_CACHE: string
}

const STORAGE_KEYS: StorageKeys = {
  USER_PREFERENCES: "@smart_budget_user_preferences",
  SHOPPING_LISTS: "@smart_budget_shopping_lists",
  PRICE_ALERTS: "@smart_budget_price_alerts",
  OFFLINE_CACHE: "@smart_budget_offline_cache",
}

class StorageServiceClass {
  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem(key, jsonValue)
    } catch (error) {
      console.error(`Error guardando ${key}:`, error)
      throw error
    }
  }

  async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key)
      return jsonValue != null ? JSON.parse(jsonValue) : null
    } catch (error) {
      console.error(`Error obteniendo ${key}:`, error)
      return null
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key)
    } catch (error) {
      console.error(`Error eliminando ${key}:`, error)
      throw error
    }
  }

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear()
    } catch (error) {
      console.error("Error limpiando storage:", error)
      throw error
    }
  }

  async getAllKeys(): Promise<string[]> {
    try {
      return await AsyncStorage.getAllKeys()
    } catch (error) {
      console.error("Error obteniendo todas las claves:", error)
      return []
    }
  }

  async multiSet(keyValuePairs: [string, string][]): Promise<void> {
    try {
      await AsyncStorage.multiSet(keyValuePairs)
    } catch (error) {
      console.error("Error en multiSet:", error)
      throw error
    }
  }

  async multiGet(keys: string[]): Promise<[string, string | null][]> {
    try {
      return await AsyncStorage.multiGet(keys)
    } catch (error) {
      console.error("Error en multiGet:", error)
      return []
    }
  }

  // Métodos específicos para la app
  async saveUserPreferences(preferences: any): Promise<void> {
    await this.setItem(STORAGE_KEYS.USER_PREFERENCES, preferences)
  }

  async getUserPreferences(): Promise<any> {
    return await this.getItem(STORAGE_KEYS.USER_PREFERENCES)
  }

  async saveOfflineData(data: any): Promise<void> {
    const existingData = (await this.getItem(STORAGE_KEYS.OFFLINE_CACHE)) || {}
    const updatedData = { ...existingData, ...data, lastUpdated: Date.now() }
    await this.setItem(STORAGE_KEYS.OFFLINE_CACHE, updatedData)
  }

  async getOfflineData(): Promise<any> {
    return await this.getItem(STORAGE_KEYS.OFFLINE_CACHE)
  }

  async isDataStale(maxAge = 3600000): Promise<boolean> {
    // 1 hora por defecto
    const data = await this.getOfflineData()
    if (!data || !data.lastUpdated) return true

    return Date.now() - data.lastUpdated > maxAge
  }
}

export const StorageService = new StorageServiceClass()
export { STORAGE_KEYS }
