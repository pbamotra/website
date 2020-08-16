---
title: Traits
dev: true
---

[#todo]

Traits are essentially Rust's version of interfaces.

```rust
trait Hello {
  fn say_hello(&self) {
  }
}
```

## Trait objects

- what can be turned into an object?
  - why does having a method without `&self` mean you can't turn it into an object?
- when should or shouldn't you use boxed trait objects?
  - [Don't Use Boxed Trait Objects for Struct Internals]

[#todo]: ../todo.md
[don't use boxed trait objects for struct internals]: ../../blog/dont-use-boxed-trait-objects-for-struct-internals/index.md
