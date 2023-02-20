import { useCounter } from './hooks/useCounter';
import './App.css';
import { useDebounceFn } from './hooks/useDebounce';
import { useDebounceFnV2 } from './hooks/useDebounceV2';
import { useEffect } from 'react';

function App() {
  const { count, increment } = useCounter();
  const { count: countV2, increment: incrementV2 } = useCounter();
  const { count: time, increment: incrementTime } = useCounter();

  const [debouncedIncrement, _] = useDebounceFn(increment, 3000);
  const [debouncedIncrementV2, __] = useDebounceFnV2(incrementV2, 3000);

  useEffect(() => {
    setInterval(incrementTime, 1000);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>Hello Vite + React!</p>
        <p>time is: {time}</p>
        <p>
          <button type="button" onClick={debouncedIncrement}>
            debounced count is: {count}
          </button>
          <button type="button" onClick={debouncedIncrementV2}>
            debounced count v2 is: {countV2}
          </button>
        </p>
        <p>
          Edit <code>App.tsx</code> and save to test HMR updates.
        </p>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {' | '}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
      </header>
    </div>
  );
}

export default App;
