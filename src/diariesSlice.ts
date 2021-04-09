import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Diary, User } from "./models";
import type { RootState } from "./store";

// Type for the slice state
interface DiariesAppState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  diaries: Diary[];
}

// Initial state using the above type
const initialState: DiariesAppState = {
  isAuthenticated: false,
  token: null,
  user: null,
  diaries: [],
};

// `createSlice` will infer the state type from the `initialState` argument
const diariesAppSlice = createSlice({
  name: "diariesApp",
  initialState: initialState,
  reducers: {
    setUser: (state, { payload }: PayloadAction<User>) => {
      if (payload) {
        state.user = payload;
      }
    },
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
    setDiaries: (state, { payload }: PayloadAction<Diary[]>) => {
      if (payload) {
        state.diaries = payload;
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setUser,
  saveToken,
  clearToken,
  setAuthState,
  setDiaries,
} = diariesAppSlice.actions;
// Other code such as selectors can use the imported `RootState` type
export const selectDiariesAppState = (state: RootState) => state.diariesApp;

export default diariesAppSlice;
