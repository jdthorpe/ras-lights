# Ras-Lights

A rasperry pi based light show and web app

## Set Up

```sh
sudo apt-get update
# always handy
sudo apt-get install vim -y
# web server
sudo apt-get install nginx -y
sudo apt-get install supervisor -y
# python lib
sudo pip install rpi_ws281x
```

```sh
sudo /etc/init.d/nginx start
```

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
