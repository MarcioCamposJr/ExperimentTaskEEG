from models.experiment import FingerTappingConfig, FingerTappingStatus
from utils import trigger, tms

import asyncio
from fastapi import FastAPI
from time import time

dict_stimulus = {
    0: {"instruction": "Descanse", "color": "gray"},
    1: {"instruction": "Mão Direita", "color": "green"},
    2: {"instruction": "Mão Esquerda", "color": "blue"},
    3: {"instruction": "Mexa a Mão", "color": "green"}
}

sleep_check_interval = 0.001 

async def start_exp(config: FingerTappingConfig, sequence = [], app: FastAPI = None):
    app.state.experiment['total_trial'] = config.num_trials
    app.state.experiment['trial_duration'] = config.task_duration_seconds
    app.state.experiment['status'] = FingerTappingStatus.running  #'running', 'paused', 'canceled', 'finished'

    exp_start_time = time()
    app.state.experiment['exp_start_time'] = exp_start_time
    total_duration = config.task_duration_seconds * config.num_trials

    for idx_trial, stimulus in enumerate(sequence):
        pulsed = False
        app.state.experiment['color'] = dict_stimulus[stimulus]['color']
        app.state.experiment['instruction'] = dict_stimulus[stimulus]['instruction']
        app.state.experiment['current_step'] = idx_trial
        app.state.experiment['trial_start_time'] = time()
        remaining_duration = config.task_duration_seconds

        await trigger.pulse_default_trigger()
        while remaining_duration > 0 and app.state.experiment['status'] != 'canceled':
            while app.state.experiment['status'] == FingerTappingStatus.paused:
                await asyncio.sleep(sleep_check_interval)
                if app.state.experiment['status'] == FingerTappingStatus.canceled:
                    break 
            if app.state.experiment['status'] == FingerTappingStatus.canceled:
                break

            current_time = time()
            await asyncio.sleep(sleep_check_interval)
            elapsed = time() - current_time
            remaining_duration -= elapsed
            total_duration -= elapsed

            app.state.experiment['remaining_duration'] = max(0, remaining_duration)
            app.state.experiment['time_remaining'] = max(0, total_duration)
            if app.state.experiment['tms'] and remaining_duration - config.task_duration_seconds < -(config.tms_time/ 1000) and not pulsed:
                pulsed = True
                await tms.single_pulse()

    app.state.experiment['is_running'] = False

def generate_sequence(taskType, num_trials):

    if taskType == "Unilateral":
        padrao = [0 , 1]
    elif taskType == "Bilateral":
        padrao = [0, 1, 0, 2]
    elif taskType == "Bilateral Simultâneo":
        padrao = [0, 3]
    else:
        padrao [0]

    reps = (num_trials // len(padrao)) + 1
    sequencia = padrao*reps
    return sequencia[:num_trials]