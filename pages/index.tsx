import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Board from "../components/board";
import styles from './index.module.css';

export default function Index(): JSX.Element {
  return <main>
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

              <Form.Group>
                <Form.Check
                  type="switch"
                  id="share_location"
                  label="Share the location of the obstructions I find with Oregon Walks."
                  className={styles.switch}
                />
                <Form.Text className={`text-muted ${styles.switchText}`}>
                  Sharing the location will allow us to better advocate for obstacle-free sidewalks.
               </Form.Text>
              </Form.Group>
              <Form.Check
                type="switch"
                id="current_location"
                label="Always use my current location when sharing obstruction locations."
                className={styles.switch}
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
        <Accordion.Collapse eventKey="1">
          <Card.Body>
            <h4>Scooter in Walkway</h4>
            <p>{"Contact the e-scooter company directly using information on the scooter, or find contact information on the City's "}
              <a href="https://www.portlandoregon.gov/transportation/79174">E-Scooter Reporting and Feedback</a> {' page.'}
            </p>

            <h4>All Other Issues</h4>
            <p>{'Can be reported on '}
              <a href="https://pdxreporter.org/">pdxreporter.org</a>
              {', or use the phone numbers listed below:'}</p>

            <p>Broken Sidewalk: <a href="tel:503-823-1711">503-823-1711</a></p>

            <p>Illegal Parking: <a href="tel:503-823-5195">503-823-5195</a></p>

            <p>Overgrown Vegetation in the Right-of-Way: <a href="tel:503-823-4489">503-823-4489</a></p>

            <p>Work Zone Concern: <a href="tel:503-823-7233">503-823-SAFE</a></p>

            <p>Street Lighting: <a href="tel:503-865-5267">503-865-5267</a></p>

            <p>A-Frame Blocking Sidewalk: <a href="tel:503-823-1711">503-823-1711</a></p>

            <p>Refuse Bins in the Right-of-Way: <a href="tel:503-823-7202">503-823-7202</a></p>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>

    <div>
      <Board />
    </div>

  </main >;
}
