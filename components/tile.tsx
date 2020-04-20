import React, { useCallback } from 'react';
import TILES from '../services/tiles';

export default function Tile({ tileindex, tileid, matched, onToggleMatched }: {
  tileindex: number;
  tileid: number;
  matched: string | null;
  onToggleMatched: (tileindex: number) => void;
}): JSX.Element {
  const tile = TILES[tileid];

  const onClick = useCallback(
    () => onToggleMatched(tileindex),
    [onToggleMatched, tileindex]);

  let drawMatched = null;
  if (matched !== null) {
    drawMatched = <img alt="Marked" src="tiles/marked.svg"
      width="150" height="150"
      style={{
        position: "absolute", left: 0, top: 0,
        objectFit: "contain",
        width: "100%", height: "100%",
      }} />;
  }

  return <td onClick={onClick} style={{ position: "relative" }}>
    <img alt={tile.alt} src={"/tiles/" + tile.image}
      width="150" height="150"
      style={{
        objectFit: "contain",
        width: "100%", height: "100%",
      }} />
    {drawMatched}
  </td>;
}
