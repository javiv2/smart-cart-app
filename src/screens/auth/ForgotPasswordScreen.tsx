"use client"

import type React from "react"
import { useState, useContext, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import LinearGradient from "react-native-linear-gradient"
import Icon from "react-native-vector-icons/MaterialIcons"

import { AuthContext } from "../../context/AuthContext"
import { AuthService } from "../../services/AuthService"
import LoadingSpinner from "../../components/LoadingSpinner"

const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation()
  const { forgotPassword, isLoading, error, clearError } = useContext(AuthContext)

  const [email, setEmail] = useState("")
  const [emailSent, setEmailSent] = useState(false)
  const [validationError, setValidationError] = useState("")

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error, [{ text: "OK", onPress: clearError }])
    }
  }, [error])

  const validateEmail = (): boolean => {
    if (!email.trim()) {
      setValidationError("El email es requerido")
      return false
    }

    if (!AuthService.validateEmail(email)) {
      setValidationError("Ingresa un email válido")
      return false
    }

    setValidationError("")
    return true
  }

  const handleForgotPassword = async () => {
    if (!validateEmail()) return

    try {
      await forgotPassword(email)
      setEmailSent(true)
    } catch (error) {
      // Error manejado por el contexto
    }
  }

  const handleBackToLogin = () => {
    navigation.navigate("Login" as never)
  }

  const handleResendEmail = () => {
    setEmailSent(false)
    handleForgotPassword()
  }

  if (emailSent) {
    return (
      <LinearGradient colors={["#2563eb", "#3b82f6", "#60a5fa"]} style={styles.container}>
        <View style={styles.successContainer}>
          <View style={styles.successIconContainer}>
            <Icon name="mark-email-read" size={80} color="white" />
          </View>

          <Text style={styles.successTitle}>Email Enviado</Text>
          <Text style={styles.successMessage}>Te hemos enviado un enlace para restablecer tu contraseña a:</Text>
          <Text style={styles.emailText}>{email}</Text>

          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>Instrucciones:</Text>
            <Text style={styles.instructionText}>1. Revisa tu bandeja de entrada</Text>
            <Text style={styles.instructionText}>2. Busca el email de Smart Budget</Text>
            <Text style={styles.instructionText}>3. Haz clic en el enlace para restablecer</Text>
            <Text style={styles.instructionText}>4. Crea una nueva contraseña</Text>
          </View>

          <TouchableOpacity style={styles.resendButton} onPress={handleResendEmail}>
            <Text style={styles.resendButtonText}>Reenviar Email</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backButton} onPress={handleBackToLogin}>
            <Text style={styles.backButtonText}>Volver al Login</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    )
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <LinearGradient colors={["#2563eb", "#3b82f6", "#60a5fa"]} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.headerBackButton} onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.iconContainer}>
              <Icon name="lock-reset" size={60} color="white" />
            </View>
            <Text style={styles.title}>Recuperar Contraseña</Text>
            <Text style={styles.subtitle}>
              Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <View style={styles.form}>
              <Text style={styles.formTitle}>Restablecer Contraseña</Text>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <View style={[styles.inputWrapper, validationError && styles.inputError]}>
                  <Icon name="email" size={20} color="#6b7280" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Correo electrónico"
                    placeholderTextColor="#9ca3af"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text)
                      if (validationError) {
                        setValidationError("")
                      }
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoFocus
                  />
                </View>
                {validationError && <Text style={styles.errorText}>{validationError}</Text>}
              </View>

              {/* Send Button */}
              <TouchableOpacity
                style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
                onPress={handleForgotPassword}
                disabled={isLoading}
              >
                {isLoading ? (
                  <LoadingSpinner size="small" color="white" />
                ) : (
                  <Text style={styles.sendButtonText}>Enviar Enlace</Text>
                )}
              </TouchableOpacity>

              {/* Info */}
              <View style={styles.infoContainer}>
                <Icon name="info" size={16} color="#6b7280" />
                <Text style={styles.infoText}>
                  Si no recibes el email en unos minutos, revisa tu carpeta de spam o correo no deseado.
                </Text>
              </View>

              {/* Back to Login */}
              <TouchableOpacity style={styles.loginButton} onPress={handleBackToLogin}>
                <Icon name="arrow-back" size={16} color="#3b82f6" style={styles.loginButtonIcon} />
                <Text style={styles.loginButtonText}>Volver al Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
    paddingTop: 20,
  },
  headerBackButton: {
    position: "absolute",
    left: 0,
    top: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
  },
  form: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    backgroundColor: "#f9fafb",
    paddingHorizontal: 16,
    height: 56,
  },
  inputError: {
    borderColor: "#ef4444",
    backgroundColor: "#fef2f2",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1f2937",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  sendButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  sendButtonDisabled: {
    backgroundColor: "#9ca3af",
  },
  sendButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#f3f4f6",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
    marginLeft: 8,
  },
  loginButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
  },
  loginButtonIcon: {
    marginRight: 8,
  },
  loginButtonText: {
    fontSize: 16,
    color: "#3b82f6",
    fontWeight: "600",
  },
  // Success screen styles
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  successIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  successTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 16,
    textAlign: "center",
  },
  successMessage: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 8,
  },
  emailText: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 30,
  },
  instructionsContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    width: "100%",
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 8,
    lineHeight: 20,
  },
  resendButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginBottom: 16,
    width: "100%",
  },
  resendButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  backButtonText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
})

export default ForgotPasswordScreen
