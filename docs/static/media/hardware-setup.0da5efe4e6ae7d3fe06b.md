# Hardware Setup

These are some ways that I have connected led strips to my Raspberry Pi.

Please note that these are for **informational purposes only**. These do not cover all
possible situations or products. Check your product data-sheets for instructions
for your products.

## Powering Lights with Your Pi

In my first experiments with individually addressable LEDs, I used a little
[Adafruit NeoPixel
module](https://www.amazon.com/Adafruit-NeoPixel-Arduino-Integrated-Drivers/dp/B00IEDH26K/ref=sr_1_7?keywords=adafruit+neopixel&qid=1645933197&sprefix=adafruit+neop%2Caps%2C167&sr=8-7)
with 8 pixels, which, in my experience, is small enough to power with my
Raspberry Pi using a setup like this:

<img 
    src="/ras-lights/assets/images/pi-powered-pixels.png" 
    alt="LEDs powered by Raspberry Pi" 
    style="width:400px;"/>

In this diagram: 

- The `5V` pin of the LEDs is attached to one of the `5V` pins of the Raspberry Pi
- The `GND` pin of the LEDS is attached to the `GND` pin of the Raspberry Pi
- The `IN` pin of the LEDs is attached to GPIO pin 18 of the Raspberry Pi to
match the settings on the "Admin" tab

Note that Raspberry Pi's have limited ability to power external hardware.
**Attempting to power too many LEDs may damage your Pi or worse**.

## Powering Lights and Pi with a 5v Power Supply

Longer strands of LEDs need to have their own power source. For LEDs which
require a 5 volt power supply, I like to power the Pi with the same power supply
by connecting the power and ground to the 5V and GND pins of the Pi, like so:

<img 
    src="/ras-lights/assets/images/pi-pixel-shared-power.png" 
    alt="LEDs powered by Raspberry Pi" 
    style="width:400px;"/>

In this diagram: 
 
- The `5V` pin of the LEDs and the `5V` pins of the Raspberry Pi are attached to
the `5V` contact of a 5V power supply
- The `GND` pin of the LEDS is and the `GND` pin of the Raspberry Pi are
attached to the `GND` contact of a 5V power supply
- The `IN` pin of the LEDs is attached to GPIO pin 18 of the Raspberry Pi to
match the settings on the "Admin" tab

Note that when the Pi is powered by an external power supply, it is **not** safe
to also power the Pi with another power supply (e.g. USB).

## Powering Lights and Your Pi Separately

Longer strands of LEDs need to have their own power source, but in cases when I
want to power the Pi via USB, it is necessary to connect the GND and signal
wires of the LEDs to the Pi, like so:

<img 
    src="/ras-lights/assets/images/pi-pixel-separate-power.png" 
    alt="LEDs powered by Raspberry Pi" 
    style="width:400px;"/>

In this diagram: 

- The `5V` pin of the LEDs is attached to the `5V` contact of a 5V power supply
- The `GND` pin of the LEDS is and the `GND` pin of the Raspberry Pi are
attached to the `GND` contact of a 5V power supply
- The `IN` pin of the LEDs is attached to GPIO pin 18 of the Raspberry Pi to
match the settings on the "Admin" tab
- The Raspberry Pi is powered by USB
