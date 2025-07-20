// features/energy/energySlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 80, // Current energy level (0-100)
  isLoading: false,
  lastRefill: null, // Timestamp of last refill
  error: null,
};

const energySlice = createSlice({
  name: "energy",
  initialState,
  reducers: {
    setEnergyLoading(state, action) {
      state.isLoading = action.payload;
    },
    setEnergy(state, action) {
      state.value = Math.min(Math.max(action.payload, 0), 100); // Clamp between 0-100
    },
    refillEnergy(state, action) {
      state.value = Math.min(state.value + (action.payload || 10), 100);
      state.lastRefill = new Date().toISOString();
    },
    drainEnergy(state, action) {
      state.value = Math.max(state.value - (action.payload || 5), 0);
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const {
  setEnergyLoading,
  setEnergy,
  refillEnergy,
  drainEnergy,
  setError,
} = energySlice.actions;

export default energySlice.reducer;
