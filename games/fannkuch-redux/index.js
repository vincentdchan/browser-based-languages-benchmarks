import initRust from "./rust/pkg/benchmarks";
import initCppModule from "./cpp/out/run";
import { mainThread } from "./js/run";

export const fanncukReduxGames = {
  js: (...args) => Promise.resolve(mainThread(...args)),
  rust: initRust,
  cpp: initCppModule,
};
