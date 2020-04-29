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

export function AskToReport({ show, sendReports }: {
  show: boolean;
  sendReports: boolean | undefined;
}): JSX.Element {
  const dispatch = useDispatch();
  const clickSendReports = useCallback(() => {
    dispatch(setSendReports(true));
  }, [dispatch]);

  const clickDontSendReports = useCallback(() => {
    dispatch(setSendReports(false));
  }, [dispatch]);

  return <Modal show={show && sendReports === undefined}>
    <Modal.Title>
      Do you want to share the locations of the obstructions you find with <a href="https://oregonwalks.org/">Oregon Walks</a>?
      </Modal.Title>
    <Modal.Body>
      <p>
        Sharing the location will allow us to better advocate for obstacle-free sidewalks.
        </p>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="primary" onClick={clickSendReports}>Yes</Button>
      <Button variant="primary" onClick={clickDontSendReports}>No</Button>
    </Modal.Footer>
  </Modal>;
}
