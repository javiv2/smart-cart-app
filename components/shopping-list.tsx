"use client"
import { Sparkles, Plus, Minus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"

interface ShoppingItem {
  id: number
  name: string
  quantity: number
  price: number
  checked: boolean
  category: string
}

interface ShoppingListProps {
  shoppingList: ShoppingItem[]
  setShoppingList: (list: ShoppingItem[]) => void
  listTotal: number
  weeklyBudget: number
  onAddItem: () => void
  onGenerateSuggested: () => void
}

export default function ShoppingList({
  shoppingList,
  setShoppingList,
  listTotal,
  weeklyBudget,
  onAddItem,
  onGenerateSuggested,
}: ShoppingListProps) {
  const currentDate = new Date()
  const weekStart = new Date(currentDate)
  weekStart.setDate(currentDate.getDate() - currentDate.getDay())
  const formattedDate = `Semana del ${weekStart.toLocaleDateString("es-US", { month: "long", day: "numeric" })}`

  const budgetPercentage = (listTotal / weeklyBudget) * 100
  const budgetStatus = budgetPercentage < 80 ? "success" : budgetPercentage < 100 ? "warning" : "danger"

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return

    setShoppingList(shoppingList.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const toggleChecked = (id: number) => {
    setShoppingList(shoppingList.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)))
  }

  const removeItem = (id: number) => {
    setShoppingList(shoppingList.filter((item) => item.id !== id))
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="p-4 flex items-center">
          <h1 className="text-xl font-bold text-gray-800 flex-1">Mi Lista de Compras</h1>
          <p className="text-sm text-gray-500">{formattedDate}</p>
        </div>

        <div className="px-4 pb-4">
          <Button className="w-full flex items-center justify-center gap-2" onClick={onGenerateSuggested}>
            <Sparkles className="h-4 w-4" />
            Generar Lista Sugerida
          </Button>
        </div>
      </div>

      <div className="p-4 pt-0">
        {shoppingList.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Tu lista de compras está vacía</p>
            <p className="text-sm mt-1">Agrega productos o genera una lista sugerida</p>
          </div>
        ) : (
          <div className="space-y-3">
            {shoppingList.map((item) => (
              <div key={item.id} className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                <Checkbox checked={item.checked} onCheckedChange={() => toggleChecked(item.id)} className="mr-3" />

                <div className="flex-1">
                  <p className={`font-medium ${item.checked ? "line-through text-gray-400" : "text-gray-800"}`}>
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500">{item.category}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 rounded-full"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>

                  <span className="w-6 text-center text-sm">{item.quantity}</span>

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7 rounded-full"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                <div className="ml-4 w-16 text-right">
                  <p className="font-medium">${(item.price * item.quantity).toLocaleString("es-CL")}</p>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2 h-8 w-8 text-gray-400 hover:text-red-500"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* List Budget Summary */}
      <div className="sticky bottom-16 p-4 bg-gray-50">
        <Card
          className={`border-none shadow-md ${
            budgetStatus === "danger" ? "bg-red-50" : budgetStatus === "warning" ? "bg-yellow-50" : "bg-green-50"
          }`}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Estimado de la Lista</p>
                <p className="text-xl font-bold text-gray-900">${listTotal.toLocaleString("es-CL")}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-600">Presupuesto de Compras</p>
                <p className="text-xl font-bold text-gray-900">${weeklyBudget.toLocaleString("es-CL")}</p>
              </div>
            </div>

            <div className="mt-3">
              <Progress
                value={Math.min(budgetPercentage, 100)}
                className={`h-2 ${
                  budgetStatus === "success"
                    ? "bg-green-100"
                    : budgetStatus === "warning"
                      ? "bg-yellow-100"
                      : "bg-red-100"
                }`}
                indicatorClassName={
                  budgetStatus === "success"
                    ? "bg-green-500"
                    : budgetStatus === "warning"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }
              />
            </div>

            <p
              className={`text-xs mt-2 ${
                budgetStatus === "danger"
                  ? "text-red-600"
                  : budgetStatus === "warning"
                    ? "text-yellow-600"
                    : "text-green-600"
              }`}
            >
              {budgetStatus === "danger"
                ? "Tu lista excede tu presupuesto en $" + (listTotal - weeklyBudget).toLocaleString("es-CL")
                : budgetStatus === "warning"
                  ? "Tu lista se está acercando al límite de tu presupuesto"
                  : "Tu lista está dentro de tu presupuesto"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Floating Add Button */}
      <Button className="fixed right-4 bottom-20 h-14 w-14 rounded-full shadow-lg" onClick={onAddItem}>
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  )
}
