import React, { useCallback, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { TileInterface } from '../services/tiles';
import GetLocation from './get-location';

export interface TileDetails {
  location?: Coordinates;
  /** "" when not set. */
  textLocation: string;
  detailString?: string;
}

export function GatherTileDetailsModal({ tile, sendReports = false, autoLocation, onReport, onDontReport, onCancel }: {
  tile: TileInterface | null;
  sendReports: boolean | undefined;
  autoLocation: boolean | undefined;
  onReport: (details: TileDetails) => void;
  onDontReport: () => void;
  onCancel: () => void;
}): JSX.Element {
  const [location, setLocation] = useState<Coordinates | undefined>(undefined);
  const [textLocation, setTextLocation] = useState<string>("");
  const [detailString, setDetailString] = useState<string | undefined>(undefined);

  const clickReport = useCallback(() => {
    onReport({ location, textLocation, detailString });
  }, [onReport, location, textLocation, detailString])

  return <Modal show={tile != null && sendReports}>
    <Modal.Body>
    <Form>
    <GetLocation location={location} setLocation={setLocation}
      textLocation={textLocation} setTextLocation={setTextLocation}
      autoLocation={autoLocation} ></GetLocation>
    {tile?.describe?.({ detailString, setDetailString })}
    </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onCancel}>Cancel</Button>
      <Button variant="secondary" onClick={onDontReport}>Don&apos;t Report</Button>
      <Button variant="primary" onClick={clickReport}>Report</Button>
    </Modal.Footer>
    
  </Modal>;
}
