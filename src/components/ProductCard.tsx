import React from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { Product } from "../features/products/types";
import { COLORS } from "../theme/colors";

type Props = {
  product: Product;
  onPress: () => void;
};

export default function ProductCard({ product, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && { opacity: 0.9 }]}>
      <Image source={{ uri: product.image }} style={styles.img} />
      <View style={styles.info}>
        <Text numberOfLines={1} style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>${product.price}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
    backgroundColor: "#fff",
    borderRadius: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  img: { width: "100%", height: 130 },
  info: { padding: 10, gap: 4 },
  title: { fontFamily: "Lora_700Bold", fontSize: 14, color: COLORS.rojo },
  price: { fontFamily: "Lora_400Regular", fontSize: 13, color: "#333" },
});
