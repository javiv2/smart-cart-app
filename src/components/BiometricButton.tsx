"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { TouchableOpacity, Text, StyleSheet, Platform } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import { AuthService } from "../services/AuthService"

interface BiometricButtonProps {
  onPress: () => void
  disabled?: boolean
}

const BiometricButton: React.FC<BiometricButtonProps> = ({ onPress, disabled = false }) => {
  const [biometricType, setBiometricType] = useState<string | null>(null)
  const [isAvailable, setIsAvailable] = useState(false)

  useEffect(() => {
    checkBiometricAvailability()
  }, [])

  const checkBiometricAvailability = async () => {
    try {
      const available = await AuthService.isBiometricAvailable()
      const type = await AuthService.getBiometricType()

      setIsAvailable(available)
      setBiometricType(type)
    } catch (error) {
      console.error("Error verificando biometría:", error)
      setIsAvailable(false)
    }
  }

  const getBiometricIcon = () => {
    if (Platform.OS === "ios") {
      return biometricType === "FaceID" ? "face" : "fingerprint"
    }
    return "fingerprint"
  }

  const getBiometricText = () => {
    if (Platform.OS === "ios") {
      return biometricType === "FaceID" ? "Usar Face ID" : "Usar Touch ID"
    }
    return "Usar Huella Dactilar"
  }

  if (!isAvailable) {
    return null
  }

  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={disabled}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Icon name={getBiometricIcon()} size={24} color={disabled ? "#9ca3af" : "#3b82f6"} />
      <Text style={[styles.buttonText, disabled && styles.buttonTextDisabled]}>{getBiometricText()}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eff6ff",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#dbeafe",
  },
  buttonDisabled: {
    backgroundColor: "#f3f4f6",
    borderColor: "#e5e7eb",
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#3b82f6",
  },
  buttonTextDisabled: {
    color: "#9ca3af",
  },
})

export default BiometricButton
