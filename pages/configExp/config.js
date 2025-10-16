const TASK_CONFIG = [
    {
        id: 'finger_tapping',
        name: 'Finger Tapping',
        trialTypes: ['Unilateral', 'Bilateral', 'Bilateral Simultâneo']
    },
]

document.addEventListener('DOMContentLoaded', () => {
    const taskListContainer = document.querySelector('.task-list');
    const trialTypeGroup = document.getElementById('trial-type-gruop');
    const trialTypeSelect = document.getElementById('trial-type');
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
            console.log('post', config)
            const data = await response.json();
            console.log('Resposta do servidor:', data);
            window.location.href ='/monitor';
        }catch (error) {
            console.error('Erro ao enviar configuração:', error);
        }
    });
});