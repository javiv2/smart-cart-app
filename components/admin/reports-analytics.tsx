"use client"

import { useState, useEffect } from "react"
import { Download, Filter } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { reportService, productService } from "@/lib/data-store"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

export default function ReportsAnalytics() {
  const [reportType, setReportType] = useState("expenses")
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0],
  })
  const [selectedProduct, setSelectedProduct] = useState<string>("all")
  const [reportData, setReportData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const products = productService.getAll()

  useEffect(() => {
    generateReport()
  }, [reportType, dateRange, selectedProduct])

  const generateReport = async () => {
    setLoading(true)

    const startDate = new Date(dateRange.start)
    const endDate = new Date(dateRange.end)

    try {
      let data: any = {}

      switch (reportType) {
        case "expenses":
          data = {
            type: "expenses",
            summary: reportService.getExpensesByCategory(startDate, endDate),
            trend: reportService.getExpensesByPeriod("daily", 30),
            total: Object.values(reportService.getExpensesByCategory(startDate, endDate)).reduce(
              (sum: number, amount: any) => sum + amount,
              0,
            ),
          }
          break

        case "products":
          data = {
            type: "products",
            topProducts: reportService.getTopProducts(10),
            totalProducts: products.length,
          }
          break

        case "budget":
          data = {
            type: "budget",
            analysis: reportService.getBudgetAnalysis(),
          }
          break

        case "price-evolution":
          if (selectedProduct !== "all") {
            data = {
              type: "price-evolution",
              productId: Number.parseInt(selectedProduct),
              evolution: reportService.getPriceEvolution(Number.parseInt(selectedProduct), 30),
              product: products.find((p) => p.id === Number.parseInt(selectedProduct)),
            }
          }
          break
      }

      setReportData(data)
    } catch (error) {
      console.error("Error generating report:", error)
    } finally {
      setLoading(false)
    }
  }

  const exportReport = () => {
    // Simular exportación de reporte
    const dataStr = JSON.stringify(reportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `reporte-${reportType}-${new Date().toISOString().split("T")[0]}.json`
    link.click()
  }

  const formatCurrency = (value: number) => `$${value.toLocaleString("es-CL")}`

  const renderExpensesReport = () => {
    if (!reportData?.summary) return null

    const chartData = Object.entries(reportData.summary).map(([category, amount]) => ({
      category,
      amount: amount as number,
    }))

    const trendData = Object.entries(reportData.trend)
      .map(([date, amount]) => ({
        date: new Date(date).toLocaleDateString("es-CL", { month: "short", day: "numeric" }),
        amount: amount as number,
      }))
      .slice(-14)

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Resumen de Gastos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{formatCurrency(reportData.total)}</div>
                <div className="text-sm text-gray-500">Total del Período</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{chartData.length}</div>
                <div className="text-sm text-gray-500">Categorías</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{formatCurrency(reportData.total / chartData.length)}</div>
                <div className="text-sm text-gray-500">Promedio por Categoría</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {Math.max(...chartData.map((d) => d.amount)) === Math.min(...chartData.map((d) => d.amount))
                    ? "0%"
                    : "25%"}
                </div>
                <div className="text-sm text-gray-500">Variación</div>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value: any) => [formatCurrency(value), "Gastos"]} />
                <Bar dataKey="amount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tendencia de Gastos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value: any) => [formatCurrency(value), "Gastos"]} />
                <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detalle por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Porcentaje</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chartData.map((item) => (
                  <TableRow key={item.category}>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{formatCurrency(item.amount)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{((item.amount / reportData.total) * 100).toFixed(1)}%</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderProductsReport = () => {
    if (!reportData?.topProducts) return null

    return (
      <Card>
        <CardHeader>
          <CardTitle>Reporte de Productos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{reportData.totalProducts}</div>
              <div className="text-sm text-gray-500">Total Productos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{reportData.topProducts.length}</div>
              <div className="text-sm text-gray-500">Productos Activos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {reportData.topProducts.reduce((sum: number, item: any) => sum + item.count, 0)}
              </div>
              <div className="text-sm text-gray-500">Total Compras</div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Cantidad Comprada</TableHead>
                <TableHead>Ranking</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.topProducts.map((item: any, index: number) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.product?.name || "Producto desconocido"}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.product?.category}</Badge>
                  </TableCell>
                  <TableCell>{item.count} unidades</TableCell>
                  <TableCell>
                    <Badge className={index < 3 ? "bg-yellow-100 text-yellow-800" : ""}>#{index + 1}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    )
  }

  const renderPriceEvolutionReport = () => {
    if (!reportData?.evolution || !reportData?.product) return null

    const chartData = reportData.evolution.map((item: any) => ({
      date: new Date(item.date).toLocaleDateString("es-CL", { month: "short", day: "numeric" }),
      price: item.price,
      supermarket: item.supermarketId,
    }))

    // Agrupar por supermercado
    const supermarketData: any = {}
    chartData.forEach((item: any) => {
      if (!supermarketData[item.supermarket]) {
        supermarketData[item.supermarket] = []
      }
      supermarketData[item.supermarket].push(item)
    })

    return (
      <Card>
        <CardHeader>
          <CardTitle>Evolución de Precios - {reportData.product.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(value) => `$${value.toLocaleString("es-CL")}`} />
              <Tooltip formatter={(value: any) => [formatCurrency(value), "Precio"]} />
              <Line type="monotone" dataKey="price" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>

          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supermercado</TableHead>
                  <TableHead>Precio Actual</TableHead>
                  <TableHead>Precio Mínimo</TableHead>
                  <TableHead>Precio Máximo</TableHead>
                  <TableHead>Variación</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(supermarketData).map(([supermarket, data]: [string, any]) => {
                  const prices = data.map((d: any) => d.price)
                  const minPrice = Math.min(...prices)
                  const maxPrice = Math.max(...prices)
                  const currentPrice = prices[prices.length - 1]
                  const variation = ((maxPrice - minPrice) / minPrice) * 100

                  return (
                    <TableRow key={supermarket}>
                      <TableCell className="font-medium">{supermarket}</TableCell>
                      <TableCell>{formatCurrency(currentPrice)}</TableCell>
                      <TableCell>{formatCurrency(minPrice)}</TableCell>
                      <TableCell>{formatCurrency(maxPrice)}</TableCell>
                      <TableCell>
                        <Badge variant={variation > 10 ? "destructive" : "outline"}>{variation.toFixed(1)}%</Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Informes y Análisis</h2>
        <Button onClick={exportReport} disabled={!reportData || loading}>
          <Download className="mr-2 h-4 w-4" />
          Exportar Reporte
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Configuración del Reporte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="reportType">Tipo de Reporte</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expenses">Gastos por Categoría</SelectItem>
                  <SelectItem value="products">Productos Más Comprados</SelectItem>
                  <SelectItem value="budget">Análisis de Presupuesto</SelectItem>
                  <SelectItem value="price-evolution">Evolución de Precios</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="startDate">Fecha Inicio</Label>
              <Input
                id="startDate"
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="endDate">Fecha Fin</Label>
              <Input
                id="endDate"
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              />
            </div>

            {reportType === "price-evolution" && (
              <div>
                <Label htmlFor="product">Producto</Label>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar producto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los productos</SelectItem>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id.toString()}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contenido del reporte */}
      {loading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4 mx-auto"></div>
              <p>Generando reporte...</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {reportData?.type === "expenses" && renderExpensesReport()}
          {reportData?.type === "products" && renderProductsReport()}
          {reportData?.type === "price-evolution" && renderPriceEvolutionReport()}
          {reportData?.type === "budget" && reportData?.analysis && (
            <Card>
              <CardHeader>
                <CardTitle>Análisis de Presupuesto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{formatCurrency(reportData.analysis.totalBudget)}</div>
                    <div className="text-sm text-gray-500">Presupuesto Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{formatCurrency(reportData.analysis.totalSpent)}</div>
                    <div className="text-sm text-gray-500">Total Gastado</div>
                  </div>
                  <div className="text-center">
                    <div
                      className={`text-2xl font-bold ${reportData.analysis.remaining >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {formatCurrency(reportData.analysis.remaining)}
                    </div>
                    <div className="text-sm text-gray-500">Restante</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
