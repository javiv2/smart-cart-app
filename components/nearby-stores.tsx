"use client"

import { useState, useEffect } from "react"
import { MapPin, Navigation, Store, ChevronRight, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Slider } from "@/components/ui/slider"
import { useGeolocation } from "@/hooks/use-geolocation"
import { getNearbyStores, type SupermarketLocation } from "@/lib/supermarket-locations"
import { usePriceUpdates } from "@/hooks/use-price-updates"

interface NearbyStoresProps {
  onSelectStore?: (store: SupermarketLocation) => void
  onBack?: () => void
  productId?: number
}

export default function NearbyStores({ onSelectStore, onBack, productId }: NearbyStoresProps) {
  const [maxDistance, setMaxDistance] = useState(5) // km
  const [nearbyStores, setNearbyStores] = useState<(SupermarketLocation & { distance: number })[]>([])
  const [selectedStore, setSelectedStore] = useState<SupermarketLocation | null>(null)
  const [mapUrl, setMapUrl] = useState("")

  // Obtener ubicación del usuario
  const { loading, error, location } = useGeolocation({
    enableHighAccuracy: true,
  })

  // Obtener precios actualizados
  const { prices } = usePriceUpdates(false)

  // Actualizar tiendas cercanas cuando cambia la ubicación o la distancia máxima
  useEffect(() => {
    if (location) {
      const stores = getNearbyStores(location.latitude, location.longitude, maxDistance)
      setNearbyStores(stores)
    }
  }, [location, maxDistance])

  // Generar URL para abrir en Google Maps
  useEffect(() => {
    if (selectedStore && location) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${location.latitude},${location.longitude}&destination=${selectedStore.location.lat},${selectedStore.location.lng}&travelmode=driving`
      setMapUrl(url)
    }
  }, [selectedStore, location])

  // Formatear distancia
  const formatDistance = (distance: number) => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)} m`
    }
    return `${distance.toFixed(1)} km`
  }

  // Obtener precio de un producto en una tienda específica
  const getProductPrice = (productId: number | undefined, storeChain: string) => {
    if (!productId || !prices[productId]) return null
    return prices[productId][storeChain]
  }

  // Encontrar el precio más bajo para un producto
  const findLowestPrice = (productId: number | undefined) => {
    if (!productId || !prices[productId]) return null

    let lowestPrice = Number.POSITIVE_INFINITY
    let lowestChain = ""

    Object.entries(prices[productId]).forEach(([chain, price]) => {
      if (price < lowestPrice) {
        lowestPrice = price as number
        lowestChain = chain
      }
    })

    return { price: lowestPrice, chain: lowestChain }
  }

  // Renderizar contenido basado en el estado
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-500">Obteniendo tu ubicación...</p>
        </div>
      )
    }

    if (error) {
      return (
        <Alert className="border-yellow-200 bg-yellow-50 my-4">
          <AlertCircle className="h-4 w-4 text-yellow-800" />
          <AlertDescription className="text-sm text-yellow-800">
            {error}
            <p className="mt-2">
              Para usar esta función, debes permitir el acceso a tu ubicación en la configuración de tu navegador.
            </p>
          </AlertDescription>
        </Alert>
      )
    }

    if (selectedStore) {
      return (
        <div className="space-y-4">
          <Button variant="outline" onClick={() => setSelectedStore(null)} className="mb-2">
            ← Volver a la lista
          </Button>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">{selectedStore.logo}</div>
                <div className="flex-1">
                  <h3 className="font-medium text-lg">{selectedStore.name}</h3>
                  <p className="text-sm text-gray-500">{selectedStore.address}</p>
                  <p className="text-sm text-gray-500">
                    {selectedStore.comuna}, {selectedStore.city}
                  </p>
                  <p className="text-sm mt-1">
                    <span className="font-medium">Horario:</span> {selectedStore.openingHours}
                  </p>
                  {selectedStore.phone && (
                    <p className="text-sm">
                      <span className="font-medium">Teléfono:</span> {selectedStore.phone}
                    </p>
                  )}
                  <p className="text-sm mt-1">
                    <span className="font-medium">Distancia:</span> {formatDistance((selectedStore as any).distance)}
                  </p>
                </div>
              </div>

              {productId && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium">Precio en esta tienda</h4>
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      {getProductPrice(productId, selectedStore.chain) ? (
                        <span className="text-xl font-bold">
                          ${getProductPrice(productId, selectedStore.chain)?.toLocaleString("es-CL")}
                        </span>
                      ) : (
                        <span className="text-gray-500">Precio no disponible</span>
                      )}
                    </div>

                    {findLowestPrice(productId) &&
                      getProductPrice(productId, selectedStore.chain) === findLowestPrice(productId)?.price && (
                        <Badge className="bg-green-100 text-green-800 border-green-200">Mejor precio</Badge>
                      )}
                  </div>
                </div>
              )}

              <div className="mt-4 flex gap-2">
                <Button className="flex-1" asChild>
                  <a href={mapUrl} target="_blank" rel="noopener noreferrer">
                    <Navigation className="mr-2 h-4 w-4" />
                    Cómo llegar
                  </a>
                </Button>
                {onSelectStore && (
                  <Button variant="outline" className="flex-1" onClick={() => onSelectStore(selectedStore)}>
                    <Store className="mr-2 h-4 w-4" />
                    Seleccionar tienda
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return (
      <>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-500">Radio de búsqueda</p>
            <div className="flex items-center gap-2">
              <span className="font-medium">{maxDistance} km</span>
            </div>
          </div>
          <div className="w-32">
            <Slider
              value={[maxDistance]}
              min={1}
              max={10}
              step={1}
              onValueChange={(value) => setMaxDistance(value[0])}
            />
          </div>
        </div>

        {nearbyStores.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Store className="h-12 w-12 mx-auto mb-2 text-gray-400" />
            <p>No se encontraron supermercados en un radio de {maxDistance} km</p>
            <p className="text-sm mt-1">Intenta aumentar el radio de búsqueda</p>
          </div>
        ) : (
          <div className="space-y-3">
            {nearbyStores.map((store) => {
              const storePrice = productId ? getProductPrice(productId, store.chain) : null
              const lowestPrice = productId ? findLowestPrice(productId) : null
              const isLowestPrice = lowestPrice && storePrice === lowestPrice.price

              return (
                <Card
                  key={store.id}
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setSelectedStore(store)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{store.logo}</div>
                      <div className="flex-1">
                        <h3 className="font-medium">{store.name}</h3>
                        <p className="text-xs text-gray-500">{store.address}</p>
                        <div className="flex items-center mt-1">
                          <MapPin className="h-3 w-3 text-gray-400 mr-1" />
                          <span className="text-xs text-gray-500">{formatDistance(store.distance)}</span>
                        </div>
                      </div>

                      {productId && storePrice && (
                        <div className="text-right mr-2">
                          <div className="font-bold">${storePrice.toLocaleString("es-CL")}</div>
                          {isLowestPrice && (
                            <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">Mejor precio</Badge>
                          )}
                        </div>
                      )}

                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </>
    )
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="p-4 flex items-center">
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
            <ChevronRight className="h-5 w-5 rotate-180" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Supermercados Cercanos</h1>
            <p className="text-sm text-gray-500">
              {location ? `Mostrando tiendas en un radio de ${maxDistance} km` : "Obteniendo tu ubicación..."}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4">{renderContent()}</div>
    </div>
  )
}
