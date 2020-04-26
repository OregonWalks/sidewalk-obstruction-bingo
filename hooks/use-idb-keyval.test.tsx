import { fireEvent, render } from '@testing-library/react';
import React, { useCallback } from 'react';
import DbProvider from '../components/db-provider';
import useIdbKeyval from './use-idb-keyval';

function TestKeyVal({ idbKey, value, reportValue }: {
  idbKey: string; value: string; reportValue: (v: string) => void;
}): JSX.Element {
  const [gotValue, setValue] = useIdbKeyval(idbKey, null);
  const onClick = useCallback((): void => setValue(value), [value, setValue]);
  reportValue(gotValue);
  return <label>Change from {String(gotValue)}{': '}
    <button type="button" onClick={onClick}>Set</button>
  </label>
}

test('works with a new database', async () => {
  const report = jest.fn();
  const { findByLabelText } = render(<DbProvider>
    <TestKeyVal idbKey="key" value="value" reportValue={report} />
  </DbProvider>);

  const setButton = await findByLabelText(/Change from undefined/);
  expect(setButton).toBeVisible();
  fireEvent.click(setButton);
  expect(await findByLabelText(/Change from value/)).toBeVisible();
  expect(report.mock.calls).toEqual([[null], [null], [null], [undefined], ["value"]]);
});
