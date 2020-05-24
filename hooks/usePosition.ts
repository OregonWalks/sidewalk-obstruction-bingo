import { useEffect, useState } from 'react';

export type UsePositionResult = {
  apiAvailable: boolean;
  permissionState: PermissionState;
  lastPosition?: Position;
  error?: PositionError;
};

export type UsePositionOptions = {
  requestNow: boolean;
  onPosition?: (pos: Position) => void;
};

const apiAvailable: boolean = 'navigator' in globalThis && navigator.geolocation && !!navigator.geolocation.getCurrentPosition;

export default function usePosition({ requestNow, onPosition }: UsePositionOptions): UsePositionResult {
  const [permissionState, setPermissionState] = useState<PermissionState>(apiAvailable ? "prompt" : "denied");
  const [lastPosition, setLastPosition] = useState<Position | undefined>(undefined);
  const [error, setError] = useState<PositionError | undefined>(undefined);

  // Ask for the permission state.
  useEffect(() => {
    if (apiAvailable && navigator.permissions && navigator.permissions.query) {
      const abortController = new AbortController();
      navigator.permissions.query({ name: "geolocation" }).then(status => {
        if (abortController.signal.aborted) return;
        setPermissionState(status.state);
        status.onchange = (): void => {
          setPermissionState(status.state);
          // The user had to do something to change the permission state, which
          // might have made any errors, especially PERMISSION_DENIED, obsolete.
          setError(undefined);
        };
        abortController.signal.onabort = (): void => {
          status.onchange = null;
        }
      }, error => {
        console.error("Failed to query the geolocation permission state:", error);
      })

      return (): void => {
        abortController.abort();
      }
    }
  }, []);

  // Ask for the position if the caller wants to.
  useEffect(() => {
    if (!requestNow || !apiAvailable) return;

    const abortController = new AbortController();
    navigator.geolocation.getCurrentPosition(
      position => {
        if (abortController.signal.aborted) return;
        setLastPosition(position);
        setError(undefined);
        if (onPosition) onPosition(position);
      },
      error => {
        if (abortController.signal.aborted) return;
        console.log(error);
        setError(error);
        setLastPosition(undefined);
        if (error.code === error.PERMISSION_DENIED) {
          // Work even if permission.query doesn't.
          setPermissionState("denied");
        }
      }, {
      maximumAge: 5000,
      timeout: 10000,
      enableHighAccuracy: true,
    });

    return (): void => {
      abortController.abort();
    }
  }, [requestNow, onPosition]);

  return {
    apiAvailable,
    permissionState,
    lastPosition,
    error,
  };
}
