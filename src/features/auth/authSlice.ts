import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type User = { uid: string; email: string | null } | null;

type AuthState = {
  user: User;
  status: "idle" | "loading" | "authenticated" | "error";
  error?: string;
};

const initialState: AuthState = { user: null, status: "idle" };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.status = action.payload ? "authenticated" : "idle";
    },
    setLoading: (state) => {
      state.status = "loading";
    },
    setError: (state, action: PayloadAction<string>) => {
      state.status = "error";
      state.error = action.payload;
    },
    signOut: (state) => {
      state.user = null;
      state.status = "idle";
    },
  },
});

export const { setUser, setLoading, setError, signOut } = authSlice.actions;
export default authSlice.reducer;
