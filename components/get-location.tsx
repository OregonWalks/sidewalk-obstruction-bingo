import React, { useCallback, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useDispatch } from 'react-redux';
import { setAutoLocation } from '../store/configSlice';

export default function GetLocation({ location, setLocation, textLocation, setTextLocation, autoLocation }: {
  location?: Coordinates; setLocation: (coords: Coordinates | undefined) => void;
  textLocation: string; setTextLocation: (loc: string) => void;
  autoLocation?: boolean;
}): JSX.Element {
  const dispatch = useDispatch();

  // True if the user has asked for their location in this instance of the dialog.
  const [geolocated, setGeolocated] = useState(false);
  //const [geolocationError, setGeolocationError] = useState<PositionError>(null);

  const onChangeLocation = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setTextLocation(event.target.value);
    setLocation(undefined);
  }, [setTextLocation, setLocation]);

  const onAutoLocationChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setAutoLocation(event.target.checked));
  }, [dispatch])

  const useCurrentLocation = useCallback(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setGeolocated(true);
      setTextLocation("");
      setLocation(position.coords);
    }, () => {
      //setGeolocationError(error);
    }, {
      maximumAge: 5000,
      timeout: 10000,
      enableHighAccuracy: true,
    });
  }, [setGeolocated, setTextLocation, setLocation]);

  // Documentation at https://developers.google.com/maps/documentation/embed/guide#place_mode.
  const mapUrl = new URL("https://www.google.com/maps/embed/v1/place?key=AIzaSyAQ9QAtFgij7jVNf_ZelJ4eg_oq1bLt_jE");
  if (location) {
    // This lat/lng format was guessed from
    // https://developers.google.com/maps/documentation/urls/guide#search-action.
    mapUrl.searchParams.append("q", `${location.latitude},${location.longitude}`);
  } else if (textLocation) {
    mapUrl.searchParams.append("q", `${textLocation} near Portland, OR`);
  } else {
    mapUrl.searchParams.append("q", "Portland, OR");
  }

  return <>
    <Form.Group controlId="obstructin-location">
      <Form.Label>Where did you find this obstruction?</Form.Label>
      <Form.Control type="input" placeholder="1234 Main St." value={textLocation} onChange={onChangeLocation} />
    </Form.Group>
    <Button onClick={useCurrentLocation}>Use my current location</Button>
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
