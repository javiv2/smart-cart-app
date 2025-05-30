"use client"

import type React from "react"
import { createContext, useReducer, useEffect, type ReactNode } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

export interface ShoppingListItem {
  id: number
  name: string
  quantity: number
  price: number
  category: string
  checked: boolean
  supermarket?: string
  notes?: string
  addedAt: Date
}

export interface ShoppingList {
  id: string
  name: string
  items: ShoppingListItem[]
  status: "active" | "completed" | "archived"
  createdAt: Date
  completedAt?: Date
  totalEstimated: number
  totalActual?: number
}

interface ShoppingListState {
  shoppingLists: ShoppingList[]
  currentList: ShoppingList | null
  loading: boolean
  error: string | null
}

interface ShoppingListContextType extends ShoppingListState {
  createList: (name: string) => void
  deleteList: (id: string) => void
  setCurrentList: (id: string) => void
  addItem: (item: Omit<ShoppingListItem, "id" | "addedAt">) => void
  updateItem: (id: number, updates: Partial<ShoppingListItem>) => void
  removeItem: (id: number) => void
  updateItemQuantity: (id: number, quantity: number) => void
  toggleItemCheck: (id: number) => void
  generateSuggestedItems: () => void
  completeList: () => void
  clearCompletedItems: () => void
  refreshData: () => Promise<void>
}

const initialState: ShoppingListState = {
  shoppingLists: [],
  currentList: null,
  loading: false,
  error: null,
}

type ShoppingListAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_LISTS"; payload: ShoppingList[] }
  | { type: "SET_CURRENT_LIST"; payload: ShoppingList | null }
  | { type: "ADD_LIST"; payload: ShoppingList }
  | { type: "UPDATE_LIST"; payload: { id: string; updates: Partial<ShoppingList> } }
  | { type: "DELETE_LIST"; payload: string }
  | { type: "ADD_ITEM"; payload: ShoppingListItem }
  | { type: "UPDATE_ITEM"; payload: { id: number; updates: Partial<ShoppingListItem> } }
  | { type: "REMOVE_ITEM"; payload: number }

const shoppingListReducer = (state: ShoppingListState, action: ShoppingListAction): ShoppingListState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload }

    case "SET_ERROR":
      return { ...state, error: action.payload }

    case "SET_LISTS":
      return { ...state, shoppingLists: action.payload }

    case "SET_CURRENT_LIST":
      return { ...state, currentList: action.payload }

    case "ADD_LIST":
      return {
        ...state,
        shoppingLists: [...state.shoppingLists, action.payload],
        currentList: action.payload,
      }

    case "UPDATE_LIST":
      const updatedLists = state.shoppingLists.map((list) =>
        list.id === action.payload.id ? { ...list, ...action.payload.updates } : list,
      )
      const updatedCurrentList =
        state.currentList?.id === action.payload.id
          ? { ...state.currentList, ...action.payload.updates }
          : state.currentList

      return {
        ...state,
        shoppingLists: updatedLists,
        currentList: updatedCurrentList,
      }

    case "DELETE_LIST":
      return {
        ...state,
        shoppingLists: state.shoppingLists.filter((list) => list.id !== action.payload),
        currentList: state.currentList?.id === action.payload ? null : state.currentList,
      }

    case "ADD_ITEM":
      if (!state.currentList) return state

      const newItems = [...state.currentList.items, action.payload]
      const newTotal = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const updatedList = {
        ...state.currentList,
        items: newItems,
        totalEstimated: newTotal,
      }

      return {
        ...state,
        currentList: updatedList,
        shoppingLists: state.shoppingLists.map((list) => (list.id === updatedList.id ? updatedList : list)),
      }

    case "UPDATE_ITEM":
      if (!state.currentList) return state

      const updatedItems = state.currentList.items.map((item) =>
        item.id === action.payload.id ? { ...item, ...action.payload.updates } : item,
      )
      const updatedTotal = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const listWithUpdatedItem = {
        ...state.currentList,
        items: updatedItems,
        totalEstimated: updatedTotal,
      }

      return {
        ...state,
        currentList: listWithUpdatedItem,
        shoppingLists: state.shoppingLists.map((list) =>
          list.id === listWithUpdatedItem.id ? listWithUpdatedItem : list,
        ),
      }

    case "REMOVE_ITEM":
      if (!state.currentList) return state

      const filteredItems = state.currentList.items.filter((item) => item.id !== action.payload)
      const newTotalAfterRemoval = filteredItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const listAfterRemoval = {
        ...state.currentList,
        items: filteredItems,
        totalEstimated: newTotalAfterRemoval,
      }

      return {
        ...state,
        currentList: listAfterRemoval,
        shoppingLists: state.shoppingLists.map((list) => (list.id === listAfterRemoval.id ? listAfterRemoval : list)),
      }

    default:
      return state
  }
}

export const ShoppingListContext = createContext<ShoppingListContextType>({
  ...initialState,
  createList: () => {},
  deleteList: () => {},
  setCurrentList: () => {},
  addItem: () => {},
  updateItem: () => {},
  removeItem: () => {},
  updateItemQuantity: () => {},
  toggleItemCheck: () => {},
  generateSuggestedItems: () => {},
  completeList: () => {},
  clearCompletedItems: () => {},
  refreshData: async () => {},
})

const STORAGE_KEY = "@smart_budget_shopping_lists"

export const ShoppingListProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(shoppingListReducer, initialState)

  useEffect(() => {
    loadShoppingLists()
  }, [])

  useEffect(() => {
    saveShoppingLists()
  }, [state.shoppingLists])

  const loadShoppingLists = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })

      const data = await AsyncStorage.getItem(STORAGE_KEY)
      if (data) {
        const lists = JSON.parse(data).map((list: any) => ({
          ...list,
          createdAt: new Date(list.createdAt),
          completedAt: list.completedAt ? new Date(list.completedAt) : undefined,
          items: list.items.map((item: any) => ({
            ...item,
            addedAt: new Date(item.addedAt),
          })),
        }))

        dispatch({ type: "SET_LISTS", payload: lists })

        // Establecer lista activa por defecto
        const activeList = lists.find((list: ShoppingList) => list.status === "active")
        if (activeList) {
          dispatch({ type: "SET_CURRENT_LIST", payload: activeList })
        } else if (lists.length > 0) {
          dispatch({ type: "SET_CURRENT_LIST", payload: lists[0] })
        } else {
          // Crear lista por defecto
          createDefaultList()
        }
      } else {
        createDefaultList()
      }
    } catch (error) {
      console.error("Error cargando listas de compras:", error)
      dispatch({ type: "SET_ERROR", payload: "Error cargando listas" })
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const saveShoppingLists = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state.shoppingLists))
    } catch (error) {
      console.error("Error guardando listas de compras:", error)
    }
  }

  const createDefaultList = () => {
    const defaultList: ShoppingList = {
      id: Date.now().toString(),
      name: "Lista de Compras",
      items: [
        {
          id: 1,
          name: "Leche",
          quantity: 1,
          price: 1200,
          category: "Lácteos",
          checked: false,
          addedAt: new Date(),
        },
        {
          id: 2,
          name: "Pan",
          quantity: 1,
          price: 800,
          category: "Panadería",
          checked: false,
          addedAt: new Date(),
        },
        {
          id: 3,
          name: "Huevos",
          quantity: 1,
          price: 2500,
          category: "Lácteos",
          checked: false,
          addedAt: new Date(),
        },
      ],
      status: "active",
      createdAt: new Date(),
      totalEstimated: 4500,
    }

    dispatch({ type: "ADD_LIST", payload: defaultList })
  }

  const createList = (name: string) => {
    const newList: ShoppingList = {
      id: Date.now().toString(),
      name,
      items: [],
      status: "active",
      createdAt: new Date(),
      totalEstimated: 0,
    }

    dispatch({ type: "ADD_LIST", payload: newList })
  }

  const deleteList = (id: string) => {
    dispatch({ type: "DELETE_LIST", payload: id })
  }

  const setCurrentList = (id: string) => {
    const list = state.shoppingLists.find((l) => l.id === id)
    if (list) {
      dispatch({ type: "SET_CURRENT_LIST", payload: list })
    }
  }

  const addItem = (itemData: Omit<ShoppingListItem, "id" | "addedAt">) => {
    const newItem: ShoppingListItem = {
      ...itemData,
      id: Date.now(),
      addedAt: new Date(),
    }

    dispatch({ type: "ADD_ITEM", payload: newItem })
  }

  const updateItem = (id: number, updates: Partial<ShoppingListItem>) => {
    dispatch({ type: "UPDATE_ITEM", payload: { id, updates } })
  }

  const removeItem = (id: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })
  }

  const updateItemQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return
    updateItem(id, { quantity })
  }

  const toggleItemCheck = (id: number) => {
    const item = state.currentList?.items.find((i) => i.id === id)
    if (item) {
      updateItem(id, { checked: !item.checked })
    }
  }

  const generateSuggestedItems = () => {
    const suggestedItems: Omit<ShoppingListItem, "id" | "addedAt">[] = [
      { name: "Pechuga de Pollo", quantity: 1, price: 4500, category: "Carnes", checked: false },
      { name: "Espinaca", quantity: 1, price: 1800, category: "Verduras", checked: false },
      { name: "Fideos", quantity: 2, price: 900, category: "Despensa", checked: false },
      { name: "Salsa de Tomate", quantity: 1, price: 1200, category: "Despensa", checked: false },
      { name: "Queso", quantity: 1, price: 3200, category: "Lácteos", checked: false },
    ]

    suggestedItems.forEach((item) => addItem(item))
  }

  const completeList = () => {
    if (!state.currentList) return

    const updates: Partial<ShoppingList> = {
      status: "completed",
      completedAt: new Date(),
      totalActual: state.currentList.totalEstimated, // En una app real, esto sería el total real gastado
    }

    dispatch({
      type: "UPDATE_LIST",
      payload: { id: state.currentList.id, updates },
    })
  }

  const clearCompletedItems = () => {
    if (!state.currentList) return

    const uncheckedItems = state.currentList.items.filter((item) => !item.checked)
    const newTotal = uncheckedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const updates: Partial<ShoppingList> = {
      items: uncheckedItems,
      totalEstimated: newTotal,
    }

    dispatch({
      type: "UPDATE_LIST",
      payload: { id: state.currentList.id, updates },
    })
  }

  const refreshData = async () => {
    await loadShoppingLists()
  }

  const contextValue: ShoppingListContextType = {
    ...state,
    createList,
    deleteList,
    setCurrentList,
    addItem,
    updateItem,
    removeItem,
    updateItemQuantity,
    toggleItemCheck,
    generateSuggestedItems,
    completeList,
    clearCompletedItems,
    refreshData,
  }

  return <ShoppingListContext.Provider value={contextValue}>{children}</ShoppingListContext.Provider>
}
