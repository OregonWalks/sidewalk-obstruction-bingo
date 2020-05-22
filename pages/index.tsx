import Head from 'next/head';
import React from 'react';
import Board from "../components/board";
import InstructionsAccordion from '../components/instructions-accordion';
import styles from './index.module.css';

export default function Index(): JSX.Element {
  return <main>
    <Head>
      <title>Sidewalk Obstruction Bingo</title>
      <link rel="manifest" href="/manifest.webmanifest" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <meta name="theme-color" content="#F4C823" />
    </Head>

    <div className={styles.banner}>
      <img src="/banner.svg" alt="Sidewalk Obstruction Bingo"></img>
    </div>

    <InstructionsAccordion />

    <div>
      <Board />
    </div>

  </main >;
}
