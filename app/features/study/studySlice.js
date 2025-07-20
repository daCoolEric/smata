// features/study/studySlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 65, // Study concentration level (0-100)
  activeSession: false, // Is a session currently running?
  elapsedTime: 0, // Seconds spent in current session
  completedSessions: 0, // Total sessions today
  isLoading: false,
  error: null,
};

const studySlice = createSlice({
  name: "study",
  initialState,
  reducers: {
    setStudyLoading(state, action) {
      state.isLoading = action.payload;
    },
    startSession(state) {
      state.activeSession = true;
      state.elapsedTime = 0;
    },
    stopSession(state) {
      state.activeSession = false;
      state.completedSessions += 1;
      state.value = Math.max(state.value - 10, 0); // Drain after session
    },
    updateElapsedTime(state) {
      state.elapsedTime += 1;
      // Every minute, lose 1 focus point
      if (state.elapsedTime % 60 === 0) {
        state.value = Math.max(state.value - 1, 0);
      }
    },
    boostConcentration(state, action) {
      state.value = Math.min(state.value + (action.payload || 20), 100);
    },
    resetDailySessions(state) {
      state.completedSessions = 0;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const {
  setStudyLoading,
  startSession,
  stopSession,
  updateElapsedTime,
  boostConcentration,
  resetDailySessions,
  setError,
} = studySlice.actions;

export default studySlice.reducer;
