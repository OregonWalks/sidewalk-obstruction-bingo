import React, { useCallback, useEffect, useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentPosition } from '../services/geolocation';
import { RootState } from '../store';
import { setAutoLocation } from '../store/configSlice';
import { TileDetails } from './gather-tile-details-modal';

export default function GetLocation({ tileDetails, setTileDetails }: {
  tileDetails: TileDetails;
  setTileDetails: (details: TileDetails) => void;
}): JSX.Element {
  const dispatch = useDispatch();
  const autoLocation = useSelector((state: RootState) =>
    state.config.state === "ready" && state.config.autoLocation);

  const [gettingLocation, setGettingLocation] = useState(false);

  //const [geolocationError, setGeolocationError] = useState<PositionError>(null);

  const onChangeLocation = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setTileDetails({ ...tileDetails, textLocation: event.target.value, location: undefined })
  }, [setTileDetails, tileDetails]);

  const onAutoLocationChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setAutoLocation(event.target.checked));
  }, [dispatch])

  const getCurrentLocation = useCallback((_event?: React.SyntheticEvent, signal?: AbortSignal) => {
    setGettingLocation(true);
    getCurrentPosition().then(coords => {
      if (signal?.aborted) {
        return;
      }
      setTileDetails({ ...tileDetails, textLocation: undefined, location: coords })
    });
  }, [setTileDetails, tileDetails]);

  useEffect(() => {
    const abort = new AbortController();
    if (autoLocation) {
      getCurrentLocation(undefined, abort.signal);
    }
    return (): void => { abort.abort(); }
  }, [autoLocation, getCurrentLocation]);

  // Documentation at https://developers.google.com/maps/documentation/embed/guide#place_mode.
  const mapUrl = new URL("https://www.google.com/maps/embed/v1/place?key=AIzaSyAQ9QAtFgij7jVNf_ZelJ4eg_oq1bLt_jE");
  if (tileDetails.location) {
    // This lat/lng format was guessed from
    // https://developers.google.com/maps/documentation/urls/guide#search-action.
    mapUrl.searchParams.append("q", `${tileDetails.location.latitude},${tileDetails.location.longitude}`);
  } else if (tileDetails.textLocation) {
    mapUrl.searchParams.append("q", `${tileDetails.textLocation} near Portland, OR`);
  } else {
    mapUrl.searchParams.append("q", "Portland, OR");
  }

  return <>
    <p> Where did you find this obstacle?</p>
    <Accordion>
      <Card>
        <Card.Header>
          <Accordion.Toggle as={Button} onClick={getCurrentLocation} variant="primary" size="sm" eventKey="0" block>
            Use my current location
          </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey="0">
          <Card.Body>
            <Form.Check
              type={"checkbox"}
              label={"Always use my current location"}
              checked={autoLocation}
              onChange={onAutoLocationChange}
            />
          </Card.Body>
        </Accordion.Collapse>
      </Card>
      <Card>
        <Card.Header>
          <Accordion.Toggle as={Button} variant="primary" size="sm" eventKey="1" block>
            Enter address or location
          </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey="1">
          <Card.Body>
            <Form.Control type="input" placeholder="'1234 Main St.' or 'Powell's'" value={tileDetails.textLocation} onChange={onChangeLocation} />
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
    <iframe src={mapUrl.href} style={{ margin: 'auto', display: 'block' }}></iframe>
  </>
}
