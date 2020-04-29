import { openDB } from 'idb';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { SobDBSchema } from '../services/db-schema';
import { loadBoard } from '../store/boardSlice';
import { loadConfig } from '../store/configSlice';
import { setDb } from '../store/dbSlice';

export default function DbLoader({ initialKeyvalsForTest = undefined }: {
  initialKeyvalsForTest?: object | undefined;
}): JSX.Element {
  const dispatch = useDispatch();

  useEffect(() => {
    let mounted = true;
    const dbPromise = openDB<SobDBSchema>("sidewalk-obstruction-bingo", 1, {
      upgrade(db, oldVersion, _newVersion, tx) {
        switch (oldVersion) {
          case 0: {
            const reportStore = db.createObjectStore('queuedReports', { keyPath: 'uuid' });
            reportStore.createIndex("tile", "tile");
            reportStore.createIndex("addTime", "addTime");

            db.createObjectStore('keyval');

            if (initialKeyvalsForTest !== undefined) {
              for (const [key, value] of Object.entries(initialKeyvalsForTest)) {
                tx.objectStore("keyval").add(value, key);
              }
            }
          }
        }
      },
      blocking() {
        // Everything should always be saved to IDB, and the system should only
        // notice that an upgrade is needed as another page is loaded, so we want to
        // get out of the way ASAP. Do that by immediately closing the database, and
        // then reload the page to get back in sync with the new code.
        dbPromise.then(db => db.close());
        location.reload();
      },
    });

    async function loadDb(): Promise<void> {
      const db = await dbPromise;

      const [configLoaded, boardLoaded] = await Promise.all([
        loadConfig(db),
        loadBoard(db),
      ]);
      if (mounted) {
        dispatch(setDb(db));
        dispatch(configLoaded);
        dispatch(boardLoaded);
      }
    }
    loadDb();

    // On unmount:
    return (): void => {
      mounted = false;
      dbPromise.then(db => db.close());
    }
  }, [dispatch, initialKeyvalsForTest])

  return <></>;
}
