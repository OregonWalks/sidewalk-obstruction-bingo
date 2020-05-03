export function getCurrentPosition(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      position => resolve(position.coords),
      error => reject(error),
      {
        maximumAge: 5000,
        timeout: 10000,
        enableHighAccuracy: true,
      });
  });
}
