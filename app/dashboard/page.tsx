"use client"

import { useState } from "react"
import { ShoppingCart, TrendingUp, DollarSign, Package, MapPin, Target, Plus, MoreVertical, ArrowUpRight } from 'lucide-react'

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("week")

  // Datos simulados
  const stats = {
    totalBudget: 120000,
    spent: 87500,
    saved: 15000,
    lists: 3,
    items: 24,
    stores: 5,
  }

  const recentPurchases = [
    { id: 1, store: "Jumbo", amount: 25000, items: 8, date: "2024-01-29" },
    { id: 2, store: "Lider", amount: 18500, items: 5, date: "2024-01-28" },
    { id: 3, store: "Santa Isabel", amount: 12000, items: 3, date: "2024-01-27" },
  ]

  const shoppingLists = [
    { id: 1, name: "Compras Semanales", items: 12, budget: 45000, spent: 32000, progress: 71 },
    { id: 2, name: "Despensa", items: 8, budget: 25000, spent: 18000, progress: 72 },
    { id: 3, name: "Limpieza", items: 4, budget: 15000, spent: 8500, progress: 57 },
  ]

  const topStores = [
    { name: "Jumbo", visits: 8, savings: 12000, color: "#ef4444" },
    { name: "Lider", visits: 6, savings: 8500, color: "#3b82f6" },
    { name: "Santa Isabel", visits: 4, savings: 5200, color: "#10b981" },
  ]

  const budgetProgress = (stats.spent / stats.totalBudget) * 100

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", padding: "1.5rem" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                color: "#1e293b",
                margin: "0 0 0.5rem 0",
              }}
            >
              Dashboard Smart Cart
            </h1>
            <p style={{ color: "#64748b", margin: 0 }}>Gestiona tus compras y presupuesto de forma inteligente</p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "0.5rem",
                border: "1px solid #d1d5db",
                backgroundColor: "white",
                fontSize: "0.875rem",
              }}
            >
              <option value="week">Esta Semana</option>
              <option value="month">Este Mes</option>
              <option value="year">Este Año</option>
            </select>

            <button
              style={{
                backgroundColor: "#3b82f6",
                color: "white",
                padding: "0.5rem 1rem",
                borderRadius: "0.5rem",
                border: "none",
                fontSize: "0.875rem",
                fontWeight: "500",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <Plus size={16} />
              Nueva Lista
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          {/* Presupuesto Total */}
          <div
            style={{
              backgroundColor: "white",
              padding: "1.5rem",
              borderRadius: "1rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #e2e8f0",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 0.5rem 0" }}>Presupuesto Total</p>
                <p style={{ fontSize: "1.875rem", fontWeight: "bold", color: "#1e293b", margin: 0 }}>
                  ${stats.totalBudget.toLocaleString("es-CL")}
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                    marginTop: "0.5rem",
                  }}
                >
                  <ArrowUpRight size={16} style={{ color: "#10b981" }} />
                  <span style={{ color: "#10b981", fontSize: "0.875rem" }}>+12% vs mes anterior</span>
                </div>
              </div>
              <div
                style={{
                  width: "3rem",
                  height: "3rem",
                  backgroundColor: "#dbeafe",
                  borderRadius: "0.75rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <DollarSign size={20} style={{ color: "#3b82f6" }} />
              </div>
            </div>
          </div>

          {/* Gastado */}
          <div
            style={{
              backgroundColor: "white",
              padding: "1.5rem",
              borderRadius: "1rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #e2e8f0",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 0.5rem 0" }}>Gastado</p>
                <p style={{ fontSize: "1.875rem", fontWeight: "bold", color: "#1e293b", margin: 0 }}>
                  ${stats.spent.toLocaleString("es-CL")}
                </p>
                <div
                  style={{
                    width: "100%",
                    backgroundColor: "#f1f5f9",
                    borderRadius: "0.5rem",
                    height: "0.5rem",
                    marginTop: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      width: `${budgetProgress}%`,
                      backgroundColor: budgetProgress > 80 ? "#ef4444" : budgetProgress > 60 ? "#f59e0b" : "#10b981",
                      height: "100%",
                      borderRadius: "0.5rem",
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "#64748b",
                    margin: "0.25rem 0 0 0",
                  }}
                >
                  {budgetProgress.toFixed(1)}% del presupuesto
                </p>
              </div>
              <div
                style={{
                  width: "3rem",
                  height: "3rem",
                  backgroundColor: "#fef3c7",
                  borderRadius: "0.75rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TrendingUp size={20} style={{ color: "#f59e0b" }} />
              </div>
            </div>
          </div>

          {/* Ahorrado */}
          <div
            style={{
              backgroundColor: "white",
              padding: "1.5rem",
              borderRadius: "1rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #e2e8f0",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 0.5rem 0" }}>Ahorrado</p>
                <p style={{ fontSize: "1.875rem", fontWeight: "bold", color: "#1e293b", margin: 0 }}>
                  ${stats.saved.toLocaleString("es-CL")}
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                    marginTop: "0.5rem",
                  }}
                >
                  <ArrowUpRight size={16} style={{ color: "#10b981" }} />
                  <span style={{ color: "#10b981", fontSize: "0.875rem" }}>+8% vs mes anterior</span>
                </div>
              </div>
              <div
                style={{
                  width: "3rem",
                  height: "3rem",
                  backgroundColor: "#dcfce7",
                  borderRadius: "0.75rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Target size={20} style={{ color: "#16a34a" }} />
              </div>
            </div>
          </div>

          {/* Listas Activas */}
          <div
            style={{
              backgroundColor: "white",
              padding: "1.5rem",
              borderRadius: "1rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #e2e8f0",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0 0 0.5rem 0" }}>Listas Activas</p>
                <p style={{ fontSize: "1.875rem", fontWeight: "bold", color: "#1e293b", margin: 0 }}>{stats.lists}</p>
                <p style={{ color: "#64748b", fontSize: "0.875rem", margin: "0.5rem 0 0 0" }}>
                  {stats.items} productos total
                </p>
              </div>
              <div
                style={{
                  width: "3rem",
                  height: "3rem",
                  backgroundColor: "#f3e8ff",
                  borderRadius: "0.75rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ShoppingCart size={20} style={{ color: "#9333ea" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
            gap: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          {/* Listas de Compras */}
          <div
            style={{
              backgroundColor: "white",
              padding: "1.5rem",
              borderRadius: "1rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #e2e8f0",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#1e293b", margin: 0 }}>
                Listas de Compras
              </h3>
              <MoreVertical size={20} style={{ color: "#64748b", cursor: "pointer" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {shoppingLists.map((list) => (
                <div
                  key={list.id}
                  style={{
                    padding: "1rem",
                    backgroundColor: "#f8fafc",
                    borderRadius: "0.75rem",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: "600",
                          color: "#1e293b",
                          margin: "0 0 0.25rem 0",
                        }}
                      >
                        {list.name}
                      </h4>
                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: "#64748b",
                          margin: 0,
                        }}
                      >
                        {list.items} productos
                      </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: "600",
                          color: "#1e293b",
                          margin: "0 0 0.25rem 0",
                        }}
                      >
                        ${list.spent.toLocaleString("es-CL")}
                      </p>
                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: "#64748b",
                          margin: 0,
                        }}
                      >
                        de ${list.budget.toLocaleString("es-CL")}
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      width: "100%",
                      backgroundColor: "#e2e8f0",
                      borderRadius: "0.25rem",
                      height: "0.5rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <div
                      style={{
                        width: `${list.progress}%`,
                        backgroundColor: list.progress > 80 ? "#ef4444" : list.progress > 60 ? "#f59e0b" : "#10b981",
                        height: "100%",
                        borderRadius: "0.25rem",
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>

                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: "#64748b",
                      margin: 0,
                    }}
                  >
                    {list.progress}% completado
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Compras Recientes */}
          <div
            style={{
              backgroundColor: "white",
              padding: "1.5rem",
              borderRadius: "1rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              border: "1px solid #e2e8f0",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#1e293b", margin: 0 }}>
                Compras Recientes
              </h3>
              <MoreVertical size={20} style={{ color: "#64748b", cursor: "pointer" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {recentPurchases.map((purchase) => (
                <div
                  key={purchase.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "1rem",
                    backgroundColor: "#f8fafc",
                    borderRadius: "0.75rem",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div
                      style={{
                        width: "2.5rem",
                        height: "2.5rem",
                        backgroundColor: "#dbeafe",
                        borderRadius: "0.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Package size={16} style={{ color: "#3b82f6" }} />
                    </div>
                    <div>
                      <h4
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: "600",
                          color: "#1e293b",
                          margin: "0 0 0.25rem 0",
                        }}
                      >
                        {purchase.store}
                      </h4>
                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: "#64748b",
                          margin: 0,
                        }}
                      >
                        {purchase.items} productos • {purchase.date}
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        color: "#1e293b",
                        margin: 0,
                      }}
                    >
                      ${purchase.amount.toLocaleString("es-CL")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Supermercados Favoritos */}
        <div
          style={{
            backgroundColor: "white",
            padding: "1.5rem",
            borderRadius: "1rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: "1px solid #e2e8f0",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#1e293b", margin: 0 }}>
              Supermercados Favoritos
            </h3>
            <MoreVertical size={20} style={{ color: "#64748b", cursor: "pointer" }} />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
            }}
          >
            {topStores.map((store, index) => (
              <div
                key={store.name}
                style={{
                  padding: "1rem",
                  backgroundColor: "#f8fafc",
                  borderRadius: "0.75rem",
                  border: "1px solid #e2e8f0",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: "3rem",
                    height: "3rem",
                    backgroundColor: store.color + "20",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 0.75rem auto",
                  }}
                >
                  <MapPin size={20} style={{ color: store.color }} />
                </div>
                <h4
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#1e293b",
                    margin: "0 0 0.5rem 0",
                  }}
                >
                  {store.name}
                </h4>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "#64748b",
                    margin: "0 0 0.5rem 0",
                  }}
                >
                  {store.visits} visitas
                </p>
                <p
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#10b981",
                    margin: 0,
                  }}
                >
                  ${store.savings.toLocaleString("es-CL")} ahorrado
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}