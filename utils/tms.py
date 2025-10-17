from magicpy import list_ports
from components.tms_connection import stimulator

stim = stimulator()

def get_ports():
    return list_ports()

async def connect(port, port_name):
    await stim.connect_port(port, port_name)

async def enable(enable):
    if stim.is_connected:
        if enable:
            print(enable)
            stim.magventure_device.arm()
        else:
            stim.magventure_device.disarm()

async def single_pulse():
    if stim.is_connected:
        stim.magventure_device.fire()