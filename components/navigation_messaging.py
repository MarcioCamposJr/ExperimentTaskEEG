import time
import socketio
import threading
from collections import deque

class NavigationMessaging:
    def __init__(self, history_size=10):
        self.__remote_host = ''
        self.__connected = False
        self.__sio = socketio.Client()
        self.__coil_at_target_history = deque(maxlen=history_size) # Stores last N states
        self.__lock = threading.Lock()

        self.__sio.on('connect', self.__on_connect)
        self.__sio.on('disconnect', self.__on_disconnect)
        self.__sio.on('to_robot', self.__on_message_receive)

    def __on_connect(self):
        self.__connected = True

    def __on_disconnect(self):
        print("Disconnected")
        self.__connected = False

    def __on_message_receive(self, msg):
        if msg.get('topic') == 'Coil at target':
            state = msg.get('data', {}).get('state')
            if state is not None:
                with self.__lock:
                    self.__coil_at_target_history.append(state)

    def try_connect(self, remote_host):
        self.__remote_host = remote_host
        try:
            self.__sio.connect(self.__remote_host, wait_timeout=1)
            # Wait for connection to be established
            while not self.__connected:
                print("Connecting to navigation system...")
                time.sleep(1.0)
            print("Navigation system connected.")
        except socketio.exceptions.ConnectionError as e:
            print(f"Connection to navigation system failed: {e}")
            self.__connected = False
        except Exception as e:
            print(f"An unexpected error occurred during connection: {e}")
            self.__connected = False

    def get_coil_at_target(self):
        with self.__lock:
            return all(list(self.__coil_at_target_history)) # Return a copy of the deque as a list

    def is_connected(self):
        return self.__connected

    def disconnect(self):
        if self.__connected:
            self.__sio.disconnect()
            print("Disconnected from navigation system.")
