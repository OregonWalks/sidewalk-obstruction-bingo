import { get, set } from 'idb-keyval';

function makeCountingArray(length: number) {
  return Array.from({ length }, (_, index) => index);
}

// Returns a random integer in [0, max).
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

export async function initializeTilesAndMatched(): Promise<{ tileorder: number[], matched: boolean[] }> {
  let [tileorder, matched] = await Promise.all([get("tileorder"), get("matched")]) as [number[], boolean[]];
  if (tileorder === undefined) {
    // Array from 1..24, inclusive.
    tileorder = Array.from({ length: 24 }, (_, index) => index + 1);
    randomShuffle(tileorder);
    // Tile 0 is the free tile; insert it at index 12, the middle of the array.
    tileorder.splice(12, 0, 0);

    matched = Array(25).fill(false);
    matched[12] = true;
    await Promise.all([set("tileorder", tileorder), set("matched", matched)]);
  }
  return { tileorder, matched };
}

export function toggleMatched(tileIndex: number) {
  return (oldMatched: boolean[]) => {
    let newMatched = Array.from(oldMatched);
    newMatched[tileIndex] = !newMatched[tileIndex];
    set("matched", newMatched); // We're not waiting for the async effect.
    return newMatched;
  }
}
