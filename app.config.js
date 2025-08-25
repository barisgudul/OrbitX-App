// app.config.js

export default {
  expo: {
    name: "OrbitX",
    slug: "OrbitX",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "orbitx",
    userInterfaceStyle: "dark", // Uygulamanın her zaman koyu temada başlamasını sağlar
    
    ios: {
      supportsTablet: true,
      userInterfaceStyle: "dark",
    },
    
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#010409", // Splash screen rengiyle uyumlu
      },
      userInterfaceStyle: "dark",
    },
    
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    
    plugins: [
      "expo-router",
    ],
    
    experiments: {
      "typedRoutes": true
    },
    
    // UYGULAMA İÇİNDEN ERİŞİLECEK EKSTRA VERİLER BURADA
    extra: {
      exchangeRateApiKey: "58961ef4c2897c3b9cbfe3ca",
      newsApiKey:"e526d52091c04c2287907041a25f5d0f"
    }
  }
};