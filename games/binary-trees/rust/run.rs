// The Computer Language Benchmarks Game
// https://salsa.debian.org/benchmarksgame-team/benchmarksgame/
//
// contributed by the Rust Project Developers
// contributed by TeXitoi
// *reset*
// Reference: https://benchmarksgame-team.pages.debian.net/benchmarksgame/program/binarytrees-rust-1.html

extern crate typed_arena;

use wasm_bindgen::prelude::wasm_bindgen;
use typed_arena::Arena;

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

struct Tree<'a> {
    l: Option<&'a Tree<'a>>,
    r: Option<&'a Tree<'a>>,
}

fn item_check(t: &Option<&Tree>) -> i32 {
    match *t {
        None => 0,
        Some(&Tree { ref l, ref r }) => 1 + item_check(l) + item_check(r)
    }
}

fn bottom_up_tree<'r>(arena: &'r Arena<Tree<'r>>, depth: i32)
                  -> Option<&'r Tree<'r>> {
    if depth >= 0 {
        let t: &Tree<'r> = arena.alloc(Tree {
            l: bottom_up_tree(arena, depth - 1),
            r: bottom_up_tree(arena, depth - 1)
        });
        Some(t)
    } else {
        None
    }
}

fn inner(depth: i32, iterations: i32) {
    let mut chk = 0;
    for i in 1 .. iterations + 1 {
        let arena = Arena::new();
        let a = bottom_up_tree(&arena, depth);
        chk += item_check(&a);
    }
    console_log!("{}\t trees of depth {}\t check: {}",
            iterations, depth, chk)
}

#[wasm_bindgen]
pub fn main(n: i32) {
    let min_depth = 4;
    let max_depth = if min_depth + 2 > n {min_depth + 2} else {n};

    {
        let arena = Arena::new();
        let depth = max_depth + 1;
        let tree = bottom_up_tree(&arena, depth);

        console_log!("stretch tree of depth {}\t check: {}",
                 depth, item_check(&tree));
    }

    let long_lived_arena = Arena::new();
    let long_lived_tree = bottom_up_tree(&long_lived_arena, max_depth);

    let _ = (min_depth..max_depth + 1).filter(|&d| d % 2 == 0).map(|depth| {
        let iterations = 1 << ((max_depth - depth + min_depth) as u32);
        inner(depth, iterations)
    }).collect::<Vec<_>>();

    console_log!("long lived tree of depth {}\t check: {}",
             max_depth, item_check(&long_lived_tree));
}