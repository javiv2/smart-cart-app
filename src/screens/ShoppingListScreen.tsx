"use client"

import type React from "react"
import { useContext, useState } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import Icon from "react-native-vector-icons/MaterialIcons"

import { ShoppingListContext } from "../context/ShoppingListContext"
import ShoppingListItem from "../components/ShoppingListItem"
import FloatingActionButton from "../components/FloatingActionButton"
import BudgetProgress from "../components/BudgetProgress"

const ShoppingListScreen: React.FC = () => {
  const navigation = useNavigation()
  const { currentList, updateItemQuantity, toggleItemCheck, removeItem, generateSuggestedItems } =
    useContext(ShoppingListContext)

  const [selectedItems, setSelectedItems] = useState<number[]>([])

  const totalAmount = currentList?.items.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0

  const weeklyBudget = 80000 // Esto vendría del contexto de presupuesto

  const handleGenerateSuggested = () => {
    Alert.alert(
      "Generar Lista Sugerida",
      "¿Quieres que generemos una lista de productos recomendados basada en tu historial?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Generar",
          onPress: () => {
            generateSuggestedItems()
            Alert.alert("Lista Generada", "Se han agregado productos sugeridos a tu lista")
          },
        },
      ],
    )
  }

  const handleAddItem = () => {
    navigation.navigate("AddItem" as never)
  }

  const handleScanBarcode = () => {
    navigation.navigate("BarcodeScanner" as never)
  }

  const renderItem = ({ item }: { item: any }) => (
    <ShoppingListItem
      item={item}
      onQuantityChange={(id, quantity) => updateItemQuantity(id, quantity)}
      onToggleCheck={(id) => toggleItemCheck(id)}
      onRemove={(id) => removeItem(id)}
      isSelected={selectedItems.includes(item.id)}
      onSelect={(id) => {
        setSelectedItems((prev) => (prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]))
      }}
    />
  )

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Mi Lista de Compras</Text>
        <Text style={styles.subtitle}>{currentList?.items.length || 0} productos</Text>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton} onPress={handleGenerateSuggested}>
          <Icon name="auto-awesome" size={20} color="#3b82f6" />
          <Text style={styles.actionButtonText}>Sugerida</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleScanBarcode}>
          <Icon name="camera-alt" size={20} color="#3b82f6" />
          <Text style={styles.actionButtonText}>Escanear</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  const renderFooter = () => (
    <BudgetProgress currentAmount={totalAmount} budgetAmount={weeklyBudget} title="Presupuesto de Compras" />
  )

  const EmptyList = () => (
    <View style={styles.emptyContainer}>
      <Icon name="shopping-cart" size={64} color="#d1d5db" />
      <Text style={styles.emptyTitle}>Tu lista está vacía</Text>
      <Text style={styles.emptySubtitle}>Agrega productos o genera una lista sugerida</Text>
      <TouchableOpacity style={styles.emptyButton} onPress={handleAddItem}>
        <Text style={styles.emptyButtonText}>Agregar Primer Producto</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <View style={styles.container}>
      <FlatList
        data={currentList?.items || []}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={EmptyList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />

      <FloatingActionButton icon="add" onPress={handleAddItem} style={styles.fab} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  header: {
    backgroundColor: "white",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  titleContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eff6ff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  actionButtonText: {
    color: "#3b82f6",
    fontWeight: "600",
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#4b5563",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
})

export default ShoppingListScreen
