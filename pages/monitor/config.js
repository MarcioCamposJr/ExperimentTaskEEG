import { updateStatusIndicator, checkDeviceStatus } from '/utils/updateStates.js';

document.addEventListener('DOMContentLoaded', () => {

    const trialCounterElement = document.getElementById('trial-counter');
    const trialTimerElement = document.getElementById('trial-timer');
    const totalTimeElement = document.getElementById('total-time');
    const pauseButtom = document.getElementById("pause-button");
    const cancelButtom = document.getElementById("cancel-button");

    const triggerStatusIndicator = document.getElementById('trigger-status-indicator');
    const triggerStatusText = document.getElementById('trigger-status-text');
    const tmsStatusIndicator = document.getElementById('tms-status-indicator');
    const tmsStatusText = document.getElementById('tms-status-text');
    const navigationStatusIndicator = document.getElementById('navigation-status-indicator');
    const navigationStatusText = document.getElementById('navigation-status-text');
    const targetStatusIndicator = document.getElementById('on-target-status-indicator');
    const targetStatusText = document.getElementById('on-target-status-text');

    let pollingInterval;
    let wasRunning = false;

    const checkNavigationAndTargetStatus = async () => {
        const connectionStatus = await checkDeviceStatus(
            '/get-navigation-status',
            navigationStatusIndicator,
            navigationStatusText,
            'Navegação Conectada',
            'Navegação Desconectada'
        );

        if (connectionStatus.is_connected) {
            // Navigation is connected, now check target status
            updateStatusIndicator(
                targetStatusIndicator,
                targetStatusText,
                connectionStatus.is_on_target, // Assuming this field exists in the response
                'No Alvo',
                'Fora do Alvo',
                'Erro no Alvo'
            );
        } else {
            // Navigation is disconnected, so target status is also disconnected/unknown
            updateStatusIndicator(
                targetStatusIndicator,
                targetStatusText,
                false, // Explicitly set to false if navigation is down
                'No Alvo',
                'Sem Alvo',
                'Erro de Conexão'
            );
        }
    };

    const formatDuration = (seconds) => {
        if (typeof seconds !== 'number' || isNaN(seconds) || seconds < 0) {
            return "00:00";
        }
        
        const totalSeconds = Math.floor(seconds); 
        const minutes = Math.floor(totalSeconds / 60);
        const remainingSeconds = totalSeconds % 60;
        
        const pad = (num) => String(num).padStart(2, '0');

        return `${pad(minutes)}:${pad(remainingSeconds)}`;
    };

    const postStatus = async (status) => {
        console.log('postStatus called with:', status);
        try{
            const response = await fetch('/status-exp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(status)
            });
            console.log('post', status);
        }catch (error) {
            console.error('Erro ao enviar status:', error);
        }

    };

    const updateStatus = async () => {
        try {
            const response = await fetch('/state-exp');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.is_running) {
                wasRunning = true;
                trialCounterElement.innerHTML = data.idx_trial;
                trialTimerElement.textContent = formatDuration(data.time_remaining_trial);
                totalTimeElement.textContent = formatDuration(data.time_remaining);

            } else {
                if (wasRunning) { 
                    trialCounterElement.innerHTML = 'Finalizado';
                    trialTimerElement.textContent = "00:00";
                    totalTimeElement.textContent = "00:00";
                    if (pollingInterval) {
                        clearInterval(pollingInterval);
                        console.log("Polling finalizado.");
                    }
                }
            }

        } catch (error) {
            console.error("Erro ao buscar status:", error);
            if (pollingInterval) {
                clearInterval(pollingInterval);
            }
        }
    };

    // --- Listeners de Botão ---
    pauseButtom.addEventListener('click', async () =>{
        const status = { status: 'paused'};
        await postStatus(status);
    });

    cancelButtom.addEventListener('click', async () =>{
        const status = { status: 'canceled'};
        await postStatus(status);
        window.location.href ='/config';
    });
    // --- Fim Listeners de Botão ---

    // Inicia o polling.
    updateStatus();
    pollingInterval = setInterval(updateStatus, 500); 

    // Initial checks for device connections
    checkDeviceStatus(
        '/get-connection-trigger',
        triggerStatusIndicator,
        triggerStatusText,
        'Trigger Conectado',
        'Trigger Desconectado'
    );
    checkDeviceStatus(
        '/get-connection-tms',
        tmsStatusIndicator,
        tmsStatusText,
        'TMS Conectado',
        'TMS Desconectado'
    );
    checkNavigationAndTargetStatus();

    // Set intervals for periodic checks
    setInterval(() => checkDeviceStatus(
        '/get-connection-trigger',
        triggerStatusIndicator,
        triggerStatusText,
        'Trigger Conectado',
        'Trigger Desconectado'
    ), 500);
    setInterval(() => checkDeviceStatus(
        '/get-connection-tms',
        tmsStatusIndicator,
        tmsStatusText,
        'TMS Conectado',
        'TMS Desconectado'
    ), 500);
    setInterval(checkNavigationAndTargetStatus, 500); 
});