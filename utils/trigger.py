from components.arduino_connection import ArduinoConnection
from config import settings

arduino = ArduinoConnection()
arduino.connect(settings.ARDUINO_PORT, settings.BOUND_RATE_ARDUINO)

def pulse_default_trigger():
    arduino.send_to_arduino("single") 