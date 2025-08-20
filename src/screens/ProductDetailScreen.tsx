import React from "react";
import { View, Text, Image, StyleSheet, Pressable, ScrollView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../navigation/HomeStack";
import { COLORS } from "../theme/colors";
import { useAppDispatch } from "../store/hooks";
import { addItem } from "../features/cart/cartSlice";

type Props = NativeStackScreenProps<HomeStackParamList, "ProductDetail">;

export default function ProductDetailScreen({ route }: Props) {
  const { product } = route.params;
  const dispatch = useAppDispatch();

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Image source={{ uri: product.image }} style={styles.img} />
      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.price}>${product.price}</Text>
      <Text style={styles.desc}>{product.description}</Text>

      <Pressable
        onPress={() => dispatch(addItem({ id: product.id, title: product.title, price: product.price }))}
        style={({ pressed }) => [styles.btn, pressed && { opacity: 0.9 }]}
      >
        <Text style={styles.btnText}>Agregar al carrito</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  img: { width: "100%", height: 240, borderRadius: 16, marginBottom: 12 },
  title: { fontFamily: "DMSerifDisplay_400Regular", fontSize: 24, color: COLORS.rojo },
  price: { fontFamily: "Lora_700Bold", fontSize: 18, marginTop: 4 },
  desc: { fontFamily: "Lora_400Regular", fontSize: 14, marginVertical: 12, lineHeight: 20 },
  btn: { backgroundColor: COLORS.naranja, padding: 14, borderRadius: 12, alignItems: "center" },
  btnText: { color: "#fff", fontFamily: "Lora_700Bold", fontSize: 16 },
});
