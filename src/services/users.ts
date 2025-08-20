// src/services/users.ts
import { db } from "./firebase";
import { ref as dbRef, set, update, onValue, off } from "firebase/database";
import type { Coords } from "../features/location/locationSlice";

// Para avatar base64 (sin Storage)
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";

// ---------- Ubicación ----------
export async function saveUserLocation(uid: string, coords: Coords, address?: string | null) {
  if (!uid || !coords) throw new Error("Faltan datos");
  await set(dbRef(db, `users/${uid}/location`), {
    lat: coords.lat,
    lng: coords.lng,
    address: address ?? null,
    updatedAt: Date.now(),
  });
}

// ---------- Perfil (datos básicos) ----------
export type UserProfile = {
  displayName?: string;
  phone?: string;
  avatarUrl?: string | null;     // por si más adelante usás Storage
  avatarBase64?: string | null;  // data URI base64 (FREE)
};

export async function saveUserProfile(uid: string, data: UserProfile) {
  if (!uid) throw new Error("UID requerido");
  await update(dbRef(db, `users/${uid}/profile`), data);
}

export function subscribeUserProfile(uid: string, cb: (p: UserProfile | null) => void) {
  const r = dbRef(db, `users/${uid}/profile`);
  const handler = (snap: any) => cb((snap.val() as UserProfile) ?? null);
  onValue(r, handler);
  return () => off(r, "value", handler);
}

// ---------- Avatar base64 (FREE) ----------
/** Toma un file:// local, lo redimensiona y guarda como data URI base64 en la DB */
export async function uploadUserAvatarBase64(uid: string, localUri: string) {
  if (!uid || !localUri) throw new Error("Faltan datos");
  // 1) Redimensionar a ~256px, comprimir JPEG
  const manip = await ImageManipulator.manipulateAsync(
    localUri,
    [{ resize: { width: 256 } }],
    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
  );
  // 2) Leer como base64
  const b64 = await FileSystem.readAsStringAsync(manip.uri, { encoding: FileSystem.EncodingType.Base64 });
  const dataUri = `data:image/jpeg;base64,${b64}`;
  // 3) Guardar en perfil
  await saveUserProfile(uid, { avatarBase64: dataUri });
  return dataUri;
}
