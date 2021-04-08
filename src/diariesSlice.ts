import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";

// Type for the slice state
interface DiariesAppState {
  isAuthenticated: boolean;
  token: string | null;
}

// Initial state using the above type
const initialState: DiariesAppState = {
  isAuthenticated: false,
  token: null,
};

// `createSlice` will infer the state type from the `initialState` argument
const diariesAppSlice = createSlice({
  name: "diariesApp",
  initialState: initialState,
  reducers: {
    saveToken: (state, { payload }: PayloadAction<string>) => {
      if (payload) {
        state.token = payload;
      }
    },
    clearToken: (state) => {
      state.token = null;
    },
    setAuthState: (state, { payload }: PayloadAction<boolean>) => {
      state.isAuthenticated = payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { saveToken, clearToken, setAuthState } = diariesAppSlice.actions;
// Other code such as selectors can use the imported `RootState` type
export const selectDiariesAppState = (state: RootState) => state.diariesApp;

export default diariesAppSlice;
