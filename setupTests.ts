import '@testing-library/jest-dom/extend-expect';
import { deleteDB } from 'idb';

type IDBFactoryWithDatabases = IDBFactory & { databases: () => Promise<{ name: string; version: number }[]> };

beforeEach(async () => {
  // Make sure we're starting from a blank IndexedDB slate.
  expect(await (indexedDB as IDBFactoryWithDatabases).databases()).toHaveLength(0);
});

afterEach(async () => {
  await deleteDB('sidewalk-obstruction-bingo');
});

process.on('unhandledRejection', (r: Error): void => {
  console.error(r.stack);
});
