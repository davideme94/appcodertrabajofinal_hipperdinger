import React, { useMemo } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { PRODUCTS } from "../features/products/mock";
import ProductCard from "../components/ProductCard";

type Props = { route: { params: { category: string } } };

export default function CategoryListScreen({ route }: Props) {
  const { category } = route.params;

  const filtered = useMemo(
    () =>
      category === "Ofertas"
        ? PRODUCTS.filter((p) => p.offer)
        : PRODUCTS.filter((p) => p.category === category),
    [category]
  );

  return (
    <View style={styles.wrap}>
      <FlatList
        data={filtered}
        keyExtractor={(it) => it.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ padding: 12, gap: 12 }}
        renderItem={({ item }) => <ProductCard product={item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: "#f7f7f7" },
});
