#!/usr/bin/env python3
# NeoPixel library strandtest example
# Author: Tony DiCola (tony@tonydicola.com)
#
# Direct port of the Arduino NeoPixel library strandtest example.  Showcases
# various animations on a strip of NeoPixels.

from rpi_ws281x import PixelStrip, Color
from types import List

# LED strip configuration:
LED_COUNT = 16  # Number of LED pixels.
LED_PIN = 18  # GPIO pin connected to the pixels (18 uses PWM!).
# LED_PIN = 10        # GPIO pin connected to the pixels (10 uses SPI /dev/spidev0.0).
LED_FREQ_HZ = 800000  # LED signal frequency in hertz (usually 800khz)
LED_DMA = 10  # DMA channel to use for generating signal (try 10)
LED_BRIGHTNESS = 255  # Set to 0 for darkest and 255 for brightest
LED_INVERT = False  # True to invert the signal (when using NPN transistor level shift)
LED_CHANNEL = 0  # set to '1' for GPIOs 13, 19, 41, 45 or 53


def set_color_s(colors: List[List[int]]):
    COLORS: List[Color] = []
    for color in colors:
        if isinstance(color, List):
            COLORS.append(Color(*color))
        else:
            COLORS.append(Color(**color))
    set_color(COLORS)

def random_colors():
    colors = []
    for _ in range(strip.numPixels()):
        a = random.randint(0, 100)
        b = random.randint(0, 100)
        colors.append([a, b, max(100 - a - b, 0)])
    set_color_s(colors)

def set_color(colors: List[Color]):
    """Draw rainbow that fades across all pixels at once."""
    if strip is None:
        return
    for i in range(strip.numPixels()):
        strip.setPixelColor(i, color[i % len(color)])
    strip.show()


strip = None


def start():
    global strip
    if strip is not None:
        return
    # Create NeoPixel object with appropriate configuration.
    strip = PixelStrip(
        LED_COUNT,
        LED_PIN,
        LED_FREQ_HZ,
        LED_DMA,
        LED_INVERT,
        LED_BRIGHTNESS,
        LED_CHANNEL,
    )
    # Intialize the library (must be called once before other functions).
    strip.begin()


# Main program logic follows:
if __name__ == "__main__":
    start()
    import random

    # set_color(
    #     [Color(random.randint(0, 255), random.randint(0, 255), random.randint(0, 255))]
    # )
    import random

    a = random.randint(0, 100)
    b = random.randint(0, 100)
    c = random.randint(0, 100)
    d = random.randint(0, 100)
    # set_color(
    #     [
    #         Color(a, b, max(100 - a - b, 0)),
    #         Color(b, c, max(100 - b - c, 0)),
    #         Color(c, d, max(100 - c - d, 0)),
    #         Color(d, a, max(100 - d - a, 0)),
    #     ]
    # )

    set_color_s(
        [
            [a, b, max(100 - a - b, 0)],
            [b, c, max(100 - b - c, 0)],
            [c, d, max(100 - c - d, 0)],
            [d, a, max(100 - d - a, 0)],
        ]
    )
