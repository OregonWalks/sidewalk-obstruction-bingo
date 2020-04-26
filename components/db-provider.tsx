import { openDB } from 'idb';
import React, { ReactNode, useEffect, useState } from 'react';
import DbContext, { SobDBSchema } from '../context/db-context';

export default function DbProvider({ initialKeyvalsForTest = undefined, children }: {
  initialKeyvalsForTest?: object | undefined;
  children: ReactNode;
}): JSX.Element {
  const [db, setDb] = useState(null);

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

    dbPromise.then(db => {
      if (mounted) {
        setDb(db);
      }
    })

    // On unmount:
    return async (): Promise<void> => {
      mounted = false;
      (await dbPromise).close();
    }
  }, [initialKeyvalsForTest])

  return <DbContext.Provider value={db}>
    {children}
  </DbContext.Provider>
}
