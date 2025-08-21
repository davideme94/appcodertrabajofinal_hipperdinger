import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../theme/colors";
import CategoryTabs from "../navigation/CategoryTabs";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Título dentro de la pantalla: ahora 'Productos' */}
      <Text style={styles.h1}>Productos</Text>

      {/* Tabs por categoría */}
      <CategoryTabs />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  h1: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    fontSize: 24,
    color: COLORS.rojo,
    fontFamily: "DMSerifDisplay_400Regular",
  },
});
