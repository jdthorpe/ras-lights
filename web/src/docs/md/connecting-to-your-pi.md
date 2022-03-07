# Connecting to Your Pi

You'll need to connect to your Pi to view the web app, and also to make updates
to your setup, so you'll need to set up at least one way to connect to your Pi
over your local network.

# Method 1: Connecting with an IP address

On your Raspberry Pi, open a terminal and type:

```sh
ip r | grep default
```

which will print something like this:

```txt
default via 192.168.4.1 dev wlan0 proto dhcp src 192.168.4.70 metric 302
```

so in this case, my Raspberry Pi's IP address is `192.168.4.70` ( and **not**
`192.168.4.1`).

**Note that** your Pi's IP address can change over time (especially when your Router
restarts), so you may want to do an internet search for how to create an "IP
address reservation" for your Pi on your router. (Instructions will vary
depending on the brand and model of your router)

With the IP address, you can connect to your Pi using `ssh` with this command:

```sh
ssh pi@192.168.4.70
```

and by navigating to the web app at `http:/192.168.4.70/` in your browser. This
method has the unfortunate side effect of having to remember an IP address, so I
prefer using the next method instead...

# Method 2: Connecting with a `hostname `

By default, your Raspberry Pi has the `hostname` of `raspberrypi`, which means
that you can connect to your Pi over ssh using:

```sh
ssh pi@raspberrypi.local
```

and view the web app on your local network at:

```txt
http://raspberrypi.local/
```

as long as your computer or phone is connected to the same router / network as
your Pi. If you have more than one Raspberry Pi on your network, this won't work
unless each of your Pi's have different `hostname`s.

To configure your PI's `hostname`, click on the start menu > Preferences >
Raspberry Pi Configuration, then enter a new hostname in the `Hostname` field
and click save. I like to use a hostname like `ras-lights`  or `livingroom`
which is informative and easy to remember.

When you click save, you'll be prompted to restart your Pi, and after it
restarts, if you picked the name `my-awesome-pi` you will be able to connect to
your py using ssh with:

```sh
ssh pi@my-awesome-pi.local
```

and view the web app at:

```txt
http://my-awesome-pi.local/
```
