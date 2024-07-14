import initRust from "./rust/pkg/benchmarks";
import initCppModule from "./cpp/out/run";

export const fanncukReduxGames = {
  rust: initRust,
  cpp: initCppModule,
};
