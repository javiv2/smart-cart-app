import { type NextRequest, NextResponse } from "next/server"
import { RateLimiterMemory } from "rate-limiter-flexible"
import { verifyToken } from "./auth"

// Rate limiting
const rateLimiter = new RateLimiterMemory({
  keyGenerator: (req: NextRequest) => req.ip || "anonymous",
  points: 10, // Number of requests
  duration: 60, // Per 60 seconds
})

const authRateLimiter = new RateLimiterMemory({
  keyGenerator: (req: NextRequest) => req.ip || "anonymous",
  points: 5, // Number of auth requests
  duration: 300, // Per 5 minutes
})

export const withRateLimit = (handler: Function, isAuth = false) => {
  return async (req: NextRequest) => {
    try {
      const limiter = isAuth ? authRateLimiter : rateLimiter
      await limiter.consume(req.ip || "anonymous")
      return handler(req)
    } catch (rejRes) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }
  }
}

export const withAuth = (handler: Function) => {
  return async (req: NextRequest) => {
    try {
      const authHeader = req.headers.get("authorization")
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Token de autorización requerido" }, { status: 401 })
      }

      const token = authHeader.substring(7)
      const { userId } = verifyToken(token)

      // Agregar userId al request para uso en el handler
      ;(req as any).userId = userId

      return handler(req)
    } catch (error) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 })
    }
  }
}

export const withCors = (handler: Function) => {
  return async (req: NextRequest) => {
    const response = await handler(req)

    // Agregar headers CORS
    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    return response
  }
}
