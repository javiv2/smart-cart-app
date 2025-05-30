// Sistema de almacenamiento de datos simulado (en producción sería una base de datos)

export interface Product {
  id: number
  name: string
  category: string
  brand?: string
  description?: string
  barcode?: string
  createdAt: Date
  updatedAt: Date
}

export interface PriceHistory {
  id: number
  productId: number
  supermarketId: string
  price: number
  date: Date
  onSale: boolean
  originalPrice?: number
}

export interface ShoppingList {
  id: number
  name: string
  items: ShoppingListItem[]
  totalEstimated: number
  totalActual?: number
  status: "draft" | "completed" | "cancelled"
  createdAt: Date
  completedAt?: Date
}

export interface ShoppingListItem {
  id: number
  productId: number
  quantity: number
  estimatedPrice: number
  actualPrice?: number
  supermarket?: string
  purchased: boolean
}

export interface Budget {
  id: number
  name: string
  period: "weekly" | "monthly" | "yearly"
  amount: number
  categories: BudgetCategory[]
  startDate: Date
  endDate: Date
  active: boolean
}

export interface BudgetCategory {
  category: string
  amount: number
  spent: number
}

export interface Expense {
  id: number
  productId: number
  amount: number
  quantity: number
  supermarket: string
  category: string
  date: Date
  shoppingListId?: number
}

// Datos simulados
const products: Product[] = [
  {
    id: 1,
    name: "Leche entera (1L)",
    category: "Lácteos",
    brand: "Soprole",
    description: "Leche entera pasteurizada",
    barcode: "7801234567890",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: 2,
    name: "Pan de molde integral",
    category: "Panadería",
    brand: "Ideal",
    description: "Pan de molde integral con semillas",
    barcode: "7801234567891",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: 3,
    name: "Huevos (12 unidades)",
    category: "Lácteos",
    brand: "Santa Rosa",
    description: "Huevos frescos tamaño L",
    barcode: "7801234567892",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: 4,
    name: "Arroz grado 1 (1kg)",
    category: "Despensa",
    brand: "Tucapel",
    description: "Arroz blanco grado 1",
    barcode: "7801234567893",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
]

const priceHistory: PriceHistory[] = []
const shoppingLists: ShoppingList[] = []
const budgets: Budget[] = [
  {
    id: 1,
    name: "Presupuesto Semanal",
    period: "weekly",
    amount: 80000,
    categories: [
      { category: "Lácteos", amount: 15000, spent: 8500 },
      { category: "Carnes", amount: 25000, spent: 18000 },
      { category: "Verduras", amount: 12000, spent: 9500 },
      { category: "Despensa", amount: 20000, spent: 16000 },
      { category: "Otros", amount: 8000, spent: 3200 },
    ],
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-12-31"),
    active: true,
  },
]
const expenses: Expense[] = []

// Generar datos de ejemplo
const generateSampleData = () => {
  const supermarkets = ["jumbo", "lider", "santaisabel", "unimarc", "tottus"]
  const now = new Date()

  // Generar historial de precios
  products.forEach((product) => {
    supermarkets.forEach((supermarket) => {
      for (let i = 0; i < 30; i++) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
        const basePrice = Math.random() * 5000 + 1000
        priceHistory.push({
          id: priceHistory.length + 1,
          productId: product.id,
          supermarketId: supermarket,
          price: Math.round(basePrice),
          date,
          onSale: Math.random() < 0.2,
          originalPrice: Math.random() < 0.2 ? Math.round(basePrice * 1.2) : undefined,
        })
      }
    })
  })

  // Generar gastos de ejemplo
  for (let i = 0; i < 50; i++) {
    const product = products[Math.floor(Math.random() * products.length)]
    const date = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    expenses.push({
      id: expenses.length + 1,
      productId: product.id,
      amount: Math.round(Math.random() * 3000 + 1000),
      quantity: Math.floor(Math.random() * 3) + 1,
      supermarket: supermarkets[Math.floor(Math.random() * supermarkets.length)],
      category: product.category,
      date,
    })
  }
}

generateSampleData()

// CRUD Operations para Products
export const productService = {
  getAll: (): Product[] => products,

  getById: (id: number): Product | undefined => products.find((p) => p.id === id),

  create: (product: Omit<Product, "id" | "createdAt" | "updatedAt">): Product => {
    const newProduct: Product = {
      ...product,
      id: Math.max(...products.map((p) => p.id), 0) + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    products.push(newProduct)
    return newProduct
  },

  update: (id: number, updates: Partial<Omit<Product, "id" | "createdAt">>): Product | null => {
    const index = products.findIndex((p) => p.id === id)
    if (index === -1) return null

    products[index] = {
      ...products[index],
      ...updates,
      updatedAt: new Date(),
    }
    return products[index]
  },

  delete: (id: number): boolean => {
    const index = products.findIndex((p) => p.id === id)
    if (index === -1) return false

    products.splice(index, 1)
    return true
  },

  search: (query: string, category?: string): Product[] => {
    return products.filter((product) => {
      const matchesQuery =
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.brand?.toLowerCase().includes(query.toLowerCase()) ||
        product.description?.toLowerCase().includes(query.toLowerCase())
      const matchesCategory = !category || product.category === category
      return matchesQuery && matchesCategory
    })
  },
}

// CRUD Operations para Budgets
export const budgetService = {
  getAll: (): Budget[] => budgets,

  getActive: (): Budget | undefined => budgets.find((b) => b.active),

  create: (budget: Omit<Budget, "id">): Budget => {
    const newBudget: Budget = {
      ...budget,
      id: Math.max(...budgets.map((b) => b.id), 0) + 1,
    }
    budgets.push(newBudget)
    return newBudget
  },

  update: (id: number, updates: Partial<Omit<Budget, "id">>): Budget | null => {
    const index = budgets.findIndex((b) => b.id === id)
    if (index === -1) return null

    budgets[index] = { ...budgets[index], ...updates }
    return budgets[index]
  },

  delete: (id: number): boolean => {
    const index = budgets.findIndex((b) => b.id === id)
    if (index === -1) return false

    budgets.splice(index, 1)
    return true
  },
}

// CRUD Operations para Shopping Lists
export const shoppingListService = {
  getAll: (): ShoppingList[] => shoppingLists,

  getById: (id: number): ShoppingList | undefined => shoppingLists.find((sl) => sl.id === id),

  create: (shoppingList: Omit<ShoppingList, "id" | "createdAt">): ShoppingList => {
    const newList: ShoppingList = {
      ...shoppingList,
      id: Math.max(...shoppingLists.map((sl) => sl.id), 0) + 1,
      createdAt: new Date(),
    }
    shoppingLists.push(newList)
    return newList
  },

  update: (id: number, updates: Partial<Omit<ShoppingList, "id" | "createdAt">>): ShoppingList | null => {
    const index = shoppingLists.findIndex((sl) => sl.id === id)
    if (index === -1) return null

    shoppingLists[index] = { ...shoppingLists[index], ...updates }
    return shoppingLists[index]
  },

  delete: (id: number): boolean => {
    const index = shoppingLists.findIndex((sl) => sl.id === id)
    if (index === -1) return false

    shoppingLists.splice(index, 1)
    return true
  },
}

// Servicios de consultas y reportes
export const reportService = {
  getExpensesByCategory: (startDate: Date, endDate: Date) => {
    return expenses
      .filter((expense) => expense.date >= startDate && expense.date <= endDate)
      .reduce(
        (acc, expense) => {
          acc[expense.category] = (acc[expense.category] || 0) + expense.amount
          return acc
        },
        {} as Record<string, number>,
      )
  },

  getExpensesByPeriod: (period: "daily" | "weekly" | "monthly", days = 30) => {
    const now = new Date()
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)

    return expenses
      .filter((expense) => expense.date >= startDate)
      .reduce(
        (acc, expense) => {
          let key: string
          if (period === "daily") {
            key = expense.date.toISOString().split("T")[0]
          } else if (period === "weekly") {
            const weekStart = new Date(expense.date)
            weekStart.setDate(expense.date.getDate() - expense.date.getDay())
            key = weekStart.toISOString().split("T")[0]
          } else {
            key = `${expense.date.getFullYear()}-${String(expense.date.getMonth() + 1).padStart(2, "0")}`
          }

          acc[key] = (acc[key] || 0) + expense.amount
          return acc
        },
        {} as Record<string, number>,
      )
  },

  getTopProducts: (limit = 10) => {
    const productCounts = expenses.reduce(
      (acc, expense) => {
        acc[expense.productId] = (acc[expense.productId] || 0) + expense.quantity
        return acc
      },
      {} as Record<number, number>,
    )

    return Object.entries(productCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([productId, count]) => ({
        product: products.find((p) => p.id === Number.parseInt(productId)),
        count,
      }))
  },

  getPriceEvolution: (productId: number, days = 30) => {
    const now = new Date()
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)

    return priceHistory
      .filter((ph) => ph.productId === productId && ph.date >= startDate)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
  },

  getBudgetAnalysis: () => {
    const activeBudget = budgets.find((b) => b.active)
    if (!activeBudget) return null

    const totalSpent = activeBudget.categories.reduce((sum, cat) => sum + cat.spent, 0)
    const totalBudget = activeBudget.amount
    const remaining = totalBudget - totalSpent
    const percentageUsed = (totalSpent / totalBudget) * 100

    return {
      budget: activeBudget,
      totalSpent,
      totalBudget,
      remaining,
      percentageUsed,
      categoryAnalysis: activeBudget.categories.map((cat) => ({
        ...cat,
        percentageUsed: (cat.spent / cat.amount) * 100,
        remaining: cat.amount - cat.spent,
      })),
    }
  },
}
