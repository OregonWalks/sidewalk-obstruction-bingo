import Document, { Head, Html, Main, NextScript } from 'next/document';
import React from 'react';

export default class SOBDocument extends Document {
  render(): JSX.Element {
    return (
      <Html lang="en-US">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
