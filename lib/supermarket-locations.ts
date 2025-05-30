// Base de datos simulada de ubicaciones de supermercados en Chile
// En una aplicación real, esto vendría de una API o base de datos

export interface SupermarketLocation {
  id: string
  name: string
  chain: string // jumbo, lider, etc.
  logo: string
  address: string
  comuna: string
  city: string
  region: string
  location: {
    lat: number
    lng: number
  }
  openingHours: string
  phone?: string
}

// Ubicaciones de supermercados en Santiago y alrededores
export const supermarketLocations: SupermarketLocation[] = [
  // Santiago Centro
  {
    id: "jumbo-costanera",
    name: "Jumbo Costanera Center",
    chain: "jumbo",
    logo: "🟢",
    address: "Av. Andrés Bello 2465",
    comuna: "Providencia",
    city: "Santiago",
    region: "Metropolitana",
    location: {
      lat: -33.418,
      lng: -70.606,
    },
    openingHours: "08:00 - 22:00",
    phone: "+56 2 2201 3400",
  },
  {
    id: "lider-express-providencia",
    name: "Líder Express Providencia",
    chain: "lider",
    logo: "🔵",
    address: "Av. Providencia 1314",
    comuna: "Providencia",
    city: "Santiago",
    region: "Metropolitana",
    location: {
      lat: -33.426,
      lng: -70.618,
    },
    openingHours: "08:00 - 22:00",
    phone: "+56 2 2412 5000",
  },
  {
    id: "santaisabel-lyon",
    name: "Santa Isabel Lyon",
    chain: "santaisabel",
    logo: "🔴",
    address: "Av. Ricardo Lyon 207",
    comuna: "Providencia",
    city: "Santiago",
    region: "Metropolitana",
    location: {
      lat: -33.423,
      lng: -70.615,
    },
    openingHours: "08:00 - 22:00",
    phone: "+56 2 2350 5700",
  },
  {
    id: "unimarc-manuel-montt",
    name: "Unimarc Manuel Montt",
    chain: "unimarc",
    logo: "🟠",
    address: "Av. Manuel Montt 797",
    comuna: "Providencia",
    city: "Santiago",
    region: "Metropolitana",
    location: {
      lat: -33.43,
      lng: -70.618,
    },
    openingHours: "08:00 - 22:00",
    phone: "+56 2 2412 6000",
  },
  {
    id: "tottus-nataniel",
    name: "Tottus Nataniel",
    chain: "tottus",
    logo: "🟣",
    address: "Nataniel Cox 620",
    comuna: "Santiago",
    city: "Santiago",
    region: "Metropolitana",
    location: {
      lat: -33.45,
      lng: -70.654,
    },
    openingHours: "08:00 - 22:00",
    phone: "+56 2 2585 1000",
  },

  // Las Condes
  {
    id: "jumbo-bilbao",
    name: "Jumbo Bilbao",
    chain: "jumbo",
    logo: "🟢",
    address: "Av. Francisco Bilbao 4144",
    comuna: "Las Condes",
    city: "Santiago",
    region: "Metropolitana",
    location: {
      lat: -33.434,
      lng: -70.583,
    },
    openingHours: "08:00 - 22:00",
    phone: "+56 2 2201 3500",
  },
  {
    id: "lider-las-condes",
    name: "Líder Las Condes",
    chain: "lider",
    logo: "🔵",
    address: "Av. Las Condes 13451",
    comuna: "Las Condes",
    city: "Santiago",
    region: "Metropolitana",
    location: {
      lat: -33.402,
      lng: -70.537,
    },
    openingHours: "08:00 - 22:00",
    phone: "+56 2 2412 5100",
  },

  // Ñuñoa
  {
    id: "santaisabel-nunoa",
    name: "Santa Isabel Ñuñoa",
    chain: "santaisabel",
    logo: "🔴",
    address: "Av. Irarrázaval 2928",
    comuna: "Ñuñoa",
    city: "Santiago",
    region: "Metropolitana",
    location: {
      lat: -33.458,
      lng: -70.598,
    },
    openingHours: "08:00 - 22:00",
    phone: "+56 2 2350 5800",
  },
  {
    id: "unimarc-irarrazaval",
    name: "Unimarc Irarrázaval",
    chain: "unimarc",
    logo: "🟠",
    address: "Av. Irarrázaval 5600",
    comuna: "Ñuñoa",
    city: "Santiago",
    region: "Metropolitana",
    location: {
      lat: -33.455,
      lng: -70.575,
    },
    openingHours: "08:00 - 22:00",
    phone: "+56 2 2412 6100",
  },

  // Maipú
  {
    id: "tottus-maipu",
    name: "Tottus Maipú",
    chain: "tottus",
    logo: "🟣",
    address: "Av. Pajaritos 4500",
    comuna: "Maipú",
    city: "Santiago",
    region: "Metropolitana",
    location: {
      lat: -33.51,
      lng: -70.757,
    },
    openingHours: "08:00 - 22:00",
    phone: "+56 2 2585 1100",
  },

  // Puente Alto
  {
    id: "jumbo-puente-alto",
    name: "Jumbo Puente Alto",
    chain: "jumbo",
    logo: "🟢",
    address: "Av. Concha y Toro 1149",
    comuna: "Puente Alto",
    city: "Santiago",
    region: "Metropolitana",
    location: {
      lat: -33.594,
      lng: -70.578,
    },
    openingHours: "08:00 - 22:00",
    phone: "+56 2 2201 3600",
  },

  // La Florida
  {
    id: "lider-la-florida",
    name: "Líder La Florida",
    chain: "lider",
    logo: "🔵",
    address: "Av. Vicuña Mackenna 7110",
    comuna: "La Florida",
    city: "Santiago",
    region: "Metropolitana",
    location: {
      lat: -33.535,
      lng: -70.598,
    },
    openingHours: "08:00 - 22:00",
    phone: "+56 2 2412 5200",
  },

  // Vitacura
  {
    id: "jumbo-vitacura",
    name: "Jumbo Vitacura",
    chain: "jumbo",
    logo: "🟢",
    address: "Av. Vitacura 4455",
    comuna: "Vitacura",
    city: "Santiago",
    region: "Metropolitana",
    location: {
      lat: -33.395,
      lng: -70.58,
    },
    openingHours: "08:00 - 22:00",
    phone: "+56 2 2201 3700",
  },

  // Viña del Mar
  {
    id: "lider-vina",
    name: "Líder Viña del Mar",
    chain: "lider",
    logo: "🔵",
    address: "Av. 15 Norte 961",
    comuna: "Viña del Mar",
    city: "Viña del Mar",
    region: "Valparaíso",
    location: {
      lat: -33.005,
      lng: -71.551,
    },
    openingHours: "08:00 - 22:00",
    phone: "+56 32 238 5000",
  },

  // Concepción
  {
    id: "santaisabel-concepcion",
    name: "Santa Isabel Concepción",
    chain: "santaisabel",
    logo: "🔴",
    address: "Barros Arana 1068",
    comuna: "Concepción",
    city: "Concepción",
    region: "Biobío",
    location: {
      lat: -36.827,
      lng: -73.05,
    },
    openingHours: "08:00 - 22:00",
    phone: "+56 41 266 5000",
  },
]

// Función para calcular la distancia entre dos puntos geográficos (fórmula de Haversine)
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c // Distancia en km
  return distance
}

// Función para obtener supermercados cercanos a una ubicación
export function getNearbyStores(
  lat: number,
  lng: number,
  maxDistance = 5, // km
): SupermarketLocation[] {
  return supermarketLocations
    .map((store) => {
      const distance = calculateDistance(lat, lng, store.location.lat, store.location.lng)
      return { ...store, distance }
    })
    .filter((store) => store.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance)
}
