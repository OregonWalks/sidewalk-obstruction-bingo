import { TileDetails } from "../components/gather-tile-details-modal";
import { CancelReport, FoundReport, SobDB } from './db-schema';
import { TileInterface } from "./tiles";

const reportAppScriptUrl =
  "https://script.google.com/macros/s/AKfycbwx-6aWGb_zojc9r-RGz84NGeTmWdv96ovuLOZQSNzRfyUxR2U/exec";

const productionSpreadsheet = "1oePSSxULfE4u1DZ2Gf91SkacNvYWXc_ZlbzEzntzlto";
const testSpreadsheet = "1ahxdRFPvX_aZd3O3lnzT36zNTWpj0ZMF6BqxWmKXYsA";
const currentSpreadsheet = ((): string => {
  if (typeof window === 'undefined') {
    return "";
  } else if (location.hostname.endsWith("localhost")) {
    return testSpreadsheet;
  } else {
    return productionSpreadsheet;
  }
})();

const sendReportsDelay = 60 * 1000;
const minReportAgeToSend = 10 * 1000;

let sendReportsTaskId = -1;

function scheduleSendReports(db: SobDB): void {
  if (sendReportsTaskId === -1) {
    sendReportsTaskId = window.setTimeout(async () => {
      sendReportsTaskId = -1;

      const now = new Date();
      const tx1 = db.transaction('queuedReports', 'readwrite');
      const reports = await tx1.store.index('addTime')
        .getAll(IDBKeyRange.upperBound(new Date(now.getTime() - minReportAgeToSend)));

      // Mark all the reports as last-sent now.
      await Promise.all(reports.map(report => {
        report.sending = now;
        return tx1.store.put(report);
      }));
      const postBody = JSON.stringify(reports.map(report => {
        // The funny type here tells Typescript that I mean to read fields
        // that don't exist on all the possible input types. The rest will get
        // undefined, which is what I want in the output.
        const { uuid, type, tile, details, textLocation, latitude, longitude, accuracy } = report as FoundReport & CancelReport;
        return { uuid, type, tile, details, textLocation, latitude, longitude, accuracy };
      }));

      // Explicitly close the transaction before the fetch, so it's not
      // ambiguous whether it closes during the fetch.
      await tx1.done;

      const reportTarget = new URL(reportAppScriptUrl);
      reportTarget.searchParams.append("sheet", currentSpreadsheet);
      const req = new Request(reportTarget.href, {
        method: "POST",
        headers: new Headers({
          // Avoid a CORS preflight:
          'Content-Type': 'text/plain',
        }),
        body: postBody,
        credentials: "omit",
        referrerPolicy: "origin",
      });
      const response = await fetch(req);
      if (!response.ok) {
        console.error("Failed to send report:", response);
        return;
      }

      const { written, debugLog, error }: { written: string[]; debugLog: unknown[]; error: object } = await response.json();
      if (error) {
        console.error('Server error:', error);
      }
      if (debugLog) {
        console.log('Server debug log:', debugLog);
      }

      const tx2 = db.transaction('queuedReports', 'readwrite');
      await Promise.all(written.map(uuid => tx2.store.delete(uuid)));
      if ((await tx2.store.count()) > 0) {
        scheduleSendReports(db);
      }
      await tx2.done;
    }, sendReportsDelay);
  }
}

export async function queueReport(
  db: SobDB,
  uuid: string,
  tile: TileInterface,
  { detailString, textLocation, location }: TileDetails): Promise<string> {
  const tx = db.transaction('queuedReports', 'readwrite');
  await tx.store.add({
    uuid,
    addTime: new Date(),
    sending: null,
    type: 'Found',
    tile: tile.alt,
    details: detailString,
    textLocation,
    latitude: location?.latitude,
    longitude: location?.longitude,
    accuracy: location?.accuracy,
  });
  await tx.done;
  scheduleSendReports(db);
  return uuid;
}

export async function tryUnqueueReport(db: SobDB, uuid: string): Promise<void> {
  const tx = db.transaction('queuedReports', 'readwrite');
  const lastMatchingReportCursor = await tx.store.openCursor(uuid);
  if (lastMatchingReportCursor === null || lastMatchingReportCursor.value.sending !== null) {
    // The 'Found' report was already sent, so add a 'Cancel' report.
    await tx.store.add({
      uuid,
      addTime: new Date(),
      sending: null,
      type: 'Cancel',
    });
    await tx.done;
    scheduleSendReports(db);
  } else {
    // We caught it in time and can just delete the report.
    await lastMatchingReportCursor.delete();
    await tx.done;
  }
}
