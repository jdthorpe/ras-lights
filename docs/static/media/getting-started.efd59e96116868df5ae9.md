# Quick Start

This guide will get the Ras-Lights app up and running as as quickly as possible.
It will walk you through:

-  Connecting your Raspberry Pi to your local network
-  Get the IP address of your Raspberry Pi
-  Enable `ssh` on your Raspberry Pi
-  Install the Ras-Lights app on your Raspberry Pi
-  [Connect a light strip](../hardware-setup) to your Raspberry Pi
-  Configure the Pi to work with your light strip(s) 

## Step 1: Setup your Pi

Turn on you Pi by plugging in a monitor, a keyboard and mouse, and then plugging
in the USB power supply. Be careful to note that one the USB ports is for power
only and the other is for peripherals like the mouse and keyboard.

The first time you plug in your Pi, the 'Welcome to Raspberry Pi' app should
open and walk you through the process of choosing your location and language,
setting a password, connecting to your local network, and updating the operating
system.

### Enable SSH

Secure Shell ("SSH") is a application that lets you connect to your Pi from
another computer and enter terminal commands on your Raspberry Pi.  To enable
SSH on your Pi, open up the terminal window using the terminal icon at the top
of the screen and type:

```sh
sudo systemctl enable ssh
sudo systemctl start ssh
```

## Set Up a Connection to Your Pi

Use the instructions on the [Connecting to your Pi](../connecting-to-your-pi)
page to set up a connection to your Pi.

## Run the Ras-Lights Install Script

To install the Ras-Lights app on your Pi, copy this into the terminal window:

```sh
sudo bash -c "$(curl -fsSL https://raw.githubusercontent.com/jdthorpe/ras-lights/main/setup.sh)"
```

**Tip**: On my Raspberry Pi Zero, I was unable start the chromium browser to
view this page, and since I didn't want to type the command by hand, I went to
my laptop and opened a terminal window and typed:

```sh
ssh pi@ras-lights
```

where `ras-lights` is the hostname you configured on the [connecting to your
Pi](../connecting-to-your-pi) page, and logged in using the password for my Pi. I
then copied the above command from this site into the ssh terminal on my laptop.

## Connect your LEDs

The [hardware setup](../hardware-setup) page has diagrams for several methods I
have used to connect LED strips to my Pi. For this demo I'm using a tiny
breakout board from Adafruit, which can be powered directly with the Pi, so my
setup looks like this:

<img 
    src="/ras-lights/assets/images/pi-powered-pixels.png" 
    alt="LEDs powered by Raspberry Pi" 
    style="width:400px;"/>

**DO NOT** power longer strings of LEDs to with Pi, as this risks damaging your
Pi or worse.

## Setup the LED drivers

Open a browser to the URL in the [Connecting to your Pi
section](../connecting-to-your-pi) to view the Ras-Lights web app. In the web
app, open the the Admin tab and scroll down to the "Driver Settings" section to
set up the driver(s) for your LEDs.

I'm starting with a NeoPixel breakout board from Adafruit that I connected to
pin 18 of my Raspberry Pi Zero, so my setup looks like this:

<img 
    src="/ras-lights/assets/images/getting-started-driver.png" 
    alt="LEDs powered by Raspberry Pi" 
    style="width:750px; box-shadow: 0 4px 8px 0 rgb(0 0 0 / 20%), 0 6px 20px 0 rgb(0 0 0 / 19%);"/>

After clicking Save, the driver will be set up and ready to go. 

More details on each of the settings in this section can be found on the
[configuration page](../configuration).  Here's a brief summary of the above settings:

-   **GPIO**: The input pin of my [Adafruit
    Neopixel breakout
    board](https://www.amazon.com/Adafruit-NeoPixel-Arduino-Integrated-Drivers/dp/B00IEDH26K/ref=sr_1_7?keywords=adafruit+neopixel&qid=1645933197&sprefix=adafruit+neop%2Caps%2C167&sr=8-7) is connected to GPIO pin 18 of my Pi Zero
-   **Brightness**: I like to start with value of around 50, especially when powering a small strip using the Pi
-   **Count**: My little [Adafruit Neopixel breakout
board](https://www.amazon.com/Adafruit-NeoPixel-Arduino-Integrated-Drivers/dp/B00IEDH26K/ref=sr_1_7?keywords=adafruit+neopixel&qid=1645933197&sprefix=adafruit+neop%2Caps%2C167&sr=8-7)
    has 8 LEDs.
-   **Invert**: My breakout board does not need inverted signals
-   **Revere**: My led strip is mounted backward compared to the display on the Editor tab
-   **Strip Type**: Adafruit NeoPixels are GRB type LEDs. See the [configuration page](/ras-lights/docs/configuration) for instructions to determine your strip type.

## Time to play!

With Ras-Lights set up, it's time to play!

-   Select your favorite color on the Manual tab
-   Select one of the build in modes on the Modes tab
-   Create a new mode on the Editor tab
-   Use the template tab to start coding your own shows
-   Fine tune your Ras-Lights setup on the Admin tab.
