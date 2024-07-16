import { binaryTreesGames } from "../games/binary-trees";
import { fanncukReduxGames } from "../games/fannkuch-redux";

globalThis.addEventListener('message', (e) => {
  const { game, lang, depth } = e.data;
  let start, end, time;
  if (game === 'binaryTrees') {
    switch (lang) {
      case 'js':
        start = performance.now();
        binaryTreesGames.js(depth);
        end = performance.now();
        time = end - start;
        postMessage({
          lang,
          game,
          time,
        });
        break;
      case 'rust':
        binaryTreesGames.rust()
          .then(wasm => {
            start = performance.now();
            wasm.main(depth);
            end = performance.now();
            time = end - start;
            postMessage({
              lang,
              game,
              time,
            });
          })
        break;
      case 'cpp':
        binaryTreesGames.cpp()
          .then(Module => {
            start = performance.now();
            const run = Module.cwrap('run', 'number', ['number'])
            run(depth);
            end = performance.now();
            time = end - start;
            postMessage({
              lang,
              game,
              time,
            });
          });
        break;

    }

  } else if (game === 'fanncukRedux') {
    switch (lang) {
      case 'js':
        start = performance.now();
        fanncukReduxGames.js(depth);
        end = performance.now();
        time = end - start;
        postMessage({
          lang,
          game,
          time,
        });
        break;
      case 'rust':
        fanncukReduxGames.rust()
          .then(wasm => {
            start = performance.now();
            wasm.main(depth);
            end = performance.now();
            time = end - start;
            postMessage({
              lang,
              game,
              time,
            });
          })
        break;
      case 'cpp':
        fanncukReduxGames.cpp()
          .then(Module => {
            start = performance.now();
            const run = Module.cwrap('run', 'number', ['number'])
            run(depth);
            end = performance.now();
            time = end - start;
            postMessage({
              lang,
              game,
              time,
            });
          });
        break;
    }

  }
});
