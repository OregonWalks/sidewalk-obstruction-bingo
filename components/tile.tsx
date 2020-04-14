import { get, set } from 'idb-keyval';
import React from 'react';

import TILES from '../services/tiles';

export default function Tile(props: { tileid: number, matched: boolean, onToggleMatched: () => void }) {
  let tile = TILES[props.tileid];

  let drawMatched = null;
  if (props.matched) {
    drawMatched = <img alt="Marked" src="tiles/marked.svg"
      width="150" height="150"
      style={{
        position: "absolute", left: 0, top: 0,
        objectFit: "contain",
        width: "100%", height: "100%",
      }} />;
  }

  return <td onClick={props.onToggleMatched} style={{ position: "relative" }}>
    <img alt={tile.alt} src={"/tiles/" + tile.image}
      width="150" height="150"
      style={{
        objectFit: "contain",
        width: "100%", height: "100%",
      }} />
    {drawMatched}
  </td>;
};
