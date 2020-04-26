import { useCallback } from 'react';
import useIdbKeyval from './use-idb-keyval';

/** Returns a random integer in [0, max). */
function getRandomNaturalUpTo(max: number): number {
  return Math.floor(Math.random() * (max + 1));
}

function randomShuffle<T>(arr: T[]): void {
  for (let index = arr.length - 1; index > 0; index--) {
    const swapIndex = getRandomNaturalUpTo(index);
    [arr[index], arr[swapIndex]] = [arr[swapIndex], arr[index]];
  }
}

/**
 * Returns null values before idb-keyval has been read for the first time.
 */
export default function useTileStorage(): {
  tileorder: number[];
  /** An array of either null for unmatched things, or a report's uuid for
   * matched things. */
  matched: (string | null)[];
  setMatched: (index: number, uuid: string) => void;
  unsetMatched: (index: number) => void;
  newBoard: () => void;
} {
  let [tileorder, setTileorder] = useIdbKeyval<number[]>("tileorder", null);
  let [matched, setMatched] = useIdbKeyval<(string | null)[]>("matched", null);

  const exposedSetMatched = useCallback((tileIndex: number, uuid: string) => {
    if (matched[tileIndex] !== null) {
      throw new Error(`Called setMatched(${tileIndex}) on an already matched tile.`);
    }
    const newMatched = Array.from(matched);
    newMatched[tileIndex] = uuid;
    setMatched(newMatched);
  }, [matched, setMatched]);

  const unsetMatched = useCallback((tileIndex: number) => {
    if (matched[tileIndex] === null) {
      throw new Error(`Called unsetMatched(${tileIndex}) on an already unmatched tile.`);
    }
    const newMatched = Array.from(matched);
    newMatched[tileIndex] = null;
    setMatched(newMatched);
  }, [matched, setMatched]);

  const newBoard = useCallback(() => {
    // Array from 1..24, inclusive.
    const tileorder = Array.from({ length: 24 }, (_, index) => index + 1);
    randomShuffle(tileorder);
    // Tile 0 is the free tile; insert it at index 12, the middle of the array.
    tileorder.splice(12, 0, 0);

    const matched: (string | null)[] = Array(25).fill(null);
    matched[12] = "Free Square";
    setTileorder(tileorder);
    setMatched(matched);
  }, [setTileorder, setMatched]);

  if (tileorder === undefined) {
    newBoard();
    tileorder = null;
  }
  if (matched === undefined) {
    // Make sure they both get defined in the same render.
    tileorder = null;
    matched = null;
  }

  return { tileorder, matched, setMatched: exposedSetMatched, unsetMatched, newBoard };
}
