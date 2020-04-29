import { fireEvent, render } from '@testing-library/react';
import React from 'react';
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
    render(<Tile tileindex={1} tileid={3} matched={false} onToggleMatched={toggleMatched} />, {
      container: tr(),
    });

  fireEvent.click(await findByAltText('A-frame sign'));

  expect(toggleMatchedCalls).toStrictEqual([1]);
});
