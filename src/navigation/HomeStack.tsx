import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import { Product } from "../features/products/types";
import { COLORS } from "../theme/colors";
import CategoryTabs from "./CategoryTabs";

export type HomeStackParamList = {
  HomeList: undefined;                    // ahora renderiza las Top Tabs
  ProductDetail: { product: Product };
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.crema },
        headerTitleStyle: { fontFamily: "DMSerifDisplay_400Regular", color: COLORS.rojo },
      }}
    >
      <Stack.Screen name="HomeList" component={CategoryTabs} options={{ title: "Inicio" }} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: "Detalle" }} />
    </Stack.Navigator>
  );
}
