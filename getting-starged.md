---
title: Quick Start
permalink: /quick-start.html
---

# Quick Start

Assuming you have a Raspberry Pi in hand, you'll need to do a few things to get
the Ras-Lights set up on your pi. In short, you'll need to:

-   connect your Pi to your local network
-   get the IP address of your PI
-   set up SSH on your pi (optional, but super handy)
-   install the Ras-Lights app

## Step 1: Setup your PI

Turn on you Pi by plugging in a monitor, a keyboard and mouse, and then plugging
in the USB power supply. The first time you plug in your Pi, the 'Welcome to
Raspberry Pi' app should open and walk you through the process of choosing your
location and language, setting a password, connecting to your local network, and
updating the operating system.

## Get your IP address

This command will print out your ip configuration:

```
ip r | grep default
```

which will look something like this:

```txt
default via 192.168.4.1 dev wlan0 proto dhcp src 192.168.4.70 metric 302
```

so in this case, my Raspberry Pi's IP address is `192.168.4.70` ( **not**
`192.168.4.1`).

**Tip**: your Pi's IP address can change over time (especially when your Router
restarts), so you may want to do an internet search for how to create an "IP
address reservation" for your Pi on your router

## Setup SSH on the pi

To enable SSH on your pi, open up the terminal window using the terminal icon at
the top of the screen and type:

```
sudo systemctl enable ssh
sudo systemctl start ssh
```

## Run the install script

To install the Ras-Lights app on your pi, copy this into the terminal window.

```sh
sudo bash -c "$(curl -fsSL https://raw.githubusercontent.com/jdthorpe/ras-lights/main/setup.sh)"
```

**Tip**: On my Raspberry Pi zero, I was unable start the chromium browser to
view this page, and since I didn't want to type the command by hand, I went to
my laptop and opened a terminal window and typed

```sh
ssh pi@192.168.4.64
```

(where `192.168.4.64` was the IP address from the previous step), and logged in
using the password for my Pi. I then copied the above command from this site
into the ssh terminal.

## Setup the LED drivers

you can open a browser and navigate to your Pi's IP address (e.g.
`http://192.168.4.64/`) to view the app. In the app, click on the the admin tab
and scroll down to the "Driver Settings" section to set up the driver(s) for your LEDs.

-   **GPIO**: This is the pin to which the your LED strip's input pin is attached.
    Consult your Pi's data sheet or do a search for "Raspberry Pi pinout" to
    determine which pin to use.
-   **Brightness**: This ranges between 0 and 255 and determines how bright and
    how much power your LEDs will use. I like to start with value of around 50,
    especially when powering a small strip using the Pi.
-   **Count**: The number of LED's on your strip. I'm using a little Adafruit
    breakout board with 8 LEDs so I chose 8.
-   **Invert**: If selected, the signal sent to the LEDs is inverted (required for some LED strips)
-   **Revere**: If selected, the colors are rendered from left-to-right instead of
    right-to-left (handy depending on how you mount your LED's)
-   **Strip Type**: This list is grouped into two groups with 6 RGB types and 6
    RGBW types. RGBW strips have an extra white pixel, which typically gives a much
    more pleasant white color, compared to turning on all three color channels.

    If you're not sure what kind of strip you have, start by choosing RGB if you
    have a three color strip, and RGBW if you have a 4 color strip. Then head
    over to the "Manual" and choose a red color. This will turn on the first
    color for your strip -- \*which might not be red**: If your strip turns
    green, you know your strip is either **G**RB or **G**BR, and if your strip
    turns blue, you have either a **B**RG or a **B\*\*GR type strip.

    With this knowledge, head back to the admin tab and select one of the
    two appropriate options, and head back to the "Manual" tab and select a
    green color. if your strip turns green you're done, and if not, head back to
    the select the admin tab, select the other of the two options, and save.

## Time to play!

With Ras Lights set up, it's time to play!

-   Select your favorite color on the Manual tab
-   Select one of the build in modes on the Modes tab
-   Create a new mode on the Editor tab
-   Use the template tab to start coding your own shows
-   Fine tune your Ras-Lights setup on the Admin tab.
