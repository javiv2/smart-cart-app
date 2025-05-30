"use client"

import type React from "react"

import { useContext } from "react"
import { AuthContext, AuthProvider } from "@/context/AuthContext"
import LoginScreen from "./LoginScreen"
import LoadingScreen from "./LoadingScreen"

const AuthContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useContext(AuthContext)

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!isAuthenticated) {
    return <LoginScreen />
  }

  return <>{children}</>
}

const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <AuthContent>{children}</AuthContent>
    </AuthProvider>
  )
}

export default AuthWrapper
