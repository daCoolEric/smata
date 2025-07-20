// features/focus/focusSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 40, // Current focus level (0-100)
  isLoading: false,
  lastMeditation: null,
  error: null,
};

const focusSlice = createSlice({
  name: "focus",
  initialState,
  reducers: {
    setFocusLoading(state, action) {
      state.isLoading = action.payload;
    },
    setFocus(state, action) {
      state.value = Math.min(Math.max(action.payload, 0), 100);
    },
    meditate(state, action) {
      state.value = Math.min(state.value + (action.payload || 15), 100);
      state.lastMeditation = new Date().toISOString();
    },
    loseFocus(state, action) {
      state.value = Math.max(state.value - (action.payload || 8), 0);
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setFocusLoading, setFocus, meditate, loseFocus, setError } =
  focusSlice.actions;

export default focusSlice.reducer;
