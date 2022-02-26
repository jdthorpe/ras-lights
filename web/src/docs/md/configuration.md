## Library folders

These correspond to the libraries which contain the basic functions which control the lights.

The `internal` library contains some default functions such as the `alternate`
and `gradient` that are used in the default shows and a `SmoothTo` function used
on the the Manual tab. **Do not delete this library** unless you're sure you
know what you're doing.

## Driver options

The `Frequency` and `dma` options are described in the documentation for the
underlying
[rpi-ws281x-led](https://github.com/dsyomichev/rpi-ws281x-led#driver-configuration)
driver.

### Light strip options

Use the `+` to add more strips

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

## How to choose the strip type

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

## Persistent data

Driver settings, user defined modes, and schedules are stored in the
`/var/lib/ras-lights/` directory. If you wish to clone your complete setup
onto another Pi, you just need to copy this directory onto your new Pi after
installing the Ras-Lights app.
