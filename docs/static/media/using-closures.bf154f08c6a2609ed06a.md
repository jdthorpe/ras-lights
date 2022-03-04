# Environments and closures

Environments and closures can be used to store values that can be used at a
later time.  These tricks can be really helpful by creating functions that store
some state which allow them to return a different value each time they are
called, which depend on when, how often, or how many times they have been called.

This can be leveraged to build all kinds of effects that vary over time, and can
be enormously helpful in creating animations.

## Environments

When you call a function, the body of the function is executed, and the body of
the function may include variable assignments, such as:

```ts
function my_function(){
    // hey look, I'm assigning a variable: 
    var x = "hello world"
}
```

Each time a function is called, a new environment is created in which the
variable gets assigned. This is what keeps the assignment in the body of the
function from over writing a variable with the same name that has been assigned
somewhere else.  For example:

```ts
var x = 42;
my_function();
console.log(x); // logs `42` to the console.
```

In JavaScript, there are 3 keywords which are used to create a new variable in
an environment, which are `var`, `let`, and `const`.  But what happens when you
*use* a variable in the body of the function that hasn't been created in the
body of the function? Well, JavaScript keeps looks for it in the environment in
which the function was created.  If the variable isn't found in the immediate
parent environment, then the search continues to further parent environments
until the the search reaches a package environment or the global environment.

This behavior is known as [lexical
scoping](https://en.wikipedia.org/wiki/Scope_(computer_science)#Lexical_scope)
and is what makes the following function return 42:

```ts
const something = 42;
function meaning_of_life(){
    // `something` isn't defined in the body of this function  and it's not a
    // function parameter, so the search for the variable `something` continues
    // in the parent environment -- i.e. the environment in which the function
    // was created
    return something:
}
meaning_of_life() // returns 42
```

## From Environments to Closures

The concept of a `Closure` is an environment that stays around as long there is
at least one reference to the a variable that it contains.  In JavaScript, this
means that the environment that is created each time a function is called will
stay in memory as long as there is a reference to any of the variables in that
environment. 

For example, the variables (`count`) defined in the body of the counter_factory,
can be used by the `counter` function -- even after the factory function has has
finished:

```ts
function counter_factory(){
    // Each time this function is called, a new environment is created,  in
    // which the following variable is defined:
    let count = 0;

    // The `counter` function function is created in the body of
    // `counter_factory`, so parent environment of the `counter` is the
    // environment that was created when the `counter_factory` was called, and
    // it can use any of the variables defined in the body `counter_factory` --
    // even after `counter_factory` has finished executing
    function counter(){
        count += 1;
        return count
    }

    return counter
}

// create some counters
const counter_A = counter_factory()
const counter_B = counter_factory()

// Use the counters -- and notice that they have their own "state" because they
// have separate closures, which are the environments that were created each time 
// counter_factory() was called.
counter_A() // returns 1
counter_A() // returns 2
counter_A() // returns 3

counter_B() // returns 1
counter_B() // returns 2
counter_B() // returns 3
```

## Making use of closures

Closures are yet another way of holding state -- i.e. data that held by a
function between function calls.  In the Ras-Lights app, they can be very useful
for creating utility functions that make writing your own special effects easer.
For example, by storing a time stamp in the closure, you can create a function
that returns a different value  depending on the elapsed time -- very handy for
animations!

### A simple timer function

<details>
<summary>Show the timer</summary>

```ts
function simple_timer(period=3000, range=5){
    const start_time = +new Date;

    return () => {
        const now = +new Date;
        const elapsed_time = now - start_time
        const fraction_of_period_elapsed = (elapsed_time % period) / period
        return Math.floor(fraction_of_period_elapsed * range)
    }
}
```
</details>

<output name="simple_timer"/>

<details>
<summary>Show the array function</summary>

```ts
function index_based_timer(period=3000, range=5){
    const index_timer = simple_timer(period, range)

    return () => {
        const out = new Array(range).fill(0)
        out[index_timer()] = 1
        return out
    }
}
```
</details>

<output name="index_based_timer"/>


### A more (slightly) complex timer

<details>
<summary>Show the timer</summary>

```ts
interface IProgress { 
    index: number;  // ranges between 0 and count - 1
    cycle: number;  // Counts the number of times the timer has cycled through
}

function base_timer(period: number, count: number): { (): IProgress } {
    const start_time = +new Date();

    return () => {
        const delta = (+new Date() - start_time) / (period);
        const index = Math.floor(delta * count) % count;
        const cycle = Math.floor(delta);
        return { index, cycle };
    };
}
```

</details>

<output name="complex_timer"/>

<details>
<summary>Show the array function</summary>

```ts
function zig_zag(period=3000, range=5) {
    const timer = complex_timer(period, range)

    return () => {
        const { index, cycle } = timer()
        const out = new Array(range)
        for (let j = 0; j < range; j++)
            out[j] = (cycle % 2) ^ +(j % range > index)
        return out;
    }
}
```

</details>

<output name="zig_zag"/>
