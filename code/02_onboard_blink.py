from machine import Pin
import time

led = Pin(25, Pin.OUT)

for i in range(5):
    led.on()
    print(i + 1, "번째 켜짐")
    time.sleep(0.4)
    led.off()
    time.sleep(0.4)

print("끝")
