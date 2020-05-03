import React, { useCallback } from 'react';
import TILES from '../services/tiles';

export default function Tile({ tileindex, tileid, matched, onToggleMatched }: {
  tileindex: number;
  tileid: number;
  matched: boolean;
  onToggleMatched: (tileindex: number) => void;
}): JSX.Element {
  const tile = TILES[tileid];

  const onClick = useCallback(
    () => onToggleMatched(tileindex),
    [onToggleMatched, tileindex]);

  let drawMatched = null;
  if (matched) {
    drawMatched = <img alt="Marked" src="tiles/marked.svg"
      style={{
        position: "absolute", left: 0, top: 0,
        objectFit: "contain",
        width: "100%",
      }} />;
  }

  return <td onClick={onClick} style={{ position: "relative" }}>
    <img alt={tile.alt} src={"/tiles/" + tile.image}
      style={{
        objectFit: "contain",
        width: "100%",
      }} />
    {drawMatched}
  </td>;
}
