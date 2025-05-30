"use client"

import type React from "react"
import { useContext } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native"
import { useNavigation } from "@react-navigation/native"
import LinearGradient from "react-native-linear-gradient"
import Icon from "react-native-vector-icons/MaterialIcons"

import { BudgetContext } from "../context/BudgetContext"
import { ShoppingListContext } from "../context/ShoppingListContext"
import BudgetSummaryCard from "../components/BudgetSummaryCard"
import QuickActionCard from "../components/QuickActionCard"
import PersonalizedTip from "../components/PersonalizedTip"

const { width } = Dimensions.get("window")

const HomeScreen: React.FC = () => {
  const navigation = useNavigation()
  const { currentBudget, totalSpent } = useContext(BudgetContext)
  const { shoppingLists } = useContext(ShoppingListContext)

  const remainingBudget = currentBudget?.amount - totalSpent || 0
  const activeListsCount = shoppingLists.filter((list) => list.status === "active").length

  const quickActions = [
    {
      title: "Planificar Compras",
      subtitle: `${activeListsCount} lista${activeListsCount !== 1 ? "s" : ""} activa${activeListsCount !== 1 ? "s" : ""}`,
      icon: "shopping-cart",
      color: "#3b82f6",
      onPress: () => navigation.navigate("Shopping" as never),
    },
    {
      title: "Comparar Precios",
      subtitle: "Encuentra las mejores ofertas",
      icon: "compare-arrows",
      color: "#10b981",
      onPress: () => navigation.navigate("Compare" as never),
    },
    {
      title: "Ver Reportes",
      subtitle: "Analiza tus gastos",
      icon: "bar-chart",
      color: "#f59e0b",
      onPress: () => navigation.navigate("Reports" as never),
    },
    {
      title: "Escanear Producto",
      subtitle: "Código de barras",
      icon: "camera-alt",
      color: "#8b5cf6",
      onPress: () => navigation.navigate("BarcodeScanner" as never),
    },
  ]

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient colors={["#2563eb", "#3b82f6"]} style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>¡Hola Ana! 👋</Text>
            <Text style={styles.subtitle}>Gestiona tu presupuesto inteligentemente</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Icon name="notifications" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Budget Summary */}
      <View style={styles.content}>
        <BudgetSummaryCard
          totalBudget={currentBudget?.amount || 0}
          remainingBudget={remainingBudget}
          totalSpent={totalSpent}
        />

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <QuickActionCard
                key={index}
                title={action.title}
                subtitle={action.subtitle}
                icon={action.icon}
                color={action.color}
                onPress={action.onPress}
              />
            ))}
          </View>
        </View>

        {/* Personalized Tips */}
        <PersonalizedTip />

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actividad Reciente</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityItem}>
              <Icon name="shopping-cart" size={20} color="#3b82f6" />
              <Text style={styles.activityText}>Lista de supermercado actualizada hace 2 horas</Text>
            </View>
            <View style={styles.activityItem}>
              <Icon name="trending-down" size={20} color="#10b981" />
              <Text style={styles.activityText}>Precio de leche bajó $200 en Jumbo</Text>
            </View>
            <View style={styles.activityItem}>
              <Icon name="notifications" size={20} color="#f59e0b" />
              <Text style={styles.activityText}>Te queda 30% del presupuesto semanal</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: -20,
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  activityCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  activityText: {
    marginLeft: 12,
    fontSize: 14,
    color: "#4b5563",
    flex: 1,
  },
})

export default HomeScreen
