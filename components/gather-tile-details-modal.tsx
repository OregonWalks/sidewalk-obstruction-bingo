import React, { useCallback } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { TileInterface } from '../services/tiles';
import GetLocation from './get-location';

export interface TileDetails {
  location?: Coordinates;
  /** "" when not set. */
  textLocation: string;
  detailString?: string;
}

export function GatherTileDetailsModal({ tile, tileDetails, setTileDetails,
  sendReports = false,
  onReport, onDontReport, onCancel }: {
    tile: TileInterface | null;
    tileDetails: TileDetails; setTileDetails: (details: TileDetails) => void;
    sendReports: boolean | undefined;
    onReport: () => void;
    onDontReport: () => void;
    onCancel: () => void;
  }): JSX.Element {
  const clickReport = useCallback(() => {
    onReport();
  }, [onReport])

  const setDetailString = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
    setTileDetails({ ...tileDetails, detailString: event.target.value });
  }, [setTileDetails, tileDetails]);

  return <Modal show={true} onHide={onCancel}>
    <Modal.Body>
      <Form>
        {sendReports && <GetLocation tileDetails={tileDetails} setTileDetails={setTileDetails} />}
        {tile.isAddYourOwn &&
          <Form.Group controlId={`${tile.id}.addYourOwnObstruction`}>
            <Form.Label>
              <p>What obstruction did you find?</p>
            </Form.Label>
            <Form.Control
              type="input"
              placeholder="Enter obstruction"
              value={tileDetails.detailString}
              onChange={setDetailString} />
          </Form.Group>}
      </Form>
    </Modal.Body>
    <Modal.Footer>
      {sendReports && <Button variant="primary" onClick={clickReport}>Share</Button>}
      <Button variant={sendReports ? "secondary" : "primary"} onClick={onDontReport}>
        {sendReports ? "Don't Share" : "Ok"}
      </Button>
      <Button variant="secondary" onClick={onCancel}>Cancel</Button>
    </Modal.Footer>

  </Modal>;
}
