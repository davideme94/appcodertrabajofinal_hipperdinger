import React, { useMemo } from "react";
import { View, Text, FlatList, Pressable, StyleSheet, Image } from "react-native";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { clearCart, removeItem, selectCartItems, selectCartTotal } from "../features/cart/cartSlice";
import { COLORS } from "../theme/colors";
import { PRODUCTS } from "../features/products/mock";
import type { Product } from "../features/products/types";

export default function CartScreen() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);

  // Mapeamos id -> producto para lookup O(1)
  const productMap = useMemo<Record<string, Product>>(
    () => PRODUCTS.reduce((acc, p) => ((acc[p.id] = p), acc), {} as Record<string, Product>),
    []
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={items}
        keyExtractor={(it) => it.id}
        ListEmptyComponent={<Text style={styles.empty}>Carrito vacío</Text>}
        renderItem={({ item }) => {
          const prod = productMap[item.id];
          const uri = prod?.image;
          return (
            <View style={styles.row}>
              {uri ? (
                <Image source={{ uri }} style={styles.thumb} resizeMode="cover" />
              ) : (
                <View style={[styles.thumb, styles.thumbPlaceholder]} />
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.sub}>x{item.qty} · ${item.price * item.qty}</Text>
              </View>
              <Pressable onPress={() => dispatch(removeItem({ id: item.id }))}>
                <Text style={styles.remove}>−</Text>
              </Pressable>
            </View>
          );
        }}
        ListFooterComponent={
          <View style={{ marginTop: 16 }}>
            <Text style={styles.total}>Total: ${total}</Text>
            <Pressable
              onPress={() => dispatch(clearCart())}
              style={({ pressed }) => [styles.clearBtn, pressed && { opacity: 0.9 }]}
            >
              <Text style={styles.clearTxt}>Vaciar carrito</Text>
            </Pressable>
          </View>
        }
      />
    </View>
  );
}

const THUMB = 56;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 12,
  },
  thumb: {
    width: THUMB,
    height: THUMB,
    borderRadius: 10,
    backgroundColor: "#eee",
  },
  thumbPlaceholder: {
    borderWidth: 1,
    borderColor: "#00000010",
  },
  title: { fontFamily: "Lora_700Bold", fontSize: 14, color: COLORS.rojo },
  sub: { fontFamily: "Lora_400Regular", fontSize: 13, color: "#444", marginTop: 2 },
  remove: { marginLeft: 12, color: COLORS.rojo, fontSize: 22, fontWeight: "800", paddingHorizontal: 8 },
  total: { fontFamily: "Lora_700Bold", fontSize: 16 },
  clearBtn: { marginTop: 8, backgroundColor: COLORS.rojo, padding: 12, borderRadius: 10, alignItems: "center" },
  clearTxt: { color: "#fff", fontWeight: "700" },
  empty: { textAlign: "center", marginTop: 24, fontFamily: "Lora_400Regular" },
});
