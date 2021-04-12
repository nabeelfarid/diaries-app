import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Diary, Entry, User } from "./models";
import type { RootState } from "./store";

// Type for the slice state
interface DiariesAppState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  diaries: Diary[];
  selectedDiary: Diary | null;
  entries: Entry[];
  selectedEntry: Entry | null;
}

// Initial state using the above type
const initialState: DiariesAppState = {
  isAuthenticated: false,
  token: null,
  user: null,
  diaries: [],
  selectedDiary: null,
  entries: [],
  selectedEntry: null,
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
    setSelectedDiary: (state, { payload }: PayloadAction<Diary | null>) => {
      state.selectedDiary = payload;
    },
    addDiary: (state, { payload }: PayloadAction<Diary>) => {
      //add new items to the begning of the arrary
      state.diaries.unshift(payload);
    },
    updateDiary: (state, { payload }: PayloadAction<Diary>) => {
      let index = state.diaries.findIndex((diary) => diary.id === payload.id);
      if (index === -1) return;
      state.diaries[index] = payload;
    },
    setEntries: (state, { payload }: PayloadAction<Entry[]>) => {
      if (payload) {
        state.entries = payload;
      }
    },
    setSelectedEntry: (state, { payload }: PayloadAction<Entry | null>) => {
      state.selectedEntry = payload;
    },
    addEntry: (state, { payload }: PayloadAction<Entry>) => {
      //add new items to the begning of the entries
      state.entries.unshift(payload);
      //update corresponding diary with the new entryid and updated date
      let diary = state.diaries.find((diary) => diary.id === payload.diaryId);
      if (diary) {
        diary.entryIds.push(payload.id);
        diary.updated = payload.updated;
      }
    },
    updateEntry: (state, { payload }: PayloadAction<Entry>) => {
      let index = state.entries.findIndex((entry) => entry.id === payload.id);
      if (index === -1) return;
      state.entries[index] = payload;
      //update diary Updated date as well
      let diary = state.diaries.find((diary) => diary.id === payload.diaryId);
      if (diary) {
        diary.entryIds.push(payload.id);
        diary.updated = payload.updated;
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
  setSelectedDiary,
  addDiary,
  updateDiary,
  setEntries,
  setSelectedEntry,
  addEntry,
  updateEntry,
} = diariesAppSlice.actions;
// Other code such as selectors can use the imported `RootState` type
export const selectDiariesAppState = (state: RootState) => state.diariesApp;

export default diariesAppSlice;
