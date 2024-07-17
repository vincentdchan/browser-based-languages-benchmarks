import "zlibjs/bin/zlib.min";
import initRust, { compress } from "./rust/pkg/benchmarks";
import initCppModule from "./cpp/build/run";

export const zipGames = {
  rust: initRust,
  rustCompress: compress,
  cpp: initCppModule,
}
