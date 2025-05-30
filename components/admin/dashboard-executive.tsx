"use client"

import { useState, useEffect } from "react"
import { TrendingUp, DollarSign, Package, Target } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { reportService, productService, budgetService } from "@/lib/data-store"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

export default function DashboardExecutive() {
  const [kpis, setKpis] = useState({
    totalProducts: 0,
    totalBudgets: 0,
    monthlyExpenses: 0,
    budgetUtilization: 0,
  })
  const [expensesByCategory, setExpensesByCategory] = useState<any[]>([])
  const [expensesTrend, setExpensesTrend] = useState<any[]>([])
  const [topProducts, setTopProducts] = useState<any[]>([])
  const [budgetAnalysis, setBudgetAnalysis] = useState<any>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = () => {
    // KPIs básicos
    const products = productService.getAll()
    const budgets = budgetService.getAll()
    const budget = budgetService.getActive()

    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthExpenses = reportService.getExpensesByCategory(monthStart, now)
    const totalMonthlyExpenses = Object.values(monthExpenses).reduce((sum: number, amount: any) => sum + amount, 0)

    setKpis({
      totalProducts: products.length,
      totalBudgets: budgets.length,
      monthlyExpenses: totalMonthlyExpenses,
      budgetUtilization: budget ? (totalMonthlyExpenses / budget.amount) * 100 : 0,
    })

    // Gastos por categoría
    const categoryData = Object.entries(monthExpenses).map(([category, amount]) => ({
      category,
      amount: amount as number,
    }))
    setExpensesByCategory(categoryData)

    // Tendencia de gastos
    const trendData = reportService.getExpensesByPeriod("daily", 30)
    const trendArray = Object.entries(trendData)
      .map(([date, amount]) => ({
        date: new Date(date).toLocaleDateString("es-CL", { month: "short", day: "numeric" }),
        amount: amount as number,
      }))
      .slice(-14) // Últimos 14 días
    setExpensesTrend(trendArray)

    // Productos más comprados
    const topProductsData = reportService.getTopProducts(5)
    setTopProducts(topProductsData)

    // Análisis de presupuesto
    const analysis = reportService.getBudgetAnalysis()
    setBudgetAnalysis(analysis)
  }

  const formatCurrency = (value: number) => `$${value.toLocaleString("es-CL")}`

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Cuadro de Mandos Ejecutivo</h2>
        <Badge variant="outline" className="text-sm">
          Actualizado: {new Date().toLocaleString("es-CL")}
        </Badge>
      </div>

      {/* KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Productos registrados en el sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Presupuestos Activos</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.totalBudgets}</div>
            <p className="text-xs text-muted-foreground">Presupuestos configurados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos del Mes</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(kpis.monthlyExpenses)}</div>
            <p className="text-xs text-muted-foreground">Total gastado este mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilización Presupuesto</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.budgetUtilization.toFixed(1)}%</div>
            <Progress value={kpis.budgetUtilization} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tendencia de gastos */}
        <Card>
          <CardHeader>
            <CardTitle>Tendencia de Gastos (Últimos 14 días)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={expensesTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value: any) => [formatCurrency(value), "Gastos"]} />
                <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gastos por categoría */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Gastos por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expensesByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {expensesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [formatCurrency(value), "Gastos"]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Análisis detallado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productos más comprados */}
        <Card>
          <CardHeader>
            <CardTitle>Productos Más Comprados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.product?.name || "Producto desconocido"}</p>
                    <p className="text-sm text-gray-500">{item.product?.category}</p>
                  </div>
                  <Badge variant="outline">{item.count} unidades</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Análisis de presupuesto */}
        {budgetAnalysis && (
          <Card>
            <CardHeader>
              <CardTitle>Análisis de Presupuesto Activo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Presupuesto Total:</span>
                  <span className="font-bold">{formatCurrency(budgetAnalysis.totalBudget)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Total Gastado:</span>
                  <span className="font-bold">{formatCurrency(budgetAnalysis.totalSpent)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Restante:</span>
                  <span className={`font-bold ${budgetAnalysis.remaining >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {formatCurrency(budgetAnalysis.remaining)}
                  </span>
                </div>
                <Progress value={budgetAnalysis.percentageUsed} className="mt-2" />

                <div className="mt-4">
                  <h4 className="font-medium mb-2">Por Categorías:</h4>
                  <div className="space-y-2">
                    {budgetAnalysis.categoryAnalysis.slice(0, 5).map((cat: any) => (
                      <div key={cat.category} className="flex justify-between text-sm">
                        <span>{cat.category}</span>
                        <span className={cat.percentageUsed > 100 ? "text-red-600" : "text-gray-600"}>
                          {cat.percentageUsed.toFixed(0)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Gráfico de barras - Gastos por categoría */}
      <Card>
        <CardHeader>
          <CardTitle>Gastos Mensuales por Categoría</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={expensesByCategory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value: any) => [formatCurrency(value), "Gastos"]} />
              <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
