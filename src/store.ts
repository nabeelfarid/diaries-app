import { configureStore } from "@reduxjs/toolkit";
import diariesAppSlice from "./diariesSlice";
let store = configureStore({
  reducer: {
    diariesApp: diariesAppSlice.reducer,
  },
});

export default store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {diariesApp: DiariesAppState}
export type AppDispatch = typeof store.dispatch;
