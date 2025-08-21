import React, { useMemo } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import ProductCard, { Product } from "../components/ProductCard";
import { useRoute, RouteProp } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";
import { COLORS } from "../theme/colors";
import { PRODUCTS } from "../features/products/mock";

type ParamList = {
  CategoryList: { category: string };
};

export default function CategoryListScreen() {
  const route = useRoute<RouteProp<ParamList, "CategoryList">>();
  const category = route.params?.category ?? "all";
  const dispatch = useDispatch();

  const data: Product[] = useMemo(() => {
    if (category === "all") return PRODUCTS as Product[];
    return (PRODUCTS as Product[]).filter((p: any) => p.category === category);
  }, [category]);

  const handleAdd = (p: Product) => {
    dispatch(
      addToCart({
        id: p.id,
        title: p.title,
        price: p.price,
        qty: 1,
        image: p.image,
      })
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 12 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => (
          <ProductCard product={item} onAdd={handleAdd} />
        )}
      />
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
