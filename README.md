# Ras-Lights

A rasperry pi based light show and web app

## Quickstart

### Get your IP address

This command:

```
ip r
```

will print out your ip configuration which will look like this:

```txt
default via 192.168.4.1 dev wlan0 proto dhcp src 192.168.4.70 metric 302
```

so my Raspberry Pi's ip address is `192.168.4.70` ( **not** `192.168.4.1`)

### Setup SSH on the pi


```
sudo systemctl enable ssh
sudo systemctl start ssh
```

### Run the install script


```sh
sudo bash -c "$(curl -fsSL https://raw.githubusercontent.com/jdthorpe/ras-lights/main/setup.sh)"
```

## optional

* make an IP address reservation on your router (so you can find your pi online)
* disable visual mode on your pi (optional, probably)

## Quick start

Plug an 8 light strand like this one into GPIO pin 18 (typially pin 12 on the
pi)  and visit the app at `http://<<your pi's ip address here>>/`

## Configuration

The `/home/pi/ras-lights/config.ini` file contains the confifuration parameters.
These are the ones you should touch

### Section `[ws281x]`: API server parameters

Includes settings for the [rpi-ws281x]() library which is used to interface with the light strand.

* `leds` indicates the number of leds on the strand.  
* `dma`, `brightness  indicates the number of leds on the strand.  


### Section `[api]`: API server parameters

* `loop_delay_ms` controls the delaty time time in the event loop that runs the light show.  The default (`50`) will refresh the lights about 20 times per second.