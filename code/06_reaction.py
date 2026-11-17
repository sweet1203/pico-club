from machine import Pin
import time
import random

led = Pin(14, Pin.OUT)
button = Pin(15, Pin.IN, Pin.PULL_DOWN)

def wait_release():
    while button.value() == 1:
        time.sleep(0.01)

print("버튼을 짧게 누르면 시작. 불이 켜지면 다시 누르세요.")
best = None

for n in range(1, 6):
    print(n, "번째")
    while button.value() == 0:
        time.sleep(0.01)
    wait_release()

    led.off()
    wait_ms = random.randint(1500, 4000)
    early = False
    t0 = time.ticks_ms()
    while time.ticks_diff(time.ticks_ms(), t0) < wait_ms:
        if button.value() == 1:
            early = True
            break
        time.sleep(0.01)

    if early:
        print("너무 일렀어요")
        for _ in range(3):
            led.on()
            time.sleep(0.08)
            led.off()
            time.sleep(0.08)
        wait_release()
        continue

    led.on()
    start = time.ticks_ms()
    while button.value() == 0:
        time.sleep(0.001)
    ms = time.ticks_diff(time.ticks_ms(), start)
    led.off()
    wait_release()
    print("기록", ms, "ms")
    if best is None or ms < best:
        best = ms
        print("오늘 최고")

if best is None:
    print("끝. 성공한 기록이 없어요")
else:
    print("끝. 최고 기록", best, "ms")
led.off()
