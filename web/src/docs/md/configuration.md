## Driver Options

The `Frequency` and `dma` options are described in the documentation for the
underlying
[rpi-ws281x-led](https://github.com/dsyomichev/rpi-ws281x-led#driver-configuration)
driver.

### Light Strip Options

-   **GPIO**: This is the "**G**eneral **P**urpose **I**nput and **O**uput" pin
to which the LED strip's input pin is attached. Consult your Pi's data sheet or
do a search for "Raspberry Pi pinout" to determine physical pin that corresponds
to the selected GPIO pin.

-   **Brightness**: This ranges between 0 and 255 and determines how bright and
how much power your LEDs will use.

-   **Count**: The number of LED's on your strip.

-   **Invert**: If selected, the signal sent to the LEDs is inverted (required
for some LED strips).

-   **Reverse**: If selected, the colors are rendered from left-to-right instead
of right-to-left (handy depending on how you mount your LED's).

-   **Strip Type**: This list contains 6 RGB pixel types and 6 RGBW pixel types.
RGBW strips have an extra white pixel.

### How to Choose the Strip Type

If you're not sure what kind of strip you have, start by choosing RGB if you
have a three color strip, and RGBW if you have a 4 color strip. Next, head
over to the "Manual" tab and choose a red color. This will turn on the first
color for your strip -- **which might not be red**: If your strip turns
<strong><span style="color: green;">green</span></strong>, you know your strip
is either <strong><span style="color: green;">G</span></strong>RB or
<strong><span style="color: green;">G</span></strong>BR, and if your strip turns
<strong><span style="color: blue;">blue</span></strong>, you have either a
<strong><span style="color: blue;">B</span></strong>RG or a <strong><span
style="color: blue;">B</span></strong>GR type strip. With this knowledge, head
back to the "Admin" tab and select one of the two appropriate options.

Now that you know that the color is in the first position is correct, it's time
to check the color in the second position. After you've updated your Strip Type
setting, head back to the "Manual" tab and select a green color. If your strip
turns green you're done, and if not, head back to the select the "Admin" tab,
select the other of the two options, and click save.

## Library Folders

These folders correspond to the libraries that contain the basic functions
(a.k.a. "Speecia Effects") that control the lights. See the [User
Library](../user-library-overview) for details.

**Note**: the `internal` library contains functions used internally by the
ras-light app. **Do not delete this library** unless you're sure you know what
you're doing.

## Persistent Data

Driver settings, user defined modes, and schedules are stored in the
`/var/lib/ras-lights/` directory. If you wish to clone your complete setup onto
another Pi, you can copy this directory onto your new Pi after installing the
Ras-Lights app.
