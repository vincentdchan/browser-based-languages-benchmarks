import { useState, useCallback } from 'react'
import { Observable, forkJoin, Subject, takeUntil } from "rxjs";
import GameRunner from './GameRunner';
import GameWorker from "./gameWorker?worker";
import './App.css'

function runGame(game, lang, depth) {
  return new Observable((subscriber) => {
    const worker = new GameWorker();
    worker.postMessage({
      game,
      lang,
      depth,
    });
    worker.addEventListener('message', (e) => {
      subscriber.next(e.data);
      subscriber.complete();
    });
    return () => {
      worker.terminate();
    };
  });
}

function GameFragment(props) {
  const { game } = props;
  const [depth, setDepth] = useState(10);
  const [gameData, setGameData] = useState(null);

  const handleButtonClick = useCallback(() => {
    const dispose$ = new Subject();
    const observables = ['js', 'rust', 'cpp'].map(lang => runGame(game, lang, depth));
    forkJoin(observables)
      .pipe(takeUntil(dispose$))
      .subscribe(result => {
        setGameData(result.map(item => item.time));
      })
    return () => {
      dispose$.next();
      dispose$.complete();
    }
  }, [game, depth]);

  return (
    <div className="game-fragment">
      <h1>{game}</h1>
      <input type="number" value={depth} onChange={(e) => setDepth(e.target.value)} />
      <button onClick={handleButtonClick}>
        Run: {depth}
      </button>
      {gameData && (
        <GameRunner data={gameData} rows={['js', 'rust', 'cpp']} />
      )}
    </div>
  )
}

function App() {
  return (
    <>
      <h1>Benchmarking Browser-Based Languages: A Comprehensive Performance Comparison</h1>
      <div className="card">
        <GameFragment game="binaryTrees" />
        <GameFragment game="fanncukRedux" />
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <div className="footer">
          © {new Date().getFullYear()}, Built by{" "}
          <a href="https://www.diverse.space/">Vincent Chan</a>
      </div>
    </>
  )
}

export default App
