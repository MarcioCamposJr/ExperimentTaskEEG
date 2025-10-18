import asyncio
from components.navigation_messaging import NavigationMessaging

navigation = NavigationMessaging()

def process_status():
    is_connected = False
    is_on_target = False
    address = None
    port = None

    if navigation.is_connected():
        is_connected = True
        is_on_target = navigation.get_coil_at_target()
        # Extract address and port from remote_host

        host_parts = navigation.get_host().replace("http://", "").split(":")
        if len(host_parts) == 2:
            address = host_parts[0]
            port = int(host_parts[1])

    return is_connected, is_on_target, address, port

async def process_connect(config):
    remote_host = f"http://{config.address}:{config.port}"
    if navigation.get_host() != remote_host:
        if navigation.is_connected():
            navigation.disconnect()
        await navigation.try_connect(remote_host)
    return navigation.is_connected()

def disconnect():
    navigation.disconnect()

def on_taget():
    return navigation.get_coil_at_target()