import React, { useState, useEffect } from 'react';

import Tile from "./tile"
import { initializeTilesAndMatched, toggleMatched } from "../services/tile-storage";

export default function Board() {
  let [tileorder, setTileorder] = useState(null);
  let [matched, setMatched] = useState(null);
  console.log("tileorder", tileorder);
  console.log("matched", matched);

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
    return <tbody><tr><td>Loading...</td></tr></tbody>;
  }

  return <tbody>
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
  </tbody>;
}
;
