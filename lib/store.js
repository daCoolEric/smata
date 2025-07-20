import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";

export const makeStore = () =>
  configureStore({
    reducer: {
      // Add your reducers here
    },
    devTools: process.env.NODE_ENV !== "production",
  });

export const wrapper = createWrapper(makeStore);
