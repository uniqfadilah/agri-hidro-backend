#include <WiFi.h>
#include <WebServer.h>
#include <Preferences.h>
#include <HTTPClient.h>

#define TRIG_PIN  5
#define ECHO_PIN  18
#define ECHO_TIMEOUT_US    30000
#define ULTRASONIC_DELAY   40
#define SAMPLE_COUNT       5
#define MIN_CHANGE_CM      1.0f
#define WIFI_TIMEOUT_MS    15000
#define WIFI_POLL_MS       300
#define LOOP_DELAY_MS      2000

#define SSID_LEN   32
#define PASS_LEN   32
#define CODE_LEN   20
#define JWT_LEN    40
#define HOST_LEN   64
#define BODY_LEN   160

WebServer server(80);
Preferences prefs;

char ssid[SSID_LEN];
char pass[PASS_LEN];
char code[CODE_LEN];
char jwt[JWT_LEN];
char host[HOST_LEN];
uint16_t apiPort = 80;

bool configured = false;
float lastSentLevel = -999.0f;

float readDistanceCm() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);

  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  long durationUs = pulseIn(ECHO_PIN, HIGH, ECHO_TIMEOUT_US);
  if (durationUs == 0) {
    return -1.0f;
  }

  // Speed of sound ~0.0343 cm/us; round trip so divide by 2
  return (float)durationUs * 0.0343f / 2.0f;
}

float getStableDistance() {
  float readings[SAMPLE_COUNT];
  int count = 0;

  for (int i = 0; i < SAMPLE_COUNT; i++) {
    float d = readDistanceCm();
    if (d > 0) {
      readings[count++] = d;
    }
    delay(ULTRASONIC_DELAY);
  }

  if (count == 0) {
    return -1.0f;
  }

  // Sort and return median
  for (int i = 0; i < count - 1; i++) {
    for (int j = i + 1; j < count; j++) {
      if (readings[j] < readings[i]) {
        float tmp = readings[i];
        readings[i] = readings[j];
        readings[j] = tmp;
      }
    }
  }
  return readings[count / 2];
}

void sendWaterLevel(float levelCm) {
  if (WiFi.status() != WL_CONNECTED) {
    return;
  }

  char body[BODY_LEN];
  snprintf(
    body, sizeof(body),
    "{\"code\":\"%s\",\"current_level_water\":%.2f,\"jwt_secret\":\"%s\"}",
    code, levelCm, jwt
  );

  String url = String("http://") + host + ":" + String(apiPort) + "/tandon/device/update-water";
  Serial.println(url);
  HTTPClient http;
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  int httpCode = http.POST(body);
  if (httpCode > 0) {
    Serial.print("API response (");
    Serial.print(httpCode);
    Serial.print("): ");
    Serial.println(http.getString());
  } else {
    Serial.print("API error: ");
    Serial.println(httpCode);
  }
  http.end();
}

void handleConfigPage() {
  String html =
    "<!DOCTYPE html><html><head><meta charset='UTF-8'>"
    "<title>ESP32 Water Setup</title></head><body>"
    "<h2>ESP32 Water Setup</h2>"
    "<form action='/save'>"
    "SSID: <input name='s'><br>"
    "Password: <input name='p' type='password'><br>"
    "Device code: <input name='c'><br>"
    "JWT: <input name='j'><br>"
    "Host: <input name='h' value='agrihidro.my.id'><br>"
    "Port: <input name='port' type='number' min='1' max='65535' value='80' placeholder='80'><br>"
    "<input type='submit' value='Save &amp; Reboot'>"
    "</form></body></html>";

  server.send(200, "text/html", html);
}

void handleConfigSave() {
  String s = server.arg("s");
  String p = server.arg("p");
  String c = server.arg("c");
  String j = server.arg("j");
  String h = server.arg("h");
  int port = server.arg("port").toInt();
  if (port <= 0 || port > 65535) port = 80;

  prefs.begin("cfg");
  prefs.putString("ssid", s);
  prefs.putString("pass", p);
  prefs.putString("code", c);
  prefs.putString("jwt", j);
  prefs.putString("host", h);
  prefs.putInt("port", port);
  prefs.end();

  // Copy into globals and connect (no reboot; config required again on next reset)
  s.toCharArray(ssid, SSID_LEN);
  p.toCharArray(pass, PASS_LEN);
  c.toCharArray(code, CODE_LEN);
  j.toCharArray(jwt, JWT_LEN);
  h.toCharArray(host, HOST_LEN);
  apiPort = (uint16_t)port;

  WiFi.begin(ssid, pass);
  server.send(200, "text/html", "Saved. Connecting to WiFi...");
}

void setup() {
  Serial.begin(115200);

  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  // Always start config portal on reset (no auto-connect from saved config)
  WiFi.softAP("ESP32_WATER_SETUP");
  Serial.println("Config AP started. Connect to ESP32_WATER_SETUP and open the IP in browser.");

  server.on("/", handleConfigPage);
  server.on("/save", handleConfigSave);
  server.begin();
}

void loop() {
  if (!configured) {
    server.handleClient();
    // After user saved config, WiFi is connecting; switch to run mode when connected
    if (ssid[0] != '\0' && WiFi.status() == WL_CONNECTED) {
      configured = true;
      WiFi.softAPdisconnect(true);  // turn off config AP; STA only until next reset
    }
    return;
  }

  float distanceCm = getStableDistance();

  if (distanceCm > 0) {
    Serial.print("Distance (cm): ");
    Serial.println(distanceCm);

    if (abs(distanceCm - lastSentLevel) > MIN_CHANGE_CM) {
      sendWaterLevel(distanceCm);
      lastSentLevel = distanceCm;
    }
  }

  delay(LOOP_DELAY_MS);
}
