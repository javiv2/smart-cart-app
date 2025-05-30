"use client"

import { useState, useEffect } from "react"

interface GeolocationState {
  loading: boolean
  error: string | null
  location: {
    latitude: number
    longitude: number
  } | null
  timestamp: number | null
}

interface GeolocationOptions {
  enableHighAccuracy?: boolean
  timeout?: number
  maximumAge?: number
  onSuccess?: (position: GeolocationPosition) => void
  onError?: (error: GeolocationPositionError) => void
}

export function useGeolocation(options: GeolocationOptions = {}) {
  const [state, setState] = useState<GeolocationState>({
    loading: true,
    error: null,
    location: null,
    timestamp: null,
  })

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        loading: false,
        error: "La geolocalización no está soportada por tu navegador",
        location: null,
        timestamp: null,
      })
      return
    }

    const geoOptions = {
      enableHighAccuracy: options.enableHighAccuracy || false,
      timeout: options.timeout || 10000,
      maximumAge: options.maximumAge || 0,
    }

    const onSuccess = (position: GeolocationPosition) => {
      setState({
        loading: false,
        error: null,
        location: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        timestamp: position.timestamp,
      })

      if (options.onSuccess) {
        options.onSuccess(position)
      }
    }

    const onError = (error: GeolocationPositionError) => {
      setState({
        loading: false,
        error: getGeolocationErrorMessage(error),
        location: null,
        timestamp: null,
      })

      if (options.onError) {
        options.onError(error)
      }
    }

    setState((prev) => ({ ...prev, loading: true }))

    const watchId = navigator.geolocation.watchPosition(onSuccess, onError, geoOptions)

    return () => {
      navigator.geolocation.clearWatch(watchId)
    }
  }, [options])

  return state
}

// Función para obtener mensajes de error más amigables
function getGeolocationErrorMessage(error: GeolocationPositionError): string {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return "No has dado permiso para acceder a tu ubicación"
    case error.POSITION_UNAVAILABLE:
      return "La información de ubicación no está disponible"
    case error.TIMEOUT:
      return "Se agotó el tiempo para obtener tu ubicación"
    default:
      return "Error desconocido al obtener tu ubicación"
  }
}
