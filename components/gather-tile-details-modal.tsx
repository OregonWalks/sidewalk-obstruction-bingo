import React, { useCallback } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { TileInterface } from '../services/tiles';
import GetLocation from './get-location';

export type TileDetails = ({
  location: Coordinates;
  textLocation?: undefined;
} | {
  location?: undefined;
  textLocation: string;
}) & {
  detailString?: string;
}

function detailsReadyForMarking(isAddYourOwn: boolean | undefined, details: TileDetails): boolean {
  if (isAddYourOwn && (details.detailString === undefined || details.detailString === "")) {
    return false;
  }
  return true;
}

function detailsReadyForSharing(isAddYourOwn: boolean | undefined, details: TileDetails): boolean {
  if (!detailsReadyForMarking(isAddYourOwn, details)) {
    return false;
  }
  return details.location !== undefined || details.textLocation !== "";
}

export function GatherTileDetailsModal({ tile, tileDetails, setTileDetails,
  sendReports = false,
  onReport, onDontReport, onCancel }: {
    tile: TileInterface;
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
        {sendReports && <GetLocation tileDetails={tileDetails} setTileDetails={setTileDetails} />}
      </Form>
    </Modal.Body>
    <Modal.Footer>
      {sendReports &&
        <Button variant="primary" onClick={clickReport}
          disabled={!detailsReadyForSharing(tile.isAddYourOwn, tileDetails)}
        >Share</Button>}
      <Button variant={sendReports ? "secondary" : "primary"} onClick={onDontReport}
        disabled={!detailsReadyForMarking(tile.isAddYourOwn, tileDetails)}>
        {sendReports ? "Don't Share" : "Ok"}
      </Button>
      <Button variant="secondary" onClick={onCancel}>Cancel</Button>
    </Modal.Footer>

  </Modal>;
}
