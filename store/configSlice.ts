import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SobDB } from '../services/db-schema';
import { enterRaffle } from '../services/report';
import { generateNewBoard } from './boardSlice';
import createAsyncAction from './createAsyncAction';
import { DbState } from './dbSlice';

type ConfigState = {
  state: "loading";
} | {
  state: "ready";
  sendReports?: boolean;
  autoLocation: boolean;
  enteredRaffle: "no" | "entering" | "yes" | { errorMessage: string };
};

interface ConfigLoadedPayload {
  sendReports?: boolean;
  autoLocation: boolean;
  enteredRaffle: boolean;
}

async function setIdbKeyVal<T>(db: DbState, key: string, value: T): Promise<void> {
  if (db.state === "loading") {
    throw new Error("Database isn't initialized yet.");
  }
  const tx = db.db.transaction("keyval", "readwrite");
  tx.store.put(value, key);
  await tx.done;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function setBoolean(actionName: string, dbName: string) {
  return createAsyncAction(
    `config/${actionName}`,
    async (value: boolean, getState): Promise<boolean> => {
      const { db } = getState();
      await setIdbKeyVal(db, dbName, value);
      return value;
    });
}

export const setSendReports = setBoolean("sendReports", "send-reports");
export const setAutoLocation = setBoolean("autoLocation", "auto-location");

type RaffleEntry = {
  email: string;
  addToList: boolean;
}
export const submittedRaffleEntry = createAsyncAction(
  'config/submittedRaffleEntry',
  async ({ email, addToList }: RaffleEntry, getState): Promise<true> => {
    const { db } = getState();
    await enterRaffle(email, addToList);
    await setIdbKeyVal(db, "entered-raffle", true);
    return true;
  }
);

const config = createSlice({
  name: 'config',
  initialState: { state: "loading" } as ConfigState,
  reducers: {
    loaded(_state, action: PayloadAction<ConfigLoadedPayload>): ConfigState {
      return {
        state: "ready",
        sendReports: action.payload.sendReports,
        autoLocation: action.payload.autoLocation,
        // We don't store the "entering" or error state in the db.
        enteredRaffle: action.payload.enteredRaffle ? "yes" : "no",
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

    builder.addCase(submittedRaffleEntry.pending, state => {
      if (state.state !== "ready") {
        throw new Error("Can't set entered-raffle while config is loading.");
      }
      state.enteredRaffle = "entering";
    });
    builder.addCase(submittedRaffleEntry.fulfilled, state => {
      if (state.state !== "ready") {
        throw new Error("Can't set entered-raffle while config is loading.");
      }
      state.enteredRaffle = "yes";
    });
    builder.addCase(submittedRaffleEntry.rejected, (state, action: PayloadAction<undefined, string, never, Error>) => {
      if (state.state !== "ready") {
        throw new Error("Can't set entered-raffle while config is loading.");
      }
      if (state.enteredRaffle === "entering") {
        // When we create a new board, we reset 'enteredRaffle' to "no", and we
        // don't want to show an error message when the user wins next, so just
        // ignore an error message that arrives now.
        //
        // A success that arrives late will do the right thing.
        state.enteredRaffle = { errorMessage: action.error.message };
      }
    });
    builder.addCase(generateNewBoard.pending, state => {
      if (state.state === "ready" && state.enteredRaffle !== "yes") {
        // Set both error messages and the "entering" state back to "no" when a
        // new board is generated so the next time people win, they see a clean
        // slate.
        state.enteredRaffle = "no";
      }
    });
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
