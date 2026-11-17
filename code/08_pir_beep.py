from machine import Pin
import time

led = Pin(14, Pin.OUT)
buzzer = Pin(13, Pin.OUT)
pir = Pin(28, Pin.IN, Pin.PULL_DOWN)
before = 0

while True:
    now = pir.value()
    if now == 1 and before == 0:
        buzzer.on()
        time.sleep(0.1)
        buzzer.off()
    if now == 1:
        led.on()
    else:
        led.off()
    before = now
    time.sleep(0.05)
