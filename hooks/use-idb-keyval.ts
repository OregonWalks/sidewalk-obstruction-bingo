import { get, set } from 'idb-keyval';
import { useCallback } from 'react';
import useSWR from 'swr';

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
  const { data, mutate } = useSWR<Type, DOMException>(
    ("indexedDB" in globalThis) && key, get, { initialData: initialValue });

  const update = useCallback((newVal: Type) => {
    mutate(set(key, newVal).then(() => newVal), false);
  }, [key, mutate]);

  return [data, update];
}
