from components.arduino_connection import ArduinoConnection
from config import settings
import re

arduino = ArduinoConnection()

def connecet_trigger(port, boud_rate = None):
    match = re.search(r'COM\d+', port)
    arduino.connect(match.group(), boud_rate)
    return arduino.arduino_connected

def pulse_default_trigger():
    if arduino.arduino_connected:
        arduino.send_to_arduino("single")