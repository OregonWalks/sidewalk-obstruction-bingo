import pushid from 'pushid';
import React, { useCallback, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import useIdbKeyval from '../hooks/use-idb-keyval';
import useTileStorage from "../hooks/use-tile-storage";
import { wonBingo } from "../services/bingo";
import { queueReport, tryUnqueueReport } from "../services/report";
import TILES from "../services/tiles";
import { GatherTileDetailsModal, TileDetails } from "./gather-tile-details-modal";
import Tile from "./tile";

export default function Board(): JSX.Element {
  const { tileorder, matched, setMatched, unsetMatched, newBoard } = useTileStorage();

  const [clickedTile, setClickedTile] = useState<number | null>(null);
  const [autoLocation, setAutoLocation] = useIdbKeyval("auto-location", false);

  const onToggleMatched = useCallback((tileindex: number) => {
    if (matched[tileindex]) {
      tryUnqueueReport(matched[tileindex]);
      unsetMatched(tileindex);
    } else {
      setClickedTile(tileindex);
    }
  }, [setClickedTile, matched, unsetMatched]);

  const onGotTileDetails = useCallback((tileDetails: TileDetails) => {
    setClickedTile(null);
    const uuid = pushid();
    setMatched(clickedTile, uuid);
    queueReport(uuid, TILES[tileorder[clickedTile]], tileDetails)
  }, [clickedTile, tileorder, setMatched])

  const onCanceledTileDetails = useCallback(() => {
    setClickedTile(null);
  }, [setClickedTile])

  if (tileorder === null || matched === null) {
    return <h1>Loading...</h1>;
  }

  let board: JSX.Element;
  if (wonBingo(matched)) {
    board = <img src="/you_won.gif"></img>;
  } else {
    board = <table style={{ flex: "1 auto", height: "90%" }}>
      <tbody>
        {[0, 1, 2, 3, 4].map(row =>
          <tr key={row}>
            {[0, 1, 2, 3, 4].map(col => {
              const flatIndex = row * 5 + col;
              return <Tile key={col} tileindex={flatIndex}
                tileid={tileorder[flatIndex]}
                matched={matched[flatIndex]}
                onToggleMatched={onToggleMatched}></Tile>
            })}
          </tr>
        )}
      </tbody>
    </table>;
  }

  return <>
    {board}
    <GatherTileDetailsModal tile={TILES[tileorder[clickedTile]]} onSave={onGotTileDetails} onCancel={onCanceledTileDetails}
      autoLocation={autoLocation} setAutoLocation={setAutoLocation} />
    <Card>
      <Card.Header>
        <Button variant="primary" block onClick={newBoard}>Generate a new board</Button>
      </Card.Header>
    </Card>
  </>;
}
