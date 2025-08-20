import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { PRODUCTS } from "../features/products/mock";
import ProductCard from "../components/ProductCard";

export default function HomeScreen() {
  return (
    <View style={styles.wrap}>
      <FlatList
        data={PRODUCTS}
        keyExtractor={(it) => it.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ padding: 12, gap: 12 }}
        renderItem={({ item }) => <ProductCard product={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: "#f7f7f7" },
});
