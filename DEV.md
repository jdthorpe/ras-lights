# fhi

<!--
```sh
sudo /etc/init.d/nginx start
```
# always handy
sudo apt-get install vim -y

## Connect to the Rasperry

```sh
ssh pi@168.192.4.64
```
-->

## local dev setup

```sh
conda create -n RasLights python=3.9
conda activate RasLights
pip install aiohttp jsonschema pyyaml
```

## dev startup

```sh

docker run --rm -it -p 5000:80 \
    -v $PWD/lib/:/www/lib \
    -v $PWD/nginx-dev.conf:/etc/nginx/nginx.conf nginx

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