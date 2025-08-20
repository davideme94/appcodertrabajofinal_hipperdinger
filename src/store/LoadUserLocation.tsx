import React, { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../services/firebase";
import { ref, get } from "firebase/database";
import { useAppDispatch } from "./hooks";
import { setLocation, clearLocation } from "../features/location/locationSlice";

export default function LoadUserLocation() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        dispatch(clearLocation());
        return;
      }
      try {
        const snap = await get(ref(db, `users/${user.uid}/location`));
        const v = snap.val();
        if (v && typeof v.lat === "number" && typeof v.lng === "number") {
          dispatch(
            setLocation({
              coords: { lat: v.lat, lng: v.lng },
              address: v.address ?? null,
            })
          );
        } else {
          dispatch(clearLocation());
        }
      } catch {
        // silencio: no bloquear el inicio si no hay datos
      }
    });
    return unsub;
  }, [dispatch]);

  return null;
}
