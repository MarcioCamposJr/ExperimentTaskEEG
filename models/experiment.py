from pydantic import BaseModel, Field
from typing import List
from enum import Enum

class MovementType(str, Enum):
    unilateral = "Unilateral"
    bilateral = "Bilateral"
    bilateral_simultaneous = "Bilateral Simultâneo"

class FingerTappingStatus(str, Enum):
    running = "running"
    paused = "paused"
    canceled = "canceled"
    finished = "finished"

class StatusFingerTappingPayload(BaseModel):
    status: FingerTappingStatus

class FingerTappingConfig(BaseModel):
    num_trials: int
    task_duration_seconds: int
    rest_duration_seconds: int
    movement_type: MovementType

class FingerTappingState(BaseModel):
    is_running: bool
    total_trial: int
    idx_trial: int
    time_remaining: float
    time_remaining_trial: float
    status: FingerTappingStatus

class FingerTappingStimulus(BaseModel):
    is_running: bool
    color: str
    instruction: str