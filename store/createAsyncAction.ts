import { ActionCreatorWithPayload, ActionCreatorWithPreparedPayload, createAction, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '.';

// See https://github.com/microsoft/TypeScript/issues/31751 for a hint at why we need to use [undefined].
type AsyncActionCreatorFunction<PayloadArg, ResultType> = [PayloadArg] extends [undefined] ?
  () => (dispatch: Dispatch, getState: () => RootState) =>
    Promise<PayloadAction<ResultType> | PayloadAction<undefined, string, never, Error>>
  :
  (payloadArg: PayloadArg) => (dispatch: Dispatch, getState: () => RootState) =>
    Promise<PayloadAction<ResultType> | PayloadAction<undefined, string, never, Error>>
  ;

export type AsyncActionCreator<PayloadArg, ResultType> = AsyncActionCreatorFunction<PayloadArg, ResultType> & {
  pending: ActionCreatorWithPayload<PayloadArg>;
  fulfilled: ActionCreatorWithPayload<ResultType>;
  rejected: ActionCreatorWithPreparedPayload<[Error], undefined, string, Error, never>;
};

/** Makes a function that fires off some asynchronous work, reporting the work's
 * progress to Redux via "pending", "fulfilled", and "rejected" lifecycle
 * actions.
 *
 * These actions are named `${namePrefix}/` and then the lifecycle stage's name.
 *
 * The function assumes that `payloadCreator()` only rejects with an Error
 * instance.
 *
 * Similar to, but simpler than redux-toolkit's createAsyncThunk().
 *
 * @param namePrefix
 * @param payloadCreator An async function to do the work of creating the
 * action.
 */
export default function createAsyncAction<PayloadArg, ResultType>(
  namePrefix: string,
  payloadCreator: (payloadArg: PayloadArg, getState: () => RootState, dispatch: Dispatch) => Promise<ResultType>
): AsyncActionCreator<PayloadArg, ResultType> {
  const pending = createAction<PayloadArg>(`${namePrefix}/pending`) as ActionCreatorWithPayload<PayloadArg>;
  const fulfilled = createAction<ResultType>(`${namePrefix}/fulfilled`) as ActionCreatorWithPayload<ResultType>;
  const rejected = createAction(`${namePrefix}/rejected`, ({ name, message, stack }: Error) => ({
    payload: undefined,
    error: { name, message, stack }
  }));
  const actionCreator = (payloadArg: PayloadArg) =>
    async (dispatch: Dispatch, getState: () => RootState): Promise<ReturnType<typeof fulfilled> | ReturnType<typeof rejected>> => {
      dispatch(pending(payloadArg));
      let finalAction;
      try {
        finalAction = fulfilled(await payloadCreator(payloadArg, getState, dispatch));
      }
      catch (error) {
        finalAction = rejected(error);
      }
      dispatch(finalAction);
      return finalAction;
    };
  return Object.assign(actionCreator as AsyncActionCreatorFunction<PayloadArg, ResultType>,
    { pending, fulfilled, rejected });
}
