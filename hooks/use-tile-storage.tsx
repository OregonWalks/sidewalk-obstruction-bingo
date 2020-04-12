import { useCallback } from 'react';

import useIdbKeyval from './use-idb-keyval';

function makeCountingArray(length: number) {
  return Array.from({ length }, (_, index) => index);
}

/** Returns a random integer in [0, max). */
function getRandomNaturalUpTo(max: number) {
  return Math.floor(Math.random() * (max + 1));
}

function randomShuffle(arr: Array<any>) {
  const len = arr.length;
  for (let index = arr.length - 1; index > 0; index--) {
    let swapIndex = getRandomNaturalUpTo(index);
    [arr[index], arr[swapIndex]] = [arr[swapIndex], arr[index]];
  }
}

export default function useTileStorage(): {
  tileorder: number[],
  matched: boolean[],
  toggleMatched: (index) => void,
  newBoard: () => void
} {
  let [tileorder, setTileorder] = useIdbKeyval<number[]>("tileorder", null);
  let [matched, setMatched] = useIdbKeyval("matched", null);

  let toggleMatched = useCallback((tileIndex: number) => {
    let newMatched = Array.from(matched);
    newMatched[tileIndex] = !newMatched[tileIndex];
    setMatched(newMatched);
  }, [matched, setMatched]);

  let newBoard = useCallback(() => {
    // Array from 1..24, inclusive.
    let tileorder = Array.from({ length: 24 }, (_, index) => index + 1);
    randomShuffle(tileorder);
    // Tile 0 is the free tile; insert it at index 12, the middle of the array.
    tileorder.splice(12, 0, 0);

    let matched = Array(25).fill(false);
    matched[12] = true;
    setTileorder(tileorder);
    setMatched(matched);
  }, [setTileorder, setMatched]);

  if (tileorder === null) {
    newBoard();
  }
  if (matched === null) {
    // Make sure they both go non-null in the same render.
    tileorder = null;
  }

  return { tileorder, matched, toggleMatched, newBoard };
}
