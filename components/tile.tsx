import React from 'react';
import TILES from '../services/tiles';

export default function Tile({ tileid, matched, onToggleMatched }: { tileid: number; matched: boolean; onToggleMatched: () => void }): JSX.Element {
  const tile = TILES[tileid];

  let drawMatched = null;
  if (matched) {
    drawMatched = <img alt="Marked" src="tiles/marked.svg"
      width="150" height="150"
      style={{
        position: "absolute", left: 0, top: 0,
        objectFit: "contain",
        width: "100%", height: "100%",
      }} />;
  }

  return <td onClick={onToggleMatched} style={{ position: "relative" }}>
    <img alt={tile.alt} src={"/tiles/" + tile.image}
      width="150" height="150"
      style={{
        objectFit: "contain",
        width: "100%", height: "100%",
      }} />
    {drawMatched}
  </td>;
}
