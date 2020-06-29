import Head from 'next/head';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Collapse from 'react-bootstrap/Collapse';
import { useSelector } from 'react-redux';
import Board from "../components/board";
import InstructionsAccordion from '../components/instructions-accordion';
import { wonSelector } from '../store/boardSlice';
import styles from './index.module.css';

export default function Index(): JSX.Element {
  const won = useSelector(wonSelector);

  return <main>
    <Head>
      <title>Sidewalk Obstruction Bingo</title>
      <link rel="manifest" href="/manifest.webmanifest" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <meta name="theme-color" content="#F4C823" />
      <meta property="og:url" content="/" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Sidewalk Obstruction Bingo" />
      <meta property="og:description" content="Go for a walk. When you see a sidewalk obstruction, tap it on the board. Choose whether or not to report the location of obstructions you find." />
      <meta property="og:image" content="/facebook_link.png" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@OregonWalks" />
      <meta name="twitter:title" content="Sidewalk Obstruction Bingo" />
      <meta name="twitter:description" content="Go for a walk. When you see a sidewalk obstruction, tap it on the board. Choose whether or not to report the location of obstructions you find." />
      <meta name="twitter:image" content="/twitter_link.png" />
    </Head>

    <div className={styles.banner}>
      <img src="/banner.svg" alt="Sidewalk Obstruction Bingo"></img>
    </div>

    <Collapse in={!won}><div>
      <InstructionsAccordion />
    </div></Collapse>

    <div>
      <Board />
    </div>

    <Card className='d-print-none'>
      <Card.Header>
        <Button variant="primary" href="https://oregonwalks.org/" block> Oregon Walks </Button>
      </Card.Header>
    </Card>

    <Card className='d-print-none'>
      <Card.Header>
        <Button variant="primary" href="https://donatenow.networkforgood.org/1435882" block> Donate </Button>
      </Card.Header>
    </Card>

  </main >;
}
