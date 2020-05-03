import React, { useCallback } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useDispatch } from 'react-redux';
import { setSendReports } from '../store/configSlice';

export interface TileDetails {
  location: Coordinates | null;
  /** "" when not set. */
  textLocation: string;
  detailString: string | null;
}

export function AskToReport({ onDone: onHide }: {
  onDone: (sendReports: boolean) => void;
}): JSX.Element {
  const dispatch = useDispatch();
  const clickSendReports = useCallback(() => {
    dispatch(setSendReports(true));
    onHide(true);
  }, [dispatch, onHide]);

  const clickDontSendReports = useCallback(() => {
    dispatch(setSendReports(false));
    onHide(false);
  }, [dispatch, onHide]);

  const hide = useCallback(() => {
    onHide(false);
  }, [onHide]);

  return <Modal show={true} onHide={hide}>
    <Modal.Title>
      Do you want to share the locations of the obstructions you find with <a href="https://oregonwalks.org/">Oregon Walks</a>?
      </Modal.Title>
    <Modal.Body>
      <p>
        Sharing the location will allow us to better advocate for obstacle-free sidewalks.
        </p>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="primary" onClick={clickSendReports}>Report</Button>
      <Button variant="primary" onClick={clickDontSendReports}>Don&apos;t Report</Button>
    </Modal.Footer>
  </Modal>;
}
