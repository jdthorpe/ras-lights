# Ras-Lights

A rasperry pi based light show and web app

## TODO

* Add a set of validators to common (including that defaults have been included in function signatures)
* Add validation for the signatures fetched from the backend (if the server is
    not running or the proxy is not set, the text is an HTML rendering from NGINX with a 502 or 404 message)

## Initial Set Up

1. Usual Raspeberry pi setup

* install rasbian
* setup ssh
* get the ip address (that's how you'll connect with ssh and to the web app)
* make an IP address reservation on your router (so you can find your pi online)
* disable visual mode on your pi (optional, probably)
* install the with either:

    ```sh
    /bsudo in/bash -c "$(curl -fsSL https://raw.githubusercontent.com/jdthorpe/ras-lights/main/install.sh)"
    ```

    or clone this repo into `/home/pi/` and run the install script with `sudo install.sh`


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