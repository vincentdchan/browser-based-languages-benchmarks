use wasm_bindgen::prelude::wasm_bindgen;
use ttf_parser as ttf;

#[wasm_bindgen]
extern "C" {
    // Use `js_namespace` here to bind `console.log(..)` instead of just
    // `log(..)`
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);

    // The `console.log` is quite polymorphic, so we can bind it with multiple
    // signatures. Note that we need to use `js_name` to ensure we always call
    // `log` in JS.
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_u32(a: u32);

    // Multiple arguments too!
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_many(a: &str, b: &str);
}

macro_rules! console_log {
    // Note that this is using the `log` function imported above during
    // `bare_bones`
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

#[wasm_bindgen]
pub fn run(content: &str, font_data: &[u8]) -> i32 {
  console_error_panic_hook::set_once();

  let face = ttf::Face::parse(&font_data, 0).unwrap();

  // iterate the conetnt to compute the x advance
  let mut x_advance = 0;
  for c in content.chars() {
    let glyph_opt = face.glyph_index(c);

    if let Some(glyph_id) = glyph_opt {
      x_advance += face.glyph_hor_advance(glyph_id).unwrap() as i32;
    }
  }

  x_advance
}
