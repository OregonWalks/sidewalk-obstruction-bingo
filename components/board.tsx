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

  async function generateANewBoardAndUpdateState() {
    let { tileorder, matched } = await generateANewBoard();
    setTileorder(tileorder);
    setMatched(matched);
  }

  let board: JSX.Element;
  if (wonBingo(matched)) {
    board = <h1>You won!</h1>;
  } else {
    board = <table style={{ flex: "1 auto", height: "90%" }}>
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

  return <>
    {board}
    <button onClick={generateANewBoardAndUpdateState}>Generate a new board</button>
  </>;
}
;
