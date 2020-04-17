import React, { useCallback, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { TileInterface } from '../services/tiles';
import GetLocation from './get-location';

export interface TileDetails {
  location: Coordinates | null;
  /** "" when not set. */
  textLocation: string;
  detailString: string | null;
}

export function GatherTileDetailsModal({ tile, autoLocation, setAutoLocation, onSave, onCancel }: {
  tile: TileInterface;
  autoLocation: boolean;
  setAutoLocation: (b: boolean) => void;
  onSave: (details: TileDetails) => void;
  onCancel: () => void;
}): JSX.Element {
  const [location, setLocation] = useState<Coordinates>(null);
  const [textLocation, setTextLocation] = useState<string>("");
  const [detailString, setDetailString] = useState<string>(null);

  const clickReport = useCallback(() => {
    onSave({ location, textLocation, detailString });
  }, [onSave, location, textLocation, detailString])

  if (tile == null) {
    return null;
  }

  return <Modal show={true}>
    <GetLocation location={location} setLocation={setLocation}
      textLocation={textLocation} setTextLocation={setTextLocation}
      autoLocation={autoLocation} setAutoLocation={setAutoLocation}></GetLocation>
    {tile.describe?.({ detailString, setDetailString })}
    <Modal.Footer>
      <Button variant="secondary" onClick={onCancel}>Cancel</Button>
      <Button variant="primary" onClick={clickReport}>Report</Button>
    </Modal.Footer>
  </Modal>;
}
