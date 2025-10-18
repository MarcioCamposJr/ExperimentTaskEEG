from components.navigation_messaging import NavigationMessaging

navigation = NavigationMessaging()

def process_status(nav_msg):
    is_connected = False
    is_on_target = False
    address = None
    port = None

    if nav_msg and nav_msg.is_connected():
        is_connected = True
        is_on_target = nav_msg.get_coil_at_target()
        # Extract address and port from remote_host
        if nav_msg._NavigationMessaging__remote_host:
            # Assuming remote_host is in format http://address:port
            host_parts = nav_msg._NavigationMessaging__remote_host.replace("http://", "").split(":")
            if len(host_parts) == 2:
                address = host_parts[0]
                port = int(host_parts[1])
    
    return is_connected, is_on_target, address, port

def on_taget():
    return navigation.get_coil_at_target()