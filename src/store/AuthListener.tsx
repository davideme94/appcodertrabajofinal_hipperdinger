import React, { useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../services/firebase";
import { useAppDispatch } from "./hooks";
import { setUser } from "../features/auth/authSlice";

/** Mantiene Redux sincronizado con Firebase Auth */
export default function AuthListener() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fbUser: User | null) => {
      if (fbUser) {
        dispatch(setUser({ uid: fbUser.uid, email: fbUser.email }));
      } else {
        dispatch(setUser(null));
      }
    });
    return () => unsub();
  }, [dispatch]);

  return null;
}
