import React, { useState } from 'react';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  decrement,
  increment,
  incrementByAmount,
  incrementAsync,
  incrementIfOdd,
  selectCount,
} from './counterSlice';
import styles from './Counter.module.css';

export function Counter(): React.ReactElement {
  const count = useAppSelector(selectCount);
  const dispatch = useAppDispatch();
  const [incrementAmount, setIncrementAmount] = useState('2');

  const incrementValue = Number(incrementAmount) || 0;

  return (
    <div>
      <div className={styles.row}>
        <button
          className="nes-btn"
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
          type="button"
        >
          -
        </button>
        <span className={styles.value}>{count}</span>
        <button
          className="nes-btn"
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
          type="button"
        >
          +
        </button>
      </div>
      <div className={styles.row}>
        <input
          className={`${styles.textbox} nes-input`}
          aria-label="Set increment amount"
          value={incrementAmount}
          onChange={(e) => setIncrementAmount(e.target.value)}
        />
        <button
          className="nes-btn is-primary"
          onClick={() => dispatch(incrementByAmount(incrementValue))}
          type="button"
        >
          Add Amount
        </button>
        <button
          className="nes-btn"
          onClick={() => dispatch(incrementAsync(incrementValue))}
          type="button"
        >
          Add Async
        </button>
        <button
          className="nes-btn"
          onClick={() => dispatch(incrementIfOdd(incrementValue))}
          type="button"
        >
          Add If Odd
        </button>
      </div>
    </div>
  );
}
