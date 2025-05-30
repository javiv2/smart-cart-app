"use client"

import type React from "react"
import { useEffect } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import { StatusBar, Platform, Alert } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"

// Screens
import HomeScreen from "./screens/HomeScreen"
import ShoppingListScreen from "./screens/ShoppingListScreen"
import PriceComparisonScreen from "./screens/PriceComparisonScreen"
import ReportsScreen from "./screens/ReportsScreen"
import SettingsScreen from "./screens/SettingsScreen"
import AddItemScreen from "./screens/AddItemScreen"
import BarcodeScanner from "./screens/BarcodeScanner"
import NearbyStoresScreen from "./screens/NearbyStoresScreen"

// Services
import { initializeNotifications } from "./services/NotificationService"
import { requestLocationPermission } from "./services/LocationService"
import { BudgetProvider } from "./context/BudgetContext"
import { ShoppingListProvider } from "./context/ShoppingListContext"

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: string

        switch (route.name) {
          case "Home":
            iconName = "home"
            break
          case "Shopping":
            iconName = "shopping-cart"
            break
          case "Compare":
            iconName = "compare-arrows"
            break
          case "Reports":
            iconName = "bar-chart"
            break
          case "Settings":
            iconName = "settings"
            break
          default:
            iconName = "home"
        }

        return <Icon name={iconName} size={size} color={color} />
      },
      tabBarActiveTintColor: "#2563eb",
      tabBarInactiveTintColor: "gray",
      headerShown: false,
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} options={{ title: "Inicio" }} />
    <Tab.Screen name="Shopping" component={ShoppingListScreen} options={{ title: "Listas" }} />
    <Tab.Screen name="Compare" component={PriceComparisonScreen} options={{ title: "Comparar" }} />
    <Tab.Screen name="Reports" component={ReportsScreen} options={{ title: "Reportes" }} />
    <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: "Ajustes" }} />
  </Tab.Navigator>
)

const App: React.FC = () => {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Inicializar notificaciones
        await initializeNotifications()

        // Solicitar permisos de ubicación
        await requestLocationPermission()

        console.log("App inicializada correctamente")
      } catch (error) {
        console.error("Error inicializando la app:", error)
        Alert.alert("Error de Inicialización", "Hubo un problema al inicializar la aplicación")
      }
    }

    initializeApp()
  }, [])

  return (
    <BudgetProvider>
      <ShoppingListProvider>
        <NavigationContainer>
          <StatusBar barStyle={Platform.OS === "ios" ? "dark-content" : "light-content"} backgroundColor="#2563eb" />
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
            <Stack.Screen
              name="AddItem"
              component={AddItemScreen}
              options={{
                headerShown: true,
                title: "Agregar Producto",
                presentation: "modal",
              }}
            />
            <Stack.Screen
              name="BarcodeScanner"
              component={BarcodeScanner}
              options={{
                headerShown: true,
                title: "Escanear Código",
                presentation: "modal",
              }}
            />
            <Stack.Screen
              name="NearbyStores"
              component={NearbyStoresScreen}
              options={{
                headerShown: true,
                title: "Tiendas Cercanas",
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ShoppingListProvider>
    </BudgetProvider>
  )
}

export default App
