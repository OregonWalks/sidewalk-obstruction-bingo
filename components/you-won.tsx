import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from 'react-redux';
import { enterRaffle } from '../services/report';
import { RootState } from '../store';
import { setEnteredRaffle } from '../store/configSlice';
import style from './you-won.module.css';


export default function YouWon(): JSX.Element {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const changeEmail = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(event.target.value);
  }, [setEmail]);

  const [addToList, setAddToList] = useState(false);
  const changeAddToList = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
    setAddToList(event.target.checked);
  }, [setAddToList]);

  const enteredRaffle = useSelector((state: RootState) =>
    state.config.state === "ready" && state.config.enteredRaffle);
  const clickEnterRaffle = useCallback(async () => {
    try {
      await enterRaffle(email, addToList);
      dispatch(setEnteredRaffle(true));
    } catch (e) {
      console.error(e);
    }
  }, [addToList, dispatch, email]);

  const youWonImg = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (youWonImg.current !== null) {
      // Restart the animation, using the technique endorsed by
      // https://html.spec.whatwg.org/multipage/images.html#reacting-to-dom-mutations.
      // eslint-disable-next-line no-self-assign
      youWonImg.current.src = youWonImg.current.src;
    }
  }, []);

  let raffleCardBody: ReactNode = null;
  if (enteredRaffle) {
    raffleCardBody = <Card.Body>
      Thank you for entering the raffle!
    </Card.Body>;
  } else {
    raffleCardBody = <Card.Body><Form>
      <Form.Group><Form.Label>Would you like to be entered for a prize?
</Form.Label>
        <Form.Group>
          <Form.Control type="email" placeholder="Enter email" value={email} onChange={changeEmail} />
        </Form.Group>
        <Form.Group controlId='email_check'>
          <Form.Check
            type="checkbox"
            label="Add me to the Oregon Walks email list"
            checked={addToList}
            onChange={changeAddToList}
          />
          <Form.Text className='text-muted subText'>
            (X emails per month on average.)
          </Form.Text>

        </Form.Group>
      </Form.Group>
    </Form>
      <div className='text-right'>
        <Button variant='warning' size='sm' onClick={clickEnterRaffle}>Submit</Button>
      </div>
    </Card.Body>;
  }

  return <>
    <img ref={youWonImg} src="/you_won.gif" alt="You Won!" className={style.wonImg}></img>
    <Card
      border='warning'
      className={style.raffleCard}>
      <Card.Header className="text-center" as='h3'>
        You won!
      </Card.Header>
      {raffleCardBody}
    </Card>
  </>;
}
