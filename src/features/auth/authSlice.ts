import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type FirebaseUser = {
  uid: string;
  email: string | null;
  displayName?: string | null;
  photoURL?: string | null;
};

type AuthState = {
  user: FirebaseUser | null;
};

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<FirebaseUser | null>) {
      state.user = action.payload;
    },
    signOutLocal(state) {
      state.user = null;
    },
  },
});

export const { setUser, signOutLocal } = authSlice.actions;
export default authSlice.reducer;
