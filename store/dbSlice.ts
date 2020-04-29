import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SobDB } from '../services/db-schema';

export type DbState = {
  state: "loading";
} | {
  state: "ready";
  db: SobDB;
};

const db = createSlice({
  name: 'db',
  initialState: { state: "loading" } as DbState,
  reducers: {
    setDb(state, action: PayloadAction<SobDB>): DbState {
      return {
        state: "ready",
        db: action.payload
      };
    },
  },
});

export const { setDb } = db.actions;

export default db.reducer;
