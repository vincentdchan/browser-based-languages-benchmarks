import { mainThread } from "./js/run";
import initRust from "./rust/pkg/benchmarks";
import initCppModule from "./cpp/out/run";

export const binaryTreesGames = {
  js: (...args) => Promise.resolve(mainThread(...args)),
  rust: initRust,
  cpp: initCppModule,
}
