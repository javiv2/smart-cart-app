import { PermissionsAndroid, Platform } from "react-native"
import Geolocation from "react-native-geolocation-service"

export interface Location {
  latitude: number
  longitude: number
}

export const requestLocationPermission = async (): Promise<boolean> => {
  if (Platform.OS === "android") {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
      title: "Permiso de Ubicación",
      message: "Smart Budget necesita acceso a tu ubicación para encontrar supermercados cercanos.",
      buttonNeutral: "Preguntar Luego",
      buttonNegative: "Cancelar",
      buttonPositive: "Aceptar",
    })
    return granted === PermissionsAndroid.RESULTS.GRANTED
  }
  return true // iOS permissions are handled in Info.plist
}

export const getCurrentLocation = (): Promise<Location> => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      (error) => {
        console.error("Error obteniendo ubicación:", error)
        reject(error)
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    )
  })
}

export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371 // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export const watchLocation = (
  onLocationChange: (location: Location) => void,
  onError?: (error: any) => void,
): number => {
  return Geolocation.watchPosition(
    (position) => {
      onLocationChange({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      })
    },
    (error) => {
      console.error("Error watching location:", error)
      if (onError) onError(error)
    },
    {
      enableHighAccuracy: true,
      distanceFilter: 100, // Actualizar cada 100 metros
      interval: 30000, // Verificar cada 30 segundos
    },
  )
}

export const stopWatchingLocation = (watchId: number): void => {
  Geolocation.clearWatch(watchId)
}
