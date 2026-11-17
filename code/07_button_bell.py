from machine import Pin
import time

led = Pin(14, Pin.OUT)
button = Pin(15, Pin.IN, Pin.PULL_DOWN)
buzzer = Pin(13, Pin.OUT)

while True:
    if button.value() == 1:
        buzzer.on()
        led.on()
    else:
        buzzer.off()
        led.off()
    time.sleep(0.05)
