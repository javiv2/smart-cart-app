"use client"

import { useState } from "react"
import { Settings, Package, DollarSign, BarChart3, FileText, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import ProductManagement from "./product-management"
import BudgetManagement from "./budget-management"
import DashboardExecutive from "./dashboard-executive"
import ReportsAnalytics from "./reports-analytics"

const adminSections = [
  { id: "dashboard", label: "Cuadro de Mandos", icon: BarChart3 },
  { id: "products", label: "Gestión de Productos", icon: Package },
  { id: "budgets", label: "Gestión de Presupuestos", icon: DollarSign },
  { id: "reports", label: "Informes y Análisis", icon: FileText },
]

interface AdminPanelProps {
  onBack?: () => void
}

export default function AdminPanel({ onBack }: AdminPanelProps) {
  const [activeSection, setActiveSection] = useState("dashboard")

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardExecutive />
      case "products":
        return <ProductManagement />
      case "budgets":
        return <BudgetManagement />
      case "reports":
        return <ReportsAnalytics />
      default:
        return <DashboardExecutive />
    }
  }

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-6">
          <Settings className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-bold">Panel de Administración</h1>
        </div>

        <nav className="space-y-2">
          {onBack && (
            <Button variant="ghost" className="w-full justify-start mb-4" onClick={onBack}>
              <Home className="mr-2 h-4 w-4" />
              Volver al Inicio
            </Button>
          )}

          {adminSections.map((section) => (
            <Button
              key={section.id}
              variant={activeSection === section.id ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveSection(section.id)}
            >
              <section.icon className="mr-2 h-4 w-4" />
              {section.label}
            </Button>
          ))}
        </nav>

        <Card className="mt-6">
          <CardContent className="p-4">
            <h3 className="font-medium mb-2">Acceso Rápido</h3>
            <div className="space-y-2 text-sm">
              <p>• CRUD completo de productos</p>
              <p>• Gestión de presupuestos</p>
              <p>• Informes detallados</p>
              <p>• Gráficos interactivos</p>
              <p>• Consultas avanzadas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 overflow-auto">{renderSection()}</div>
    </div>
  )
}
