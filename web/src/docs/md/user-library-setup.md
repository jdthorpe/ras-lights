# User Defined Functions

Creating a user library is a one-time setup that creates a workspace where
you can create your own functions and use them in the Ras-Lights app. This
guide will walk you through the steps to:

- Create a Github repository from a template.
- Clone your user library onto your computer and onto the Pi.
- Add the user library onto your Pi.
- Configure the Ras-Lights app to load the functions in your library.

### Step 1: Create a Github Repo for Your Code

To get started, head over to the [template repo](https://github.com/jdthorpe/ras-lights-user-lib-template)
and click on the `Use this template` button to create a new repo. I'll call mine
`ras-light-user-library` (Very creative, I know).

### Step 2: Workstation Setup

User Libraries are written in TypeScript which is compiled to JavaScript. This
allows it to can run on the Pi and in the web app. For this, you'll need to have
NodeJS installed wherever you plan on editing your user library.

To test if you have NodeJS installed, open a terminal window and type:

```sh
node --version
```

If it prints out a version number like `v14.18.3`, you're good to go. Otherwise head
over the [NodeJS downloads page](https://nodejs.org/en/download/) to install it.

Next, clone your new repo to your machine. In my case, I'll open a terminal
window and call:

```sh
git clone https://github.com/jdthorpe/ras-light-user-library.git
```

to clone the new repo that I setup in step 1 onto my machine.

### Step 3: Update Library Names (Optional, usually)

This library is somewhat special because it is transpiled to run on the Pi
(using ordinary JS modules) _and_ loaded onto the web app using federated
web modules. This requires a bit of configuration that isn't typically required
for a NodeJS package.

If you are only going to use a single user-library with your Ras-Lights app
*and* you don't plan on sharing your cool new library, then you can skip this
part. However, if you plan to have more than one user library on your Pi (e.g.
by downloading someone elses library of special effects), or you plan to share
your user library with your friends (why not!), then you need to give it a
unique name in order to avoid naming collisions.

There are two library names that matter:

The first name that needs to be configured is the name of the javascript
variable that will hold your library when it is loaded into the web app. Hence
you'll need to choose a unique library name that is a valid JavaScript variable name
that is unlikely to be used by someone else (e.g. `jdthorpe_ras_lights`).

Once you choose a variable name for your library, you'll need to update the old
name (`user`) by opening the `webpack-config.js` file at the root of the library
directory and replace the string `"user"` two times in the Federated Module
Plugin specification:

```js
new ModuleFederationPlugin({
    name: "user", // <- HERE
    filename: "remoteEntry.js",
    library: { type: "var", name: "user" }, // <- AND HERE
    exposes: {
        "./lib": "./bootstrap",
    },
});
```

Next, you'll need to update the package name in the library's `package.json`
file:

```json
{
    "name": "ras-lights-user-demo", // <- HERE
    ...
}
```

In order for these changes to be reflected in the compiled code, you'll need to
build the library and push your updates back to github like so:

```bash
# navigate to the library
cd path/to/my-ras-lights-user-library

# install the dependencies (or use `npm i` for the cool kids)
npm install

# build the library files
npm run build

# add the updated files to Git's "staging area" and then commit them
git add .
git commit -m "updated package name"
git push
```

### Step 4: Load Your Library onto Your pi

Now it's time to get your new user library onto your Pi. I like to do this by
connecting to my Pi from my computer using SSH by opening a terminal on my
computer and typing:

```sh
ssh pi@192.168.4.64
```

where `pi` is the default user name on the Raspberry Pi, and the IP address is
the IP address or hostname from the [getting started](../getting-started) page.

Then in the `ssh` terminal, navigate to the user directory and clone **your**
new repo here (using it's url):

```sh
cd /home/pi
# USE YOUR GITHUB REPO URL HERE: 
git clone https://github.com/jdthorpe/ras-light-user-library.git 
```

which will clone your user library into the directory:

```txt
/home/pi/ras-light-user-library
```

### Step 5: Add the Library to Ras-Lights

Open the web app to the "Admin" page and scroll to the "Library Folders" section.
Add the library using **your** library name variable from step 3
(`jdthorpe_ras_lights` in my case), and **your** the directory name above from
step 4, like so:

<img 
    src="/ras-lights/assets/images/new-library-folder.png" 
    alt="LEDs powered by Raspberry Pi" 
    style="width:400px;"/>


Your library is now set up on the your Pi! Next, head over to the [user library
workflow](../user-library-workflow) page to learn how to add new functions to
your user library and push them to your Pi.
