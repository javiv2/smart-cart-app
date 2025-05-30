"use client"

import type React from "react"
import { createContext, useReducer, useEffect, type ReactNode } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

export interface Budget {
  id: string
  name: string
  amount: number
  period: "weekly" | "monthly"
  startDate: Date
  endDate: Date
  categories: BudgetCategory[]
}

export interface BudgetCategory {
  name: string
  amount: number
  spent: number
}

interface BudgetState {
  budgets: Budget[]
  currentBudget: Budget | null
  totalSpent: number
  loading: boolean
  error: string | null
}

interface BudgetContextType extends BudgetState {
  createBudget: (budget: Omit<Budget, "id">) => void
  updateBudget: (id: string, updates: Partial<Budget>) => void
  deleteBudget: (id: string) => void
  setCurrentBudget: (id: string) => void
  addExpense: (categoryName: string, amount: number) => void
  refreshData: () => Promise<void>
}

const initialState: BudgetState = {
  budgets: [],
  currentBudget: null,
  totalSpent: 52000, // Valor inicial simulado
  loading: false,
  error: null,
}

type BudgetAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_BUDGETS"; payload: Budget[] }
  | { type: "SET_CURRENT_BUDGET"; payload: Budget | null }
  | { type: "ADD_BUDGET"; payload: Budget }
  | { type: "UPDATE_BUDGET"; payload: { id: string; updates: Partial<Budget> } }
  | { type: "DELETE_BUDGET"; payload: string }
  | { type: "ADD_EXPENSE"; payload: { categoryName: string; amount: number } }
  | { type: "SET_TOTAL_SPENT"; payload: number }

const budgetReducer = (state: BudgetState, action: BudgetAction): BudgetState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload }

    case "SET_ERROR":
      return { ...state, error: action.payload }

    case "SET_BUDGETS":
      return { ...state, budgets: action.payload }

    case "SET_CURRENT_BUDGET":
      return { ...state, currentBudget: action.payload }

    case "ADD_BUDGET":
      return { ...state, budgets: [...state.budgets, action.payload] }

    case "UPDATE_BUDGET":
      return {
        ...state,
        budgets: state.budgets.map((budget) =>
          budget.id === action.payload.id ? { ...budget, ...action.payload.updates } : budget,
        ),
        currentBudget:
          state.currentBudget?.id === action.payload.id
            ? { ...state.currentBudget, ...action.payload.updates }
            : state.currentBudget,
      }

    case "DELETE_BUDGET":
      return {
        ...state,
        budgets: state.budgets.filter((budget) => budget.id !== action.payload),
        currentBudget: state.currentBudget?.id === action.payload ? null : state.currentBudget,
      }

    case "ADD_EXPENSE":
      if (!state.currentBudget) return state

      const updatedCategories = state.currentBudget.categories.map((category) =>
        category.name === action.payload.categoryName
          ? { ...category, spent: category.spent + action.payload.amount }
          : category,
      )

      const updatedBudget = { ...state.currentBudget, categories: updatedCategories }

      return {
        ...state,
        currentBudget: updatedBudget,
        totalSpent: state.totalSpent + action.payload.amount,
        budgets: state.budgets.map((budget) => (budget.id === updatedBudget.id ? updatedBudget : budget)),
      }

    case "SET_TOTAL_SPENT":
      return { ...state, totalSpent: action.payload }

    default:
      return state
  }
}

export const BudgetContext = createContext<BudgetContextType>({
  ...initialState,
  createBudget: () => {},
  updateBudget: () => {},
  deleteBudget: () => {},
  setCurrentBudget: () => {},
  addExpense: () => {},
  refreshData: async () => {},
})

const STORAGE_KEYS = {
  BUDGETS: "@smart_budget_budgets",
  CURRENT_BUDGET_ID: "@smart_budget_current_id",
  TOTAL_SPENT: "@smart_budget_total_spent",
}

export const BudgetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(budgetReducer, initialState)

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData()
  }, [])

  // Guardar datos cuando cambien
  useEffect(() => {
    saveBudgetsToStorage()
  }, [state.budgets])

  useEffect(() => {
    saveCurrentBudgetToStorage()
  }, [state.currentBudget])

  useEffect(() => {
    saveTotalSpentToStorage()
  }, [state.totalSpent])

  const loadInitialData = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })

      const [budgetsData, currentBudgetId, totalSpent] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.BUDGETS),
        AsyncStorage.getItem(STORAGE_KEYS.CURRENT_BUDGET_ID),
        AsyncStorage.getItem(STORAGE_KEYS.TOTAL_SPENT),
      ])

      // Cargar presupuestos
      if (budgetsData) {
        const budgets = JSON.parse(budgetsData).map((budget: any) => ({
          ...budget,
          startDate: new Date(budget.startDate),
          endDate: new Date(budget.endDate),
        }))
        dispatch({ type: "SET_BUDGETS", payload: budgets })

        // Establecer presupuesto actual
        if (currentBudgetId) {
          const currentBudget = budgets.find((b: Budget) => b.id === currentBudgetId)
          if (currentBudget) {
            dispatch({ type: "SET_CURRENT_BUDGET", payload: currentBudget })
          }
        }
      } else {
        // Crear presupuesto por defecto si no existe
        createDefaultBudget()
      }

      // Cargar total gastado
      if (totalSpent) {
        dispatch({ type: "SET_TOTAL_SPENT", payload: Number.parseFloat(totalSpent) })
      }
    } catch (error) {
      console.error("Error cargando datos del presupuesto:", error)
      dispatch({ type: "SET_ERROR", payload: "Error cargando datos" })
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const createDefaultBudget = () => {
    const defaultBudget: Budget = {
      id: Date.now().toString(),
      name: "Presupuesto Semanal",
      amount: 80000,
      period: "weekly",
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      categories: [
        { name: "Lácteos", amount: 15000, spent: 8500 },
        { name: "Carnes", amount: 25000, spent: 18000 },
        { name: "Verduras", amount: 12000, spent: 9500 },
        { name: "Despensa", amount: 20000, spent: 16000 },
        { name: "Otros", amount: 8000, spent: 0 },
      ],
    }

    dispatch({ type: "ADD_BUDGET", payload: defaultBudget })
    dispatch({ type: "SET_CURRENT_BUDGET", payload: defaultBudget })
  }

  const saveBudgetsToStorage = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(state.budgets))
    } catch (error) {
      console.error("Error guardando presupuestos:", error)
    }
  }

  const saveCurrentBudgetToStorage = async () => {
    try {
      if (state.currentBudget) {
        await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_BUDGET_ID, state.currentBudget.id)
      } else {
        await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_BUDGET_ID)
      }
    } catch (error) {
      console.error("Error guardando presupuesto actual:", error)
    }
  }

  const saveTotalSpentToStorage = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TOTAL_SPENT, state.totalSpent.toString())
    } catch (error) {
      console.error("Error guardando total gastado:", error)
    }
  }

  const createBudget = (budgetData: Omit<Budget, "id">) => {
    const newBudget: Budget = {
      ...budgetData,
      id: Date.now().toString(),
    }
    dispatch({ type: "ADD_BUDGET", payload: newBudget })
  }

  const updateBudget = (id: string, updates: Partial<Budget>) => {
    dispatch({ type: "UPDATE_BUDGET", payload: { id, updates } })
  }

  const deleteBudget = (id: string) => {
    dispatch({ type: "DELETE_BUDGET", payload: id })
  }

  const setCurrentBudget = (id: string) => {
    const budget = state.budgets.find((b) => b.id === id)
    if (budget) {
      dispatch({ type: "SET_CURRENT_BUDGET", payload: budget })
    }
  }

  const addExpense = (categoryName: string, amount: number) => {
    dispatch({ type: "ADD_EXPENSE", payload: { categoryName, amount } })
  }

  const refreshData = async () => {
    await loadInitialData()
  }

  const contextValue: BudgetContextType = {
    ...state,
    createBudget,
    updateBudget,
    deleteBudget,
    setCurrentBudget,
    addExpense,
    refreshData,
  }

  return <BudgetContext.Provider value={contextValue}>{children}</BudgetContext.Provider>
}
