---
createdAt: 2020-07-30
title: Downcast Trait Object
description: "How to downcast a trait back to a concrete type in Rust"
type: garden
status: evergreen
tags:
  - "rust"
aliases:
  -  "/wiki/rust/rust-downcast-trait-object/"
---

Downcasting is Rust's method of converting a trait into a concrete type.

It is done using the `Any` trait, which allows "dynamic typing of any `'static` type through runtime reflection" ([docs][da]).

Here's an example showing a simple case of having a trait object that you want to change back into it's original type:

```rust
trait Print {
  fn start_printing(&self);
}

struct TrustyPrinter;

impl Print for TrustyPrinter {
  fn start_printing(&self) {
    println!("Starting!");
  }
}

fn main() {
  // Create your struct that implements your trait
  let t = TrustyPrinter;

  // Use the trait to abstract away everything that is not needed
  let x: &dyn Print = &t;

  // Now there's an edge case that uses the original type..
  // How do you change it back?
  let printer: &TrustyPrinter = x;
}
```

In order to make use of it, you need to add a method into your trait so the

```rust{1,5,14-16}
use std::any::Any;

trait Print {
  fn start_printing(&self);
  fn as_any(&self) -> &dyn Any;
}

struct TrustyPrinter;

impl Print for TrustyPrinter {
  fn start_printing(&self) {
    println!("Starting!");
  }
  fn as_any(&self) -> &dyn Any {
    self
  }
}
```

You can now use the [`downcast_ref`][dr] method to convert the reference to your trait object back into your concrete type.

```rust{10-15}
fn main() {
  // Create your struct that implements your trait
  let t = TrustyPrinter;

  // Use the trait to abstract away everything that is not needed
  let x: &dyn Print = &t;

  // Now you can use the `downcast_ref` method to convert it back
  // into `TrustyPrinter`
  let printer: &TrustyPrinter =
        x.as_any()
         .downcast_ref::<TrustyPrinter>()
         .expect("Wasn't a trusty printer!");

   printer.start_printing();
}
```

([Playground][pg])

Voilà! You can now freely and carelessly convert between levels of abstraction.

## Crates

There's a few crates for making this process easier. Namely [mopa] and [downcast-rs].

Unfortunately, much like using `Any`, these crates only enable downcasting of traits that you own,
meaning you couldn't downcast from traits from the standard library.

## Important Notes

There's a reason why this is so tedious to do and why [there's not many][au] usages of this trait in the standard library - it's almost always a bad idea.

Traits exist to create a boundary between the different levels of abstraction, they're not supposed to be able to see outside their own little world.
This goes against the concept of separation of concerns and can make your code difficult to understand.

Alternatives to this approach are discussed in my blog post [Don't use boxed trait objects for struct internals].

[au]: https://doc.rust-lang.org/core/panic/struct.PanicInfo.html?search=Any
[pg]: https://play.rust-lang.org/?version=stable&mode=debug&edition=2018&gist=f174144a750e4d7cd214d4cfc8ada449
[dr]: https://doc.rust-lang.org/std/any/trait.Any.html#method.downcast_ref
[da]: https://doc.rust-lang.org/std/any/
[mopa]: https://crates.io/crates/mopa
[downcast-rs]: https://crates.io/crates/downcast-rs
[don't use boxed trait objects for struct internals]: ../dont-use-boxed-trait-objects-for-struct-internals/index.mdx
