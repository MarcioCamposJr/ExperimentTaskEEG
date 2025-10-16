document.addEventListener('DOMContentLoaded', ()=>{
    const circleElement = document.getElementById('stimulus-circle');
    const instructionElement = document.getElementById('instruction-text');

    const updateStimulus = async() => {
        try{

            const reponse = await fetch('/stimulus-exp');
            const data = await reponse.json();
            
            if (data.is_running) {
                circleElement.style.backgroundColor = data.color;
                instructionElement.textContent = data.instruction;
            } else{
                circleElement.style.backgroundColor = 'gray';
                instructionElement.textContent = 'Aguarde';
            }
        } catch {
            console.error("Erro ao buscar estímulo:", error);
        }
    }
    setInterval(updateStimulus, 50);
});