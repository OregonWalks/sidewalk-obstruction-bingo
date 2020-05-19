import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SobDB } from '../services/db-schema';
import createAsyncAction from './createAsyncAction';

type ConfigState = {
  state: "loading";
} | {
  state: "ready";
  sendReports?: boolean;
  autoLocation: boolean;
  enteredRaffle: boolean;
};

interface ConfigLoadedPayload {
  sendReports?: boolean;
  autoLocation: boolean;
  enteredRaffle: boolean;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function setBoolean(actionName: string, dbName: string) {
  return createAsyncAction(
    `config/${actionName}`,
    async (value: boolean, getState): Promise<boolean> => {
      const { db } = getState();
      if (db.state === "loading") {
        throw new Error("Database isn't initialized yet.");
      }
      const tx = db.db.transaction("keyval", "readwrite");
      tx.store.put(value, dbName);
      await tx.done;

      return value;
    });
}

export const setSendReportsOrig = setBoolean("sendReports", "send-reports");
export const setSendReports = createAsyncAction(
  `config/sendReports`,
  async (value: boolean, getState): Promise<boolean> => {
    const { db } = getState();
    if (db.state === "loading") {
      throw new Error("Database isn't initialized yet.");
    }
    const tx = db.db.transaction("keyval", "readwrite");
    tx.store.put(value, "send-reports");
    await tx.done;

    return value;
  });
export const setAutoLocation = setBoolean("autoLocation", "auto-location");
export const setEnteredRaffle = setBoolean("enteredRaffle", "entered-raffle");

const config = createSlice({
  name: 'config',
  initialState: { state: "loading" } as ConfigState,
  reducers: {
    loaded(_state, action: PayloadAction<ConfigLoadedPayload>): ConfigState {
      return {
        state: "ready",
        sendReports: action.payload.sendReports,
        autoLocation: action.payload.autoLocation,
        enteredRaffle: action.payload.enteredRaffle,
      };
    },
  },
  extraReducers: builder => {
    builder.addCase(setSendReports.fulfilled, (state, action: PayloadAction<boolean>): void => {
      if (state.state !== "ready") {
        throw new Error("Can't set send-reports while config is loading.");
      }
      state.sendReports = action.payload;
    });
    builder.addCase(setAutoLocation.fulfilled, (state, action: PayloadAction<boolean>): void => {
      if (state.state !== "ready") {
        throw new Error("Can't set auto-location while config is loading.");
      }
      state.autoLocation = action.payload;
    });
    builder.addCase(setEnteredRaffle.fulfilled, (state, action: PayloadAction<boolean>): void => {
      if (state.state !== "ready") {
        throw new Error("Can't set auto-location while config is loading.");
      }
      state.enteredRaffle = action.payload;
    })
  },
});

export async function loadConfig(db: SobDB): Promise<PayloadAction<ConfigLoadedPayload>> {
  const tx = db.transaction("keyval", "readonly");
  const [sendReports, autoLocation, enteredRaffle] = await Promise.all([
    tx.store.get("send-reports"),
    tx.store.get("auto-location"),
    tx.store.get("entered-raffle"),
  ]) as [boolean | undefined, boolean | undefined, boolean | undefined];
  return config.actions.loaded({
    sendReports,
    autoLocation: autoLocation ?? false,
    enteredRaffle: enteredRaffle ?? false
  });

}

export const { loaded: configLoadedForTest } = config.actions;

export default config.reducer;
