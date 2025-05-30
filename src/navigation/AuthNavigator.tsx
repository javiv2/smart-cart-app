"use client"

import type React from "react"
import { useContext } from "react"
import { createStackNavigator } from "@react-navigation/stack"

import { AuthContext } from "../context/AuthContext"
import LoginScreen from "../screens/auth/LoginScreen"
import RegisterScreen from "../screens/auth/RegisterScreen"
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen"
import OnboardingScreen from "../screens/auth/OnboardingScreen"
import LoadingSpinner from "../components/LoadingSpinner"

const Stack = createStackNavigator()

const AuthNavigator: React.FC = () => {
  const { isLoading, firstTimeUser } = useContext(AuthContext)

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          }
        },
      }}
    >
      {firstTimeUser ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </>
      )}
    </Stack.Navigator>
  )
}

export default AuthNavigator
