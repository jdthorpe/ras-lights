# Hardware Setup

Please note that these are for informational purposes only.  These are some ways
that I have connected led strips to my Raspberry Pi.  These do not cover all
possible situations or products. Check your product datasheets for instuctions
for your products.

## Powering Lights with your Pi

In mmy first experiments with individually addressable LEDs, I used a little
[Adafruit Neopixel
module](https://www.amazon.com/Adafruit-NeoPixel-Arduino-Integrated-Drivers/dp/B00IEDH26K/ref=sr_1_7?keywords=adafruit+neopixel&qid=1645933197&sprefix=adafruit+neop%2Caps%2C167&sr=8-7)
with 8 pixels, which, in my experience is small enough to power with my
Raspberry Pi using a setup like this:

<img 
    src="/ras-lights/assets/images/pi-powered-pixels.png" 
    alt="LEDs powered by Raspberry Pi" 
    style="width:400px;"/>

## Powering Lights and Pi with a 5v power supply

Longer strands of LEDs need to have their own power source. For LEDs which
require a 5 volt power supply, I like to power the Pi with the same power supply
by connecting the power and ground to the 5V and GND pins of the Pi, like so:

<img 
    src="/ras-lights/assets/images/pi-pixel-shared-power.png" 
    alt="LEDs powered by Raspberry Pi" 
    style="width:400px;"/>

Note that when the Pi is powered by an external power supply, it is **not** safe
to also power the Pi with another power supply (e.g. USB).


## Powering Lights and your Pi separately

Longer strands of LEDs need to have their own power source, but in cases when I
want to power the Pi via USB, it is necessary to connect the GND and signal
wires of the LEDs to the Pi, like so:

<img 
    src="/ras-lights/assets/images/pi-pixel-separate-power.png" 
    alt="LEDs powered by Raspberry Pi" 
    style="width:400px;"/>
