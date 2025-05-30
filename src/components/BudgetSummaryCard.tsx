import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import Icon from "react-native-vector-icons/MaterialIcons"

interface BudgetSummaryCardProps {
  totalBudget: number
  remainingBudget: number
  totalSpent: number
}

const BudgetSummaryCard: React.FC<BudgetSummaryCardProps> = ({ totalBudget, remainingBudget, totalSpent }) => {
  const percentageUsed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0
  const isOverBudget = remainingBudget < 0
  const isWarning = percentageUsed > 80 && !isOverBudget

  const getStatusColor = () => {
    if (isOverBudget) return ["#ef4444", "#dc2626"]
    if (isWarning) return ["#f59e0b", "#d97706"]
    return ["#10b981", "#059669"]
  }

  const getStatusIcon = () => {
    if (isOverBudget) return "warning"
    if (isWarning) return "info"
    return "check-circle"
  }

  const getStatusMessage = () => {
    if (isOverBudget) {
      return `Excediste tu presupuesto por $${Math.abs(remainingBudget).toLocaleString("es-CL")}`
    }
    if (isWarning) {
      return "Te estás acercando al límite de tu presupuesto"
    }
    return "Estás dentro de tu presupuesto"
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={["white", "#f8fafc"]} style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Presupuesto Semanal</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor()[0] }]}>
            <Icon name={getStatusIcon()} size={16} color="white" />
          </View>
        </View>

        <View style={styles.amountContainer}>
          <Text style={styles.remainingAmount}>${Math.abs(remainingBudget).toLocaleString("es-CL")}</Text>
          <Text style={styles.amountLabel}>{isOverBudget ? "Excedido" : "Restante"}</Text>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(percentageUsed, 100)}%`,
                  backgroundColor: getStatusColor()[0],
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>{percentageUsed.toFixed(0)}% utilizado</Text>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Gastado</Text>
            <Text style={styles.detailValue}>${totalSpent.toLocaleString("es-CL")}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Presupuesto</Text>
            <Text style={styles.detailValue}>${totalBudget.toLocaleString("es-CL")}</Text>
          </View>
        </View>

        <View style={[styles.statusMessage, { backgroundColor: `${getStatusColor()[0]}20` }]}>
          <Text style={[styles.statusText, { color: getStatusColor()[0] }]}>{getStatusMessage()}</Text>
        </View>
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4b5563",
  },
  statusBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  amountContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  remainingAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1f2937",
  },
  amountLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  statusMessage: {
    padding: 12,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
})

export default BudgetSummaryCard
