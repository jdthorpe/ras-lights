# Ras Lights Developer Setup

These docs are for setting up a dev environment to work on the Raspberry Lights
Infrastructure (as opposed to setting up a new Rasperry pi or working with a
user library )

## Local Dev Machine Setup

### Start the builders

Start the shared library transpiler in watch mode:

```sh
cd ras-lights/shared
npx tsc --watch
```

Start the API transpiler in watch mode:

```sh
cd ras-lights/api
npx tsc --watch
```

If you update the `default-lib` you'll want to build it and push the build to
the /lib directory (only required on the dev machine)

```
cd ras-ligths/default-lib
yarn build
```

Since the web app is served on the Raspberry Pi, it needs to be compiled and pushed to the pi

```
cd ras-ligths/web
yarn build
```

### NGINX proxy

When developing the web app, you'll need to connect it to a Raspberry Pi
running the lights show API.  For this an NGINX proxy running in Docker
container can be used to (1) proxy the usual react dev server, (2) the ApI
running on the raspberry pi, and (3) 

First, open the `nginx-dev.conf`  and change this upstream IP address to the
address of your Raspberry Pi:

```nginx
    upstream raspberry {
        server 192.168.4.64;
    }
```

Then open a terminal and run the nginx from the root of this repo like so: 

```sh
docker run --rm -it -p 5000:80 -v $PWD/nginx-dev.conf:/etc/nginx/nginx.conf nginx
```

### React App Startup

```
cd ras-ligths/web
BROWSER=none yarn start
```

then open the app at `https://localhost:5000/`

## Raspberry pi setup

### API Server

With the default setup, the API server is run at startup by the
[supervisord](http://supervisord.org/). Hence, to work on the API, you'll want
to stop the API service like so:

```sh
sudo supervisorctl stop api
```

and start up the api in the SSH terminal like so: 

```sh
cd ras-lights/api
sudo node build/index.js
```

### NGINX Proxy

To reload the nginx script, copy the new script to the nginx config location,
test it out, and if it works, restart ("reload") the nginx service

```sh
# edit the config
sudo vim /etc/nginx/nginx.conf
# validate the config
sudo nginx -t
# reload the config
sudo nginx -s reload
```

# for other docs

```sh
ssh pi@168.192.4.64
```

### Initializing a bare git repo

It's handy to have a bare repo on the pi so that you can push updates from your
dev machine to the pi.  On the pi, use: 

```sh
cd /hom/pi/
mkdir ras-lights-bare
cd ras-lights-bare
git init --bare
```

to aid in pushing to the raspberry pi, consider adding the pi as a remote with:

```sh
git remote add pi ssh://192.168.4.64/home/pi/ras-lights-bare/
```

so that later you can push your updates directly to the pi with 

```sh
git push pi main
```

which bash users might want to alias via

```sh
alias ppi="git push pi main"
```

