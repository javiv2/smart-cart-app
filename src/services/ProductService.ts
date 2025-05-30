import axios from "axios"

export interface Product {
  id: string
  name: string
  category: string
  brand?: string
  barcode?: string
  estimatedPrice?: number
  imageUrl?: string
  description?: string
}

export interface PriceComparison {
  supermarket: string
  price: number
  discount?: number
  originalPrice?: number
  inStock: boolean
  lastUpdated: Date
}

class ProductServiceClass {
  private baseURL = "https://api.smartbudget.cl" // URL de tu API

  async getProductByBarcode(barcode: string): Promise<Product | null> {
    try {
      const response = await axios.get(`${this.baseURL}/products/barcode/${barcode}`)
      return response.data
    } catch (error) {
      console.error("Error obteniendo producto por código de barras:", error)
      return null
    }
  }

  async searchProducts(query: string, category?: string): Promise<Product[]> {
    try {
      const params: any = { q: query }
      if (category) params.category = category

      const response = await axios.get(`${this.baseURL}/products/search`, { params })
      return response.data
    } catch (error) {
      console.error("Error buscando productos:", error)
      return []
    }
  }

  async getProductPrices(productId: string): Promise<PriceComparison[]> {
    try {
      const response = await axios.get(`${this.baseURL}/products/${productId}/prices`)
      return response.data.map((price: any) => ({
        ...price,
        lastUpdated: new Date(price.lastUpdated),
      }))
    } catch (error) {
      console.error("Error obteniendo precios del producto:", error)
      return []
    }
  }

  async createProduct(productData: Omit<Product, "id">): Promise<Product> {
    try {
      const response = await axios.post(`${this.baseURL}/products`, productData)
      return response.data
    } catch (error) {
      console.error("Error creando producto:", error)
      throw error
    }
  }

  async updateProductPrice(productId: string, supermarket: string, price: number): Promise<void> {
    try {
      await axios.post(`${this.baseURL}/products/${productId}/prices`, {
        supermarket,
        price,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Error actualizando precio:", error)
      throw error
    }
  }

  async getPopularProducts(limit = 20): Promise<Product[]> {
    try {
      const response = await axios.get(`${this.baseURL}/products/popular`, {
        params: { limit },
      })
      return response.data
    } catch (error) {
      console.error("Error obteniendo productos populares:", error)
      return []
    }
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const response = await axios.get(`${this.baseURL}/products/category/${category}`)
      return response.data
    } catch (error) {
      console.error("Error obteniendo productos por categoría:", error)
      return []
    }
  }

  // Simulación local para desarrollo
  async getProductByBarcodeLocal(barcode: string): Promise<Product | null> {
    // Base de datos simulada de productos
    const localProducts: Product[] = [
      {
        id: "1",
        name: "Leche Entera Soprole 1L",
        category: "Lácteos",
        brand: "Soprole",
        barcode: "7801234567890",
        estimatedPrice: 1250,
        description: "Leche entera pasteurizada",
      },
      {
        id: "2",
        name: "Pan de Molde Ideal Integral",
        category: "Panadería",
        brand: "Ideal",
        barcode: "7801234567891",
        estimatedPrice: 1890,
        description: "Pan de molde integral con semillas",
      },
      {
        id: "3",
        name: "Huevos Santa Rosa 12 Unidades",
        category: "Lácteos",
        brand: "Santa Rosa",
        barcode: "7801234567892",
        estimatedPrice: 2890,
        description: "Huevos frescos tamaño L",
      },
    ]

    return localProducts.find((p) => p.barcode === barcode) || null
  }
}

export const ProductService = new ProductServiceClass()
