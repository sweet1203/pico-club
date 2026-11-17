from machine import Pin
import time

led = Pin(14, Pin.OUT)

while True:
    for i in range(3):
        led.on()
        time.sleep(0.12)
        led.off()
        time.sleep(0.12)
    time.sleep(1.2)
