import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import CategoryListScreen from "../screens/CategoryListScreen";
import { CATEGORIES } from "../features/products/mock";
import { COLORS } from "../theme/colors";

const Tab = createMaterialTopTabNavigator();

export default function CategoryTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarScrollEnabled: true,
        tabBarActiveTintColor: COLORS.naranja,
        tabBarInactiveTintColor: "#444",
        tabBarStyle: { backgroundColor: "#fff" },
        tabBarIndicatorStyle: { backgroundColor: COLORS.naranja, height: 3, borderRadius: 3 },
        tabBarLabelStyle: { fontFamily: "Lora_700Bold", textTransform: "none" },
      }}
    >
      {CATEGORIES.map((cat) => (
        <Tab.Screen
          key={cat}
          name={cat}
          options={{ title: cat }}
          children={() => <CategoryListScreen category={cat} />}
        />
      ))}
    </Tab.Navigator>
  );
}
