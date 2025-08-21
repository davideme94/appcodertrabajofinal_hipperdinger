import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";
import { useAppDispatch } from "./hooks";
import { setUser } from "../features/auth/authSlice";

export default function AuthListener() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      dispatch(setUser(u ? { uid: u.uid, email: u.email } : null));
      // ⚠️ Nada de navigation aquí
    });
    return unsub;
  }, [dispatch]);

  return null;
}
