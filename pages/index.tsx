import Head from 'next/head';
import React, { useCallback } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from 'react-redux';
import Board from "../components/board";
import { RootState } from '../store';
import { setAutoLocation, setSendReports } from '../store/configSlice';
import styles from './index.module.css';

export default function Index(): JSX.Element {
  const dispatch = useDispatch();
  const config = useSelector((state: RootState) => state.config);

  const sendReports = config.state == "ready" && !!config.sendReports;
  const autoLocation = config.state == "ready" && !!config.autoLocation;

  const changeSendReports = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSendReports(event.target.checked));
  }, [dispatch]);
  const changeAutoLocation = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setAutoLocation(event.target.checked));
  }, [dispatch]);

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

    <Accordion>
      <Card>
        <Card.Header>
          <Accordion.Toggle as={Button} variant="primary" eventKey="0" block>
            How to Play
          </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey="0">
          <div>
            <Card.Body>
              <ul>
                <li><p>{"Go for a walk. When you see a sidewalk obstruction, tap it on the board. If you don't get a bingo in one walk, don't fret! "}
                  {"Your browser will remember your squares so you can keep going for walks until you get a bingo."}</p></li>
                <li><p>
                  {"When you get a bingo, you'll have the option to enter your information for a prize drawing."}
                </p></li>
                <li><p>
                  {"If you decide to start a new board, the tiles will re-shuffle so your card will look different every time you play."}
                </p>
                </li>
              </ul>

              <Form.Check type="switch" id="share_location" className={styles.switch}>
                <Form.Check.Input
                  checked={sendReports}
                  disabled={config.state == "loading"}
                  onChange={changeSendReports} />
                <Form.Check.Label>Share the location of the obstructions I find with Oregon Walks.</Form.Check.Label>
                <Form.Text className='text-muted'>
                  Sharing the location will allow us to better advocate for obstacle-free sidewalks.
               </Form.Text>
              </Form.Check>
              <Form.Check
                type="switch"
                id="current_location"
                label="Always use my current location when sharing obstruction locations."
                className={styles.switch}
                checked={autoLocation && sendReports}
                disabled={config.state == "loading" || !sendReports}
                onChange={changeAutoLocation}
              />
            </Card.Body>
            <Card.Body>
              <Card.Text className="text-muted">
                {'To add a shortcut to your homescreen:'}
              </Card.Text>
              <Accordion>
                <Card>
                  <Card.Header>
                    <Accordion.Toggle as={Button} variant="light" size="sm" eventKey="0" >
                      {'In iOS'}
                    </Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      {'In Safari, at the bottom of the page, tap the Share button (looks like a square with an arrow pointing out the top). '}
                      {'Tap "Add to Home Screen". The "Add to Home" dialog box will appear. Choose a name, confirm the link, then click Add.'}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
                <Card>
                  <Card.Header>
                    <Accordion.Toggle as={Button} variant="light" size="sm" eventKey="1" >
                      {'In Android'}
                    </Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse eventKey="1">
                    <Card.Body>
                      {'In Chrome, tap the menu icon (3 dots in upper right-hand corner) and tap "Add to Home Screen". '}
                      {'You’ll be able to enter a name for the shortcut and then Chrome will add it to your home screen.'}
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
            </Card.Body>
          </div>
        </Accordion.Collapse>
      </Card>
      <Card>
        <Card.Header>
          <Accordion.Toggle as={Button} variant="primary" eventKey="1" block>
            Report a Sidewalk Obstruction
          </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey="1" className='d-print-block' >
          <Card.Body>
            <h5>Scooter in Walkway</h5>
            <p>{"Contact the e-scooter company directly using information on the scooter, or find contact information on the City's "}
              <a href="https://www.portlandoregon.gov/transportation/79174">E-Scooter Reporting and Feedback</a> {' page.'}
            </p>

            <h5>All Other Issues</h5>
            <p>{'Can be reported on '}
              <a href="https://pdxreporter.org/">pdxreporter.org</a>
              {', or use the phone numbers listed below:'}</p>

            <p>Broken Sidewalk: <a href="tel:503-823-1711">503-823-1711</a>
              <br />Illegal Parking: <a href="tel:503-823-5195">503-823-5195</a>
              <br />Overgrown Vegetation in the Right-of-Way: <a href="tel:503-823-4489">503-823-4489</a>
              <br />Work Zone Concern: <a href="tel:503-823-7233">503-823-SAFE</a>
              <br />Street Lighting: <a href="tel:503-865-5267">503-865-5267</a>
              <br />A-Frame Blocking Sidewalk: <a href="tel:503-823-1711">503-823-1711</a>
              <br />Refuse Bins in the Right-of-Way: <a href="tel:503-823-7202">503-823-7202</a></p>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>

    <div>
      <Board />
    </div>

  </main >;
}
