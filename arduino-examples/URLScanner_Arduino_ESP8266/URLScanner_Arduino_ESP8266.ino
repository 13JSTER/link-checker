/*
 * URLY Scanner - Arduino Integration Example
 * 
 * This example demonstrates how to use the URLY Scanner API
 * from an Arduino-compatible device (ESP8266/ESP32) with WiFi capability.
 * 
 * Hardware Requirements:
 * - ESP8266 (NodeMCU, Wemos D1 Mini, etc.) or ESP32
 * - WiFi connection
 * 
 * Note: Arduino Uno does not have WiFi capability. You'll need:
 * - ESP8266/ESP32 WiFi module, OR
 * - Arduino with Ethernet shield, OR
 * - Arduino with WiFi shield
 * 
 * Setup Instructions:
 * 1. Install ESP8266 board support in Arduino IDE:
 *    File > Preferences > Additional Board Manager URLs:
 *    http://arduino.esp8266.com/stable/package_esp8266com_index.json
 * 2. Install ESP8266 WiFi library (usually pre-installed)
 * 3. Update WIFI_SSID and WIFI_PASSWORD with your WiFi credentials
 * 4. Update SCANNER_HOST with your scanner server IP address
 * 5. Upload to your ESP8266/ESP32 board
 */

#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ArduinoJson.h>  // Install via Library Manager: ArduinoJson by Benoit Blanchon

// WiFi Configuration
const char* WIFI_SSID = "YOUR_WIFI_SSID";        // Replace with your WiFi SSID
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD"; // Replace with your WiFi password

// Scanner Server Configuration
// Replace with your scanner server IP address (e.g., "192.168.1.100" or "yourserver.com")
const char* SCANNER_HOST = "192.168.1.100";  // Your computer's IP running the scanner
const int SCANNER_PORT = 3000;                // Default scanner server port

// Example URLs to scan
const char* testUrls[] = {
  "https://www.google.com",
  "http://malicious-site-example.com",
  "https://github.com"
};
const int numTestUrls = 3;

WiFiClient wifiClient;
HTTPClient http;

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n\n=================================");
  Serial.println("URLY Scanner - Arduino Client");
  Serial.println("=================================\n");
  
  // Connect to WiFi
  connectToWiFi();
  
  Serial.println("\nReady to scan URLs!");
  Serial.println("Type a URL in Serial Monitor to scan it, or wait for auto-scan...\n");
  
  // Run initial test scan
  delay(2000);
  runTestScans();
}

void loop() {
  // Check if user entered a URL via Serial Monitor
  if (Serial.available() > 0) {
    String url = Serial.readStringUntil('\n');
    url.trim();
    if (url.length() > 0) {
      scanURL(url.c_str());
    }
  }
  
  // Auto-scan test URLs every 30 seconds
  static unsigned long lastScan = 0;
  if (millis() - lastScan > 30000) {
    lastScan = millis();
    Serial.println("\n--- Auto-scanning test URLs ---");
    runTestScans();
  }
  
  delay(100);
}

void connectToWiFi() {
  Serial.print("Connecting to WiFi: ");
  Serial.println(WIFI_SSID);
  
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n✓ WiFi Connected!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\n✗ WiFi Connection Failed!");
    Serial.println("Please check your credentials and try again.");
  }
}

void runTestScans() {
  for (int i = 0; i < numTestUrls; i++) {
    scanURL(testUrls[i]);
    delay(2000); // Wait between scans
  }
}

void scanURL(const char* url) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("✗ WiFi not connected!");
    return;
  }
  
  Serial.println("\n--- Scanning URL ---");
  Serial.print("URL: ");
  Serial.println(url);
  
  // Build the API endpoint
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
  
  // Make HTTP POST request
  http.begin(wifiClient, apiUrl);
  http.addHeader("Content-Type", "application/json");
  
  Serial.println("Sending request to scanner...");
  int httpResponseCode = http.POST(requestBody);
  
  if (httpResponseCode > 0) {
    String response = http.getString();
    
    Serial.print("Response Code: ");
    Serial.println(httpResponseCode);
    
    // Parse JSON response
    DynamicJsonDocument responseDoc(4096);
    DeserializationError error = deserializeJson(responseDoc, response);
    
    if (error) {
      Serial.print("✗ JSON Parse Error: ");
      Serial.println(error.c_str());
      Serial.println("Raw Response:");
      Serial.println(response);
    } else {
      // Display scan results
      displayScanResults(responseDoc);
    }
  } else {
    Serial.print("✗ HTTP Error: ");
    Serial.println(httpResponseCode);
    Serial.print("Error: ");
    Serial.println(http.errorToString(httpResponseCode));
  }
  
  http.end();
}

void displayScanResults(JsonDocument& doc) {
  Serial.println("\n=== SCAN RESULTS ===");
  
  // Status
  const char* status = doc["status"];
  if (status) {
    Serial.print("Status: ");
    if (strcmp(status, "safe") == 0) {
      Serial.println("✓ SAFE");
    } else if (strcmp(status, "caution") == 0) {
      Serial.println("⚠ CAUTION");
    } else {
      Serial.println("✗ UNSAFE");
    }
  }
  
  // Scores
  if (doc.containsKey("scores")) {
    JsonObject scores = doc["scores"];
    Serial.print("Safety Score: ");
    Serial.print(scores["safety"].as<int>());
    Serial.println("/100");
    
    Serial.print("Risk Score: ");
    Serial.print(scores["risk"].as<int>());
    Serial.println("/100");
  }
  
  // Verdict
  if (doc.containsKey("verdict")) {
    JsonObject verdict = doc["verdict"];
    Serial.print("Risk Level: ");
    Serial.println(verdict["risk"].as<const char*>());
  }
  
  // Blocklist check
  if (doc.containsKey("blocklist")) {
    JsonObject blocklist = doc["blocklist"];
    if (blocklist["match"].as<bool>()) {
      Serial.println("⚠ Found in blocklist!");
      Serial.print("Match Type: ");
      Serial.println(blocklist["matchType"].as<const char*>());
    }
  }
  
  // SSL/TLS information
  if (doc.containsKey("tls") && !doc["tls"].isNull()) {
    JsonObject tls = doc["tls"];
    if (tls["ok"].as<bool>()) {
      Serial.println("SSL Certificate: Valid");
      if (tls.containsKey("daysToExpire")) {
        Serial.print("Days to Expire: ");
        Serial.println(tls["daysToExpire"].as<int>());
      }
    } else {
      Serial.println("SSL Certificate: Invalid or Missing");
    }
  }
  
  // Recommendations
  if (doc.containsKey("recommendations")) {
    JsonArray recs = doc["recommendations"];
    if (recs.size() > 0) {
      Serial.println("\nRecommendations:");
      for (JsonVariant rec : recs) {
        Serial.print("- ");
        Serial.println(rec.as<const char*>());
      }
    }
  }
  
  Serial.println("===================\n");
}
