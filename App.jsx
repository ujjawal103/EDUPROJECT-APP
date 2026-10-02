import "./global.css";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { axiosInstance } from "./src/api/axios";
import RootNavigator from "./src/navigation/RootNavigator";
import { setupAxiosInterceptors } from "./src/api/axios.interceptor";

// Initialize Axios interceptors exactly once at module load to prevent duplicate interceptors
setupAxiosInterceptors();

const App = () => {
  useEffect(() => {
    const test = async () => {
      try {
        const res = await axiosInstance.get("/health");
        console.log("Health check status:", res.data);
      } catch (error) {
        console.log("Health check error:", error.response?.data || error.message);
      }
    };

    test();
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <RootNavigator />
        <Toast />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
