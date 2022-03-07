# What the Heck is `this`?

In JavaScript, functions have a magical `this` variable can be accessed in the
body of the function, which *by default* is the `globalThis` object.  (In the browser
it's the `Window` object, and in NodeJS, it's the `global` object).  For
example, if we create a function like so and call it (without first defining the
global `message` variable), we get:

```ts
function my_function(){ return this.message; }
my_function() // returns "undefined"
```

and later if a `message` attribute is added to the `globalThis` object, then it
will be returned by our function:

```ts
globalThis.message = "hello"
my_function() // returns "hello"
```

Ok, that's weird.  But it's the first half of a trick that is used in the Ras-Lights app.

## Binding a Function

In JavaScript, functions have a `bind()` method that creates a new function, and
that new function has it's  `this` object bound to the first parameter passed into
the `bind` method.  

For example, we can create a new function from our first function with: 

```ts
const my_new_function = my_function.bind({message: "something something"})
my_new_function() // returns "something something"
```

## Storing State in the `this` Variable

In the Ras-Lights app, when a new mode is selected, each effect in the show is
bound to an empty object.  For example, when the `alternate` function (included
in the default library) is part of a show it is called like this: 

```ts
let effect = Library.alternate.bind({})
```

which means that the the first time the `alternate` function is called, the
`this` variable will be bound to a new empty object.  

Note that when an effect is used multiple times in the same show, each instance
of the effect is initialized separately with it's own independent empty `this`
object.

For example, the `alternate` function will return a different color when it is
called over time, which means that it needs to take into account the difference
between the current time, and the time that the show was started. This can be
done by storing the shows start time in the `this` variable, like so:

```ts
function alternate( this: { start_time: number }) {
    if( typeof this.start_time === "undefined") {
        this.start_time = +new Date();
    }
    ...
}
```

Notice that TypeScript uses a special (optional) `this` *pseudo parameter* in
order to keep track of the type of the `this` object in the body of the
function.
