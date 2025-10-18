export function updateStatusIndicator(indicatorElement, textElement, isConnected, connectedText, disconnectedText, errorText = 'Erro') {
    if (isConnected === true) {
        indicatorElement.classList.add('connected');
        indicatorElement.classList.remove('error');
        textElement.textContent = connectedText;
    } else if (isConnected === false) {
        indicatorElement.classList.remove('connected');
        indicatorElement.classList.remove('error');
        textElement.textContent = disconnectedText;
    } else { // Error state or unknown
        indicatorElement.classList.add('error');
        indicatorElement.classList.remove('connected');
        textElement.textContent = errorText;
    }
}

export async function fetchAndPopulateDropdown(url, selectElement, valueKey, textKey) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        selectElement.innerHTML = ''; // Clear existing options
        data.forEach(item => {
            const option = document.createElement('option');
            option.value = valueKey ? item[valueKey] : item;
            option.textContent = textKey ? item[textKey] : item;
            selectElement.appendChild(option);
        });
    } catch (error) {
        console.error(`Erro ao buscar portas de ${url}:`, error);
    }
}

export async function handleDeviceConnection(url, config, indicatorElement, textElement, connectedText, disconnectedText) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(config)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        const isConnected = result.is_connected !== undefined ? result.is_connected : result; // Handle both boolean and object with is_connected

        updateStatusIndicator(indicatorElement, textElement, isConnected, connectedText, disconnectedText, 'Falha na conexão');
        return isConnected;

    } catch (error) {
        console.error(`Erro ao conectar: ${url}`, error);
        updateStatusIndicator(indicatorElement, textElement, null, connectedText, disconnectedText, 'Erro');
        return false;
    }
}

export async function checkDeviceStatus(url, indicatorElement, textElement, connectedText, disconnectedText, formElementsToUpdate = {}) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const connectionStatus = await response.json();

        updateStatusIndicator(indicatorElement, textElement, connectionStatus.is_connected, connectedText, disconnectedText);

        if (connectionStatus.is_connected) {
            for (const [id, value] of Object.entries(formElementsToUpdate)) {
                const element = document.getElementById(id);
                if (element) {
                    if (typeof value === 'function') {
                        element.value = value(connectionStatus); // Call the function with connectionStatus
                    } else {
                        element.value = connectionStatus[value];
                    }
                }
            }
        }
        return connectionStatus;
    } catch (error) {
        console.error(`Erro ao verificar conexão: ${url}`, error);
        updateStatusIndicator(indicatorElement, textElement, null, connectedText, disconnectedText, 'Erro');
        return { is_connected: false };
    }
}
