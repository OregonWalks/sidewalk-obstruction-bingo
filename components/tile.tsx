import { get, set } from 'idb-keyval';
import React from 'react';

export default class Tile extends React.Component<{ tile: number, matched: boolean }> {

  render() {
    return <td style={{ position: "relative" }}>
      <div style={{ position: "absolute", width: "100%", height: "100%", left: 0, top: 0 }}>Tile {this.props.tile}</div>
      <div style={{ position: "absolute", width: "100%", height: "100%", left: 0, top: 0, color: "red" }}>{this.props.matched ? "X" : ""}</div>
    </td>;
  }
};
