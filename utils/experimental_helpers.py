from time import time
import asyncio

async def elepesed_time(sleep_check_interval, remaining_duration, total_duration):
    current_time = time()
    await asyncio.sleep(sleep_check_interval)
    elapsed = time() - current_time
    remaining_duration -= elapsed
    total_duration -= elapsed

    return remaining_duration, total_duration