# JavaScript Getters

With JavaScript objects, you can store key value pairs and access them by name
at a later time, like so: 

```ts
// create an object
const my_data = {
    something_special: do_lots_of_work(),
    message: "Hello world",
}
console.log(mydata["message"]) // logs "Hello world" to the console.
```

However, if you don't use a variable that requires lots of work to calculate,
using a [getter
function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get)
lets you write more efficient code that waits until the value is accessed before
calculating it. 

For example, the following code snippet, works just like the one above (both log
"hello world" to the console), but in this one the `do_lots_of_work` function is
never run:

```ts
function make_message(){ return "hello world" }

const my_data = {
    get something_special: do_lots_of_work,
    get message: make_message,
}
console.log(mydata["message"]) // logs "Hello world" to the console.
```

This is often termed [*lazy
evaluation*](https://en.wikipedia.org/wiki/Lazy_evaluation), and can save you
from doing work you don't need to do, which allows your functions to run faster.

### Being lazy isn't always good

One problem with getter functions is that they can take a very fast operation
(looking up a value in an object), and turn it into something slow (calling a
slow function). This is especially true when accessing a value in the body of a
loop.  

In this example, `do_lots_of_work` gets called `A_LARGE_NUMBER` of times, which is
probably not necessary. The fact that this function is called repeatedly is not
obvious at first glance because accessing an attribute with the dot operator,
(i.e. `my_data.something_special`) does not *look* like a function call:

```ts
const my_data = {
    get something_special: do_lots_of_work,
    get message: make_message,
}
for(let i = 0; i < A_LARGE_NUMBER; i++){
    x = my_data.something_special + 1;
    ...
}
```

### Application in Ras-Lights

In the body of the template function, you'll notice that the `input` variable is
destructured in the first line of the template:

```ts
function effect(this: any, input: input, globals: globals): rgb[] {
    // THIS LINE IS NO ACCIDENT:
    const { colors, frequency } = inputs;
    ...
}
```

This is because all of the attributes of the `input` object are actually getter
functions.  This design choice makes it easy to compose functions to create
dynamic animations, but it does come with some risks. 

Most functions that return an array of colors will include a loop of
some kind, and by destructuring the `input` object, you can avoid accidentally
calling `inputs.something_slow` in the body of the `for` loop.

To put this in perspective, the light show is set to render 20 times per second
by default.  Light shows may be composed of many effect functions, and all
the work needs to be completed within 50 milliseconds to render on time --
(though ideally in 1 - 2 milliseconds in order for the Pi to have time to do
other work such as handle network requests).

In a light show on a strand with 500 LEDs, if two functions ("effects") were
composed in the "Editor" tab, and each calls `input.something` in a `for` loop
that loops over each LED, the rendering cycle will take 250,000 times longer
than necessary. This means that an an otherwise blazingly fast 2 ms rendering
time can slow down to an insufferable 83 minutes.
