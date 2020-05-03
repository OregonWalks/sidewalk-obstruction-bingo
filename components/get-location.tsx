import React, { useCallback, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
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

  // True if the user has asked for their location in this instance of the dialog.
  const [geolocated, setGeolocated] = useState(false);
  //const [geolocationError, setGeolocationError] = useState<PositionError>(null);

  const onChangeLocation = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setTileDetails({ ...tileDetails, textLocation: event.target.value, location: undefined })
  }, [setTileDetails, tileDetails]);

  const onAutoLocationChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setAutoLocation(event.target.checked));
  }, [dispatch])

  const getCurrentLocation = useCallback((_event?: React.MouseEvent, signal?: AbortSignal) => {
    setGettingLocation(true);
    setGeolocated(true);
    getCurrentPosition().then(coords => {
      if (signal?.aborted) {
        return;
      }
      setTileDetails({ ...tileDetails, textLocation: "", location: coords })
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
    <Form.Group controlId="obstruction-location">
      <Form.Label>Where did you find this obstruction?</Form.Label>
      <Form.Control type="input" placeholder="1234 Main St." value={tileDetails.textLocation} onChange={onChangeLocation} />
    </Form.Group>
    <Button onClick={getCurrentLocation}>Use my current location</Button>
    {geolocated &&
      <Form.Check
        type={"checkbox"}
        label={"Always use my current location"}
        checked={autoLocation}
        onChange={onAutoLocationChange}
      />}
    <iframe src={mapUrl.href}></iframe>
  </>
}
