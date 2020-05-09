import { createSelector } from '@reduxjs/toolkit';
import React, { useCallback } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useDispatch, useSelector } from 'react-redux';
import { wonBingo } from "../services/bingo";
import { RootState } from '../store';
import { generateNewBoard, TilesState } from '../store/boardSlice';
import Tile from "./tile";
import YouWon from './you-won';

const wonSelector = createSelector(
  (state: RootState) => state.board,
  (board): boolean => {
    if (board.isLoading) return false;
    return wonBingo(board.matched.map(matchDetails => matchDetails.match));
  }
);

export default function BoardOrLoading(): JSX.Element {
  const { db, board, config } = useSelector((state: RootState) => state);

  if (db.state === "loading" || board.isLoading || config.state === "loading") {
    return <h1>Loading...</h1>;
  }

  return <LoadedBoard boardState={board} />;
}

function LoadedBoard({ boardState }: {
  boardState: TilesState;
}): JSX.Element {
  const dispatch = useDispatch();

  const generateBoard = useCallback(() => {
    dispatch(generateNewBoard());
  }, [dispatch]);

  const won = useSelector(wonSelector);

  let result: JSX.Element;
  if (won) {
    result = <YouWon />;
  } else {
    result = <table>
      <tbody>
        {[0, 1, 2, 3, 4].map(row =>
          <tr key={row}>
            {[0, 1, 2, 3, 4].map(col => {
              const flatIndex = row * 5 + col;
              return <Tile key={col} tileindex={flatIndex}
                tileid={boardState.tileorder[flatIndex]}
                matched={boardState.matched[flatIndex]} />
            })}
          </tr>
        )}
      </tbody>
    </table>;
  }

  return <>
    {result}
    <Card>
      <Card.Header>
        <Button variant="primary" block onClick={generateBoard}>Generate a new board</Button>
      </Card.Header>
    </Card>
  </>;
}
