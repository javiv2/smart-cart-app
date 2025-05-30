import { ShoppingCart, TrendingUp, MapPin, Bell } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Smart Cart</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Gestiona tu presupuesto de compras de forma inteligente y compara precios entre diferentes supermercados en
            Chile
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Comenzar Ahora
            </button>
            <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold transition-colors">
              Ver Demo
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Lista de Compras</h3>
            <p className="text-gray-600">Organiza tus compras y controla tu presupuesto</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Comparación de Precios</h3>
            <p className="text-gray-600">Encuentra los mejores precios en supermercados</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Tiendas Cercanas</h3>
            <p className="text-gray-600">Localiza supermercados cerca de ti</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <Bell className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Alertas de Precios</h3>
            <p className="text-gray-600">Recibe notificaciones de ofertas</p>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">¡Próximamente disponible!</h2>
          <p className="text-gray-600">Estamos trabajando en traerte la mejor experiencia de compras inteligentes</p>
        </div>
      </div>
    </div>
  )
}