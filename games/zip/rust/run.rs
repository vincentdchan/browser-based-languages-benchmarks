
use wasm_bindgen::prelude::wasm_bindgen;
use std::io::Write;
use deflate::Compression;
use deflate::write::ZlibEncoder;

#[wasm_bindgen]
pub fn compress(data: &[u8]) -> Vec<u8> {
  let mut encoder = ZlibEncoder::new(Vec::new(), Compression::Default);
  encoder.write_all(data).expect("Write error!");
  let compressed_data = encoder.finish().expect("Failed to finish compression!");
  compressed_data
}
