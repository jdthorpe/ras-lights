# Using `this`

## TL;DR: 

```ts
function effect(this: any, input: input, globals: globals): rgb[] {
    // Your code goes here...
    if(!this.some_Property){

        // `some_property` has not been initialized. This must be the first time
        // the function has been called...
        this.some_property = "some value"
    }
}
```

## Binding a function

## Storing state in the `this` variable