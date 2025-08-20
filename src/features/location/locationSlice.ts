import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Coords = { lat: number; lng: number } | null;

export type LocationState = {
  coords: Coords;
  address?: string | null;
};

const initialState: LocationState = { coords: null, address: null };

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocation(state, action: PayloadAction<{ coords: Coords; address?: string | null }>) {
      state.coords = action.payload.coords;
      state.address = action.payload.address ?? null;
    },
    clearLocation(state) {
      state.coords = null;
      state.address = null;
    },
  },
});

export const { setLocation, clearLocation } = locationSlice.actions;
export default locationSlice.reducer;
