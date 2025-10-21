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

    function connect() {
    const proto = location.protocol === 'https:' ? 'wss' : 'ws';
    console.log(`${proto}://${location.host}/ws/stimulus`)
    const ws = new WebSocket(`${proto}://${location.host}/ws/stimulus`);
    ws.onmessage = (ev) => {
        const { r, c, i } = JSON.parse(ev.data);
        circleElement.style.backgroundColor = r ? c : 'gray';
        instructionElement.textContent = r ? i : 'Aguarde';
        ws.send(JSON.stringify({trigger: true}));
    };
    ws.onclose = () => setTimeout(connect, 500);
    }
    connect();
    updateStimulus()
});