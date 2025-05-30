import PushNotification from "react-native-push-notification"
import { Platform } from "react-native"

export interface NotificationData {
  title: string
  message: string
  data?: any
  scheduled?: Date
}

export const initializeNotifications = async (): Promise<void> => {
  return new Promise((resolve) => {
    PushNotification.configure({
      onRegister: (token) => {
        console.log("TOKEN:", token)
      },
      onNotification: (notification) => {
        console.log("NOTIFICATION:", notification)

        // Handle notification actions
        if (notification.userInteraction) {
          // Usuario tocó la notificación
          handleNotificationClick(notification.data)
        }
      },
      onAction: (notification) => {
        console.log("ACTION:", notification.action)
      },
      onRegistrationError: (err) => {
        console.error(err.message, err)
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: Platform.OS === "ios",
    })

    // Crear canal de notificaciones para Android
    if (Platform.OS === "android") {
      PushNotification.createChannel(
        {
          channelId: "smart-budget-channel",
          channelName: "Smart Budget Notifications",
          channelDescription: "Notificaciones de la app Smart Budget",
          playSound: true,
          soundName: "default",
          importance: 4,
          vibrate: true,
        },
        (created) => {
          console.log(`Canal creado: ${created}`)
          resolve()
        },
      )
    } else {
      resolve()
    }
  })
}

const handleNotificationClick = (data: any) => {
  // Manejar diferentes tipos de notificaciones
  switch (data?.type) {
    case "price_alert":
      // Navegar a comparación de precios
      break
    case "budget_warning":
      // Navegar a reportes de presupuesto
      break
    case "shopping_reminder":
      // Navegar a lista de compras
      break
    default:
      // Acción por defecto
      break
  }
}

export const sendLocalNotification = (notification: NotificationData): void => {
  PushNotification.localNotification({
    channelId: "smart-budget-channel",
    title: notification.title,
    message: notification.message,
    userInfo: notification.data,
    playSound: true,
    soundName: "default",
    actions: ["OK"],
  })
}

export const scheduleNotification = (notification: NotificationData): void => {
  if (!notification.scheduled) {
    throw new Error("Se requiere fecha para notificación programada")
  }

  PushNotification.localNotificationSchedule({
    channelId: "smart-budget-channel",
    title: notification.title,
    message: notification.message,
    date: notification.scheduled,
    userInfo: notification.data,
    playSound: true,
    soundName: "default",
    actions: ["OK"],
  })
}

export const cancelAllNotifications = (): void => {
  PushNotification.cancelAllLocalNotifications()
}

export const cancelNotification = (id: string): void => {
  PushNotification.cancelLocalNotifications({ id })
}

// Notificaciones predefinidas para la app
export const NotificationTemplates = {
  budgetWarning: (percentage: number) => ({
    title: "⚠️ Alerta de Presupuesto",
    message: `Has usado el ${percentage}% de tu presupuesto semanal`,
    data: { type: "budget_warning", percentage },
  }),

  priceAlert: (productName: string, oldPrice: number, newPrice: number, store: string) => ({
    title: "💰 Bajó el precio",
    message: `${productName} ahora cuesta $${newPrice.toLocaleString("es-CL")} en ${store}`,
    data: {
      type: "price_alert",
      product: productName,
      oldPrice,
      newPrice,
      store,
    },
  }),

  shoppingReminder: (listName: string, itemCount: number) => ({
    title: "🛒 Recordatorio de compras",
    message: `Tienes ${itemCount} productos en "${listName}"`,
    data: { type: "shopping_reminder", listName, itemCount },
  }),

  budgetExceeded: (exceededAmount: number) => ({
    title: "🚨 Presupuesto Excedido",
    message: `Has superado tu presupuesto por $${exceededAmount.toLocaleString("es-CL")}`,
    data: { type: "budget_exceeded", exceededAmount },
  }),
}
