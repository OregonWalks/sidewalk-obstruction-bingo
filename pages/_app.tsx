import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import DbProvider from '../components/db-provider';
import '../styles.css';

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }: { Component: React.ComponentType; pageProps: object }): JSX.Element {
  return <DbProvider>
    <Component {...pageProps} />
  </DbProvider>;
}
