import type React from "react"
import { View, ActivityIndicator, StyleSheet } from "react-native"

interface LoadingSpinnerProps {
  size?: "small" | "large"
  color?: string
  style?: any
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = "large", color = "#3b82f6", style }) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
})

export default LoadingSpinner
