const int LED_BUILTIN_PIN = 2; 
const int TRIGGER_TTL_PIN = 23; 
const int DURATION_MS = 100;

String incomingString = "";

void setup() {
  Serial.begin(115200); 

  pinMode(LED_BUILTIN_PIN, OUTPUT);
  pinMode(TRIGGER_TTL_PIN, OUTPUT);
  
  digitalWrite(TRIGGER_TTL_PIN, LOW); 
  
  Serial.println("ESP32 pronto. Envie 'SINGLE' via Serial para ativar.");
}

void loop() {
  while (Serial.available()) {
    char incomingChar = Serial.read(); 
    
    if (incomingChar == '\n') {
      incomingString.trim(); 
      incomingString.toUpperCase();

      Serial.print("Comando Recebido: ");
      Serial.println(incomingString);

      if (incomingString.equals("SINGLE")) {
        activate_trigger_and_blink();
      } else {
        Serial.println("Comando inválido. Use 'SINGLE'.");
      }
      
      incomingString = ""; 
    } else {
      incomingString += incomingChar;
    }
  }
}

void activate_trigger_and_blink() {
  digitalWrite(TRIGGER_TTL_PIN, HIGH); 
  
  digitalWrite(LED_BUILTIN_PIN, HIGH);
  
  delay(DURATION_MS); 

  digitalWrite(TRIGGER_TTL_PIN, LOW); 

  digitalWrite(LED_BUILTIN_PIN, LOW);

  Serial.println("Ação concluída: LED piscou e Trigger TTL foi disparado.");
}