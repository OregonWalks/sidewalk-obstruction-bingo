import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { SobDB } from '../services/db-schema';
import { createNewStoreForTest } from '../store';
import { boardLoadedForTest } from '../store/boardSlice';
import { configLoadedForTest } from '../store/configSlice';
import { setDb } from '../store/dbSlice';
import Tile from './tile';

function tr(): HTMLTableRowElement {
  const tr = document.createElement("tr");
  const table = document.createElement("table");
  table.appendChild(tr);
  document.body.appendChild(table);
  return tr;
}


test('shows a simple unmatched tile', async () => {
  const store = createNewStoreForTest();
  store.dispatch(setDb("TODO: put a fake DB here" as unknown as SobDB));
  store.dispatch(boardLoadedForTest({
    tileorder: [5, 6],
    matched: [
      { match: false, pending: false },
      { match: false, pending: false },
    ],
  }));
  store.dispatch(configLoadedForTest({ sendReports: false, autoLocation: true }));

  const { findByAltText } =
    render(<Provider store={store}>
      <Tile tileindex={1} tileid={3} matched={{ match: false, pending: false }} />
    </Provider>, {
      container: tr(),
    });

  fireEvent.click(await findByAltText('A-frame sign'));
  await findByAltText('Marked');

  const board = store.getState().board;
  if (board.isLoading) throw new Error("Can't happen");
  expect(board.matched[1]).toEqual({ match: true, pending: false });
});
