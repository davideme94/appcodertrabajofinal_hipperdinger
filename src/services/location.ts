import * as Location from "expo-location";

export async function getCurrentLocation() {
  // 1) Permiso
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    throw new Error("Permiso de ubicación denegado");
  }

  // 2) Coordenadas
  const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
  const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };

  // 3) Dirección (best-effort)
  let address: string | null = null;
  try {
    const rev = await Location.reverseGeocodeAsync({ latitude: coords.lat, longitude: coords.lng });
    const a = rev?.[0];
    if (a) {
      address = [a.street, a.name, a.city, a.region].filter(Boolean).join(" · ");
    }
  } catch {
    // ignoramos si falla el reverse
  }

  return { coords, address };
}
