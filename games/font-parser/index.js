import initRust, { run } from "./rust/pkg/benchmarks";
import initCppModule from "./cpp/build/run";

export const fontParserGames = {
  rust: initRust,
  runRust: run,
  cpp: initCppModule,
}
