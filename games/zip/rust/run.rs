
use wasm_bindgen::prelude::wasm_bindgen;
use std::io::Write;
use deflate::Compression;
use deflate::write::ZlibEncoder;

#[wasm_bindgen]
pub fn compress(data: &str) -> Vec<u8> {
  console_error_panic_hook::set_once();
  let mut encoder = ZlibEncoder::new(Vec::new(), Compression::Default);
  encoder.write_all(data.as_bytes()).expect("Write error!");
  let compressed_data = encoder.finish().expect("Failed to finish compression!");
  compressed_data
}
