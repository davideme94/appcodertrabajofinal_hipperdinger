import React from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { COLORS } from "../theme/colors";
import type { Product } from "../features/products/types";
import { useAppDispatch } from "../store/hooks";
import { addItem } from "../features/cart/cartSlice";
import { useNavigation } from "@react-navigation/native";

type Props = { product: Product };

export default function ProductCard({ product }: Props) {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() =>
        navigation.navigate("ProductDetail" as never, { product } as never)
      }
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.95 }]}
    >
      <Image source={{ uri: product.image }} style={styles.img} />
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>
          {product.title}
        </Text>

        {/* 👇 Todo el contenido textual va dentro de <Text> */}
        <Text style={styles.price}>
          ${product.price}
        </Text>

        <Pressable
          onPress={() =>
            dispatch(addItem({ id: product.id, title: product.title, price: product.price, qty: 1 }))
          }
          style={({ pressed }) => [styles.btn, pressed && { opacity: 0.9 }]}
        >
          <Text style={styles.btnTxt}>Agregar</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#00000010",
  },
  img: { width: "100%", height: 120 },
  body: { padding: 12, gap: 6 },
  title: { fontFamily: "Lora_700Bold", color: COLORS.rojo, fontSize: 14 },
  price: { fontFamily: "Lora_400Regular", fontSize: 14 },
  btn: {
    marginTop: 4,
    backgroundColor: COLORS.naranja,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  btnTxt: { color: "#fff", fontFamily: "Lora_700Bold" },
});
