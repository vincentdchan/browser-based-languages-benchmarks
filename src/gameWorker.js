import { binaryTreesGames } from "../games/binary-trees";
import { fanncukReduxGames } from "../games/fannkuch-redux";
import { zipGames } from "../games/zip";

async function compress(str) {
  // Convert the string to a byte stream.
  const stream = new Blob([str]).stream();

  // Create a compressed stream.
  const compressedStream = stream.pipeThrough(
    new CompressionStream("deflate")
  );

  // Read all the bytes from this stream.
  const chunks = [];
  for await (const chunk of compressedStream) {
    chunks.push(chunk);
  }
  return await concatUint8Arrays(chunks);
}

async function concatUint8Arrays(uint8arrays) {
  const blob = new Blob(uint8arrays);
  const buffer = await blob.arrayBuffer();
  return new Uint8Array(buffer);
}

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

  } else if (game === 'zip') {
    fetch("./hamlet.txt")
      .then(resp => resp.text())
      .then((zipContent) => {
        switch (lang) {
          case 'js': {
            start = performance.now();
            compress(zipContent).then(bytes => {
              end = performance.now();
              time = end - start;

              console.log("js zip result", bytes);
              postMessage({
                lang,
                game,
                time,
              });
            });
            break;
          }
          case 'rust':
            zipGames.rust()
              .then(() => {
                start = performance.now();
                const zipResult = zipGames.rustCompress(zipContent);
                console.log("rust zip result", zipResult);
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
            zipGames.cpp()
              .then(Module => {
                start = performance.now();
                // malloc a size_t on stack to store out size
                let outSize = Module._malloc(4);

                let zipContentBuffer = Module.allocateUTF8(zipContent);
                const run = Module.cwrap('run', 'number', ['number', 'number', 'number'])
                const reuslt = run(6, zipContentBuffer, outSize);

                // the runResult is a pointer, copy array buffer
                const outSizeValue = Module.getValue(outSize, 'i32');
                const outPtr = reuslt;
                const outBuffer = new Uint8Array(Module.HEAPU8.buffer, outPtr, outSizeValue);
                console.log("cpp zip buffer", outBuffer);
                Module._free(zipContentBuffer);
                Module._free(outPtr);
                Module._free(outSize);

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
      })
  }
});
