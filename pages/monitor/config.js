document.addEventListener('DOMContentLoaded', () => {

    const trialCounterElement = document.getElementById('trial-counter');
    const trialTimerElement = document.getElementById('trial-timer');
    const totalTimeElement = document.getElementById('total-time');

    let pollingInterval;
    let wasRunning = false;

    const updateStatus = async () => {
        try {
            const response = await fetch('/state-exp');
            const data = await response.json();

            if (data.is_running) {
                wasRunning = true;

                // 1. Usa a chave `idx_trial` e exibe apenas o número do trial atual.
                trialCounterElement.innerHTML = data.idx_trial;

                // 2. Pega as strings de tempo e as formata para exibição.
                trialTimerElement.textContent = cleanTimeString(data.time_remaining_trial);
                totalTimeElement.textContent = cleanTimeString(data.time_remaining);

            } else {
                if (wasRunning) {
                    trialCounterElement.innerHTML = 'Finalizado';
                    trialTimerElement.textContent = "00:00";
                    totalTimeElement.textContent = "00:00";
                    if (pollingInterval) {
                        clearInterval(pollingInterval);
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

    // 3. Nova função para limpar a string de tempo (ex: "00:00:04.945...Z" -> "00:04")
    const cleanTimeString = (timeString) => {
        if (!timeString || typeof timeString !== 'string') {
            return "00:00";
        }
        // Pega a parte antes do ponto decimal
        const parts = timeString.split('.')[0]; // ex: "00:00:04"
        // Retorna apenas a parte de minutos e segundos
        return parts.substring(3);
    };

    // Inicia o polling.
    updateStatus();
    pollingInterval = setInterval(updateStatus, 50);
});
