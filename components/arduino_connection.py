import serial
import threading
from concurrent.futures import ThreadPoolExecutor
import time

class ArduinoConnection():
    def __init__(self):
        self.device = None
        self.arduino_connected = False
        self.baudrate = 0
        self.port = ''
        self.port_name = ''
        self.lock = threading.Lock() 
        self.executor = ThreadPoolExecutor(max_workers=2) 

    def connect(self, port, baudrate, port_name):
        try:
            self.device = serial.Serial(port, str(baudrate), timeout=1)
            self.arduino_connected = True
            self.baudrate = baudrate
            self.port = port
            self.port_name = port_name
            print("Arduino Connection Established")
        except serial.SerialException:
            print("Arduino Connection Error. Check the USB Port")
            self.arduino_connected = False
            self.device = None
            self.baudrate = 0
            self.port = ''
            self.port_name = ''

    def disconnect(self):
        if self.arduino_connected:
            self.device.close()
            self.arduino_connected = False
            print("Arduino Disconnected")
        else:
            print("Arduino is not connected")

    def send_to_arduino(self, message):
        """Send a message to Arduino using a thread from the pool."""
        if self.arduino_connected:
            self.executor.submit(self._send_message, message)

    def _send_message(self, message):
        """Actual function that sends the message to Arduino (blocking I/O)."""
        try:
            with self.lock:  # Ensures that only one thread writes to the serial at a time
                self.device.write((str(message) + '\n').encode())
        except serial.SerialException:
            self.arduino_connected = False

    def read_from_arduino(self):
        """Read from Arduino using a thread from the pool."""
        if self.arduino_connected:
            self.executor.submit(self._read_message)

    def _read_message(self):
        """Actual function that reads from Arduino (blocking I/O)."""
        try:
            with self.lock:
                read = self.device.readline()
                read = read.decode('utf-8')
                read = read.strip()
                print(f"Read from Arduino: {read}")
        except serial.SerialException:
            self.arduino_connected = False
    async def check_connection(self):
        if self.device is not None:
            if not self.device.is_open:
                self.arduino_connected = False
            else:
                try:
                    await self.send_to_arduino('t')
                except serial.SerialException:
                    self.arduino_connected = False
                if not self.arduino_connected:
                    self.connect(self.port, self.baudrate, self.port_name)
    
