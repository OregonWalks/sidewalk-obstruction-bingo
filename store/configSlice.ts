import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SobDB } from '../services/db-schema';

type ConfigState = {
  state: "loading";
} | {
  state: "ready";
  sendReports?: boolean;
  autoLocation: boolean;
};

interface ConfigLoadedPayload {
  sendReports?: boolean;
  autoLocation: boolean;
}

const config = createSlice({
  name: 'config',
  initialState: { state: "loading" } as ConfigState,
  reducers: {
    loaded(_state, action: PayloadAction<ConfigLoadedPayload>): ConfigState {
      return {
        state: "ready",
        sendReports: action.payload.sendReports,
        autoLocation: action.payload.autoLocation,
      };
    },
    setSendReports(state, action: PayloadAction<boolean>): void {
      if (state.state !== "ready") {
        throw new Error("Can't set send-reports while config is loading.");
      }
      state.sendReports = action.payload;
    },
    setAutoLocation(state, action: PayloadAction<boolean>): void {
      if (state.state !== "ready") {
        throw new Error("Can't set auto-location while config is loading.");
      }
      state.autoLocation = action.payload;
    },
  },
});

export const { setSendReports, setAutoLocation } = config.actions;

export async function loadConfig(db: SobDB): Promise<PayloadAction<ConfigLoadedPayload>> {
  const tx = db.transaction("keyval", "readonly");
  const [sendReports, autoLocation] = await Promise.all([
    tx.store.get("send-reports"),
    tx.store.get("auto-location"),
  ]) as [boolean | undefined, boolean | undefined];
  return config.actions.loaded({ sendReports, autoLocation: autoLocation ?? false });

}

export default config.reducer;
