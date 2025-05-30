import React from 'react'
import { ShoppingCart, TrendingUp, MapPin, Bell } from 'lucide-react'

export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "2rem",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          color: "white",
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "4rem",
          }}
        >
          <h1
            style={{
              fontSize: "3.5rem",
              fontWeight: "bold",
              marginBottom: "1.5rem",
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            Smart Cart
          </h1>
          <p
            style={{
              fontSize: "1.25rem",
              marginBottom: "2rem",
              maxWidth: "600px",
              margin: "0 auto 2rem auto",
              opacity: "0.9",
            }}
          >
            Gestiona tu presupuesto de compras de forma inteligente y compara precios entre diferentes supermercados en
            Chile
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              style={{
                backgroundColor: "#4f46e5",
                color: "white",
                padding: "0.75rem 2rem",
                borderRadius: "0.5rem",
                border: "none",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
              }}
            >
              Comenzar Ahora
            </button>
            <button
              style={{
                backgroundColor: "transparent",
                color: "white",
                padding: "0.75rem 2rem",
                borderRadius: "0.5rem",
                border: "2px solid white",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              Ver Demo
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "2rem",
            marginBottom: "4rem",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "2rem",
              borderRadius: "1rem",
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              color: "#1f2937",
            }}
          >
            <div
              style={{
                width: "3rem",
                height: "3rem",
                backgroundColor: "#dbeafe",
                borderRadius: "0.75rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1rem",
              }}
            >
              <ShoppingCart style={{ width: "1.5rem", height: "1.5rem", color: "#3b82f6" }} />
            </div>
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
              }}
            >
              Lista de Compras
            </h3>
            <p style={{ color: "#6b7280" }}>Organiza tus compras y controla tu presupuesto</p>
          </div>

          <div
            style={{
              backgroundColor: "white",
              padding: "2rem",
              borderRadius: "1rem",
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              color: "#1f2937",
            }}
          >
            <div
              style={{
                width: "3rem",
                height: "3rem",
                backgroundColor: "#dcfce7",
                borderRadius: "0.75rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1rem",
              }}
            >
              <TrendingUp style={{ width: "1.5rem", height: "1.5rem", color: "#16a34a" }} />
            </div>
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
              }}
            >
              Comparación de Precios
            </h3>
            <p style={{ color: "#6b7280" }}>Encuentra los mejores precios en supermercados</p>
          </div>

          <div
            style={{
              backgroundColor: "white",
              padding: "2rem",
              borderRadius: "1rem",
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              color: "#1f2937",
            }}
          >
            <div
              style={{
                width: "3rem",
                height: "3rem",
                backgroundColor: "#f3e8ff",
                borderRadius: "0.75rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1rem",
              }}
            >
              <MapPin style={{ width: "1.5rem", height: "1.5rem", color: "#9333ea" }} />
            </div>
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
              }}
            >
              Tiendas Cercanas
            </h3>
            <p style={{ color: "#6b7280" }}>Localiza supermercados cerca de ti</p>
          </div>

          <div
            style={{
              backgroundColor: "white",
              padding: "2rem",
              borderRadius: "1rem",
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              color: "#1f2937",
            }}
          >
            <div
              style={{
                width: "3rem",
                height: "3rem",
                backgroundColor: "#fed7aa",
                borderRadius: "0.75rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1rem",
              }}
            >
              <Bell style={{ width: "1.5rem", height: "1.5rem", color: "#ea580c" }} />
            </div>
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
              }}
            >
              Alertas de Precios
            </h3>
            <p style={{ color: "#6b7280" }}>Recibe notificaciones de ofertas</p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center" }}>
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              marginBottom: "1rem",
            }}
          >
            ¡Próximamente disponible!
          </h2>
          <p style={{ opacity: "0.9" }}>Estamos trabajando en traerte la mejor experiencia de compras inteligentes</p>
        </div>
      </div>
    </div>
  )
}