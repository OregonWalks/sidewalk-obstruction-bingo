import { get, set } from 'idb-keyval';
import useSWR from 'swr'
import { useCallback } from 'react';

/**
 * A React Hook that maintains a local variable as the value of an idb-keyval 
 * value.
 * 
 * @param key idb-keyval's key.
 * @param initialValue The value to render with before the first get() returns.
 * 
 * @returns an array of [value, set], where 'value' is the value of idb-keyval.get(key),
 * and 'set(newVal)' passes through to idb-keyval.set(key, newVal).
 */
export default function useIdbKeyval<Type>(key: string, initialValue: Type): [Type, (newval: Type) => void] {
  let { data, mutate } = useSWR<Type, DOMException>(key, get, { initialData: initialValue });

  let update = useCallback((newVal: Type) => {
    mutate(set(key, newVal).then(() => newVal), false);
  }, [key, mutate]);

  return [data, update];
}
