const TASK_CONFIG = [
    {
        id: 'finger_tapping',
        name: 'Finger Tapping',
        trialTypes: ['Unilateral', 'Bilateral', 'Bilateral Simultâneo']
    },
]

document.addEventListener('DOMContentLoaded', async () => {
    const taskListContainer = document.querySelector('.task-list');
    const trialTypeGroup = document.getElementById('trial-type-gruop');
    const trialTypeSelect = document.getElementById('trial-type');

    const arduinoPort= document.getElementById('arduino-port');
    const triggerConnectButtom = document.querySelector('.arduino-settings .connect-button');
    const triggerStatusIndicator = document.querySelector('.arduino-settings .status-indicator');
    const triggerStatusText = document.querySelector('.arduino-settings .status-text');

    const tmsPort = document.getElementById('tms-port');
    const tmsConnectButtom = document.getElementById('connect-buttom-tms');
    const tmsStatusIndicator = document.querySelector('.tms-settings .status-indicator');
    const tmsStatusText = document.querySelector('.tms-settings .status-text');

    const tmsStartButton = document.querySelector('.tms-toggle-button');

    const startButton = document.querySelector('.start-button'); 

    let isTmsActive = false;

    function updateTmsButtonState() {
        if (isTmsActive) {
            tmsStartButton.classList.add('active');
            tmsStartButton.textContent = 'Desativar TMS';
        } else {
            tmsStartButton.classList.remove('active');
            tmsStartButton.textContent = 'Ativar TMS';
        }
    }

    function updateUIForTask(taskId){
        const selectedTask = TASK_CONFIG.find(task => task.id === taskId);

        if(!selectedTask){
            console.error('Configuração de tarefa não encontrada');
            return
        }
        if(selectedTask.trialTypes.length > 0){
            trialTypeGroup.style.display = 'block';
            trialTypeSelect.innerHTML = '';
            selectedTask.trialTypes.forEach(type => {
                const option = document.createElement('option');
                option.value = type.replace(' ', '_');
                option.textContent = type;
                trialTypeSelect.appendChild(option);
            });
        }else {
            trialTypeGruop.style.display = 'none'
        }
    }

    function initializeTaskButtons(){
        taskListContainer.innerHTML = '';

        TASK_CONFIG.forEach((task, index) => {
            const button = document.createElement('button');
            button.className = 'task-button';
            button.textContent = task.name;
            button.dataset.taskId = task.id;
            
            if (index === 0){
                button.classList.add('selected');
            }
            
            button.addEventListener('click', () => {
                document.querySelectorAll('.task-button').forEach(btn => btn.classList.remove('selected'));
                button.classList.add('selected');
                updateUIForTask(task.id);
            });
            taskListContainer.appendChild(button);
        });
    }

    const getTriggerPorts = async () =>{

        try{
            const response = await fetch('/ports-trigger');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            data.forEach((port, index) => {
                const option = document.createElement('option');
                option.value = port;
                option.textContent = port;
                arduinoPort.appendChild(option);
            });

        }catch(error){
            console.error("Erro ao buscar status:", error);
        }

    }
    const getTMSPorts = async () =>{

        try{
            const response = await fetch('/ports-tms');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            data.forEach((port, index) => {
                const option = document.createElement('option');
                option.value = port.name;
                option.textContent = port.description;
                tmsPort.appendChild(option);
            });

        }catch(error){
            console.error("Erro ao buscar status:", error);
        }

    }
    const checkTmsConnection = async () => {
        try {
            const response = await fetch('/get-connection-tms');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const connectionStatus = await response.json();

            if (connectionStatus.is_connected) {
                tmsStatusIndicator.classList.add('connected');
                tmsStatusIndicator.classList.remove('error');
                tmsStatusText.textContent = 'Conectado';
                document.getElementById('tms-port').value = connectionStatus.port;
            } else {
                tmsStatusIndicator.classList.remove('connected');
                tmsStatusIndicator.classList.remove('error');
                tmsStatusText.textContent = 'Desconectado';
            }
        } catch (error) {
            console.error('Erro ao verificar conexão do tms:', error);
            tmsStatusIndicator.classList.add('error');
            tmsStatusIndicator.classList.remove('connected');
            tmsStatusText.textContent = 'Erro';
        }
    };

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
                triggerStatusText.textContent = 'Conectado';
                document.getElementById('arduino-port').value = connectionStatus.port_name;
                document.getElementById('arduino-baudrate').value = connectionStatus.boudrate;
            } else {
                triggerStatusIndicator.classList.remove('connected');
                triggerStatusIndicator.classList.remove('error');
                triggerStatusText.textContent = 'Desconectado';
            }
        } catch (error) {
            console.error('Erro ao verificar conexão do trigger:', error);
            triggerStatusIndicator.classList.add('error');
            triggerStatusIndicator.classList.remove('connected');
            triggerStatusText.textContent = 'Erro';
        }
    };

    const checkTmsStatus = async () => {
        try {
            const response = await fetch('/get-tms-status');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const status = await response.json();
            isTmsActive = status.is_active;
            updateTmsButtonState();
        } catch (error) {
            console.error('Erro ao verificar status do TMS:', error);
        }
    };

    triggerConnectButtom.addEventListener('click', async () => {
        const config = {
            port: arduinoPort.value,
            boudrate: parseInt(document.getElementById('arduino-baudrate').value || 9600)
        };

        try {
            const response = await fetch('/connect-trigger', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(config)
            });

            const is_connected_trigger = await response.json();

            if (is_connected_trigger) {
                triggerStatusIndicator.classList.add('connected');
                triggerStatusIndicator.classList.remove('error');
                triggerStatusText.textContent = 'Conectado';
            } else {
                triggerStatusIndicator.classList.add('error');
                triggerStatusIndicator.classList.remove('connected');
                triggerStatusText.textContent = 'Falha na conexão';
            }

        } catch (error) {
            console.error('Erro ao enviar configuração:', error);
            triggerStatusIndicator.classList.add('error');
            triggerStatusIndicator.classList.remove('connected');
            triggerStatusText.textContent = 'Erro';
        }
    });

    tmsConnectButtom.addEventListener('click', async () => {
        const config = {
            port: tmsPort.value,
            port_name: tmsPort.options[tmsPort.selectedIndex].textContent
        };

        try {
            const response = await fetch('/connect-tms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(config)
            });

            const is_connected_tms = await response.json();

            if (is_connected_tms) {
                tmsStatusIndicator.classList.add('connected');
                tmsStatusIndicator.classList.remove('error');
                tmsStatusText.textContent = 'Conectado';
            } else {
                tmsStatusIndicator.classList.add('error');
                tmsStatusIndicator.classList.remove('connected');
                tmsStatusText.textContent = 'Falha na conexão';
            }

        } catch (error) {
            console.error('Erro ao enviar configuração:', error);
            tmsStatusIndicator.classList.add('error');
            tmsStatusIndicator.classList.remove('connected');
            tmsStatusText.textContent = 'Erro';
        }
    });

    
    startButton.addEventListener('click', async () => {
        
        const config = {
            num_trials: parseInt(document.getElementById('num-trials').value || 10),
            task_duration_seconds: parseInt(document.getElementById('trial-duration').value || 5),
            rest_duration_seconds: parseInt(document.getElementById('trial-duration').value || 5),
            movement_type: trialTypeSelect.value.replace('_', ' '),
            tms_time: parseInt(document.getElementById('tms-stim-time').value || 0)
        };
        
        try{
            const response = await fetch('/set-config', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify(config) 
            });
            const data = await response.json();
            console.log('Resposta do servidor:', data);
            window.location.href ='/monitor';
        }catch (error) {
            console.error('Erro ao enviar configuração:', error);
        }
    });

    tmsStartButton.addEventListener('click', async () => {
        isTmsActive = !isTmsActive;
        const config = {'enable': isTmsActive};
        try {
            const response = await fetch('/enable-tms',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify(config) 
            });
            if (!response.ok) {
                isTmsActive = !isTmsActive;
                throw new Error(`Erro ao buscar dados: ${response.status} ${response.statusText}`);
            }
            updateTmsButtonState();
        }catch (error) {
            console.error('Erro ao enviar configuração:', error);
        }
    });

    await getTMSPorts();
    await checkTmsConnection();
    await getTriggerPorts();
    await checkTriggerConnection();
    await checkTmsStatus();
    initializeTaskButtons();
    
    if(TASK_CONFIG.length > 0){
        updateUIForTask(TASK_CONFIG[0].id);
    }
});
