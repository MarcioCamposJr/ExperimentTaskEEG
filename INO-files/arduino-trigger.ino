// Pino do LED integrado (geralmente azul)
const int LED_BUILTIN_PIN = 2; 

// Pino para o Trigger TTL (escolhemos o GPIO 23, mas pode ser outro)
const int TRIGGER_TTL_PIN = 23; 

// Define a duração da piscada e do pulso TTL em milissegundos
const int DURATION_MS = 100;

// Variável para armazenar a mensagem lida da serial
String incomingString = "";

void setup() {
  // Inicializa a comunicação serial na mesma taxa do Python
  Serial.begin(115200); 

  // Configura os pinos como saída
  pinMode(LED_BUILTIN_PIN, OUTPUT);
  pinMode(TRIGGER_TTL_PIN, OUTPUT);
  
  // Garante que o trigger TTL esteja em LOW (nível zero) no início
  digitalWrite(TRIGGER_TTL_PIN, LOW); 
  
  // MENSAGEM ATUALIZADA
  Serial.println("ESP32 pronto. Envie 'SINGLE' via Serial para ativar.");
}

void loop() {
  // Verifica se há dados disponíveis para leitura na serial
  while (Serial.available()) {
    // Lê o próximo byte
    char incomingChar = Serial.read(); 
    
    // Constrói a string até receber a nova linha ('\n')
    if (incomingChar == '\n') {
      // Remove espaços em branco antes e depois e converte para maiúsculas
      incomingString.trim(); 
      incomingString.toUpperCase();

      Serial.print("Comando Recebido: ");
      Serial.println(incomingString);
      
      // VERIFICAÇÃO ATUALIZADA DO COMANDO
      if (incomingString.equals("SINGLE")) {
        activate_trigger_and_blink();
      } else {
        Serial.println("Comando inválido. Use 'SINGLE'.");
      }
      
      // Limpa a string para a próxima leitura
      incomingString = ""; 
    } else {
      incomingString += incomingChar;
    }
  }
}

// Função que executa a piscada e o pulso TTL (não muda)
void activate_trigger_and_blink() {
  // 1. Pulso TTL (HIGH)
  digitalWrite(TRIGGER_TTL_PIN, HIGH); 
  
  // 2. Pisca o LED
  digitalWrite(LED_BUILTIN_PIN, HIGH); // Liga o LED
  
  // Aguarda um breve momento
  delay(DURATION_MS); 
  
  // 3. Pulso TTL (LOW)
  digitalWrite(TRIGGER_TTL_PIN, LOW); 
  
  // 4. Desliga o LED
  digitalWrite(LED_BUILTIN_PIN, LOW); // Desliga o LED

  Serial.println("Ação concluída: LED piscou e Trigger TTL foi disparado.");
}