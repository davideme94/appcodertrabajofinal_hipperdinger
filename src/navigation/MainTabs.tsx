import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import CartScreen from "../screens/CartScreen";
import ProfileScreen from "../screens/ProfileScreen";
import HomeStack from "./HomeStack"; // 👈 usamos el Stack, no HomeScreen
import { COLORS } from "../theme/colors";
import { useAppSelector } from "../store/hooks";
import { selectCartCount } from "../features/cart/cartSlice";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  const count = useAppSelector(selectCartCount);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: COLORS.crema },
        headerTitleStyle: { fontWeight: "800", color: COLORS.rojo },
        tabBarActiveTintColor: COLORS.naranja,
        tabBarInactiveTintColor: "#666",
        tabBarStyle: { backgroundColor: "#fff" },
        tabBarIcon: ({ focused, color, size }) => {
          const map: Record<string, any> = {
            Home: focused ? "home" : "home-outline",
            Cart: focused ? "cart" : "cart-outline",
            Profile: focused ? "person" : "person-outline",
          };
          return <Ionicons name={map[route.name]} size={size} color={color} />;
        },
      })}
    >
      {/* 👇 Ocultamos el header del Tab para no duplicar el de HomeStack */}
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ headerShown: false, title: "Inicio" }}
      />

      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: "Carrito",
          tabBarBadge: count > 0 ? count : undefined,
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Perfil" }}
      />
    </Tab.Navigator>
  );
}
