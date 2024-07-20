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
  const { game, hasDepth = true, source } = props;
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
      <h3>{beatifyName(game)}</h3>
      <div>
        {hasDepth ? (
          <>
            <input type="number" value={depth} onChange={(e) => setDepth(e.target.value)} />
            <button onClick={handleButtonClick}>
              Run: {depth}
            </button>
          </>
        ) : (
          <button onClick={handleButtonClick}>
            Run
          </button>
        )}
        {source && (<a className="source" href={source}>Source</a>)}
      </div>
      <GameRunner data={gameData} rows={['js', 'rust', 'cpp']} />
    </div>
  )
}

function beatifyName(name) {
  return name
    .split(/(?=[A-Z])/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function App() {
  return (
    <>
      <h1>Benchmarking Browser-Based Languages</h1>
      <h2 className="subtitle">A Comprehensive Performance Comparison</h2>
      <div className="card">
        <GameFragment game="binaryTrees" source="https://github.com/vincentdchan/browser-based-languages-benchmarks/tree/master/games/binary-trees" />
        <GameFragment game="fanncukRedux" source="https://github.com/vincentdchan/browser-based-languages-benchmarks/tree/master/games/fannkuch-redux" />
        <GameFragment game="zip" hasDepth={false} source="https://github.com/vincentdchan/browser-based-languages-benchmarks/tree/master/games/zip" />
        <GameFragment game="fontParser" hasDepth={false} source="https://github.com/vincentdchan/browser-based-languages-benchmarks/tree/master/games/font-parser" />
      </div>
      <div className="footer">
          © {new Date().getFullYear()}, Built by{" "}
          <a href="https://www.diverse.space/">Vincent Chan</a>
      </div>
    </>
  )
}

export default App
