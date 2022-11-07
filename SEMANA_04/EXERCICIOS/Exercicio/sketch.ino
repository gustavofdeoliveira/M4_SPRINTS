//Exercicio feito em conjunto com Gabriel Carneiro
//Declarações dos botoões
#define btnSalvar 12
#define btnLer 14
#define buzzer 26
#define fotoLuz 25
//Varivaeis auxiliares
int vetor[4];
int vetorArmazenamento[100];
int indexOf = 0;
int leds[4] = {2,4,5,18};
void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);

  pinMode(btnSalvar, INPUT_PULLUP);
  pinMode(btnLer, INPUT_PULLUP);
  pinMode(buzzer, OUTPUT);
  pinMode(fotoLuz, INPUT);
  pinMode(2, OUTPUT);
  pinMode(4, OUTPUT);
  pinMode(5, OUTPUT);
  pinMode(18, OUTPUT);
}

void converteBinario(int numEntrada) {
  for (int i = 0; i != 4; i++) {
    vetor[i] = numEntrada % 2;
    numEntrada = numEntrada / 2;
  }

}

void lerEntrada(int numEntrada) {
  converteBinario(numEntrada);
  for (int i = 3; i >=0;i--) {
    if (vetor[i] == 1) {
      digitalWrite(leds[i], HIGH);
    } else if (vetor[i] == 0) {
      digitalWrite(leds[i], LOW);
    }
  }
}

void tocaBuzzer(int numEntrada) {
  for (int i = 1; i < numEntrada; numEntrada--) {
    tone(buzzer, (100 * numEntrada), 200);
  }
}

int armazenaVetor(int numEntrada, int indexVetor) {
  vetorArmazenamento[indexVetor] = numEntrada;
  lerEntrada(numEntrada);
  tocaBuzzer(numEntrada);

  return indexVetor + 1;
}

void loop() {
  int valorEntrada = analogRead(fotoLuz);
  int valorFotoluz = (valorEntrada / 273);

  Serial.println("Valor de entrada atual: ");
  Serial.println(valorFotoluz);

  if (digitalRead(btnSalvar) == LOW) {
    indexOf = armazenaVetor(valorFotoluz, indexOf);
    Serial.println("Salvando valor: ");
    Serial.println(valorFotoluz);
    while (digitalRead(btnSalvar) == LOW) {}
  }

  if (digitalRead(btnLer) == LOW) {
    Serial.println("Lendo valor");
    for (int i = 0; i < indexOf; i++) {
      lerEntrada(vetorArmazenamento[i]);
      tocaBuzzer(vetorArmazenamento[i]);
      delay(3000);
    }
    while (digitalRead(btnLer) == LOW) {}
  }

  delay(3000);
}
