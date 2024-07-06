import sys
import RPi.GPIO as GPIO

LIGHT = 16

def main(args) -> None:
    if len(args) != 1 : raise Exception('invalid args')
    if args[0] != 'ON' and args[0] != 'OFF': raise Exception('invalid args')
    
    GPIO.setmode(GPIO.BOARD)
    GPIO.setup(LIGHT, GPIO.OUT)
    GPIO.output(LIGHT, GPIO.HIGH if args[0]=='ON' else GPIO.LOW)
    GPIO.cleanup()

if __name__ == '__main__':
    main(sys.argv[1:])