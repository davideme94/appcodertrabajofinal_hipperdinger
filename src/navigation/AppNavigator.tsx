import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "../screens/WelcomeScreen";
import MainTabs from "./MainTabs";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import CategoryListScreen from "../screens/CategoryListScreen";
import { COLORS } from "../theme/colors";

export type RootStackParamList = {
  Welcome: undefined;
  MainTabs: undefined;
  ProductDetail: { product: any };
  CategoryList: { category: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: "#fff" },
};

export default function AppNavigator() {
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        // 👇 Asegura que SIEMPRE arranque en la pantalla de Bienvenida
        initialRouteName="Welcome"
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.crema },
          headerShadowVisible: false,
          headerTintColor: COLORS.rojo,
          headerTitleStyle: {
            color: COLORS.rojo,
            fontFamily: "DMSerifDisplay_400Regular",
          },
        }}
      >
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetailScreen}
          options={{ title: "Detalle" }}
        />
        <Stack.Screen
          name="CategoryList"
          component={CategoryListScreen}
          options={({ route }) => ({ title: route.params.category })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
