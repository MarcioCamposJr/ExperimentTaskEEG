import serial
import serial.tools.list_ports as lp

class ArduinoConnection():
    def __init__(self):
        self.device = None
        self.arduino_connected = False
        self.baudrate = 0
        self.port = ''
        self.port_name = ''

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

    async def send_to_arduino(self, message):
        try:
            if self.arduino_connected:
                self.device.write((str(message) + '\n').encode())
        except:
            self.arduino_connected = False

    def read_from_arduino(self):
        read = self.device.readline()
        read = read.decode('utf-8')
        read = read.strip()

        try:
            read = int(read)  # converte a string para um número inteiro
            #print(read)  # exibe o número
            return read
        except ValueError:
            print("Não foi possível converter para número:", read)
        #print(self.device.readline())
        #return read

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