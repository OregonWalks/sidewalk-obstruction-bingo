import { useCallback, useContext, useDebugValue } from 'react';
import useSWR from 'swr';
import DbContext, { SobDB } from '../context/db-context';

async function get<Type>(db: SobDB, key: string): Promise<Type> {
  const result = await db.get('keyval', key) as Type;
  return result;
}

async function set<Type>(db: SobDB, key: string, value: Type): Promise<void> {
  await db.put('keyval', value, key);
}

/**
 * A React Hook that maintains a local variable as the value of an idb-keyval
 * value.
 *
 * idb-keyval returns `undefined` for variables that have never been set, so
 * to distinguish between that and the not-yet-read value, set `initialValue`
 * to something else.
 *
 * @param key idb-keyval's key.
 * @param initialValue The value to render with before the first get() returns.
 *
 * @returns an array of [value, set], where 'value' is the value of idb-keyval.get(key),
 * and 'set(newVal)' passes through to idb-keyval.set(key, newVal).
 */
export default function useIdbKeyval<Type>(key: string, initialValue: Type): [Type, (newval: Type) => void] {
  const db = useContext(DbContext);
  const { data, mutate } = useSWR<Type, DOMException>(
    [db, key], get, { initialData: initialValue });

  useDebugValue(`${key}: ${data}`);

  const update = useCallback((newVal: Type) => {
    mutate(set(db, key, newVal).then(() => newVal), false);
  }, [db, key, mutate]);

  return [data, update];
}
