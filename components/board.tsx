import React, { useState, useEffect } from 'react';

import Tile from "./tile"
import useTileStorage from "../hooks/use-tile-storage";
import { wonBingo } from "../services/bingo";
import Button from 'react-bootstrap/Button'


export default function Board() {
  let { tileorder, matched, toggleMatched, newBoard } = useTileStorage();

  if (tileorder === null || matched === null) {
    return <h1>Loading...</h1>;
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
                onToggleMatched={() => toggleMatched(flatIndex)}></Tile>
            })}
          </tr>
        )}
      </tbody>
    </table>;
  }

  return <>
    {board}
    <Button variant="primary" block onClick={newBoard}>Generate a new board</Button>
  </>;
}
;
