import { fireEvent, render, within } from '@testing-library/react';
import React, { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import store from '../store';
import Board from './board';
import DbLoader from './db-loader';

function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
  // Have clicks on the board not pop up a dialog asking what location to report.
  return <Provider store={store}>
    <DbLoader initialKeyvalsForTest={{ "send-reports": false }} />
    {children}
  </Provider>
}

test('can bingo', async () => {
  const { findByRole, findByAltText } = render(<Board />, { wrapper: Wrapper });

  const table = await findByRole('table') as HTMLTableElement;
  let cell: HTMLTableCellElement;
  fireEvent.click(cell = table.rows[0].cells[0]);
  expect(await within(cell).findByAltText("Marked")).toBeInTheDocument();
  fireEvent.click(cell = table.rows[0].cells[1]);
  expect(await within(cell).findByAltText("Marked")).toBeInTheDocument();
  fireEvent.click(cell = table.rows[0].cells[2]);
  expect(await within(cell).findByAltText("Marked")).toBeInTheDocument();
  fireEvent.click(cell = table.rows[0].cells[3]);
  expect(await within(cell).findByAltText("Marked")).toBeInTheDocument();
  fireEvent.click(cell = table.rows[0].cells[4]);
  // Last mark may or may not show up before winning text appears.
  expect(await findByAltText('You Won!')).toBeInTheDocument();
});

test('can bingo with the free square', async () => {

  const { findByRole, findByAltText } = render(<Board />, { wrapper: Wrapper });

  const table = await findByRole('table') as HTMLTableElement;
  let cell: HTMLTableCellElement;
  fireEvent.click(cell = table.rows[2].cells[0]);
  // TODO: If the test doesn't wait for these marks to appear, some get lost.
  expect(await within(cell).findByAltText("Marked")).toBeInTheDocument();
  fireEvent.click(cell = table.rows[2].cells[1]);
  expect(await within(cell).findByAltText("Marked")).toBeInTheDocument();
  fireEvent.click(cell = table.rows[2].cells[3]);
  expect(await within(cell).findByAltText("Marked")).toBeInTheDocument();
  fireEvent.click(cell = table.rows[2].cells[4]);

  expect(await findByAltText('You Won!')).toBeInTheDocument();
});
