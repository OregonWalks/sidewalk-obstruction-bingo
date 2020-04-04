import React from 'react';
import Board from "../components/board"

export default class Index extends React.Component<{}> {
  render() {
    return <main style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between safe",
    }}>
      <h1 style={{ flex: "0 auto" }}>Sidewalk Obstruction Bingo</h1>
      <table style={{ flex: "1 auto", height: "100%" }}>
        <Board tileorder={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 0, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]}
          matched={Array(12).fill(false).concat([true]).concat(Array(12).fill(false))} />
      </table>
    </main>;
  }
};
