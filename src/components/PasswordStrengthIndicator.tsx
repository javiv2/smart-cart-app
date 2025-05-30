import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import { AuthService } from "../services/AuthService"

interface PasswordStrengthIndicatorProps {
  password: string
  strength: number
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password, strength }) => {
  const validation = AuthService.validatePassword(password)

  const getStrengthColor = () => {
    switch (strength) {
      case 0:
      case 1:
        return "#ef4444" // Red
      case 2:
      case 3:
        return "#f59e0b" // Orange
      case 4:
        return "#10b981" // Green
      case 5:
        return "#059669" // Dark Green
      default:
        return "#e5e7eb" // Gray
    }
  }

  const getStrengthText = () => {
    switch (strength) {
      case 0:
      case 1:
        return "Muy débil"
      case 2:
        return "Débil"
      case 3:
        return "Regular"
      case 4:
        return "Fuerte"
      case 5:
        return "Muy fuerte"
      default:
        return ""
    }
  }

  const getStrengthWidth = () => {
    return `${(strength / 5) * 100}%`
  }

  return (
    <View style={styles.container}>
      {/* Strength Bar */}
      <View style={styles.strengthBar}>
        <View
          style={[
            styles.strengthFill,
            {
              width: getStrengthWidth(),
              backgroundColor: getStrengthColor(),
            },
          ]}
        />
      </View>

      {/* Strength Text */}
      <View style={styles.strengthInfo}>
        <Text style={[styles.strengthText, { color: getStrengthColor() }]}>{getStrengthText()}</Text>
      </View>

      {/* Validation Errors */}
      {validation.errors.length > 0 && (
        <View style={styles.errorsContainer}>
          {validation.errors.slice(0, 2).map((error, index) => (
            <Text key={index} style={styles.errorText}>
              • {error}
            </Text>
          ))}
          {validation.errors.length > 2 && (
            <Text style={styles.errorText}>• +{validation.errors.length - 2} requisitos más</Text>
          )}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  strengthBar: {
    height: 4,
    backgroundColor: "#e5e7eb",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 4,
  },
  strengthFill: {
    height: "100%",
    borderRadius: 2,
    transition: "width 0.3s ease",
  },
  strengthInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: "500",
  },
  errorsContainer: {
    marginTop: 4,
  },
  errorText: {
    fontSize: 11,
    color: "#6b7280",
    lineHeight: 16,
  },
})

export default PasswordStrengthIndicator
