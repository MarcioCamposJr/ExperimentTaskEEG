from pydantic import BaseModel, Field
from typing import List
from enum import Enum
from datetime import time

class MovementType(str, Enum):
    unilateral = "Unilateral"
    bilateral = "Bilateral"
    bilateral_simultaneous = "Bilateral Simultâneo"

class FingerTappingConfig(BaseModel):
    num_trials: int
    task_duration_seconds: int
    rest_duration_seconds: int
    movement_type: MovementType

class FingerTappingState(BaseModel):
    is_running: bool
    total_trial: int
    idx_trial: int
    time_remaining: time
    time_remaining_trial: time

class FingerTappingStimulus(BaseModel):
    is_running: bool
    color: str
    instruction: str