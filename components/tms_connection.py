import magicpy as mp
from serial import serialutil

class stimulator():

    def __init__(self):
        self.magventure_device = None
        self.is_connected = False
        self.port = ''
        self.port_name = ''

    async def connect_port(self, portid, port_name):
        try:
            self.magventure_device = mp.MagVenture(portid)
            self.magventure_device.connect()
            self.port_name = port_name
            self.port = portid
            await self.check_connection()
            if not self.is_connected:
                self.magventure_device = None
                self.port = ''
                self.port_name = ''

        except (serialutil.SerialException, serialutil.PortNotOpenError) as e:
            print(f"Falha ao abrir a porta {portid}: {e}")
            self.magventure_device = None
            self.is_connected = False
            raise
    
    async def check_connection(self):
        if self.magventure_device is None:
            self.is_connected = False
            return
        if not self.magventure_device.port.is_open:
            print("Porta do dispositivo está fechada. A conexão falhou na inicialização.")
            self.is_connected = False
            return
        try:
            status = self.magventure_device.get_status()
            if status and status[0] != "Empty":
                self.is_connected = True
            else:
                self.is_connected = False
        except serialutil.PortNotOpenError:
            self.is_connected = False
        except Exception:
            self.is_connected = False
