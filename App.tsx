import React from "react";
import { Provider } from "react-redux";
import { store } from "./src/store/store";
import { View, ActivityIndicator } from "react-native";

import AppNavigator from "./src/navigation/AppNavigator";
import PersistCart from "./src/store/PersistCart";
import AuthListener from "./src/store/AuthListener";
import LoadUserLocation from "./src/store/LoadUserLocation";

// Fuentes
import {
  useFonts as useDMSerifDisplay,
  DMSerifDisplay_400Regular,
} from "@expo-google-fonts/dm-serif-display";
import {
  useFonts as useLora,
  Lora_400Regular,
  Lora_700Bold,
} from "@expo-google-fonts/lora";

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
      {/* Persistencia del carrito en SQLite */}
      <PersistCart />
      {/* Sincroniza estado de Auth (firebase) con Redux */}
      <AuthListener />
      {/* Hidrata ubicación guardada en Firebase al loguear */}
      <LoadUserLocation />
      {/* Navegación (ya incluye NavigationContainer adentro) */}
      <AppNavigator />
    </Provider>
  );
}
