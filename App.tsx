import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import { Provider } from "react-redux";
import { store } from "./src/store/store";

// Fuentes (lo que ya tenías)
import {
  useFonts as useDMSerifDisplay,
  DMSerifDisplay_400Regular,
} from "@expo-google-fonts/dm-serif-display";
import {
  useFonts as useLora,
  Lora_400Regular,
  Lora_700Bold,
} from "@expo-google-fonts/lora";
import { View, ActivityIndicator } from "react-native";

import PersistCart from "./src/store/PersistCart";
import AuthListener from "./src/store/AuthListener"; // 👈 NUEVO

export default function App() {
  const [loadedDisplay] = useDMSerifDisplay({ DMSerifDisplay_400Regular });
  const [loadedLora] = useLora({ Lora_400Regular, Lora_700Bold });

  if (!loadedDisplay || !loadedLora) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <PersistCart />
        <AuthListener /> {/* 👈 NUEVO */}
        <AppNavigator />
      </NavigationContainer>
    </Provider>
  );
}
