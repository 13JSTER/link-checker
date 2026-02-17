/*
 * URLY Scanner - Interactive LED Indicator Example
 * 
 * This example adds RGB LED visual feedback to show URL scan results.
 * Think of it as a "chatbot" that responds with colored lights!
 * 
 * Hardware Requirements:
 * - ESP8266 (NodeMCU, Wemos D1 Mini, etc.)
 * - RGB LED (Common Cathode) or 3 separate LEDs (Red, Yellow, Green)
 * - 3x 220Ω resistors
 * - Breadboard and jumper wires
 * 
 * LED Color Meanings (like a chatbot's responses):
 * - 🟢 GREEN  = "This URL is SAFE! ✓"
 * - 🟡 YELLOW = "Be careful with this URL ⚠"
 * - 🔴 RED    = "DANGER! This URL is unsafe! ✗"
 * - 🔵 BLUE   = "Scanning URL... please wait"
 * - ⚪ WHITE  = "Ready to scan"
 * 
 * Wiring (for RGB LED - Common Cathode):
 * - D1 (GPIO5)  → 220Ω resistor → Red pin
 * - D2 (GPIO4)  → 220Ω resistor → Green pin
 * - D3 (GPIO0)  → 220Ω resistor → Blue pin
 * - GND → Common Cathode (longest pin)
 * 
 * Alternatively (for separate LEDs):
 * - D1 → 220Ω → Red LED (+) → GND
 * - D2 → 220Ω → Yellow/Green LED (+) → GND
 * - D3 → 220Ω → Green LED (+) → GND
 */

#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ArduinoJson.h>

// WiFi Configuration
const char* WIFI_SSID = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// Scanner Server Configuration
const char* SCANNER_HOST = "192.168.1.100";
const int SCANNER_PORT = 3000;

// LED Pin Configuration (adjust if needed)
const int RED_PIN = D1;    // GPIO5
const int GREEN_PIN = D2;  // GPIO4
const int BLUE_PIN = D3;   // GPIO0

// LED brightness (0-255, for PWM control)
const int BRIGHTNESS = 128;  // Adjust if too bright/dim

// Test URLs with different safety levels
const char* testUrls[] = {
  "https://www.google.com",          // Should be safe (GREEN)
  "http://example.com",              // HTTP - might show caution (YELLOW)
  "https://github.com"               // Should be safe (GREEN)
};
const int numTestUrls = 3;

WiFiClient wifiClient;
HTTPClient http;

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  // Initialize LED pins
  pinMode(RED_PIN, OUTPUT);
  pinMode(GREEN_PIN, OUTPUT);
  pinMode(BLUE_PIN, OUTPUT);
  
  Serial.println("\n\n=================================");
  Serial.println("URLY Scanner - Interactive LED Bot");
  Serial.println("=================================\n");
  
  // Show white light (ready state)
  setLEDColor(255, 255, 255);
  Serial.println("LED: White (Ready)");
  
  // Connect to WiFi
  connectToWiFi();
  
  Serial.println("\n🤖 Interactive URL Scanner Bot Ready!");
  Serial.println("Watch the LED for real-time feedback:");
  Serial.println("  🔵 Blue   = Scanning...");
  Serial.println("  🟢 Green  = Safe URL");
  Serial.println("  🟡 Yellow = Caution");
  Serial.println("  🔴 Red    = Unsafe");
  Serial.println("\nType a URL to scan, or wait for demo...\n");
  
  // Show green (ready and connected)
  setLEDColor(0, 255, 0);
  delay(2000);
  
  // Run demo
  runInteractiveDemo();
}

void loop() {
  // Interactive mode - scan URLs from Serial Monitor
  if (Serial.available() > 0) {
    String url = Serial.readStringUntil('\n');
    url.trim();
    if (url.length() > 0) {
      Serial.println("\n🤖 Bot: I'll check that URL for you!");
      scanURLWithFeedback(url.c_str());
    }
  }
  
  // Pulse the LED gently when idle (breathing effect)
  static unsigned long lastPulse = 0;
  static int brightness = 0;
  static int direction = 5;
  
  if (millis() - lastPulse > 50) {
    lastPulse = millis();
    brightness += direction;
    if (brightness >= 100 || brightness <= 0) {
      direction = -direction;
    }
    
    // Gentle green pulse when idle
    analogWrite(GREEN_PIN, brightness);
    analogWrite(RED_PIN, 0);
    analogWrite(BLUE_PIN, 0);
  }
}

void runInteractiveDemo() {
  Serial.println("\n🎬 Starting Interactive Demo...\n");
  
  for (int i = 0; i < numTestUrls; i++) {
    Serial.print("🤖 Bot: Let me check URL ");
    Serial.print(i + 1);
    Serial.print(" of ");
    Serial.println(numTestUrls);
    
    scanURLWithFeedback(testUrls[i]);
    
    delay(5000);  // Wait 5 seconds between scans
  }
  
  Serial.println("\n✅ Demo complete! Now in interactive mode.");
  Serial.println("Type any URL to scan it!\n");
}

void connectToWiFi() {
  // Flash blue while connecting
  Serial.print("🤖 Bot: Connecting to WiFi");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(250);
    setLEDColor(0, 0, 255);  // Blue
    delay(250);
    setLEDColor(0, 0, 0);    // Off
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println();
    Serial.println("🤖 Bot: Connected! ✓");
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());
    
    // Flash green 3 times for success
    for (int i = 0; i < 3; i++) {
      setLEDColor(0, 255, 0);
      delay(200);
      setLEDColor(0, 0, 0);
      delay(200);
    }
  } else {
    Serial.println();
    Serial.println("🤖 Bot: WiFi connection failed! ✗");
    // Flash red continuously
    while (true) {
      setLEDColor(255, 0, 0);
      delay(500);
      setLEDColor(0, 0, 0);
      delay(500);
    }
  }
}

void scanURLWithFeedback(const char* url) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("🤖 Bot: Oops! Not connected to WiFi.");
    setLEDColor(255, 0, 0);  // Red
    return;
  }
  
  Serial.println("\n┌─────────────────────────────");
  Serial.print("│ URL: ");
  Serial.println(url);
  
  // Show blue (scanning)
  Serial.println("│ 🤖 Bot: Scanning... 🔵");
  setLEDColor(0, 0, 255);  // Blue - Scanning
  
  // Build API URL
  String apiUrl = "http://" + String(SCANNER_HOST) + ":" + String(SCANNER_PORT) + "/api/scan";
  
  // Create JSON payload
  StaticJsonDocument<256> requestDoc;
  requestDoc["url"] = url;
  JsonObject options = requestDoc.createNestedObject("options");
  options["enableDNS"] = true;
  options["enableSSL"] = true;
  options["enableHeuristics"] = true;
  
  String requestBody;
  serializeJson(requestDoc, requestBody);
  
  // Make request
  http.begin(wifiClient, apiUrl);
  http.addHeader("Content-Type", "application/json");
  
  int httpResponseCode = http.POST(requestBody);
  
  if (httpResponseCode > 0) {
    String response = http.getString();
    
    // Parse response
    DynamicJsonDocument responseDoc(4096);
    DeserializationError error = deserializeJson(responseDoc, response);
    
    if (!error) {
      // Display results with LED feedback
      displayResultsWithLED(responseDoc);
    } else {
      Serial.println("│ 🤖 Bot: Sorry, I couldn't understand the response.");
      setLEDColor(255, 128, 0);  // Orange - Error
    }
  } else {
    Serial.print("│ 🤖 Bot: Connection error (");
    Serial.print(httpResponseCode);
    Serial.println(")");
    setLEDColor(255, 0, 0);  // Red - Error
  }
  
  Serial.println("└─────────────────────────────\n");
  http.end();
}

void displayResultsWithLED(JsonDocument& doc) {
  const char* status = doc["status"];
  
  Serial.println("│");
  Serial.print("│ 🤖 Bot: ");
  
  if (strcmp(status, "safe") == 0) {
    // SAFE - Green LED
    setLEDColor(0, 255, 0);
    Serial.println("This URL looks SAFE! 🟢✓");
    
    // Show scores
    if (doc.containsKey("scores")) {
      JsonObject scores = doc["scores"];
      Serial.print("│      Safety score: ");
      Serial.print(scores["safety"].as<int>());
      Serial.println("/100");
    }
    
    // Celebratory blink
    delay(500);
    for (int i = 0; i < 3; i++) {
      setLEDColor(0, 255, 0);
      delay(150);
      setLEDColor(0, 0, 0);
      delay(150);
    }
    setLEDColor(0, 255, 0);  // Back to green
    
  } else if (strcmp(status, "caution") == 0) {
    // CAUTION - Yellow LED
    setLEDColor(255, 255, 0);
    Serial.println("Be CAREFUL with this URL! 🟡⚠");
    
    if (doc.containsKey("scores")) {
      JsonObject scores = doc["scores"];
      Serial.print("│      Risk score: ");
      Serial.print(scores["risk"].as<int>());
      Serial.println("/100");
    }
    
    // Warning pulse
    for (int i = 0; i < 3; i++) {
      setLEDColor(255, 255, 0);
      delay(300);
      setLEDColor(128, 128, 0);
      delay(300);
    }
    setLEDColor(255, 255, 0);  // Back to yellow
    
  } else {
    // UNSAFE - Red LED
    setLEDColor(255, 0, 0);
    Serial.println("DANGER! This URL is UNSAFE! 🔴✗");
    
    if (doc.containsKey("scores")) {
      JsonObject scores = doc["scores"];
      Serial.print("│      Risk score: ");
      Serial.print(scores["risk"].as<int>());
      Serial.println("/100");
    }
    
    // Danger flash
    for (int i = 0; i < 5; i++) {
      setLEDColor(255, 0, 0);
      delay(200);
      setLEDColor(0, 0, 0);
      delay(200);
    }
    setLEDColor(255, 0, 0);  // Back to red
  }
  
  // Show additional info
  if (doc.containsKey("verdict")) {
    JsonObject verdict = doc["verdict"];
    Serial.print("│      Risk level: ");
    Serial.println(verdict["risk"].as<const char*>());
  }
  
  // Blocklist warning
  if (doc.containsKey("blocklist")) {
    JsonObject blocklist = doc["blocklist"];
    if (blocklist["match"].as<bool>()) {
      Serial.println("│      ⚠️ Found in blocklist database!");
    }
  }
  
  // SSL info
  if (doc.containsKey("tls") && !doc["tls"].isNull()) {
    JsonObject tls = doc["tls"];
    if (tls["ok"].as<bool>()) {
      Serial.print("│      SSL: Valid");
      if (tls.containsKey("daysToExpire")) {
        Serial.print(" (");
        Serial.print(tls["daysToExpire"].as<int>());
        Serial.print(" days left)");
      }
      Serial.println();
    }
  }
  
  // Top recommendation
  if (doc.containsKey("recommendations")) {
    JsonArray recs = doc["recommendations"];
    if (recs.size() > 0) {
      Serial.print("│ 💡 Tip: ");
      Serial.println(recs[0].as<const char*>());
    }
  }
}

void setLEDColor(int red, int green, int blue) {
  // Use PWM for brightness control
  analogWrite(RED_PIN, red);
  analogWrite(GREEN_PIN, green);
  analogWrite(BLUE_PIN, blue);
}
