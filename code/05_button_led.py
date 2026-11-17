from machine import Pin
import time

led = Pin(14, Pin.OUT)
button = Pin(15, Pin.IN, Pin.PULL_DOWN)

while True:
    if button.value() == 1:
        led.on()
    else:
        led.off()
    time.sleep(0.05)
