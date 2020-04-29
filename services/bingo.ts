
function checkLine(matched: boolean[], start: number, increment: number): boolean {
  for (let i = 0; i < 5; ++i) {
    if (!matched[start + i * increment]) return false;
  }
  return true;
}

/**
 * @param matched is a 25-element boolean array representing the marked spaces on the Bingo board.
 */
export function wonBingo(matched: boolean[]): boolean {
  // Horizontal:
  for (const start of [0, 5, 10, 15, 20]) {
    if (checkLine(matched, start, 1)) return true;
  }
  // Vertical:
  for (const start of [0, 1, 2, 3, 4]) {
    if (checkLine(matched, start, 5)) return true;
  }
  // Top left to bottom right:
  if (checkLine(matched, 0, 6)) return true;
  // Top right to bottom left:
  if (checkLine(matched, 4, 4)) return true;

  return false;
}
