import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { submittedRaffleEntry } from '../store/configSlice';
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
  const clickEnterRaffle = useCallback(() => {
    dispatch(submittedRaffleEntry({ email, addToList }));
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
  if (enteredRaffle === "yes") {
    raffleCardBody = <Card.Body>
      Thank you for entering the raffle!
    </Card.Body>;
  } else {
    raffleCardBody = <Card.Body>
      <Form>
        {'Would you like to be entered for a prize?'}
        <Form.Group>
          <Form.Control type="email" placeholder="Enter email" value={email} onChange={changeEmail} />
        </Form.Group>
        <Form.Check type="checkbox" id='email_check'>
          <Form.Check.Input checked={addToList} onChange={changeAddToList} />
          <Form.Check.Label>Add me to the Oregon Walks email list</Form.Check.Label>
          <Form.Text className='text-muted'>
            {'(X emails per month on average.)'}
          </Form.Text>
        </Form.Check>
      </Form>
      <div className='text-right'>
        <Button variant='warning' size='sm' onClick={clickEnterRaffle} disabled={enteredRaffle === "entering"}>
          {enteredRaffle === "entering" ?
            <Spinner animation="border" role="status">
              <span className="sr-only">Submitting...</span>
            </Spinner>
            : "Submit"}
        </Button>
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
