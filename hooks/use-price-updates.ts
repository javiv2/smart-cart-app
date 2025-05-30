"use client"

import { useState, useEffect, useCallback } from "react"
import { fetchAllPrices, detectPriceChanges } from "@/lib/supermarket-api"

interface PriceUpdateHook {
  prices: any
  loading: boolean
  error: string | null
  lastUpdated: Date | null
  refreshPrices: () => Promise<void>
  priceChanges: any[]
  isStale: boolean
}

export const usePriceUpdates = (enableAutoRefresh = false): PriceUpdateHook => {
  const [prices, setPrices] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [priceChanges, setPriceChanges] = useState([])
  const [isStale, setIsStale] = useState(false)

  const refreshPrices = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const responses = await fetchAllPrices()
      const newPrices = {}
      const errors = []

      // Procesar respuestas de cada supermercado
      Object.entries(responses).forEach(([supermarketId, response]: [string, any]) => {
        if (response.success && response.data) {
          response.data.forEach((item: any) => {
            if (!newPrices[item.productId]) {
              newPrices[item.productId] = {}
            }
            newPrices[item.productId][supermarketId] = item.price
          })
        } else {
          errors.push(`${supermarketId}: ${response.error}`)
        }
      })

      // Detectar cambios de precios
      if (Object.keys(prices).length > 0) {
        const changes = detectPriceChanges(prices, newPrices)
        if (changes.length > 0) {
          setPriceChanges(changes)
          // Limpiar notificaciones después de 10 segundos
          setTimeout(() => setPriceChanges([]), 10000)
        }
      }

      setPrices(newPrices)
      setLastUpdated(new Date())
      setIsStale(false)

      if (errors.length > 0) {
        setError(`Errores en: ${errors.join(", ")}`)
      }
    } catch (err) {
      setError("Error al actualizar precios")
      console.error("Error fetching prices:", err)
    } finally {
      setLoading(false)
    }
  }, [prices])

  // Carga inicial de datos
  useEffect(() => {
    refreshPrices()
  }, [])

  // Marcar datos como desactualizados después de 10 minutos
  useEffect(() => {
    if (lastUpdated && !enableAutoRefresh) {
      const timer = setTimeout(
        () => {
          setIsStale(true)
        },
        10 * 60 * 1000,
      ) // 10 minutos

      return () => clearTimeout(timer)
    }
  }, [lastUpdated, enableAutoRefresh])

  return {
    prices,
    loading,
    error,
    lastUpdated,
    refreshPrices,
    priceChanges,
    isStale,
  }
}
