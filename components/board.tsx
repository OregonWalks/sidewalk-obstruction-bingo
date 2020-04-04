import { get, set } from 'idb-keyval';
import React from 'react';
import Tile from "./tile"

export default class Board extends React.Component<{ tileorder: Array<number>; matched: Array<boolean> }>{

  render() {
    return <tbody>
      {[0, 1, 2, 3, 4].map(row =>
        <tr key={row}>
          {[0, 1, 2, 3, 4].map(col => {
            let flatIndex = row * 5 + col;
            return <Tile key={col} tile={this.props.tileorder[flatIndex]} matched={this.props.matched[flatIndex]}></Tile>
          })}
        </tr>
      )}
    </tbody>;
  }
};
