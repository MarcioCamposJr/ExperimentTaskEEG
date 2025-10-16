from models.experiment import FingerTappingConfig, FingerTappingState, FingerTappingStimulus
from experiments.fingertapping import start_exp, generate_sequence

from fastapi import APIRouter, Request, BackgroundTasks
from time import time

config_routers= APIRouter()

@config_routers.post("/set-config")
async def set_config(config: FingerTappingConfig, request: Request, background_tasks: BackgroundTasks):
    if not request.app.state.experiment['is_running']:
        request.app.state.experiment['is_running'] = True
        sequence = generate_sequence(config.movement_type, config.num_trials)
        background_tasks.add_task(start_exp, config, sequence, request.app)
        return {"message": "Experiment started in the background"}

@config_routers.get("/state-exp")
async def get_state_exp(request: Request):
    exp_state = request.app.state.experiment
    if exp_state.get('is_running'):
        now = time()

        # Calcula o tempo restante do trial
        trial_duration = exp_state.get("trial_duration", 0)
        trial_start_time = exp_state.get("trial_start_time", 0)
        trial_end_time = trial_start_time + trial_duration
        time_remaining_trial = max(0, trial_end_time - now)

        # Calcula o tempo restante total do experimento
        total_trial = exp_state.get("total_trial", 0)
        exp_start_time = exp_state.get("exp_start_time", 0)
        total_duration = total_trial * trial_duration
        exp_end_time = exp_start_time + total_duration
        time_remaining = max(0, exp_end_time - now)

        return FingerTappingState(
            idx_trial=exp_state.get("current_step", 0),
            total_trial=total_trial,
            time_remaining=time_remaining,
            time_remaining_trial=time_remaining_trial,
            is_running=True
        )
    
    return FingerTappingState(
            idx_trial=0,
            total_trial=0,
            time_remaining=0,
            time_remaining_trial=0,
            is_running=False
        )

@config_routers.get("/stimulus-exp")
async def set_stimulus(request: Request):
    exp_state = request.app.state.experiment
    return FingerTappingStimulus(is_running=exp_state.get('is_running'),
                                 color=exp_state.get('color'),
                                 instruction=exp_state.get('instruction'))