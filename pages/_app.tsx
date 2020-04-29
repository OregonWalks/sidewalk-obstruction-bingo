import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Provider } from 'react-redux';
import DbLoader from '../components/db-loader';
import store from '../store';
import '../styles.css';

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }: { Component: React.ComponentType; pageProps: object }): JSX.Element {
  return <Provider store={store}>
    <DbLoader/>
    <Component {...pageProps} />
  </Provider>;
}
