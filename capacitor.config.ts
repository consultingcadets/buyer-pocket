import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.buyerpocket.app",
  appName: "BuyerPocket",
  webDir: "out",
  server: {
    url: "https://buyerpocket.com.au",
    cleartext: false,
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: "#0F1C2C",
      androidSplashResourceName: "splash",
      showSpinner: false,
    },
    StatusBar: {
      style: "LIGHT",
      backgroundColor: "#0F1C2C",
    },
  },
};

export default config;
