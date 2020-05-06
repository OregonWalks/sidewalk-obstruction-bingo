import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SobDB } from '../services/db-schema';
import { DbState } from './dbSlice';


export interface MatchDetails {
  match: boolean;
  pending: boolean;
  reportId?: string;
  /** For AddYourOwn tiles, the user-provided description of the obstruction. */
  details?: string;
}

export interface TilesState {
  tileorder: number[];
  matched: MatchDetails[];
}

type BoardState = { isLoading: true } |
  ({ isLoading: false } & TilesState);

const initialState: BoardState = {
  isLoading: true,
};

/** Returns a random integer in [0, max). */
function getRandomNaturalUpTo(max: number): number {
  return Math.floor(Math.random() * (max + 1));
}

/** In-place */
function randomShuffle<T>(arr: T[]): void {
  for (let index = arr.length - 1; index > 0; index--) {
    const swapIndex = getRandomNaturalUpTo(index);
    [arr[index], arr[swapIndex]] = [arr[swapIndex], arr[index]];
  }
}

async function doGenerateNewBoard(db: SobDB): Promise<TilesState> {
  // Array from 1..24, inclusive.
  const tileorder = Array.from({ length: 24 }, (_, index) => index + 1);
  randomShuffle(tileorder);
  // Tile 0 is the free tile; insert it at index 12, the middle of the array.
  tileorder.splice(12, 0, 0);

  const matched: MatchDetails[] = Array.from({ length: 25 }, (_, k) => {
    return {
      match: k == 12,
      pending: false,
      reportId: undefined,
    }
  });

  const tx = db.transaction("keyval", "readwrite");
  tx.store.put(tileorder, "tileorder");
  tx.store.put(matched, "matched");
  await tx.done;

  return {
    tileorder,
    matched,
  };
}

export const generateNewBoard = createAsyncThunk<TilesState, void, { state: { db: DbState } }>(
  'board/generateNewBoard',
  async (_, { getState }) => {
    const { db } = getState();
    if (db.state === "loading") {
      throw new Error("Database isn't initialized yet.");
    }
    return await doGenerateNewBoard(db.db);
  }
)

type MatchToggleDetails = { tileIndex: number } & ({
  newmatch: false;
} | {
  newmatch: true;
  reportId?: string;
  details?: string;
});

export const matchToggled = createAsyncThunk<MatchToggleDetails, MatchToggleDetails, { state: { db: DbState } }>(
  'board/matchToggled',
  async (matchDetails: MatchToggleDetails, { getState }): Promise<MatchToggleDetails> => {
    const { db } = getState();
    if (db.state === "loading") {
      throw new Error("Database isn't initialized yet.");
    }
    const tx = db.db.transaction("keyval", "readwrite");
    const matched = await tx.store.get("matched") as MatchDetails[];
    const oldMatch = matched[matchDetails.tileIndex];
    if (oldMatch.match == matchDetails.newmatch) {
      throw new Error(`Toggling match with details ${JSON.stringify(matchDetails)} didn't change match state.\n` +
        `Old state: ${JSON.stringify(oldMatch)}`);
    }
    oldMatch.pending = false;
    if (matchDetails.newmatch) {
      oldMatch.match = true;
      oldMatch.reportId = matchDetails.reportId;
      oldMatch.details = matchDetails.details;
    } else {
      oldMatch.match = false;
      delete oldMatch.reportId;
      delete oldMatch.details;
    }
    tx.store.put(matched, "matched");
    await tx.done;

    return matchDetails;
  });

const board = createSlice({
  name: 'board',
  initialState: initialState as BoardState,
  reducers: {
    loaded(state, action: PayloadAction<TilesState>): BoardState {
      return {
        isLoading: false,
        tileorder: action.payload.tileorder,
        matched: action.payload.matched,
      };
    },
    tilePendingClickResolution(state, action: PayloadAction<number>): void {
      if (state.isLoading) {
        throw new Error("Can't have a tile click while the board is loading.");
      }
      state.matched[action.payload].pending = true;
    },
    tileClickCancelled(state, action: PayloadAction<number>): void {
      if (state.isLoading) {
        throw new Error("Can't have a tile click while the board is loading.");
      }
      state.matched[action.payload].pending = false;
    },
  },
  extraReducers: builder => {
    builder.addCase(generateNewBoard.pending, (): BoardState => {
      return { isLoading: true };
    });
    builder.addCase(generateNewBoard.fulfilled, (_state, action): BoardState => {
      const { tileorder, matched } = action.payload;
      if (tileorder.length != 25 || matched.length != 25) {
        throw new Error(`Board doesn't have 25 cells: ${action.payload}`);
      }
      if (tileorder[12] != 0 || matched[12].match === false) {
        throw new Error(`Board's center square isn't the free square: ${action.payload}`);
      }
      return {
        isLoading: false,
        tileorder,
        matched,
      };
    });
    // TODO: Fix up the matchToggled.pending action. It ought to send the
    // tileIndex, but createAsyncThunk() can't be configured to send any
    // information with the pending action.
    builder.addCase(matchToggled.fulfilled, (state, action): void => {
      if (state.isLoading) {
        throw new Error("Can't toggle a match while the board is loading.");
      }
      const match = state.matched[action.payload.tileIndex];
      match.pending = false;
      match.match = action.payload.newmatch;
      if (action.payload.newmatch) {
        match.reportId = action.payload.reportId;
        match.details = action.payload.details;
      } else {
        delete match.reportId;
        delete match.details;
      }
    });
    builder.addCase(matchToggled.rejected, (state, action): void => {
      throw action.error;
    });
  },
});

export async function loadBoard(db: SobDB): Promise<PayloadAction<TilesState>> {
  const tx = db.transaction("keyval", "readonly");
  let [tileorder, matched] = await Promise.all([
    tx.store.get("tileorder"),
    tx.store.get("matched"),
  ]) as [number[] | undefined, MatchDetails[] | undefined];
  if (tileorder === undefined || matched === undefined) {
    // Need to generate a board.
    ({ tileorder, matched } = await doGenerateNewBoard(db));
  }
  return board.actions.loaded({ tileorder, matched });
}

export const { tilePendingClickResolution, tileClickCancelled } = board.actions;

export default board.reducer;
