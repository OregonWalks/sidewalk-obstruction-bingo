import { get, set } from 'idb-keyval';
import React from 'react';

export default function Tile(props: { tile: number, matched: boolean, onToggleMatched: () => void }) {
  return <td>
    <button style={{
      width: "100%",
      height: "100%",
      backgroundColor: props.matched ? "red" : "white"
    }}
      onClick={props.onToggleMatched}>Tile {props.tile}</button>
  </td>;
};
