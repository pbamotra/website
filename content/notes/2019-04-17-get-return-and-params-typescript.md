---
title: Get Function Parameters and Return Types with Typescript
type: text
category: javascript
---
When creating advanced functions in Typescript, it can be difficult
to get everything to work without resorting to using `any`.

Working with functions is definitely one of the hardest things,
luckily Typescript has a bunch of useful helpers to save the day.
```typescript
import { doACoolThing } from 'cool-lib';

// get the type of the imported function
type CoolThingFunction = typeof doACoolThing;

function sayAndDoSomething(
    text: string,
    // set the "coolThing" to be the first param
    // of the imported function
    coolThing: Parameters<CoolThingFunction>[0]
    // set the return type to be the return type
    // of the imported function
): ReturnType<CoolThingFunction>  {
    sayText(text);
    return doACoolThing(coolThing);
}
```