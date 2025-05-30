"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartBars, ChartBar } from "@/components/ui/chart"

export default function Reports() {
  const [period, setPeriod] = useState("week")

  const weeklyData = [
    { category: "Supermercado", amount: 45000, budget: 50000, color: "hsl(var(--chart-1))" },
    { category: "Restaurantes", amount: 18000, budget: 25000, color: "hsl(var(--chart-2))" },
    { category: "Hogar", amount: 12000, budget: 15000, color: "hsl(var(--chart-3))" },
    { category: "Personal", amount: 8500, budget: 10000, color: "hsl(var(--chart-4))" },
    { category: "Otros", amount: 4200, budget: 8000, color: "hsl(var(--chart-5))" },
  ]

  const monthlyData = [
    { category: "Supermercado", amount: 185000, budget: 200000, color: "hsl(var(--chart-1))" },
    { category: "Restaurantes", amount: 75000, budget: 100000, color: "hsl(var(--chart-2))" },
    { category: "Hogar", amount: 48000, budget: 60000, color: "hsl(var(--chart-3))" },
    { category: "Personal", amount: 32000, budget: 40000, color: "hsl(var(--chart-4))" },
    { category: "Otros", amount: 18000, budget: 25000, color: "hsl(var(--chart-5))" },
  ]

  const data = period === "week" ? weeklyData : monthlyData
  const totalSpent = data.reduce((sum, item) => sum + item.amount, 0)
  const totalBudget = data.reduce((sum, item) => sum + item.budget, 0)

  return (
    <div className="flex-1 overflow-auto">
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="p-4">
          <h1 className="text-xl font-bold text-gray-800">Reportes de Gastos</h1>
        </div>

        <div className="px-4 pb-4">
          <Tabs defaultValue="week" className="w-full" onValueChange={setPeriod}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="week">Última Semana</TabsTrigger>
              <TabsTrigger value="month">Último Mes</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="p-4 pt-0 space-y-6">
        {/* Total Summary */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-sm font-medium text-gray-500">Gasto Total</h2>
            <div className="flex items-baseline mt-1">
              <span className="text-2xl font-bold text-gray-900">${totalSpent.toLocaleString("es-CL")}</span>
              <span className="ml-2 text-sm text-gray-500">de ${totalBudget.toLocaleString("es-CL")} presupuesto</span>
            </div>

            <div className="mt-2 text-sm">
              {totalSpent <= totalBudget ? (
                <span className="text-green-600">
                  Estás bajo presupuesto por ${(totalBudget - totalSpent).toLocaleString("es-CL")}
                </span>
              ) : (
                <span className="text-red-600">
                  Estás sobre presupuesto por ${(totalSpent - totalBudget).toLocaleString("es-CL")}
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Main Chart */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-sm font-medium text-gray-500 mb-4">Gastos por Categoría</h2>

            <ChartContainer
              config={{
                supermercado: { label: "Supermercado", color: "hsl(var(--chart-1))" },
                restaurantes: { label: "Restaurantes", color: "hsl(var(--chart-2))" },
                hogar: { label: "Hogar", color: "hsl(var(--chart-3))" },
                personal: { label: "Personal", color: "hsl(var(--chart-4))" },
                otros: { label: "Otros", color: "hsl(var(--chart-5))" },
              }}
              className="h-64"
            >
              <ChartBars>
                {data.map((item) => (
                  <ChartBar key={item.category} label={item.category} value={item.amount} color={item.color} />
                ))}
              </ChartBars>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Insights */}
        <Card className="bg-blue-50 border-none">
          <CardContent className="p-4">
            <h3 className="font-medium text-blue-800">Oportunidades de Ahorro</h3>
            <ul className="mt-2 space-y-2 text-sm text-blue-700">
              <li>
                • Gastaste ${data.find((i) => i.category === "Restaurantes")?.amount.toLocaleString("es-CL")} en
                restaurantes esta {period === "week" ? "semana" : "mes"}. Considera cocinar más comidas en casa.
              </li>
              <li>
                • Tu gasto en hogar está{" "}
                {data.find((i) => i.category === "Hogar")?.amount > data.find((i) => i.category === "Hogar")?.budget
                  ? "sobre"
                  : "bajo"}{" "}
                presupuesto por $
                {Math.abs(
                  data.find((i) => i.category === "Hogar")?.amount - data.find((i) => i.category === "Hogar")?.budget,
                ).toLocaleString("es-CL")}
                .
              </li>
              <li>
                • Podrías ahorrar aproximadamente $8.500 comprando productos del supermercado al por mayor la próxima{" "}
                {period === "week" ? "semana" : "mes"}.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
