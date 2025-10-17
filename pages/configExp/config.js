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

    const startButton = document.querySelector('.start-button'); 

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
            // Verifica se a resposta foi bem-sucedida antes de tentar ler o JSON
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

        }catch{
            console.error("Erro ao buscar status:", error);
        }

    }

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

    await getTriggerPorts();
    await checkTriggerConnection();
    initializeTaskButtons();

    if(TASK_CONFIG.length > 0){
        updateUIForTask(TASK_CONFIG[0].id);
    }

    startButton.addEventListener('click', async () => {

        const config = {
        num_trials: parseInt(document.getElementById('num-trials').value || 10),
        task_duration_seconds: parseInt(document.getElementById('trial-duration').value || 5),
        rest_duration_seconds: parseInt(document.getElementById('trial-duration').value || 5),
        movement_type: trialTypeSelect.value.replace('_', ' ') // pega o valor selecionado
        };

        try{
            const response = await fetch('http://127.0.0.1:8000/set-config', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // muito importante
            },
            body: JSON.stringify(config) // converte objeto JS para JSON
            });
            console.log('post', config);
            const data = await response.json();
            console.log('Resposta do servidor:', data);
            window.location.href ='/monitor';
        }catch (error) {
            console.error('Erro ao enviar configuração:', error);
        }
    });
});