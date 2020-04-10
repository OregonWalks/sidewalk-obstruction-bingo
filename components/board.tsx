import React, { useState, useEffect } from 'react';

import Tile from "./tile"
import { initializeTilesAndMatched, toggleMatched, generateANewBoard } from "../services/tile-storage";
import { wonBingo } from "../services/bingo";

export default function Board() {
  let [tileorder, setTileorder] = useState(null);
  let [matched, setMatched] = useState(null);

  useEffect(() => {
    (async () => {
      if (tileorder === null) {
        let { tileorder, matched } = await initializeTilesAndMatched();
        setTileorder(tileorder);
        setMatched(matched);
      }
    })()
  });

  if (tileorder === null || matched === null) {
    return <h1>Loading...</h1>;
  }

  let won = wonBingo(matched);

  if (won) {
    async function generateANewBoardAndUpdateState() {
      let { tileorder, matched } = await generateANewBoard();
      setTileorder(tileorder);
      setMatched(matched);
    }
    return <div>
      <h1>You won!</h1>
      <button onClick={generateANewBoardAndUpdateState}>Generate a new board</button>
    </div>;
  }

  return <table style={{ flex: "1 auto", height: "90%" }}>
    <tbody>
      {[0, 1, 2, 3, 4].map(row =>
        <tr key={row}>
          {[0, 1, 2, 3, 4].map(col => {
            let flatIndex = row * 5 + col;
            return <Tile key={col} tileid={tileorder[flatIndex]}
              matched={matched[flatIndex]}
              onToggleMatched={() => setMatched(toggleMatched(flatIndex))}></Tile>
          })}
        </tr>
      )}
    </tbody>
  </table>;
}
;
