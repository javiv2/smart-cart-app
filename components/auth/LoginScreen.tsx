"use client"

import type React from "react"

import { useState, useContext, useEffect } from "react"
import { AuthContext } from "@/context/AuthContext"
import { AuthService } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, ShoppingCart, Mail, Lock, Loader2 } from "lucide-react"

const LoginScreen = () => {
  const { login, register, forgotPassword, isLoading, error, clearError } = useContext(AuthContext)

  const [mode, setMode] = useState<"login" | "register" | "forgot">("login")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    acceptTerms: false,
  })

  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, clearError])

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {}

    if (!formData.email.trim()) {
      errors.email = "El email es requerido"
    } else if (!AuthService.validateEmail(formData.email)) {
      errors.email = "Ingresa un email válido"
    }

    if (mode !== "forgot") {
      if (!formData.password.trim()) {
        errors.password = "La contraseña es requerida"
      } else if (mode === "register") {
        const passwordValidation = AuthService.validatePassword(formData.password)
        if (!passwordValidation.isValid) {
          errors.password = passwordValidation.errors[0]
        }
      }

      if (mode === "register") {
        if (!formData.firstName.trim()) {
          errors.firstName = "El nombre es requerido"
        }
        if (!formData.lastName.trim()) {
          errors.lastName = "El apellido es requerido"
        }
        if (formData.password !== formData.confirmPassword) {
          errors.confirmPassword = "Las contraseñas no coinciden"
        }
        if (!formData.acceptTerms) {
          errors.acceptTerms = "Debes aceptar los términos y condiciones"
        }
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      if (mode === "login") {
        await login(formData.email, formData.password, true)
      } else if (mode === "register") {
        await register({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone || undefined,
          acceptTerms: formData.acceptTerms,
          acceptMarketing: false,
        })
      } else if (mode === "forgot") {
        await forgotPassword(formData.email)
        alert("Te hemos enviado un enlace para restablecer tu contraseña")
        setMode("login")
      }
    } catch (error) {
      // Error manejado por el contexto
    }
  }

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value })
    if (validationErrors[field]) {
      setValidationErrors({ ...validationErrors, [field]: "" })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4">
            <ShoppingCart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Smart Cart</h1>
          <p className="text-blue-100">Compra inteligente, ahorra más</p>
        </div>

        {/* Form Card */}
        <Card className="shadow-2xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {mode === "login" && "Iniciar Sesión"}
              {mode === "register" && "Crear Cuenta"}
              {mode === "forgot" && "Recuperar Contraseña"}
            </CardTitle>
            <CardDescription className="text-center">
              {mode === "login" && "Ingresa a tu cuenta para continuar"}
              {mode === "register" && "Crea tu cuenta y comienza a ahorrar"}
              {mode === "forgot" && "Te enviaremos un enlace para restablecer tu contraseña"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nombre y Apellido (solo registro) */}
              {mode === "register" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Input
                      placeholder="Nombre"
                      value={formData.firstName}
                      onChange={(e) => updateFormData("firstName", e.target.value)}
                      className={validationErrors.firstName ? "border-red-500" : ""}
                    />
                    {validationErrors.firstName && <p className="text-sm text-red-500">{validationErrors.firstName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Input
                      placeholder="Apellido"
                      value={formData.lastName}
                      onChange={(e) => updateFormData("lastName", e.target.value)}
                      className={validationErrors.lastName ? "border-red-500" : ""}
                    />
                    {validationErrors.lastName && <p className="text-sm text-red-500">{validationErrors.lastName}</p>}
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Correo electrónico"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    className={`pl-10 ${validationErrors.email ? "border-red-500" : ""}`}
                  />
                </div>
                {validationErrors.email && <p className="text-sm text-red-500">{validationErrors.email}</p>}
              </div>

              {/* Teléfono (solo registro) */}
              {mode === "register" && (
                <div className="space-y-2">
                  <Input
                    type="tel"
                    placeholder="Teléfono (opcional)"
                    value={formData.phone}
                    onChange={(e) => updateFormData("phone", e.target.value)}
                  />
                </div>
              )}

              {/* Contraseña */}
              {mode !== "forgot" && (
                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Contraseña"
                      value={formData.password}
                      onChange={(e) => updateFormData("password", e.target.value)}
                      className={`pl-10 pr-10 ${validationErrors.password ? "border-red-500" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {validationErrors.password && <p className="text-sm text-red-500">{validationErrors.password}</p>}
                </div>
              )}

              {/* Confirmar Contraseña (solo registro) */}
              {mode === "register" && (
                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirmar contraseña"
                      value={formData.confirmPassword}
                      onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                      className={`pl-10 pr-10 ${validationErrors.confirmPassword ? "border-red-500" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {validationErrors.confirmPassword && (
                    <p className="text-sm text-red-500">{validationErrors.confirmPassword}</p>
                  )}
                </div>
              )}

              {/* Términos y Condiciones (solo registro) */}
              {mode === "register" && (
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      id="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={(e) => updateFormData("acceptTerms", e.target.checked)}
                      className="mt-1"
                    />
                    <label htmlFor="acceptTerms" className="text-sm text-gray-600">
                      Acepto los{" "}
                      <a href="/terms" className="text-blue-600 hover:underline">
                        términos y condiciones
                      </a>{" "}
                      y la{" "}
                      <a href="/privacy" className="text-blue-600 hover:underline">
                        política de privacidad
                      </a>
                    </label>
                  </div>
                  {validationErrors.acceptTerms && (
                    <p className="text-sm text-red-500">{validationErrors.acceptTerms}</p>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === "login" && "Iniciar Sesión"}
                {mode === "register" && "Crear Cuenta"}
                {mode === "forgot" && "Enviar Enlace"}
              </Button>
            </form>

            {/* Mode Switchers */}
            <div className="space-y-2 text-center text-sm">
              {mode === "login" && (
                <>
                  <button type="button" onClick={() => setMode("forgot")} className="text-blue-600 hover:underline">
                    ¿Olvidaste tu contraseña?
                  </button>
                  <div>
                    ¿No tienes cuenta?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("register")}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Regístrate aquí
                    </button>
                  </div>
                </>
              )}

              {mode === "register" && (
                <div>
                  ¿Ya tienes cuenta?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Inicia sesión aquí
                  </button>
                </div>
              )}

              {mode === "forgot" && (
                <button type="button" onClick={() => setMode("login")} className="text-blue-600 hover:underline">
                  Volver al login
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default LoginScreen
