import { TileDetails } from "../components/gather-tile-details-modal";
import { TileInterface } from "./tiles";

export function queueReport(tile: TileInterface, details: TileDetails): void {
  console.log("Queue", tile, details);
}

export function tryUnqueueReport(tile: TileInterface): void {
  console.log("Unqueue", tile);
}
