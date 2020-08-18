---
title: Speculative Generality
---

> Read more in the book [Refactoring]

Speculative Generality is when you engineer code to handle cases that aren't required, but might be required some day.

More often than not the "some day" never comes and you're left with bloated code that can be annoying to maintain[^1].

This can often be seen in [Rust] through the use of aggressive parametrisation and generics, resulting in code that is hard to refactor[^2].

[^1]: Developers are lazy, the last thing they want to do is spend a lot of time maintaining code and tests that for use cases that don't impact the customer.
[^2]: Rust is very verbose when working with generics. Every `impl` block requires the generic to be written more than once, meaning a whole heap of places you have to edit when refactoring - something to keep in mind when [easy to refactor Rust].

[refactoring]: ../books/refactoring.md
[easy to refactor rust]: ../rust/write-easy-to-refactor-rust.md
[rust]: ../rust/_index.md
