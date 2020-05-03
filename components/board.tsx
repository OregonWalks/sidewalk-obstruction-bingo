import pushid from 'pushid';
import React, { useCallback, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useDispatch, useSelector } from 'react-redux';
import { wonBingo } from "../services/bingo";
import { SobDB } from '../services/db-schema';
import { queueReport, tryUnqueueReport } from "../services/report";
import TILES from "../services/tiles";
import { RootState } from '../store';
import { generateNewBoard, matchToggled, TilesState } from '../store/boardSlice';
import { AskToReport } from './ask-to-report';
import { GatherTileDetailsModal, TileDetails } from "./gather-tile-details-modal";
import Tile from "./tile";

export default function BoardOrLoading(): JSX.Element {
  const { db, board, config } = useSelector((state: RootState) => state);

  if (db.state === "loading" || board.isLoading || config.state === "loading") {
    return <h1>Loading...</h1>;
  }

  return <LoadedBoard db={db.db}
    boardState={board}
    sendReports={config.sendReports}
    autoLocation={config.autoLocation} />;
}

function LoadedBoard({ db, boardState, sendReports, autoLocation }: {
  db: SobDB;
  boardState: TilesState;
  sendReports: boolean | undefined;
  autoLocation: boolean;
}): JSX.Element {
  const dispatch = useDispatch();
  const [clickedTile, setClickedTile] = useState<number | null>(null);

  const onToggleMatched = useCallback((tileIndex: number) => {
    const matchedtile = boardState.matched[tileIndex];
    if (matchedtile.match) {
      if (matchedtile.reportId !== undefined) {
        tryUnqueueReport(db, matchedtile.reportId);
      }
      dispatch(matchToggled({ tileIndex, newmatch: false }));
    } else {
      if (sendReports === false) {
        dispatch(matchToggled({ tileIndex, newmatch: true }));
      } else {
        setClickedTile(tileIndex);
      }
    }
  }, [dispatch, db, setClickedTile, sendReports, boardState.matched]);

  const onGotTileDetails = useCallback((tileDetails: TileDetails) => {
    if (clickedTile === null) {
      throw new Error("Can't happen: got tile details with a null clickedTile.");
    }
    setClickedTile(null);
    const uuid = pushid();
    dispatch(matchToggled({ tileIndex: clickedTile, newmatch: true, reportId: uuid }));
    queueReport(db, uuid, TILES[boardState.tileorder[clickedTile]], tileDetails)
  }, [dispatch, db, clickedTile, boardState.tileorder]);

  const onDontReportTileDetails = useCallback(() => {
    if (clickedTile === null) {
      throw new Error("Can't happen: got tile details with a null clickedTile.");
    }
    setClickedTile(null);
    dispatch(matchToggled({ tileIndex: clickedTile, newmatch: true }));
  }, [dispatch, clickedTile]);

  const onCanceledTileDetails = useCallback(() => {
    setClickedTile(null);
  }, [setClickedTile])

  const generateBoard = useCallback(() => {
    dispatch(generateNewBoard());
  }, [dispatch]);

  let result: JSX.Element;
  if (wonBingo(boardState.matched.map(matchDetails => matchDetails.match))) {
    result = <img src="/you_won.gif" alt="You Won!"></img>;
  } else {
    result = <table style={{ flex: "1 auto", height: "90%" }}>
      <tbody>
        {[0, 1, 2, 3, 4].map(row =>
          <tr key={row}>
            {[0, 1, 2, 3, 4].map(col => {
              const flatIndex = row * 5 + col;
              return <Tile key={col} tileindex={flatIndex}
                tileid={boardState.tileorder[flatIndex]}
                matched={boardState.matched[flatIndex].match}
                onToggleMatched={onToggleMatched}></Tile>
            })}
          </tr>
        )}
      </tbody>
    </table>;
  }

  return <>
    {result}
    <AskToReport show={clickedTile != null} sendReports={sendReports} />
    <GatherTileDetailsModal tile={clickedTile === null ? null : TILES[boardState.tileorder[clickedTile]]}
      onReport={onGotTileDetails} onDontReport={onDontReportTileDetails} onCancel={onCanceledTileDetails}
      sendReports={sendReports}
      autoLocation={autoLocation}/>
    <Card>
      <Card.Header>
        <Button variant="primary" size="sm" block onClick={generateBoard}>Generate a new board</Button>
      </Card.Header>
    </Card>
  </>;
}
