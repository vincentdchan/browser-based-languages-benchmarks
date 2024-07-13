// /* The Computer Language Benchmarks Game 
//  * https://salsa.debian.org/benchmarksgame-team/benchmarksgame/
//  *
//  * Contributed by Jon Harrop
//  * Modified by Alex Mizrahi
//  *  *reset*
//  * 
//  * Reference: https://benchmarksgame-team.pages.debian.net/benchmarksgame/program/binarytrees-gpp-2.html
//  */

// #include <stdio.h>
// #include <stdlib.h>
// #include <iostream>

// struct Node {
//   Node *l, *r;
//   Node() : l(0), r(0) {}
//   Node(Node *l2, Node *r2) : l(l2), r(r2) {}
//   ~Node() { delete l; delete r; }
//   int check() const {
// 	  if (l)
// 		return l->check() + 1 + r->check(); 
// 	  else return 1;
//   }
// };

// Node *make(int d) {
//   if (d == 0) return new Node();
//   return new Node(make(d-1), make(d-1));
// }

// extern "C" {

// int run(int max_depth) {
//   int min_depth = 4;
//   max_depth = std::max(min_depth+2,
//       max_depth);
//   int stretch_depth = max_depth+1;

//   {
//     Node *c = make(stretch_depth);
//     std::cout << "stretch tree of depth " << stretch_depth << "\t "
//       << "check: " << c->check() << std::endl;
//     delete c;
//   }

//   Node *long_lived_tree=make(max_depth);

//   for (int d=min_depth; d<=max_depth; d+=2) {
//     int iterations = 1 << (max_depth - d + min_depth), c=0;
//     for (int i=1; i<=iterations; ++i) {
//       Node *a = make(d);
//       c += a->check();
//       delete a;
//     }
//     std::cout << iterations << "\t trees of depth " << d << "\t "
// 	      << "check: " << c << std::endl;
//   }

//   std::cout << "long lived tree of depth " << max_depth << "\t "
// 	    << "check: " << (long_lived_tree->check()) << "\n";

//   delete long_lived_tree;

//   return 0;
// }

// }

/* The Computer Language Benchmarks Game
 * https://salsa.debian.org/benchmarksgame-team/benchmarksgame/
 *
 * contributed by Danial Klimkin (C++)
 * contributed by the Rust Project Developers (Rust)
 * contributed by TeXitoi (Rust)
 * contributed by Cristi Cobzarenco (Rust)
 * contributed by Matt Brubeck (Rust)
 * contributed by Dmytro Ovdiienko
 * contributed by Martin Jambrek
 *
 */

#include <algorithm>
#include <execution>
#include <iostream>
#include <memory_resource>
#include <numeric>

using MemoryPool = std::pmr::monotonic_buffer_resource;

struct Node {
    Node *l, *r;

    int check() const
    {
        if (l)
            return l->check() + 1 + r->check();
        else
            return 1;
    }
};

inline static Node* make(const int d, MemoryPool& store)
{
    void* mem = store.allocate(sizeof(Node), alignof(Node));
    Node* root = new (mem) Node;
    if (d > 0) {
        root->l = make(d - 1, store);
        root->r = make(d - 1, store);
    } else {
        root->l = root->r = nullptr;
    }
    return root;
}

constexpr auto MIN_DEPTH = 4;

extern "C" {

int run(int max_depth)
{
    max_depth = std::max(MIN_DEPTH + 2, max_depth);
    const int stretch_depth = max_depth + 1;

    // Alloc then dealloc stretchdepth tree.
    {
        MemoryPool store;

        Node* c = make(stretch_depth, store);
        std::cout << "stretch tree of depth " << stretch_depth << "\t "
                  << "check: " << c->check() << std::endl;
    }

    MemoryPool long_lived_store;
    Node* long_lived_tree = make(max_depth, long_lived_store);

    // Used as std::vector<std::pair<depth, checksum>>
    std::vector<std::pair<int, int>> results((max_depth - MIN_DEPTH) / 2 + 1);

    for (size_t i = 0; i < results.size(); ++i) {
        results[i].first = i * 2 + MIN_DEPTH;
    }

    for (auto& [d, c] : results) {
        int iters = 1 << (max_depth - d + MIN_DEPTH);

        for (int i=1; i<=iters; ++i) {
          MemoryPool pool { };
          c = make(d, pool)->check();
        }
        // res.second = std::transform_reduce(std::execution::seq,
        //     boost::counting_iterator<int>(0), boost::counting_iterator<int>(iters),
        //     0,
        //     std::plus<> {},
        //     [d](int) {
        //         thread_local std::pmr::unsynchronized_pool_resource upperPool;
        //         MemoryPool pool { &upperPool};
        //         return make(d, pool)->check();
        //     });
        std::cout << (1 << (max_depth - d + MIN_DEPTH))
                  << "\t trees of depth " << d
                  << "\t check: " << c << "\n";
    }

    std::cout << "long lived tree of depth " << max_depth << "\t "
              << "check: " << (long_lived_tree->check()) << "\n";

    return 0;
}

}