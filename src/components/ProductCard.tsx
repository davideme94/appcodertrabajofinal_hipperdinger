import React from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { COLORS } from "../theme/colors";

export type Product = {
  id: string;
  title: string;
  price: number;
  image?: any; // string (url) o require(...)
  // si tenés category u otros campos, no pasa nada
};

type Props = {
  product: Product;
  onAdd?: (p: Product) => void; // 👈 ahora opcional
};

export default function ProductCard({ product, onAdd }: Props) {
  const source =
    typeof product.image === "string"
      ? { uri: product.image }
      : product.image || undefined;

  return (
    <View style={styles.card}>
      <View style={styles.imgBox}>
        {source ? (
          <Image source={source} style={styles.img} resizeMode="contain" />
        ) : (
          <View style={[styles.img, styles.imgFallback]}>
            <Text>Sin imagen</Text>
          </View>
        )}
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {product.title}
      </Text>
      <Text style={styles.price}>${product.price}</Text>

      <Pressable
        onPress={() => onAdd?.(product)} // 👈 si no viene, no hace nada
        style={({ pressed }) => [styles.btn, pressed && { opacity: 0.9 }]}
      >
        <Text style={styles.btnTxt}>Agregar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff", borderRadius: 16, padding: 12,
    borderWidth: 1, borderColor: "#00000010",
  },
  imgBox: {
    height: 160, width: "100%",
    borderRadius: 12, overflow: "hidden", backgroundColor: "#fff",
    marginBottom: 8,
  },
  img: { width: "100%", height: "100%" },
  imgFallback: { alignItems: "center", justifyContent: "center", backgroundColor: "#f6f6f6" },
  title: { fontFamily: "Lora_700Bold", fontSize: 16, color: COLORS.rojo, marginTop: 4 },
  price: { fontFamily: "Lora_400Regular", fontSize: 16, marginVertical: 8 },
  btn: { backgroundColor: COLORS.naranja, paddingVertical: 12, borderRadius: 12, alignItems: "center" },
  btnTxt: { color: "#fff", fontFamily: "Lora_700Bold" },
});
