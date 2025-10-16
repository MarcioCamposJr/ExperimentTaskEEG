from models.experiment import FingerTappingConfig
from utils import trigger

import asyncio
from fastapi import FastAPI
from time import time
from random import choice

dict_stimulus = {
    0: {
        "instruction": "Descanse",
        "color": "gray"
    },
    1: {
        "instruction": "Mão Direita",
        "color": "green"
    },
    2: {
        "instruction": "Mão Esquerda",
        "color": "blue"
    },
    3: {
        "instruction": "Mexa a Mão",
        "color": "green"
    }
}

async def start_exp(config: FingerTappingConfig, sequence, app: FastAPI):
    app.state.experiment['total_trial'] = config.num_trials
    app.state.experiment['trial_duration'] = config.task_duration_seconds

    exp_start_time = time()
    app.state.experiment['exp_start_time'] = exp_start_time
    for idx_trial, stimulus in enumerate(sequence):
        trigger.pulse_default_trigger()

        app.state.experiment['color'] = dict_stimulus[stimulus]['color']
        app.state.experiment['instruction'] = dict_stimulus[stimulus]['instruction']

        trial_start_time = time()
        app.state.experiment['trial_start_time'] = trial_start_time
        app.state.experiment['current_step'] = idx_trial
        await asyncio.sleep(config.task_duration_seconds)
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