# Experiment Task EEG System

This repository hosts a comprehensive system designed for conducting EEG (Electroencephalography) experiments. It provides real-time visual feedback to participants regarding their movements and is built with integration capabilities for Transcranial Magnetic Stimulation (TMS) and neuronavigation software, specifically Invesalius.

The system leverages a web-based interface for experiment configuration, monitoring, and participant interaction, with a FastAPI backend handling experiment logic, hardware communication, and state management.

## Features

*   **EEG Task Feedback:** Provides real-time visual feedback (color changes, instructions) to volunteers on required movements during EEG tasks via a dedicated web interface.
*   **TMS Integration:** Seamlessly integrates with MagVenture stimulators for combined experimental protocols, allowing for precise TMS pulse triggering (arm, disarm, fire) during trials.
*   **Neuronavigation Compatibility:** Designed for initial compatibility with Invesalius software, facilitating neuronavigation alongside experimental procedures.
*   **Arduino-based Stimulus Triggering:** Utilizes an Arduino (e.g., ESP32) for precise and synchronized triggering of task stimuli. The Arduino receives a "SINGLE" command via serial to generate a 100ms TTL pulse on GPIO 23 and blink an LED on GPIO 2.
*   **Web-based User Interfaces:**
    *   **Configuration Panel (`/config`):** A comprehensive interface for setting up experiment parameters (e.g., number of trials, task duration, movement type), connecting to Arduino and TMS devices, and enabling/disabling TMS.
    *   **Experiment Monitor (`/monitor`):** Displays real-time experiment progress, including current trial, trial timer, and total time remaining, along with hardware connection statuses.
    *   **Volunteer Display (`/experiment`):** The participant-facing screen that shows dynamic visual cues (e.g., colored circles, instructions) based on the experiment's state.
*   **Experiment Management:** Currently supports the Finger Tapping experiment with various types (Unilateral, Bilateral, Bilateral Simultâneo), and includes capabilities to pause, resume, and cancel experiments. The system is designed to be extensible for future experiment protocols.


## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/ExperimentTaskEEG.git
    cd ExperimentTaskEEG
    ```
2.  **Create and activate a Python virtual environment:**
    ```bash
    python -m venv .venv
    # On Windows
    .venv\Scripts\activate
    # On macOS/Linux
    source .venv/bin/activate
    ```
3.  **Install Python dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

5.  **Arduino Setup:**
    *   Upload the `arduino-trigger.ino` sketch to your Arduino board (e.g., ESP32).
6.  **MagVenture Stimulator:**
    *   Ensure your MagVenture stimulator is properly connected and configured according to its documentation.
    *   The system expects to communicate with it via a serial port, which will be selectable in the configuration panel.
7.  **Invesalius Software:**
    *   Install Invesalius and ensure it's configured for neuronavigation as required by your experimental setup. (Note: Direct integration details with Invesalius are not fully implemented in the provided code, but the system is designed to be compatible).

## Usage

1.  **Start the application:**
    ```bash
    python app.py
    ```
2.  **Access the web interfaces:**
    *   **Configuration Panel:** Open your web browser and navigate to `http://localhost:8000/config` (or the port specified in your `.env`). Here you can set up experiments and connect hardware.
    *   **Experiment Monitor:** After starting an experiment from the configuration panel, you will be redirected to `http://localhost:8000/monitor` to observe its progress.
    *   **Volunteer Display:** The participant's screen should be opened at `http://localhost:8000/experiment`. This page will dynamically update with visual stimuli during the experiment.
3.  **Configure and run experiments:** Use the Configuration Panel to define experiment parameters, connect your Arduino and TMS devices, and initiate the experiment. Monitor its progress and control its state (pause/cancel) from the Experiment Monitor.

## Contributing

Contributions are welcome! Please feel free to fork the repository, make your changes, and submit a pull request. For major changes, please open an issue first to discuss what you would like to change.