"use client"

import type React from "react"
import { useState, useContext } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native"
import { useNavigation } from "@react-navigation/native"
import LinearGradient from "react-native-linear-gradient"
import Icon from "react-native-vector-icons/MaterialIcons"

import { AuthContext } from "../../context/AuthContext"
import { SecureStorageService } from "../../services/SecureStorageService"

const { width, height } = Dimensions.get("window")

interface OnboardingSlide {
  id: number
  title: string
  subtitle: string
  description: string
  icon: string
  gradient: string[]
}

const onboardingSlides: OnboardingSlide[] = [
  {
    id: 1,
    title: "Bienvenido a Smart Budget",
    subtitle: "Tu asistente financiero personal",
    description: "Gestiona tu dinero de manera inteligente y alcanza tus metas de ahorro con facilidad.",
    icon: "account-balance-wallet",
    gradient: ["#667eea", "#764ba2"],
  },
  {
    id: 2,
    title: "Compara Precios",
    subtitle: "Encuentra las mejores ofertas",
    description: "Compara precios en tiempo real entre diferentes supermercados y ahorra en cada compra.",
    icon: "compare-arrows",
    gradient: ["#f093fb", "#f5576c"],
  },
  {
    id: 3,
    title: "Listas Inteligentes",
    subtitle: "Organiza tus compras",
    description: "Crea listas de compras inteligentes con estimaciones de precios y control de presupuesto.",
    icon: "shopping-cart",
    gradient: ["#4facfe", "#00f2fe"],
  },
  {
    id: 4,
    title: "Escanea Productos",
    subtitle: "Tecnología a tu alcance",
    description: "Escanea códigos de barras para agregar productos instantáneamente y comparar precios.",
    icon: "camera-alt",
    gradient: ["#43e97b", "#38f9d7"],
  },
  {
    id: 5,
    title: "Reportes Detallados",
    subtitle: "Analiza tus gastos",
    description: "Obtén insights valiosos sobre tus hábitos de consumo con reportes visuales y recomendaciones.",
    icon: "bar-chart",
    gradient: ["#fa709a", "#fee140"],
  },
]

const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation()
  const { clearError } = useContext(AuthContext)
  const [currentSlide, setCurrentSlide] = useState(0)

  const handleNext = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    } else {
      handleGetStarted()
    }
  }

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const handleSkip = () => {
    handleGetStarted()
  }

  const handleGetStarted = async () => {
    try {
      await SecureStorageService.setFirstTimeUser(false)
      clearError()
      navigation.navigate("Login" as never)
    } catch (error) {
      console.error("Error completando onboarding:", error)
    }
  }

  const slide = onboardingSlides[currentSlide]
  const isLastSlide = currentSlide === onboardingSlides.length - 1

  return (
    <LinearGradient colors={slide.gradient} style={styles.container}>
      <View style={styles.content}>
        {/* Skip Button */}
        {!isLastSlide && (
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>Saltar</Text>
          </TouchableOpacity>
        )}

        {/* Slide Content */}
        <View style={styles.slideContainer}>
          <View style={styles.iconContainer}>
            <Icon name={slide.icon} size={80} color="white" />
          </View>

          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.subtitle}>{slide.subtitle}</Text>
          <Text style={styles.description}>{slide.description}</Text>
        </View>

        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {onboardingSlides.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.dot, index === currentSlide && styles.activeDot]}
              onPress={() => setCurrentSlide(index)}
            />
          ))}
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navigation}>
          {currentSlide > 0 && (
            <TouchableOpacity style={styles.navButton} onPress={handlePrevious}>
              <Icon name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
          )}

          <View style={styles.spacer} />

          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            {isLastSlide ? (
              <Text style={styles.nextButtonText}>Comenzar</Text>
            ) : (
              <Icon name="arrow-forward" size={24} color="white" />
            )}
          </TouchableOpacity>
        </View>

        {/* Features Preview */}
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Icon name="security" size={16} color="rgba(255, 255, 255, 0.8)" />
            <Text style={styles.featureText}>100% Seguro</Text>
          </View>
          <View style={styles.featureItem}>
            <Icon name="offline-bolt" size={16} color="rgba(255, 255, 255, 0.8)" />
            <Text style={styles.featureText}>Funciona Offline</Text>
          </View>
          <View style={styles.featureItem}>
            <Icon name="free-breakfast" size={16} color="rgba(255, 255, 255, 0.8)" />
            <Text style={styles.featureText}>Gratis</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 50,
  },
  skipButton: {
    alignSelf: "flex-end",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
    fontWeight: "500",
  },
  slideContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: "white",
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  navButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  spacer: {
    flex: 1,
  },
  nextButton: {
    height: 50,
    paddingHorizontal: 24,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    minWidth: 50,
  },
  nextButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  featureItem: {
    alignItems: "center",
  },
  featureText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
  },
})

export default OnboardingScreen
