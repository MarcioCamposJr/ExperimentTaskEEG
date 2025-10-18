document.addEventListener('DOMContentLoaded', () => {

    const trialCounterElement = document.getElementById('trial-counter');
    const trialTimerElement = document.getElementById('trial-timer');
    const totalTimeElement = document.getElementById('total-time');
    const pauseButtom = document.getElementById("pause-button");
    const cancelButtom = document.getElementById("cancel-button");
    const triggerStatusIndicator = document.getElementById('trigger-status-indicator');
    const triggerStatusText = document.getElementById('trigger-status-text');
    const navigationStatusIndicator = document.getElementById('navigation-status-indicator');
    const navigationStatusText = document.getElementById('navigation-status-text');
    const tmsStatusIndicator = document.getElementById('tms-status-indicator');
    const tmsStatusText = document.getElementById('tms-status-text');
    const targetStatusIndicator = document.getElementById('on-target-status-indicator');
    const targetStatusText = document.getElementById('on-target-status-text');

    let pollingInterval;
    let wasRunning = false;

    const checkTriggerConnection = async () => {
        try {
            const response = await fetch('/get-connection-trigger');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const connectionStatus = await response.json();

            if (connectionStatus.is_connected) {
                triggerStatusIndicator.classList.add('connected');
                triggerStatusIndicator.classList.remove('error');
                triggerStatusText.textContent = 'Trigger Conectado';
            } else {
                triggerStatusIndicator.classList.remove('connected');
                triggerStatusIndicator.classList.add('error');
                triggerStatusText.textContent = 'Trigger Desconectado';
            }
        } catch (error) {
            console.error('Erro ao verificar conexão do trigger:', error);
            triggerStatusIndicator.classList.add('error');
            triggerStatusIndicator.classList.remove('connected');
            triggerStatusText.textContent = 'Erro de Conexão';
        }
    };
    const checkTMSConnection = async () => {
        try {
            const response = await fetch('/get-connection-tms');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const connectionStatus = await response.json();

            if (connectionStatus.is_connected) {
                tmsStatusIndicator.classList.add('connected');
                tmsStatusIndicator.classList.remove('error');
                tmsStatusText.textContent = 'TMS Conectado';
            } else {
                tmsStatusIndicator.classList.remove('connected');
                tmsStatusIndicator.classList.add('error');
                tmsStatusText.textContent = 'TMS Desconectado';
            }
        } catch (error) {
            tmsStatusIndicator.classList.add('error');
            tmsStatusIndicator.classList.remove('connected');
            tmsStatusText.textContent = 'Erro de Conexão';
        }
    };

const checkNavigationConnection = async () => {
        try {
            const response = await fetch('/status-navigation');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const connectionStatus = await response.json();

            if (connectionStatus.is_connected) {
                navigationStatusIndicator.classList.add('connected');
                navigationStatusIndicator.classList.remove('error');
                navigationStatusText.textContent = 'Navegação Conectada';
                if (connectionStatus.target) {
                    targetStatusIndicator.classList.add('connected');
                    targetStatusIndicator.classList.remove('error');
                    targetStatusText.textContent = 'No alvo';
                } else {
                    targetStatusIndicator.classList.remove('connected');
                    targetStatusIndicator.classList.add('error');
                    targetStatusText.textContent = 'Fora do alvo';
                }
            } else {
                navigationStatusIndicator.classList.remove('connected');
                navigationStatusIndicator.classList.add('error');
                navigationStatusText.textContent = 'Navegação Desconectada';
                targetStatusIndicator.classList.remove('connected');
                targetStatusIndicator.classList.add('error');
                targetStatusText.textContent = 'Sem alvo';
        }
        } catch (error) {
            console.error('Erro ao verificar conexão do trigger:', error);
            navigationStatusIndicator.classList.add('error');
            navigationStatusIndicator.classList.remove('connected');
            navigationStatusText.textContent = 'Erro de Conexão';
            targetStatusIndicator.classList.remove('connected');
            targetStatusIndicator.classList.add('error');
            targetStatusText.textContent = 'Erro de Conexão';
        }
    };

    const formatDuration = (seconds) => {
        if (typeof seconds !== 'number' || isNaN(seconds) || seconds < 0) {
            return "00:00";
        }
        
        // Arredonda para o segundo inteiro mais próximo
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
            // Verifica a resposta do post, mas não é estritamente necessário processar o JSON aqui.
        }catch (error) {
            console.error('Erro ao enviar status:', error);
        }

    };

    const updateStatus = async () => {
        try {
            const response = await fetch('/state-exp');
            // Verifica se a resposta foi bem-sucedida antes de tentar ler o JSON
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.is_running) {
                wasRunning = true;

                // 1. Exibe o índice do trial
                trialCounterElement.innerHTML = data.idx_trial;

                // 2. Formata e exibe o tempo restante
                // Esperamos que data.time_remaining_trial e data.time_remaining sejam agora números (segundos)
                trialTimerElement.textContent = formatDuration(data.time_remaining_trial);
                totalTimeElement.textContent = formatDuration(data.time_remaining);

            } else {
                if (wasRunning) { // A experiência acabou
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
            // Parar o polling em caso de erro persistente de rede/servidor
            if (pollingInterval) {
                clearInterval(pollingInterval);
            }
        }
    };

    // --- Listeners de Botão ---
    pauseButtom.addEventListener('click', async () =>{
        // A lógica do backend deve alternar entre 'paused' e 'running'
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
    pollingInterval = setInterval(updateStatus, 500); //
    checkTriggerConnection();
    checkTMSConnection();
    checkNavigationConnection();
    setInterval(checkTriggerConnection, 500); 
    setInterval(checkTMSConnection, 500); 
    setInterval(checkNavigationConnection, 500); 
    setInterval(checkTarget, 500); 
});