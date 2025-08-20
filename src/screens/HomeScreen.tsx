import React from "react";
import { View, FlatList, StyleSheet, ListRenderItem } from "react-native";
import ProductCard from "../components/ProductCard";
import { useNavigation } from "@react-navigation/native";
import { HomeStackParamList } from "../navigation/HomeStack";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { PRODUCTS } from "../features/products/mock";
import { Product } from "../features/products/types";
import { COLORS } from "../theme/colors";

type Nav = NativeStackNavigationProp<HomeStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();

  const renderItem: ListRenderItem<Product> = ({ item }) => (
    <ProductCard product={item} onPress={() => navigation.navigate("ProductDetail", { product: item })} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={PRODUCTS}
        keyExtractor={(it) => it.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ padding: 12, gap: 12 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.crema + "33" },
});
