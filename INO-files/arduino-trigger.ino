const int LED_BUILTIN_PIN = 2; 
const int TRIGGER_TTL_PIN = 15; 
const int TRIGGER_TTL_TMS_PIN = 13; 
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

      if (incomingString.equals("SINGLE")) {
        activate_trigger_and_blink(TRIGGER_TTL_PIN);
      } else if(incomingString.equals("SINGLE_TMS")){
        activate_trigger_and_blink(TRIGGER_TTL_TMS_PIN);
      }
      
      incomingString = ""; 
    } else {
      incomingString += incomingChar;
    }
  }
}

void activate_trigger_and_blink(int pin) {
  digitalWrite(pin, HIGH); 
  
  digitalWrite(LED_BUILTIN_PIN, HIGH);
  
  delay(DURATION_MS); 

  digitalWrite(pin, LOW); 

  digitalWrite(LED_BUILTIN_PIN, LOW);

  Serial.println("True");
}