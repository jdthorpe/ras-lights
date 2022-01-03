# Ras-Lights

A rasperry pi based light show and web app

## TODO

* Add a set of validators to common (including that defaults have been included in function signatures)
* Add validation for the signatures fetched from the backend (if the server is
    not running or the proxy is not set, the text is an HTML rendering from NGINX with a 502 or 404 message)

## Set Up

1. Usual Raspeberry pi setup

* install rasbian
* setup ssh
* get the ip address (that's how you'll connect with ssh and to the web app)
* make an IP address reservation on your router (so you can find your pi online)
* disable visual mode on your pi (optional, probably)

* install the app as follows:

This probably belongs in a `setup.sh` script:

```sh
sudo apt-get update
sudo apt-get install nginx -y
sudo apt-get install supervisor -y
sudo apt-get install node -y

cd /home/pi
git clone https://github.com/jdthorpe/ras-lights

# config files
cd /home/pi/ras-lights
sudo cp nginx.conf /etc/nginx/nginx.conf
sudo cp supervisor.conf /etc/supervisor/confi.d/supervisor.conf

# install npm dependencies
pushd web
npm install
popd

# install npm dependencies (necessary???)
pushd common
npm install
popd

# star tthe apps
sudo supervisorctl reload
```

<!--
```sh
sudo /etc/init.d/nginx start
```
# always handy
sudo apt-get install vim -y
-->

## Connect to the Rasperry

```sh
ssh pi@168.192.4.64
```

[site](http://168.192.4.64/)

## local dev setup

```sh
conda create -n RasLights python=3.9
conda activate RasLights
pip install aiohttp jsonschema pyyaml
```

## dev startup

```sh
docker run --rm -it -p 5000:80 -v $PWD/nginx-dev.conf:/etc/nginx/nginx.conf nginx
```

reload the nginx script

```sh
# edit the config
sudo vim /etc/nginx/nginx.conf
# validate the config
sudo nginx -t
# reload the config
sudo nginx -s reload
```
