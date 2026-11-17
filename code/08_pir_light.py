from machine import Pin
import time

led = Pin(14, Pin.OUT)
pir = Pin(28, Pin.IN, Pin.PULL_DOWN)

while True:
    if pir.value() == 1:
        led.on()
    else:
        led.off()
    time.sleep(0.1)
