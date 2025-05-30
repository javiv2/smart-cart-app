"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { budgetService, type Budget, type BudgetCategory } from "@/lib/data-store"

const categories = ["Lácteos", "Panadería", "Despensa", "Carnes", "Verduras", "Higiene", "Limpieza", "Otros"]

export default function BudgetManagement() {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    period: "weekly" as "weekly" | "monthly" | "yearly",
    amount: "",
    startDate: "",
    endDate: "",
    active: false,
  })
  const [categoryBudgets, setCategoryBudgets] = useState<BudgetCategory[]>([])

  useEffect(() => {
    loadBudgets()
  }, [])

  const loadBudgets = () => {
    const allBudgets = budgetService.getAll()
    setBudgets(allBudgets)
  }

  const initializeCategoryBudgets = (totalAmount: number) => {
    const amountPerCategory = Math.floor(totalAmount / categories.length)
    setCategoryBudgets(
      categories.map((category) => ({
        category,
        amount: amountPerCategory,
        spent: 0,
      })),
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const budgetData = {
      name: formData.name,
      period: formData.period,
      amount: Number.parseInt(formData.amount),
      categories: categoryBudgets,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      active: formData.active,
    }

    if (editingBudget) {
      budgetService.update(editingBudget.id, budgetData)
    } else {
      budgetService.create(budgetData)
    }

    loadBudgets()
    resetForm()
    setIsDialogOpen(false)
  }

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget)
    setFormData({
      name: budget.name,
      period: budget.period,
      amount: budget.amount.toString(),
      startDate: budget.startDate.toISOString().split("T")[0],
      endDate: budget.endDate.toISOString().split("T")[0],
      active: budget.active,
    })
    setCategoryBudgets(budget.categories)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar este presupuesto?")) {
      budgetService.delete(id)
      loadBudgets()
    }
  }

  const resetForm = () => {
    setEditingBudget(null)
    setFormData({
      name: "",
      period: "weekly",
      amount: "",
      startDate: "",
      endDate: "",
      active: false,
    })
    setCategoryBudgets([])
  }

  const updateCategoryAmount = (category: string, amount: number) => {
    setCategoryBudgets((prev) => prev.map((cat) => (cat.category === category ? { ...cat, amount } : cat)))
  }

  const getTotalCategoryBudget = () => {
    return categoryBudgets.reduce((sum, cat) => sum + cat.amount, 0)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gestión de Presupuestos</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Presupuesto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingBudget ? "Editar Presupuesto" : "Nuevo Presupuesto"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nombre del Presupuesto</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="period">Período</Label>
                  <Select
                    value={formData.period}
                    onValueChange={(value: any) => setFormData({ ...formData, period: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Semanal</SelectItem>
                      <SelectItem value="monthly">Mensual</SelectItem>
                      <SelectItem value="yearly">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="amount">Monto Total</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => {
                      setFormData({ ...formData, amount: e.target.value })
                      if (e.target.value && !editingBudget) {
                        initializeCategoryBudgets(Number.parseInt(e.target.value))
                      }
                    }}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="startDate">Fecha Inicio</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">Fecha Fin</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label>
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="mr-2"
                  />
                  Presupuesto Activo
                </Label>
              </div>

              {categoryBudgets.length > 0 && (
                <div>
                  <Label>Distribución por Categorías</Label>
                  <div className="space-y-2 mt-2">
                    {categoryBudgets.map((cat) => (
                      <div key={cat.category} className="flex items-center gap-2">
                        <span className="w-20 text-sm">{cat.category}</span>
                        <Input
                          type="number"
                          value={cat.amount}
                          onChange={(e) => updateCategoryAmount(cat.category, Number.parseInt(e.target.value) || 0)}
                          className="flex-1"
                        />
                      </div>
                    ))}
                    <div className="text-sm text-gray-500">
                      Total asignado: ${getTotalCategoryBudget().toLocaleString("es-CL")} / $
                      {Number.parseInt(formData.amount || "0").toLocaleString("es-CL")}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingBudget ? "Actualizar" : "Crear"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de presupuestos */}
      <div className="grid gap-4">
        {budgets.map((budget) => {
          const totalSpent = budget.categories.reduce((sum, cat) => sum + cat.spent, 0)
          const percentageUsed = (totalSpent / budget.amount) * 100

          return (
            <Card key={budget.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {budget.name}
                      {budget.active && <Badge className="bg-green-100 text-green-800">Activo</Badge>}
                    </CardTitle>
                    <p className="text-sm text-gray-500">
                      {budget.period === "weekly" ? "Semanal" : budget.period === "monthly" ? "Mensual" : "Anual"} •
                      {budget.startDate.toLocaleDateString("es-CL")} - {budget.endDate.toLocaleDateString("es-CL")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(budget)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(budget.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Gastado: ${totalSpent.toLocaleString("es-CL")}</span>
                      <span>Presupuesto: ${budget.amount.toLocaleString("es-CL")}</span>
                    </div>
                    <Progress value={percentageUsed} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">{percentageUsed.toFixed(1)}% utilizado</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {budget.categories.map((cat) => {
                      const catPercentage = (cat.spent / cat.amount) * 100
                      return (
                        <div key={cat.category} className="text-center p-2 bg-gray-50 rounded">
                          <div className="text-xs font-medium">{cat.category}</div>
                          <div className="text-sm">
                            ${cat.spent.toLocaleString("es-CL")} / ${cat.amount.toLocaleString("es-CL")}
                          </div>
                          <div className="text-xs text-gray-500">{catPercentage.toFixed(0)}%</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
