"use client"

import { useState, useEffect } from "react"
import { Search, Plus, RefreshCw, Wifi, WifiOff, TrendingDown, TrendingUp, MapPin, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { usePriceUpdates } from "@/hooks/use-price-updates"
import NearbyStores from "@/components/nearby-stores"

// Datos de supermercados chilenos
const supermarkets = [
  { id: "jumbo", name: "Jumbo", logo: "🟢" },
  { id: "lider", name: "Líder", logo: "🔵" },
  { id: "santaisabel", name: "Santa Isabel", logo: "🔴" },
  { id: "unimarc", name: "Unimarc", logo: "🟠" },
  { id: "tottus", name: "Tottus", logo: "🟣" },
]

// Datos de productos
const productsData = [
  {
    id: 1,
    name: "Leche entera (1L)",
    category: "Lácteos",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 2,
    name: "Pan de molde integral",
    category: "Panadería",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 3,
    name: "Huevos (12 unidades)",
    category: "Lácteos",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 4,
    name: "Arroz grado 1 (1kg)",
    category: "Despensa",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 5,
    name: "Aceite de oliva (500ml)",
    category: "Despensa",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 6,
    name: "Pechuga de pollo (1kg)",
    category: "Carnes",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 7,
    name: "Pasta de dientes",
    category: "Higiene",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 8,
    name: "Detergente líquido (3L)",
    category: "Limpieza",
    image: "/placeholder.svg?height=80&width=80",
  },
]

const categories = ["Todas", "Lácteos", "Panadería", "Despensa", "Carnes", "Higiene", "Limpieza"]

interface PriceComparisonProps {
  onAddToList?: (product: any) => void
}

export default function PriceComparison({ onAddToList }: PriceComparisonProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todas")
  const [sortBy, setSortBy] = useState("name")
  const [filteredProducts, setFilteredProducts] = useState(productsData)
  const [showNearbyStores, setShowNearbyStores] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)

  // Hook para actualizaciones de precios en tiempo real
  const { prices, loading, error, lastUpdated, refreshPrices, priceChanges, isStale } = usePriceUpdates(false)

  // Filtrar y ordenar productos
  useEffect(() => {
    let result = [...productsData]

    if (searchTerm) {
      result = result.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    if (selectedCategory !== "Todas") {
      result = result.filter((product) => product.category === selectedCategory)
    }

    if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === "price-low") {
      result.sort((a, b) => {
        const aMinPrice = prices[a.id] ? Math.min(...Object.values(prices[a.id])) : 0
        const bMinPrice = prices[b.id] ? Math.min(...Object.values(prices[b.id])) : 0
        return aMinPrice - bMinPrice
      })
    } else if (sortBy === "price-high") {
      result.sort((a, b) => {
        const aMinPrice = prices[a.id] ? Math.min(...Object.values(prices[a.id])) : 0
        const bMinPrice = prices[b.id] ? Math.min(...Object.values(prices[b.id])) : 0
        return bMinPrice - aMinPrice
      })
    } else if (sortBy === "savings") {
      result.sort((a, b) => {
        const aSavings = prices[a.id]
          ? Math.max(...Object.values(prices[a.id])) - Math.min(...Object.values(prices[a.id]))
          : 0
        const bSavings = prices[b.id]
          ? Math.max(...Object.values(prices[b.id])) - Math.min(...Object.values(prices[b.id]))
          : 0
        return bSavings - aSavings
      })
    }

    setFilteredProducts(result)
  }, [searchTerm, selectedCategory, sortBy, prices])

  const getCheapestSupermarket = (productId: number) => {
    if (!prices[productId]) return null

    let cheapestId = Object.keys(prices[productId])[0]
    let cheapestPrice = prices[productId][cheapestId]

    Object.entries(prices[productId]).forEach(([id, price]) => {
      if (price < cheapestPrice) {
        cheapestPrice = price as number
        cheapestId = id
      }
    })

    return {
      id: cheapestId,
      name: supermarkets.find((s) => s.id === cheapestId)?.name || "",
      logo: supermarkets.find((s) => s.id === cheapestId)?.logo || "",
      price: cheapestPrice as number,
    }
  }

  const calculateSavings = (productId: number) => {
    if (!prices[productId]) return 0
    const productPrices = Object.values(prices[productId])
    return Math.max(...productPrices) - Math.min(...productPrices)
  }

  const handleAddToList = (product) => {
    const cheapest = getCheapestSupermarket(product.id)
    if (onAddToList && cheapest) {
      onAddToList({
        name: product.name,
        quantity: 1,
        price: cheapest.price,
        category: product.category,
        supermarket: cheapest.name,
      })
    }
  }

  const formatLastUpdated = (date: Date | null) => {
    if (!date) return "Nunca"
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return "Hace menos de 1 minuto"
    if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins > 1 ? "s" : ""}`

    const diffHours = Math.floor(diffMins / 60)
    return `Hace ${diffHours} hora${diffHours > 1 ? "s" : ""}`
  }

  const handleShowNearbyStores = (productId: number) => {
    setSelectedProductId(productId)
    setShowNearbyStores(true)
  }

  const handleStoreSelected = (store) => {
    if (selectedProductId && onAddToList && prices[selectedProductId] && prices[selectedProductId][store.chain]) {
      const product = productsData.find((p) => p.id === selectedProductId)
      if (product) {
        onAddToList({
          name: product.name,
          quantity: 1,
          price: prices[selectedProductId][store.chain],
          category: product.category,
          supermarket: store.name,
        })
      }
    }
    setShowNearbyStores(false)
  }

  // Si estamos mostrando tiendas cercanas
  if (showNearbyStores) {
    return (
      <NearbyStores
        onBack={() => setShowNearbyStores(false)}
        onSelectStore={handleStoreSelected}
        productId={selectedProductId}
      />
    )
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-gray-800">Comparador de Precios</h1>
              <p className="text-sm text-gray-500 mt-1">
                {isStale ? "Los precios pueden estar desactualizados" : "Precios actualizados"}
              </p>
            </div>
          </div>

          {/* Botón de actualización prominente */}
          <Button
            onClick={refreshPrices}
            disabled={loading}
            className={`w-full mb-3 ${isStale ? "bg-orange-500 hover:bg-orange-600" : ""}`}
            variant={isStale ? "default" : "outline"}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Actualizando precios..." : isStale ? "Actualizar precios (recomendado)" : "Actualizar precios"}
          </Button>

          {/* Estado de conexión y última actualización */}
          <div className="flex items-center justify-between text-xs mb-3">
            <div className="flex items-center gap-1">
              {error ? <WifiOff className="h-3 w-3 text-red-500" /> : <Wifi className="h-3 w-3 text-green-500" />}
              <span className={error ? "text-red-500" : "text-green-500"}>
                {error ? "Conexión limitada" : "Conectado"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {isStale && <AlertCircle className="h-3 w-3 text-orange-500" />}
              <span className={isStale ? "text-orange-500" : "text-gray-500"}>
                Actualizado: {formatLastUpdated(lastUpdated)}
              </span>
            </div>
          </div>
        </div>

        {/* Notificaciones de cambios de precios */}
        {priceChanges.length > 0 && (
          <div className="px-4 pb-2">
            <Alert className="border-blue-200 bg-blue-50">
              <AlertDescription className="text-sm">
                <div className="flex items-center gap-1">
                  {priceChanges[0].type === "decrease" ? (
                    <TrendingDown className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingUp className="h-4 w-4 text-red-500" />
                  )}
                  <span>
                    {priceChanges.length} producto{priceChanges.length > 1 ? "s han" : " ha"} cambiado de precio
                  </span>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Error de conexión */}
        {error && (
          <div className="px-4 pb-2">
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertDescription className="text-sm text-yellow-800">
                {error}. Mostrando últimos precios disponibles.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Barra de búsqueda */}
        <div className="px-4 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar productos..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Filtros */}
        <div className="px-4 pb-4 flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Nombre (A-Z)</SelectItem>
              <SelectItem value="price-low">Precio (menor a mayor)</SelectItem>
              <SelectItem value="price-high">Precio (mayor a menor)</SelectItem>
              <SelectItem value="savings">Mayor ahorro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Leyenda de supermercados */}
        <div className="px-4 pb-2 overflow-x-auto">
          <div className="flex gap-3">
            {supermarkets.map((supermarket) => (
              <div key={supermarket.id} className="flex items-center gap-1 text-xs whitespace-nowrap">
                <span>{supermarket.logo}</span>
                <span>{supermarket.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 pt-0">
        {loading && Object.keys(prices).length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p>Actualizando precios...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No se encontraron productos</p>
            <p className="text-sm mt-1">Intenta con otra búsqueda</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product) => {
              const productPrices = prices[product.id] || {}
              const cheapest = getCheapestSupermarket(product.id)
              const savings = calculateSavings(product.id)
              const savingsPercentage =
                Object.keys(productPrices).length > 0
                  ? Math.round((savings / Object.values(productPrices)[0]) * 100)
                  : 0

              return (
                <Card key={product.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex">
                      <div className="w-20 h-20 bg-gray-100 flex items-center justify-center">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="max-w-full max-h-full"
                        />
                      </div>

                      <div className="flex-1 p-3">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">{product.name}</h3>
                            <p className="text-xs text-gray-500">{product.category}</p>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-blue-600"
                              onClick={() => handleShowNearbyStores(product.id)}
                            >
                              <MapPin className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleAddToList(product)}
                              disabled={!cheapest}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Precios */}
                        <div className="mt-2 flex flex-wrap gap-2">
                          {Object.keys(productPrices).length > 0 ? (
                            Object.entries(productPrices).map(([supermarketId, price]) => {
                              const isLowest = cheapest && price === cheapest.price
                              const supermarket = supermarkets.find((s) => s.id === supermarketId)

                              return (
                                <div
                                  key={supermarketId}
                                  className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                                    isLowest ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"
                                  }`}
                                >
                                  <span>{supermarket?.logo}</span>
                                  <span>${(price as number).toLocaleString("es-CL")}</span>
                                </div>
                              )
                            })
                          ) : (
                            <div className="text-xs text-gray-500 italic">Actualizando precios...</div>
                          )}
                        </div>

                        {/* Ahorro */}
                        {savings > 0 && cheapest && (
                          <div className="mt-2 flex items-center">
                            <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                              Ahorra hasta ${savings.toLocaleString("es-CL")} ({savingsPercentage}%)
                            </Badge>
                            <p className="text-xs text-gray-500 ml-2">
                              Mejor precio en {cheapest.logo} {cheapest.name}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
