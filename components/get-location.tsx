import React, { ReactNode, useCallback, useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from 'react-redux';
import usePosition from '../hooks/usePosition';
import { RootState } from '../store';
import { setAutoLocation } from '../store/configSlice';
import { TileDetails } from './gather-tile-details-modal';
import style from './get-location.module.css';

export default function GetLocation({ tileDetails, setTileDetails }: {
  tileDetails: TileDetails;
  setTileDetails: (details: TileDetails) => void;
}): JSX.Element {
  const dispatch = useDispatch();
  const autoLocation = useSelector((state: RootState) =>
    state.config.state === "ready" && state.config.autoLocation);

  const onChangeLocation = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setTileDetails({ ...tileDetails, textLocation: event.target.value, location: undefined })
  }, [setTileDetails, tileDetails]);

  const onAutoLocationChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setAutoLocation(event.target.checked));
  }, [dispatch])

  const [requestLocationNow, setRequestLocationNow] = useState<boolean>(false);

  const getCurrentLocation = useCallback(() => {
    setRequestLocationNow(true);
  }, []);

  const onPosition = useCallback((position) => {
    setRequestLocationNow(false);
    setTileDetails({ ...tileDetails, textLocation: undefined, location: position.coords });
  }, [setTileDetails, tileDetails]);

  const { apiAvailable, permissionState, error } = usePosition({
    requestNow: (autoLocation && !tileDetails.location) || requestLocationNow,
    onPosition
  });

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

  let currentLocationCard: ReactNode = null;
  if (!apiAvailable) {
    currentLocationCard = <Card>
      <Card.Header>
        {"Your browser doesn't support using your current location."}
      </Card.Header>
    </Card>;
  } else if (permissionState == "denied" || (error && error.code == error.PERMISSION_DENIED)) {
    currentLocationCard = <Card>
      <Card.Header>
        {"This site is denied permission to use your current location."}
      </Card.Header>
    </Card>;
  } else if (error) {
    <Card>
      <Card.Header>
        {"Getting your current location failed. Try again?"}
      </Card.Header>
    </Card>;
  } else {
    currentLocationCard = <Card>
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
    </Card>;
  }

  return <>
    <p> Where did you find this obstruction?</p>
    <Accordion>
      {currentLocationCard}
      <Card>
        <Card.Header>
          <Accordion.Toggle as={Button} variant="primary" size="sm" eventKey="1" block>
            Enter address or landmark
          </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey="1">
          <Card.Body>
            <Form.Control type="input" placeholder="'1234 Main St.' or 'Powell's'" value={tileDetails.textLocation ?? ""} onChange={onChangeLocation} />
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
    <div className={style.map}>
      <iframe src={mapUrl.href}></iframe>
    </div>
  </>
}
