import { combineReducers, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import board from './boardSlice';
import config from './configSlice';
import db from './dbSlice';

const reducer = combineReducers({ db, config, board, });

export type RootState = ReturnType<typeof reducer>;

export default configureStore({
  reducer,
  middleware: [...getDefaultMiddleware({
    // I'm storing an open IndexedDB object in the store, which breaks all the rules.
    immutableCheck: { ignoredPaths: ["db.db"] },
    serializableCheck: {
      ignoredActions: ["db/setDb"],
      ignoredPaths: ["db.db"]
    },
  })],
});
