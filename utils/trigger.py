from components.arduino_connection import ArduinoConnection
from config import settings
import re

arduino = ArduinoConnection()

def connect_trigger(port, boud_rate = None):
    match = re.search(r'COM\d+', port)
    arduino.connect(port=match.group(), baudrate = boud_rate, port_name=port)
    return arduino.arduino_connected

def pulse_default_trigger():
    if arduino.arduino_connected:
        arduino.send_to_arduino("SINGLE")

def pulse_tms_trigger():
    if arduino.arduino_connected:
        arduino.send_to_arduino("SINGLE_TMS")