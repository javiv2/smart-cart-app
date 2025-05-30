#!/bin/bash

# Script de configuración para Smart Budget Mobile App

echo "🚀 Configurando Smart Budget Mobile App..."

# Verificar que Node.js esté instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js v16 o superior."
    exit 1
fi

# Verificar versión de Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt "16" ]; then
    echo "❌ Se requiere Node.js v16 o superior. Versión actual: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detectado"

# Verificar que React Native CLI esté instalado
if ! command -v react-native &> /dev/null; then
    echo "📦 Instalando React Native CLI..."
    npm install -g @react-native-community/cli
fi

echo "✅ React Native CLI listo"

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Configuración para iOS
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 Configurando para iOS..."
    
    # Verificar Xcode
    if ! command -v xcodebuild &> /dev/null; then
        echo "⚠️  Xcode no está instalado. Descárgalo desde el App Store para desarrollo iOS."
    else
        echo "✅ Xcode detectado"
        
        # Instalar pods
        if command -v pod &> /dev/null; then
            echo "📦 Instalando CocoaPods..."
            cd ios && pod install && cd ..
            echo "✅ CocoaPods configurado"
        else
            echo "⚠️  CocoaPods no está instalado. Instálalo con: sudo gem install cocoapods"
        fi
    fi
fi

# Configuración para Android
echo "🤖 Configurando para Android..."

# Verificar Android SDK
if [ -z "$ANDROID_HOME" ]; then
    echo "⚠️  ANDROID_HOME no está configurado."
    echo "Configura las siguientes variables de entorno:"
    echo "export ANDROID_HOME=\$HOME/Library/Android/sdk  # macOS"
    echo "export ANDROID_HOME=\$HOME/Android/Sdk          # Linux"
    echo "export PATH=\$PATH:\$ANDROID_HOME/emulator"
    echo "export PATH=\$PATH:\$ANDROID_HOME/tools"
    echo "export PATH=\$PATH:\$ANDROID_HOME/tools/bin"
    echo "export PATH=\$PATH:\$ANDROID_HOME/platform-tools"
else
    echo "✅ ANDROID_HOME configurado: $ANDROID_HOME"
fi

# Verificar Java
if ! command -v java &> /dev/null; then
    echo "⚠️  Java no está instalado. Se requiere Java 11 para Android."
else
    JAVA_VERSION=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2 | cut -d'.' -f1)
    if [ "$JAVA_VERSION" -ge "11" ]; then
        echo "✅ Java $JAVA_VERSION detectado"
    else
        echo "⚠️  Se requiere Java 11 o superior. Versión actual: $JAVA_VERSION"
    fi
fi

# Crear archivos de configuración
echo "📝 Creando archivos de configuración..."

# Crear .env para configuración
cat > .env << EOL
# Configuración de la aplicación
API_BASE_URL=https://api.smartbudget.cl
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
SENTRY_DSN=your_sentry_dsn_here

# Configuración de desarrollo
DEV_MODE=true
DEBUG_LOGS=true

# Configuración de notificaciones
FCM_SENDER_ID=your_fcm_sender_id_here
EOL

# Crear estructura de directorios adicionales
mkdir -p src/assets/images
mkdir -p src/assets/fonts
mkdir -p src/utils
mkdir -p src/hooks
mkdir -p android/app/src/main/res/drawable
mkdir -p ios/SmartBudgetMobile/Images.xcassets

echo "📱 Creando iconos y splash screens..."

# Placeholder para iconos (deberían ser reemplazados por iconos reales)
echo "⚠️  Recuerda agregar los iconos de la app en:"
echo "   - android/app/src/main/res/mipmap-*/ic_launcher.png"
echo "   - ios/SmartBudgetMobile/Images.xcassets/AppIcon.appiconset/"

echo "🎨 Configurando tema y assets..."

# Crear archivo de constantes
cat > src/constants/index.ts << EOL
export const COLORS = {
  primary: '#2563eb',
  secondary: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  background: '#f8fafc',
  surface: '#ffffff',
  text: '#1f2937',
  textSecondary: '#6b7280',
  border: '#e5e7eb',
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
};

export const SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const SUPERMARKETS = [
  { id: 'jumbo', name: 'Jumbo', color: '#00a651', logo: '🟢' },
  { id: 'lider', name: 'Líder', color: '#0066cc', logo: '🔵' },
  { id: 'santaisabel', name: 'Santa Isabel', color: '#e31837', logo: '🔴' },
  { id: 'unimarc', name: 'Unimarc', color: '#ff6600', logo: '🟠' },
  { id: 'tottus', name: 'Tottus', color: '#9900cc', logo: '🟣' },
];

export const CATEGORIES = [
  'Lácteos',
  'Panadería',
  'Despensa',
  'Carnes',
  'Verduras',
  'Frutas',
  'Congelados',
  'Bebidas',
  'Limpieza',
  'Higiene',
  'Otros',
];
EOL

echo "✅ Configuración completada!"
echo ""
echo "🚀 Para ejecutar la aplicación:"
echo ""
echo "iOS:"
echo "  npm run ios"
echo "  # o"
echo "  react-native run-ios"
echo ""
echo "Android:"
echo "  npm run android"
echo "  # o"
echo "  react-native run-android"
echo ""
echo "Metro Bundler:"
echo "  npm start"
echo ""
echo "📝 Tareas pendientes:"
echo "  1. Configurar API_BASE_URL en .env"
echo "  2. Agregar Google Maps API Key"
echo "  3. Configurar iconos de la aplicación"
echo "  4. Configurar Firebase/FCM para notificaciones"
echo "  5. Configurar Sentry para monitoreo de errores"
echo ""
echo "🎉 ¡Smart Budget Mobile está listo para desarrollo!"
