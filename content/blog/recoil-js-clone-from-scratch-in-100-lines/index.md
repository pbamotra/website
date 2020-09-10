---
title: "Rewriting Facebook's \"Recoil\" React library from scratch in 100 lines"
description: "Recoil is a brand new React library and approach to state management. Here's my attempt at implementing it in under 100 lines."
date: 2020-09-09
tags:
  - "javascript"
  - "typescript"
  - "react"
  - "recoil"
  - "beginner"
---

Recoil is a slick new React library written by some people at Facebook that work on a tool called ["Comparison View."](https://www.youtube.com/watch?v=_ISAA_Jt9kI)
It came about because of ergonomics and [performance issues with context](https://github.com/facebook/react/issues/14620) and `useState`.
It's a very clever library, and almost everyone will find a use for it - check out this [explainer video](https://www.youtube.com/watch?v=_ISAA_Jt9kI) if you want to learn more.

At first I was really taken aback by the talk of graph theory and the wondrous magic that Recoil performs, but after a while I started to see that maybe it's not that special after all. Here's my shot at implementing something similar!

Before I get started, please note that the way I've implemented my Recoil clone is completely different to how the actual Recoil is implemented.
Don't assume anything about Recoil from this.

## Atoms

Recoil is built around the concept of "atoms". 
Atoms are small atomic pieces of state that you can subscribe to and update in your components.

To begin, I'm going to create a class called `Atom` that is going to wrap some value `T`.
I've added helper methods `update` and `snapshot` to allow you to get and set the value.

```typescript
class Atom<T> {
  constructor(private value: T) {}

  update(value: T) {
    this.value = value;
  }

  snapshot(): T {
    return this.value;
  }
}
```

To listen for changes to the state, you need to use [the observer pattern](https://www.tutorialspoint.com/design_pattern/observer_pattern.htm).
This is commonly seen in libraries like [RxJS](https://rxjs-dev.firebaseapp.com/guide/overview),
but in this case I'm going to write a simple synchronous version from scratch.

To know who is listening to the state I use a `Set` of callbacks.
A `Set` (or Hash Set) is a data structure that only contains unique items.
In JavaScript it can easily be turned into an array and has helpful methods for quickly adding and removing items.

Adding a listener is done through the `subscribe` method.
The subscribe method returns `Disconnecter` - an interface containing a method that will stop a listener from listening.
This is called when a React component is unmounted and you no longer want to listen for changes.

Next, a method called `emit` is added. This method loops through each of the listeners and gives them the current value in the state.

Finally I update the `update` method to emit the new values whenever the state is set.

```typescript {hl_lines=[1,4,10,"17-21","23-30"]}
type Disconnecter = { disconnect: () => void };

class Atom<T> {
  private listeners = new Set<(value: T) => void>();

  constructor(private value: T) {}

  update(value: T) {
    this.value = value;
    this.emit();
  }

  snapshot(): T {
    return this.value;
  }

  emit() {
    for (const listener of this.listeners) {
      listener(this.snapshot());
    }
  }

  subscribe(callback: (value: T) => void): Disconnecter {
    this.listeners.add(callback);
    return {
      disconnect: () => {
        this.listeners.delete(callback);
      },
    };
  }
}
```

Phew!

It's time to write the atom up into our React components. To do this, I've created a hook called `useCoiledValue`. ([sound familiar?](https://recoiljs.org/docs/api-reference/core/useRecoilValue/))

This hook returns the current state of an atom, and listens and re-renders whenever the value changes.
Whenever the hook is unmounted, it disconnects the listener.

One thing that's a little weird here is the `updateState` hook.
By performing a set state with a new object reference (`{}`), React will re-render the component.
This is a little bit of a hack, but it's an easy way to make sure the component re-renders.

```typescript
export function useCoiledValue<T>(value: Atom<T>): T {
  const [, updateState] = useState({});

  useEffect(() => {
    const { disconnect } = value.subscribe(() => updateState({}));
    return () => disconnect();
  }, [value]);

  return value.snapshot();
}
```

Next I've added a `useCoiledState` method. This has a very similar API to `useState` - it gives you the current value of the state and allows you to set a new one.

```typescript
export function useCoiledState<T>(atom: Atom<T>): [T, (value: T) => void] {
  const value = useCoiledValue(atom);
  return [value, useCallback((value) => atom.update(value), [atom])];
}
```

Now that we've got those hooks out of the road, it's time to move onto Selectors.
Before that though, let's refactor what we've got a little bit.

A selector is a stateful value, just like an atom.
To make implementing them a bit easier,
I'll move most of the logic out of `Atom` into a base class called `Stateful`.

```typescript {hl_lines=[1,6,"25-29"]}
class Stateful<T> {
  private listeners = new Set<(value: T) => void>();

  constructor(private value: T) {}

  protected _update(value: T) {
    this.value = value;
    this.emit();
  }

  snapshot(): T {
    return this.value;
  }

  subscribe(callback: (value: T) => void): Disconnecter {
    this.listeners.add(callback);
    return {
      disconnect: () => {
        this.listeners.delete(callback);
      },
    };
  }
}

class Atom<T> extends Stateful<T> {
  update(value: T) {
    super._update(value);
  }
}
```

Moving on!



## Selectors

A selector is Recoil's version of "computed values" or "reducers". In their [own words](https://recoiljs.org/docs/basic-tutorial/selectors):

> A selector represents a piece of derived state. You can think of derived state as the output of passing state to a pure function that modifies the given state in some way.


The API for selectors in Recoil is quite simple, you create an object with a method called `get` and whatever that method returns is the value of your state.
Inside the `get` method you can subscribe to other pieces of state, and whenever they update so too will your selector.

In our case, I'm going to rename the `get` method to be called `generator`.
I'm calling it this because it's essentially a factory function that's supposed to generate the next value of the state, based on whatever is piped into it.

![a flowchart demonstrating two atoms (titled "hello" and "bob") being piped into a selector, with the output becomming "Hello, Bob"](./atom-selector-flow.png)

In code, we can capture this `generate` method with the following type signature.

```typescript
type SelectorGenerator<T> = (context: GeneratorContext) => T;
```

For those unfamilar with Typescript, it's a function that takes a context object (`GeneratorContext`) as a parameter and returns some value `T`. 
This return value is what becomes the internal state of the selector.

What does the `GeneratorContext` object do?

Well that's how selectors use other pieces of state when generating their own internal state.
From now on I'll refer to these pieces of state as "dependencies".

```typescript
interface GeneratorContext {
  get: <V>(dependency: Stateful<V>) => V
}
```

Whenever someone calls the `get` method on the `GeneratorContext`, it adds a piece of state as a dependency.
This means that whenever a dependency updates, so too will the selector.

Here's what creating a selector's generate function might look like:

```typescript
function generate(context) {
  // Register the NameAtom as a dependency
  // and get it's value
  const name = context.get(NameAtom);
  // Do the same for AgeAtom
  const age = context.get(AgeAtom);

  // Return a new value using the previous atoms
  // E.g. "Bob is 20 years old"
  return `${name} is ${age} years old.`;
};
```

With the generate function out of the way, let's create the `Selector` class.
This class should accept the generate function as a constructor parameter and use a `getDep` method on the class to return the value of the `Atom` dependencies.

You might notice in the constructor that I've written `super(undefined as any)`.
This is because `super` must be the very first line in a derived class's constructor.
If it helps, in this case you can think of `undefined` as uninitialised memory.

```typescript
export class Selector<T> extends Stateful<T> {
  private getDep<V>(dep: Stateful<V>): V {
    return dep.snapshot();
  }

  constructor(
    private readonly generate: SelectorGenerator<T>
  ) {
    super(undefined as any);
    const context = {
      get: dep => this.getDep(dep) 
    };
    this.value = generate(context);
  }
}
```

This selector is only good for generating state once.
In order to react to changes in the dependencies, we need to subscribe to them.

To do this, let's update the `getDep` method to subscribe to the dependencies and call the `updateSelector` method.
To make sure the selector only updates once per change, let's keep track of the deps using a `Set`. 

The `updateSelector` method is very similar to the constructor in the previous example.
It creates the `GeneratorContext`, runs the `generate` method and then uses the `update` method from the `Stateful` base class.

```typescript {hl_lines=[2,"5-8","13-18"]}
export class Selector<T> extends Stateful<T> {
  private registeredDeps = new Set<Stateful>();

  private getDep<V>(dep: Stateful<V>): V {
    if (!this.registeredDeps.has(dep)) {
      dep.subscribe(() => this.updateSelector());
      this.registeredDeps.add(dep);
    }

    return dep.snapshot();
  }

  private updateSelector() {
    const context = {
      get: dep => this.getDep(dep)
    };
    this.update(this.generate(context));
  }

  constructor(
    private readonly generate: SelectorGenerator<T>
  ) {
    super(undefined as any);
    const context = {
      get: dep => this.getDep(dep) 
    };
    this.value = generate(context);
  }
}
```

Almost done! Recoil has some helper functions for creating atoms and selectors.
Since most JavaScript devs consider classes evil, they'll help mask our atrocities.

One for creating an atom...

```typescript
export function atom<V>(
  value: { key: string; default: V }
): Atom<V> {
  return new Atom(value.default);
}
```

And one for creating a selector...

```typescript
export function selector<V>(value: {
  key: string;
  get: SelectorGenerator<V>;
}): Selector<V> {
  return new Selector(value.get);
}
```

Oh, remember that `useCoiledValue` hook from before? Let's update that to accept selectors too:

```typescript {hl_lines=[1]}
export function useCoiledValue<T>(value: Stateful<T>): T {
  const [, updateState] = useState({});

  useEffect(() => {
    const { disconnect } = value.subscribe(() => updateState({}));
    return () => disconnect();
  }, [value]);

  return value.snapshot();
}
```

That's it! We've done it! 🎉 

Give yourself a pat on your back!

Finished?

For the sake of brevity (and in order to use that clickbaity "100 lines" title) I decided to omit comments, tests and examples.
If you want a more thorough explanation (or want to play with examples), all that stuff is up in my ["recoil-clone" Github repository.](https://github.com/bennetthardwick/recoil-clone)

There's also an [example site](https://100-line-recoil-clone.netlify.app/) live so you can test it out.

## Conclusion

I once read that all good software should be simple enough that anyone could rewrite it if they needed to.
Recoil has a lot of features that I haven't implemented here, but it's exciting to see such a simple and intuitive design that _can_ reasonably be implemented by hand.

Before you decide to roll my bootleg Recoil in production though, make sure you look into the following things:
  - Selectors never unsubscribe from the atoms. This means they'll leak memory when you stop using them.
  - React [has introduced](https://github.com/facebook/react/pull/18000) a hook called `useMutableSource`. If you're on a recent version of React you should use this instead of `setState` in `useCoiledValue`.
  - Selectors and Atoms only do a shallow comparison between states before re-rendering. In some cases it might make sense to change this to be a deep comparison.
  - Recoil uses a `key` field for each atom and selector which is used as metadata for a feature called "app-wide observation". I included it despite not using it to keep the API familiar.
  - Recoil supports async in selectors, this would be a massive undertaking so I've made sure to exclude it.

Other than that, hopefully I've shown you that you don't always have to look to a library when deciding on state management solutions.
More often then not you can engineer something that perfectly fits your solution - [that's how Recoil was born](https://recoiljs.org/docs/introduction/motivation) after all.

---

After writing this post I was shown the [jotai](https://github.com/react-spring/jotai) library. It's for a very similar feature set to my clone and supports async!
