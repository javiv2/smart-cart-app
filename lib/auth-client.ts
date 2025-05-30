const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://smart-cart-api.vercel.app"

export interface LoginResponse {
  user: any
  token: string
  refreshToken: string
  expiresIn: number
}

export interface RegisterResponse {
  user: any
  token: string
  refreshToken: string
  expiresIn: number
}

class AuthServiceClass {
  private async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem("smart_cart_token")

    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Error de conexión" }))
      throw new Error(error.message || `Error ${response.status}`)
    }

    return response.json()
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    return this.request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        password,
        deviceInfo: {
          platform: "web",
          userAgent: navigator.userAgent,
        },
      }),
    })
  }

  async register(userData: any): Promise<RegisterResponse> {
    return this.request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        ...userData,
        email: userData.email.toLowerCase().trim(),
        deviceInfo: {
          platform: "web",
          userAgent: navigator.userAgent,
        },
      }),
    })
  }

  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem("smart_cart_refresh_token")

    return this.request("/api/auth/logout", {
      method: "POST",
      headers: {
        ...(refreshToken && { "X-Refresh-Token": refreshToken }),
      },
    })
  }

  async forgotPassword(email: string): Promise<void> {
    return this.request("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
      }),
    })
  }

  async getCurrentUser(): Promise<any> {
    return this.request("/api/auth/me")
  }

  async updateProfile(updates: any): Promise<any> {
    return this.request("/api/auth/profile", {
      method: "PUT",
      body: JSON.stringify(updates),
    })
  }

  async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem("smart_cart_refresh_token")
    if (!refreshToken) {
      throw new Error("No refresh token available")
    }

    const response = await this.request("/api/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    })

    return response.token
  }

  // Validaciones del lado cliente
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  static validatePassword(password: string): {
    isValid: boolean
    errors: string[]
  } {
    const errors: string[] = []

    if (password.length < 8) {
      errors.push("La contraseña debe tener al menos 8 caracteres")
    }

    if (!/(?=.*[a-z])/.test(password)) {
      errors.push("Debe contener al menos una letra minúscula")
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push("Debe contener al menos una letra mayúscula")
    }

    if (!/(?=.*\d)/.test(password)) {
      errors.push("Debe contener al menos un número")
    }

    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.push("Debe contener al menos un carácter especial (@$!%*?&)")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  static validatePhone(phone: string): boolean {
    const phoneRegex = /^(\+56|56)?[2-9]\d{8}$/
    return phoneRegex.test(phone.replace(/\s/g, ""))
  }
}

export const AuthService = new AuthServiceClass()
