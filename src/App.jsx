import { useState, useCallback } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { binaryTreesGames } from "../games/binary-trees";
import { from, timer, tap, switchMap } from "rxjs";
import './App.css'

function App() {
  const [depth, setDepth] = useState(20)
  const handleButtonClick = useCallback(() => {
    let start, end;

    timer(0).pipe(
      tap(() => {
        console.log("JS");
        start = performance.now();
      }),
      switchMap(() => from(binaryTreesGames.js(depth))),
      tap(() => {
        end = performance.now();
        console.log(`JS: ${end - start}ms`);
      }),
      switchMap(() => {
        console.log("Rust");
        return from(binaryTreesGames.rust());
      }),
      tap((wasm) => {
        start = performance.now();
        wasm.main(depth);
        end = performance.now();
        console.log(`Rust: ${end - start}ms`);
      }),
      switchMap(() => {
        console.log("cpp");
        return from(binaryTreesGames.cpp());
      }),
      tap(Module => {
        start = performance.now();
        const run = Module.cwrap('run', 'number', ['number'])
        run(depth);
        end = performance.now();
        console.log(`cpp: ${end - start}ms`);
      })
    ).subscribe();
  }, [depth]);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <input type="number" value={depth} onChange={(e) => setDepth(e.target.value)} />
        <button onClick={handleButtonClick}>
          Depth is {depth}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
