---
title: How to write easy to refactor Rust
---

> Note: this section is still under development, who knows if it’ll exist in the future

Tags: [rust], [easy-to-refactor]

### Ideas

- Type inference is your friend
  - Try and write types for something once. The more you write types for something the more you'd have to change it.
    - Use Self for the return type of constructors with `..Default::default()`
    - Associated types can be used so you don't have to keep writing the type
    - Rust supports `-> impl Something`, you don't have to write out the concrete type every time
    - Try and implement as many built in traits or traits as possible
    - Don't be afraid to implement your trait for built in types
  - Instead of casting all the time, let the compiler infer the cast
- `impl` blocks make things really hard, try creating traits to abstract away all that pain
  - Traits allow you to define the relationship between different types that you're using, plus adding a little bit of logic. There is a limit to their power though (doesn't work when you want to construct a particular struct)
    - [reference][where-clause]
- infer types more
  - only works for stack allocated variables (not params)
- use free generic variables when you don't care
- Know when to use generic parameters or associated types
- Write more functional code
  - FP is the best at composable / refactorable code
  - This is also useful when writing tests, you know the core pillars that it's built on are working fine, so it's easier to adapt the tests
- Avoid having to refactor at all
  - Try TDD - write the API usage before writing the API, you might find that what you were thinking doesn't work with the borrow checker
    - A bit of info [here](https://doc.rust-lang.org/book/ch12-04-testing-the-librarys-functionality.html)
    - Also [here](https://doc.rust-lang.org/book/ch10-03-lifetime-syntax.html#validating-references-with-lifetimes)
  - Try and think of three other possible usages of the API that you've written, try to sympathise with their use cases
- Pass on the benefits
  - You should be writing APIs that help people write code that's easy to refactor. This means implementing Default or Vector methods, if you can work with iterating over a value you should implement iter / from iter methods.
  - Find crates that could possibly make use of your library and implement traits for them. These could be hidden behind a feature flag.
- Generics generate more code so be careful
- Macros for repretetive tasks
  - [mdbook get and insert macro]
    - This case is an example of using a macro to allow `try_into` and into to work properly
  - Quick tip: use the paste libray to make code generation even better
  - Rule of thumb: if you have to write something multiple times why not write it once with a macro?
- If all else fails, learn some Vim-fu

[rust]: ./_index.md
[easy-to-refactor]: ../easy-to-refactor.md
[where-clause]: https://users.rust-lang.org/t/where-clause-requires-too-much-information/45463/2?u=bennetthardwick
[mdbook get and insert macro]: https://github.com/rust-lang/mdBook/blob/ec495a7823384eefc15002b41eb05a51f3527b87/src/config.rs#L259-L269
