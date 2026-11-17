from machine import Pin
import time

led = Pin(14, Pin.OUT)

while True:
    led.on()
    time.sleep(0.12)
    led.off()
    time.sleep(0.12)
    led.on()
    time.sleep(0.12)
    led.off()
    time.sleep(0.6)
