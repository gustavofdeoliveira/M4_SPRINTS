#include <Keypad.h>
#include <WiFi.h>
#include <ArduinoJson.h>
#include <HTTPClient.h>
const byte ROWS = 4;
const byte COLS = 4;
char hexaKeys[ROWS][COLS] = {
  { '1', '2', '3', 'A' },
  { '4', '5', '6', 'B' },
  { '7', '8', '9', 'C' },
  { 'F', '0', 'E', 'D' }
};

byte rowPins[ROWS] = { 11, 10, 9, 8 };
byte colPins[COLS] = { 7, 6, 5, 4 };

#define led 2
const char *ssid = "SHARE-RESIDENTE";  //atribuir nome da rede WiFi
const char *password = "Share@residente";
WiFiServer server(80);
void relay_wifi();
bool start = false;
int playerOne = 0;
int playerTwo = 0;
int id = 1;
Keypad customKeypad = Keypad(makeKeymap(hexaKeys), rowPins, colPins, ROWS, COLS);  // inicializa o Keypad
void setup() {
  Serial.begin(9600);
  pinMode(led, OUTPUT);
  Serial.println();
  Serial.print("Conectando-se a ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(741);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi conectada");
  Serial.println("Endereço de IP: ");
  Serial.println(WiFi.localIP());

  server.begin();
}

void loop() {

  char leitura_teclas = customKeypad.getKey();

  if (leitura_teclas && start == false) {
    start = true;
    Serial.println(leitura_teclas);
    digitalWrite(led, HIGH);
    postStart(start);
  }
  if (leitura_teclas == 49 || leitura_teclas == 50 || leitura_teclas == 51 || leitura_teclas == 70 && start == true) {
    if (playerOne != 70) {
      postPlayerOne(leitura_teclas);
      if (leitura_teclas == 70) {
        playerOne = leitura_teclas;
        leitura_teclas = 0;
      }
    }
  }
  if (leitura_teclas == 49 || leitura_teclas == 50 || leitura_teclas == 51 || leitura_teclas == 70 && start == true) {
    if (playerOne == 70 && playerTwo != 70) {
      postPlayerTwo(leitura_teclas);
      if (leitura_teclas == 70) {
        playerTwo = leitura_teclas;
      }
    }
  }

  if (playerTwo == 70 && playerTwo == 70) {
    digitalWrite(led, LOW);
    playerOne = 0;
    playerTwo = 0;
  }
}

void postStart(bool start) {
  Serial.println("Posting JSON data to server...");
  HTTPClient http;
  http.begin("http://10.254.18.226:3000/start");
  http.addHeader("Content-Type", "application/json");
  StaticJsonDocument<200> doc;
  doc["start"] = start;
  doc["id"] = id;
  JsonArray data = doc.createNestedArray("data");
  String requestBody;
  serializeJson(doc, requestBody);
  int httpResponseCode = http.POST(requestBody);
  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.println(httpResponseCode);
    Serial.println(response);
  }
}

void postPlayerOne(int playerOne) {
  Serial.println("Posting JSON data to server...");
  HTTPClient http;
  http.begin("http://10.254.18.226:3000/playerOne");
  http.addHeader("Content-Type", "application/json");
  StaticJsonDocument<200> doc;
  doc["playerOne"] = playerOne;
  doc["start"] = true;
  doc["id"] = id;
  JsonArray data = doc.createNestedArray("data");
  String requestBody;
  serializeJson(doc, requestBody);
  int httpResponseCode = http.POST(requestBody);
  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.println(httpResponseCode);
    Serial.println(response);
  }
}

void postPlayerTwo(int playerTwo) {
  Serial.println("Posting JSON data to server...");
  HTTPClient http;
  http.begin("http://10.254.18.226:3000/playerTwo");
  http.addHeader("Content-Type", "application/json");
  StaticJsonDocument<200> doc;
  doc["playerTwo"] = playerTwo;
  doc["start"] = true;
  doc["id"] = id;
  JsonArray data = doc.createNestedArray("data");
  String requestBody;
  serializeJson(doc, requestBody);
  int httpResponseCode = http.POST(requestBody);
  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.println(httpResponseCode);
    Serial.println(response);
  }
}