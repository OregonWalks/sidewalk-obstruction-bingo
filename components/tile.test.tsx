import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import store from '../store';
import Tile from './tile';

function tr(): HTMLTableRowElement {
  const tr = document.createElement("tr");
  const table = document.createElement("table");
  table.appendChild(tr);
  document.body.appendChild(table);
  return tr;
}

test('shows a simple unmatched tile', async () => {
  const toggleMatchedCalls: number[] = [];
  function toggleMatched(index: number): void { toggleMatchedCalls.push(index); }
  const { findByAltText } =
    render(<Provider store={store}>
      <Tile tileindex={1} tileid={3} matched={{ match: false, pending: false }} />
    </Provider>, {
      container: tr(),
    });

  fireEvent.click(await findByAltText('A-frame sign'));

  expect(toggleMatchedCalls).toStrictEqual([1]);
});
