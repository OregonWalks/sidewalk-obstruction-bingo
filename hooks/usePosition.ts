import { useEffect, useState } from 'react';

export type UsePositionResult = {
  apiAvailable: boolean;
  permissionState: PermissionState;
  lastPosition?: Position | "searching";
  error?: PositionError;
};

export type UsePositionOptions = {
  requestNow: boolean;
  onPosition?: (pos: Position) => void;
  onError?: (err: PositionError) => void;
};

const apiAvailable: boolean = 'navigator' in globalThis && navigator.geolocation && !!navigator.geolocation.getCurrentPosition;
let permissionStatus: PermissionStatus | "initializing" | "unavailable" | "firstcall" = "firstcall";
let globalPermissionState: PermissionState = "prompt";
const permissionStatesToUpdate: Set<(ps: PermissionState) => void> = new Set();

function setGlobalPermissionState(state: PermissionState): void {
  globalPermissionState = state;
  for (const setPermissionState of permissionStatesToUpdate) {
    setPermissionState(state);
  }
}

async function initializePermissionStatus(): Promise<void> {
  if (permissionStatus !== "firstcall") return;
  if (!apiAvailable || !navigator.permissions || !navigator.permissions.query) {
    permissionStatus = "unavailable";
    return;
  }
  permissionStatus = "initializing";
  try {
    const status = await navigator.permissions.query({ name: "geolocation" })
    permissionStatus = status;
    setGlobalPermissionState(status.state);
    status.onchange = (): void => {
      setGlobalPermissionState(status.state);
    };
  } catch (error) {
    console.error("Failed to query the geolocation permission state:", error);
    permissionStatus = "unavailable";
  }
}

export default function usePosition({ requestNow, onPosition, onError }: UsePositionOptions): UsePositionResult {
  const [permissionState, setPermissionState] = useState<PermissionState>(globalPermissionState);
  const [lastPosition, setLastPosition] = useState<Position | "searching" | undefined>(undefined);
  const [error, setError] = useState<PositionError | undefined>(undefined);

  // Ask for the permission state.
  useEffect(() => {
    if (!apiAvailable) {
      globalPermissionState = "denied";
      setPermissionState(globalPermissionState);
      return;
    }
    initializePermissionStatus();
    permissionStatesToUpdate.add(setPermissionState);

    return (): void => {
      permissionStatesToUpdate.delete(setPermissionState);
    }
  }, []);

  // Ask for the position if the caller wants to.
  useEffect(() => {
    if (!requestNow || !apiAvailable) return;

    const abortController = new AbortController();
    setLastPosition("searching");
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
        if (onError) onError(error);
        if (permissionStatus === "unavailable" &&
          error.code === error.PERMISSION_DENIED) {
          // If permission.query doesn't work, assume a single denied means this
          // tab will deny forever.
          setGlobalPermissionState("denied");
        }
      }, {
      maximumAge: 5000,
      timeout: 10000,
      enableHighAccuracy: true,
    });

    return (): void => {
      abortController.abort();
    }
  }, [requestNow, onPosition, onError]);

  return {
    apiAvailable,
    permissionState,
    lastPosition,
    error,
  };
}
