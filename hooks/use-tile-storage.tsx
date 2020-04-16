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
  matched: boolean[];
  toggleMatched: (index: number) => void;
  newBoard: () => void;
} {
  let [tileorder, setTileorder] = useIdbKeyval<number[]>("tileorder", null);
  let [matched, setMatched] = useIdbKeyval("matched", null);

  const toggleMatched = useCallback((tileIndex: number) => {
    const newMatched = Array.from(matched);
    newMatched[tileIndex] = !newMatched[tileIndex];
    setMatched(newMatched);
  }, [matched, setMatched]);

  const newBoard = useCallback(() => {
    // Array from 1..24, inclusive.
    const tileorder = Array.from({ length: 24 }, (_, index) => index + 1);
    randomShuffle(tileorder);
    // Tile 0 is the free tile; insert it at index 12, the middle of the array.
    tileorder.splice(12, 0, 0);

    const matched = Array(25).fill(false);
    matched[12] = true;
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

  return { tileorder, matched, toggleMatched, newBoard };
}
