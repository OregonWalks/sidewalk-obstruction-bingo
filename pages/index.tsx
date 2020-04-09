import React from 'react';

import Board from "../components/board"

export default function Index() {


  return <main style={{
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between safe",
  }}>
    <h1 style={{ flex: "0 auto" }}>Sidewalk Obstruction Bingo</h1>
    <table style={{ flex: "1 auto", height: "100%" }}>
      <Board />
    </table>
  </main>;
};
