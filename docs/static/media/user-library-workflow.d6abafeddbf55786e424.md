# User Library Workflow

To add your own functions to the Ras-Lights app, you'll need to:

-   Create a function template using the Ras-Lights template tab of the web app
-   Copy the template into your repo and fill in the function with your own
    special logic 
-   Import your new module
-   Compile (transpile) your code using the 'npm run build' command
-   Push your code to Github and pull it down to your Pi
-   Refresh the library using the web app

If this sounds intimidating, well, it can be at first. But once you've done it
a couple of times, you'll notice that each step becomes more and more familiar,
and (hopefully) the guide below will help get you started.

## Step 1: Create a template

I'm going to make a new function called "Stripes" that will take an array of
colors as an input and return an array of colors with each of the input colors a
certain number of times. I will specify the output type as an RGB Array (`RGB[]`) , the
name of my new function ("Stripes"), and two inputs of type `RGB[]` and another
of type integer.

The text in the "Input Label" colum will be presented in the Editor tab, and
the text in the "Key" column will become the variable names in the "effect"
function that defines my new special effect.

<img 
    src="/ras-lights/assets/images/template-settings.png" 
    alt="LEDs powered by Raspberry Pi" 
    style="width:750px; box-shadow: 0 4px 8px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%);"/>


## Step 2: Create a new module (file)

In your user library, create a new file in the `/src` folder, which I'll do by
using the `touch` function in the terminal, and copy the function into the new
file and add some custom logic in my effect function in `// Your code goes here...` section of the template

```ts
import { register } from "../register";

interface input {
    x: rgb[];
    n: integer;
}

function effect(this: any, input: input, globals: globals): rgb[] {
    const { x, n } = inputs;

    // initialize the output array
    const out: rgb[] = [];

    // for each color in the input array
    x.forEach((color) => {
        // append that color to the output array n times
        for (let i = 0; i < n; i++) {
            out.push(color);
        }
    });

    // return the outputs
    return out;
}

register({
    /* Effect Name */
    name: "Stripes",
    /* Effect Function */
    func: effect,
    /* Effect Inputs */
    input: [
        {
            key: "x",
            type: "rgb[]",
            label: "Colors",
            default: [
                [0, 0, 255],
                [0, 255, 255],
                [100, 0, 255],
            ],
        },
        {
            key: "n",
            type: "integer",
            label: "Count",
            default: 5,
            min: 2,
            max: 100,
        },
    ],
    /* Effect Output Type */
    output: "rgb[]",
});
```

## Step 3: Import your new module

Without importing your new file, your code won't get executed and it won't be
available in the app. To fix this, open up the `/src/index.ts` file and add
your file to the list of imports (without the `.ts` file extension), like so:

```ts
import "./stripes";
```

## Step 5: Compile your function and Push to github

Compiling your code and pushing it to github is exactly the same as the first
time we did this in the [User Library Setup](../user-library-setup) section, only
this time we won't need to install the dependencies:

```bash
# navigate to the library
cd path/to/my-ras-lights-user-library

# build the library files
npm run build

# add the updated files to Git's "staging area" and then commit them
git add .
git commit -m "Added a new stripes function"
git push
```

## Step 6: Pull updates onto your Pi and reload

Finally, you need to to [Connect to your Pi](../connecting-to-your-pi), and pull
in the changes that you pushed to Github, which in my case looks like:

```sh
ssh pi@ras-lights
```

(Where `ras-lights` is the `hostname` of the Pi from the [Getting
Started](../getting-started) page), followed by

```sh
cd /home/pi/ras-light-user-library
git pull
```

Finally, head over to the `Admin` tab on your web app, scroll down to the
`Library Folders` section and click the reload button to force the Pi to reload
your library, and then refresh the browser to import your new function into the
functions available on the Editor tab.
