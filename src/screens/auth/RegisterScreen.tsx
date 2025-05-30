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
  Linking,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import LinearGradient from "react-native-linear-gradient"
import Icon from "react-native-vector-icons/MaterialIcons"

import { AuthContext, type RegisterData } from "../../context/AuthContext"
import { AuthService } from "../../services/AuthService"
import LoadingSpinner from "../../components/LoadingSpinner"
import PasswordStrengthIndicator from "../../components/PasswordStrengthIndicator"

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation()
  const { register, isLoading, error, clearError } = useContext(AuthContext)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
    acceptMarketing: false,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})
  const [passwordStrength, setPasswordStrength] = useState(0)

  useEffect(() => {
    if (error) {
      Alert.alert("Error de Registro", error, [{ text: "OK", onPress: clearError }])
    }
  }, [error])

  useEffect(() => {
    // Calcular fortaleza de contraseña
    const validation = AuthService.validatePassword(formData.password)
    const strength = Math.max(0, 5 - validation.errors.length)
    setPasswordStrength(strength)
  }, [formData.password])

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {}

    // Validar nombre
    if (!formData.firstName.trim()) {
      errors.firstName = "El nombre es requerido"
    } else if (formData.firstName.trim().length < 2) {
      errors.firstName = "El nombre debe tener al menos 2 caracteres"
    }

    // Validar apellido
    if (!formData.lastName.trim()) {
      errors.lastName = "El apellido es requerido"
    } else if (formData.lastName.trim().length < 2) {
      errors.lastName = "El apellido debe tener al menos 2 caracteres"
    }

    // Validar email
    if (!formData.email.trim()) {
      errors.email = "El email es requerido"
    } else if (!AuthService.validateEmail(formData.email)) {
      errors.email = "Ingresa un email válido"
    }

    // Validar teléfono (opcional)
    if (formData.phone.trim() && !AuthService.validatePhone(formData.phone)) {
      errors.phone = "Ingresa un número de teléfono chileno válido"
    }

    // Validar contraseña
    const passwordValidation = AuthService.validatePassword(formData.password)
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.errors[0] // Mostrar el primer error
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Confirma tu contraseña"
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden"
    }

    // Validar términos y condiciones
    if (!formData.acceptTerms) {
      errors.acceptTerms = "Debes aceptar los términos y condiciones"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleRegister = async () => {
    if (!validateForm()) return

    try {
      const registerData: RegisterData = {
        email: formData.email.trim(),
        password: formData.password,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim() || undefined,
        acceptTerms: formData.acceptTerms,
        acceptMarketing: formData.acceptMarketing,
      }

      await register(registerData)
    } catch (error) {
      // Error manejado por el contexto
    }
  }

  const handleLogin = () => {
    navigation.navigate("Login" as never)
  }

  const openTermsAndConditions = () => {
    Linking.openURL("https://smartbudget.cl/terms")
  }

  const openPrivacyPolicy = () => {
    Linking.openURL("https://smartbudget.cl/privacy")
  }

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value })
    if (validationErrors[field]) {
      setValidationErrors({ ...validationErrors, [field]: "" })
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <LinearGradient colors={["#2563eb", "#3b82f6", "#60a5fa"]} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.title}>Crear Cuenta</Text>
            <Text style={styles.subtitle}>Únete a Smart Budget y comienza a ahorrar</Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <View style={styles.form}>
              {/* Nombre y Apellido */}
              <View style={styles.row}>
                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <View style={[styles.inputWrapper, validationErrors.firstName && styles.inputError]}>
                    <Icon name="person" size={20} color="#6b7280" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Nombre"
                      placeholderTextColor="#9ca3af"
                      value={formData.firstName}
                      onChangeText={(text) => updateFormData("firstName", text)}
                      autoCapitalize="words"
                      autoCorrect={false}
                    />
                  </View>
                  {validationErrors.firstName && <Text style={styles.errorText}>{validationErrors.firstName}</Text>}
                </View>

                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <View style={[styles.inputWrapper, validationErrors.lastName && styles.inputError]}>
                    <TextInput
                      style={styles.input}
                      placeholder="Apellido"
                      placeholderTextColor="#9ca3af"
                      value={formData.lastName}
                      onChangeText={(text) => updateFormData("lastName", text)}
                      autoCapitalize="words"
                      autoCorrect={false}
                    />
                  </View>
                  {validationErrors.lastName && <Text style={styles.errorText}>{validationErrors.lastName}</Text>}
                </View>
              </View>

              {/* Email */}
              <View style={styles.inputContainer}>
                <View style={[styles.inputWrapper, validationErrors.email && styles.inputError]}>
                  <Icon name="email" size={20} color="#6b7280" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Correo electrónico"
                    placeholderTextColor="#9ca3af"
                    value={formData.email}
                    onChangeText={(text) => updateFormData("email", text)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                {validationErrors.email && <Text style={styles.errorText}>{validationErrors.email}</Text>}
              </View>

              {/* Teléfono */}
              <View style={styles.inputContainer}>
                <View style={[styles.inputWrapper, validationErrors.phone && styles.inputError]}>
                  <Icon name="phone" size={20} color="#6b7280" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Teléfono (opcional)"
                    placeholderTextColor="#9ca3af"
                    value={formData.phone}
                    onChangeText={(text) => updateFormData("phone", text)}
                    keyboardType="phone-pad"
                    autoCorrect={false}
                  />
                </View>
                {validationErrors.phone && <Text style={styles.errorText}>{validationErrors.phone}</Text>}
              </View>

              {/* Contraseña */}
              <View style={styles.inputContainer}>
                <View style={[styles.inputWrapper, validationErrors.password && styles.inputError]}>
                  <Icon name="lock" size={20} color="#6b7280" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    placeholderTextColor="#9ca3af"
                    value={formData.password}
                    onChangeText={(text) => updateFormData("password", text)}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    style={styles.passwordToggle}
                    onPress={() => setShowPassword(!showPassword)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Icon name={showPassword ? "visibility-off" : "visibility"} size={20} color="#6b7280" />
                  </TouchableOpacity>
                </View>
                {formData.password.length > 0 && (
                  <PasswordStrengthIndicator password={formData.password} strength={passwordStrength} />
                )}
                {validationErrors.password && <Text style={styles.errorText}>{validationErrors.password}</Text>}
              </View>

              {/* Confirmar Contraseña */}
              <View style={styles.inputContainer}>
                <View style={[styles.inputWrapper, validationErrors.confirmPassword && styles.inputError]}>
                  <Icon name="lock-outline" size={20} color="#6b7280" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirmar contraseña"
                    placeholderTextColor="#9ca3af"
                    value={formData.confirmPassword}
                    onChangeText={(text) => updateFormData("confirmPassword", text)}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    style={styles.passwordToggle}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Icon name={showConfirmPassword ? "visibility-off" : "visibility"} size={20} color="#6b7280" />
                  </TouchableOpacity>
                </View>
                {validationErrors.confirmPassword && (
                  <Text style={styles.errorText}>{validationErrors.confirmPassword}</Text>
                )}
              </View>

              {/* Términos y Condiciones */}
              <View style={styles.checkboxContainer}>
                <TouchableOpacity
                  style={styles.checkboxRow}
                  onPress={() => updateFormData("acceptTerms", !formData.acceptTerms)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <View style={[styles.checkbox, formData.acceptTerms && styles.checkboxChecked]}>
                    {formData.acceptTerms && <Icon name="check" size={14} color="white" />}
                  </View>
                  <View style={styles.checkboxTextContainer}>
                    <Text style={styles.checkboxText}>
                      Acepto los{" "}
                      <Text style={styles.linkText} onPress={openTermsAndConditions}>
                        términos y condiciones
                      </Text>{" "}
                      y la{" "}
                      <Text style={styles.linkText} onPress={openPrivacyPolicy}>
                        política de privacidad
                      </Text>
                    </Text>
                  </View>
                </TouchableOpacity>
                {validationErrors.acceptTerms && <Text style={styles.errorText}>{validationErrors.acceptTerms}</Text>}
              </View>

              {/* Marketing */}
              <View style={styles.checkboxContainer}>
                <TouchableOpacity
                  style={styles.checkboxRow}
                  onPress={() => updateFormData("acceptMarketing", !formData.acceptMarketing)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <View style={[styles.checkbox, formData.acceptMarketing && styles.checkboxChecked]}>
                    {formData.acceptMarketing && <Icon name="check" size={14} color="white" />}
                  </View>
                  <Text style={styles.checkboxText}>Quiero recibir ofertas y promociones por email (opcional)</Text>
                </TouchableOpacity>
              </View>

              {/* Register Button */}
              <TouchableOpacity
                style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
                onPress={handleRegister}
                disabled={isLoading}
              >
                {isLoading ? (
                  <LoadingSpinner size="small" color="white" />
                ) : (
                  <Text style={styles.registerButtonText}>Crear Cuenta</Text>
                )}
              </TouchableOpacity>

              {/* Login Link */}
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
                <TouchableOpacity onPress={handleLogin} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Text style={styles.loginLink}>Inicia sesión aquí</Text>
                </TouchableOpacity>
              </View>
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
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
    paddingTop: 20,
  },
  backButton: {
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
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
  formContainer: {
    flex: 1,
  },
  form: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputContainer: {
    marginBottom: 16,
  },
  halfWidth: {
    width: "48%",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    backgroundColor: "#f9fafb",
    paddingHorizontal: 16,
    height: 52,
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
  passwordToggle: {
    padding: 4,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  checkboxContainer: {
    marginBottom: 16,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#d1d5db",
    borderRadius: 4,
    marginRight: 12,
    marginTop: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  checkboxTextContainer: {
    flex: 1,
  },
  checkboxText: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 20,
  },
  linkText: {
    color: "#3b82f6",
    fontWeight: "500",
  },
  registerButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  registerButtonDisabled: {
    backgroundColor: "#9ca3af",
  },
  registerButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    fontSize: 14,
    color: "#6b7280",
  },
  loginLink: {
    fontSize: 14,
    color: "#3b82f6",
    fontWeight: "600",
  },
})

export default RegisterScreen
