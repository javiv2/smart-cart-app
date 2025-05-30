"use client"

import { ShoppingCart, Loader2 } from "lucide-react"

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl mb-6">
          <ShoppingCart className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Smart Cart</h1>
        <div className="flex items-center justify-center space-x-2 text-blue-100">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Cargando...</span>
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen
