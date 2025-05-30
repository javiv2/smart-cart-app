"use client"

import type React from "react"
import { useState, useRef } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Alert, Vibration, Dimensions } from "react-native"
import { RNCamera } from "react-native-camera"
import { useNavigation } from "@react-navigation/native"
import Icon from "react-native-vector-icons/MaterialIcons"

import { ProductService } from "../services/ProductService"

const { width, height } = Dimensions.get("window")

const BarcodeScanner: React.FC = () => {
  const navigation = useNavigation()
  const [scanned, setScanned] = useState(false)
  const [flashMode, setFlashMode] = useState(RNCamera.Constants.FlashMode.off)
  const cameraRef = useRef<RNCamera>(null)

  const handleBarCodeRead = async (scanResult: any) => {
    if (scanned) return

    setScanned(true)
    Vibration.vibrate(100)

    try {
      const product = await ProductService.getProductByBarcode(scanResult.data)

      if (product) {
        Alert.alert(
          "Producto Encontrado",
          `${product.name}\nPrecio estimado: $${product.estimatedPrice?.toLocaleString("es-CL")}`,
          [
            {
              text: "Cancelar",
              style: "cancel",
              onPress: () => setScanned(false),
            },
            {
              text: "Agregar a Lista",
              onPress: () => {
                navigation.navigate("AddItem", {
                  product: product,
                } as never)
              },
            },
          ],
        )
      } else {
        Alert.alert(
          "Producto No Encontrado",
          `No encontramos el producto con código ${scanResult.data}. ¿Quieres agregarlo manualmente?`,
          [
            {
              text: "Cancelar",
              style: "cancel",
              onPress: () => setScanned(false),
            },
            {
              text: "Agregar Manualmente",
              onPress: () => {
                navigation.navigate("AddItem", {
                  barcode: scanResult.data,
                } as never)
              },
            },
          ],
        )
      }
    } catch (error) {
      console.error("Error buscando producto:", error)
      Alert.alert("Error", "Hubo un problema al buscar el producto. Intenta nuevamente.", [
        { text: "OK", onPress: () => setScanned(false) },
      ])
    }
  }

  const toggleFlash = () => {
    setFlashMode(
      flashMode === RNCamera.Constants.FlashMode.off
        ? RNCamera.Constants.FlashMode.torch
        : RNCamera.Constants.FlashMode.off,
    )
  }

  return (
    <View style={styles.container}>
      <RNCamera
        ref={cameraRef}
        style={styles.camera}
        onBarCodeRead={handleBarCodeRead}
        barCodeTypes={[RNCamera.Constants.BarCodeType.ean13, RNCamera.Constants.BarCodeType.ean8]}
        flashMode={flashMode}
        captureAudio={false}
      >
        <View style={styles.overlay}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
              <Icon name="close" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Escanear Código</Text>
            <TouchableOpacity style={styles.headerButton} onPress={toggleFlash}>
              <Icon
                name={flashMode === RNCamera.Constants.FlashMode.off ? "flash-off" : "flash-on"}
                size={24}
                color="white"
              />
            </TouchableOpacity>
          </View>

          {/* Scanning Area */}
          <View style={styles.scanningArea}>
            <View style={styles.scanFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
          </View>

          {/* Instructions */}
          <View style={styles.instructions}>
            <Text style={styles.instructionText}>Coloca el código de barras dentro del marco</Text>
            <Text style={styles.instructionSubtext}>El escaneo se realizará automáticamente</Text>
          </View>

          {/* Manual Entry Button */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.manualButton} onPress={() => navigation.navigate("AddItem" as never)}>
              <Icon name="keyboard" size={20} color="white" />
              <Text style={styles.manualButtonText}>Introducir Manualmente</Text>
            </TouchableOpacity>
          </View>
        </View>
      </RNCamera>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  scanningArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scanFrame: {
    width: width * 0.7,
    height: width * 0.7 * 0.6, // Proporción típica de código de barras
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: "#3b82f6",
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  instructions: {
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 30,
  },
  instructionText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  instructionSubtext: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    textAlign: "center",
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  manualButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(59, 130, 246, 0.8)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  manualButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default BarcodeScanner
