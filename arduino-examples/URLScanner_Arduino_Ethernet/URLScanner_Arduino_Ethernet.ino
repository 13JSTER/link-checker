/*
 * URLY Scanner - Arduino Uno + Ethernet Shield Example
 * 
 * This example demonstrates how to use the URLY Scanner API
 * from an Arduino Uno with an Ethernet shield.
 * 
 * Hardware Requirements:
 * - Arduino Uno (or compatible)
 * - Ethernet Shield (W5100, W5500, or compatible)
 * - Ethernet cable connected to your router
 * 
 * Setup Instructions:
 * 1. Install ArduinoJson library (version 6.x):
 *    Sketch > Include Library > Manage Libraries > Search for "ArduinoJson"
 * 2. Update the MAC address if needed (should be unique on your network)
 * 3. Update SCANNER_HOST with your scanner server IP address
 * 4. Connect Ethernet shield to Arduino Uno
 * 5. Connect Ethernet cable to shield
 * 6. Upload to your Arduino Uno
 * 7. Open Serial Monitor at 9600 baud
 */

#include <SPI.h>
#include <Ethernet.h>
#include <ArduinoJson.h>  // Install via Library Manager: ArduinoJson by Benoit Blanchon

// Network Configuration
byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };  // MAC address for Ethernet shield
IPAddress scannerServer(192, 168, 1, 100);  // Replace with your scanner server IP
const int scannerPort = 3000;                 // Scanner server port

// Test URLs
const char* testUrl = "https://www.google.com";

EthernetClient client;

void setup() {
  Serial.begin(9600);
  while (!Serial) {
    ; // Wait for serial port to connect (needed for native USB)
  }
  
  Serial.println("\n\n=================================");
  Serial.println("URLY Scanner - Arduino Uno Client");
  Serial.println("=================================\n");
  
  // Start Ethernet connection
  Serial.println("Initializing Ethernet...");
  if (Ethernet.begin(mac) == 0) {
    Serial.println("Failed to configure Ethernet using DHCP");
    
    // Try to configure using IP address
    IPAddress ip(192, 168, 1, 177);  // Fallback IP address
    IPAddress myDns(192, 168, 1, 1);
    Ethernet.begin(mac, ip, myDns);
  }
  
  // Print local IP address
  Serial.print("Arduino IP address: ");
  Serial.println(Ethernet.localIP());
  
  // Give the Ethernet shield time to initialize
  delay(1000);
  
  Serial.println("\nReady to scan URLs!");
  Serial.println("Scanning test URL in 3 seconds...\n");
  delay(3000);
  
  // Scan test URL
  scanURL(testUrl);
}

void loop() {
  // Check if user entered a URL via Serial Monitor
  if (Serial.available() > 0) {
    String url = Serial.readStringUntil('\n');
    url.trim();
    if (url.length() > 0 && url.startsWith("http")) {
      scanURL(url.c_str());
    } else if (url.length() > 0) {
      Serial.println("Error: URL must start with http:// or https://");
    }
  }
  
  // Auto-scan test URL every 60 seconds
  static unsigned long lastScan = 0;
  if (millis() - lastScan > 60000) {
    lastScan = millis();
    Serial.println("\n--- Auto-scanning test URL ---");
    scanURL(testUrl);
  }
  
  delay(100);
}

void scanURL(const char* url) {
  Serial.println("\n--- Scanning URL ---");
  Serial.print("URL: ");
  Serial.println(url);
  Serial.println("Connecting to scanner...");
  
  // Connect to scanner server
  if (client.connect(scannerServer, scannerPort)) {
    Serial.println("Connected to server");
    
    // Create JSON payload - simplified for Arduino Uno memory constraints
    String jsonPayload = "{\"url\":\"";
    jsonPayload += url;
    jsonPayload += "\",\"options\":{\"enableDNS\":true,\"enableSSL\":true}}";
    
    // Send HTTP POST request
    client.println("POST /api/scan HTTP/1.1");
    client.print("Host: ");
    client.println(scannerServer);
    client.println("Content-Type: application/json");
    client.print("Content-Length: ");
    client.println(jsonPayload.length());
    client.println("Connection: close");
    client.println();
    client.println(jsonPayload);
    
    Serial.println("Request sent. Waiting for response...");
    
    // Wait for response
    unsigned long timeout = millis();
    while (client.available() == 0) {
      if (millis() - timeout > 10000) {
        Serial.println("Error: Connection timeout");
        client.stop();
        return;
      }
    }
    
    // Read response headers
    boolean headersEnded = false;
    while (client.available() && !headersEnded) {
      String line = client.readStringUntil('\n');
      if (line == "\r") {
        headersEnded = true;
      }
    }
    
    // Read response body
    String response = "";
    while (client.available()) {
      char c = client.read();
      response += c;
    }
    
    client.stop();
    Serial.println("Disconnected from server");
    
    // Parse JSON response (simplified for memory constraints)
    parseAndDisplayResults(response);
    
  } else {
    Serial.println("Error: Could not connect to scanner server");
    Serial.println("Please check:");
    Serial.println("1. Scanner server is running");
    Serial.println("2. Scanner server IP address is correct");
    Serial.println("3. Network connection is working");
  }
}

void parseAndDisplayResults(String jsonResponse) {
  Serial.println("\n=== SCAN RESULTS ===");
  
  // Parse JSON - using simplified parsing for Arduino Uno memory constraints
  DynamicJsonDocument doc(2048);
  DeserializationError error = deserializeJson(doc, jsonResponse);
  
  if (error) {
    Serial.print("JSON Parse Error: ");
    Serial.println(error.c_str());
    Serial.println("\nRaw Response (first 500 chars):");
    Serial.println(jsonResponse.substring(0, 500));
    return;
  }
  
  // Status
  const char* status = doc["status"];
  if (status) {
    Serial.print("Status: ");
    if (strcmp(status, "safe") == 0) {
      Serial.println("SAFE ✓");
    } else if (strcmp(status, "caution") == 0) {
      Serial.println("CAUTION ⚠");
    } else {
      Serial.println("UNSAFE ✗");
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
  
  // Risk level
  if (doc.containsKey("verdict")) {
    JsonObject verdict = doc["verdict"];
    Serial.print("Risk Level: ");
    Serial.println(verdict["risk"].as<const char*>());
  }
  
  // Blocklist check
  if (doc.containsKey("blocklist")) {
    JsonObject blocklist = doc["blocklist"];
    if (blocklist["match"].as<bool>()) {
      Serial.println("WARNING: Found in blocklist!");
    }
  }
  
  // SSL/TLS
  if (doc.containsKey("tls") && !doc["tls"].isNull()) {
    JsonObject tls = doc["tls"];
    if (tls["ok"].as<bool>()) {
      Serial.print("SSL: Valid");
      if (tls.containsKey("daysToExpire")) {
        Serial.print(" (expires in ");
        Serial.print(tls["daysToExpire"].as<int>());
        Serial.println(" days)");
      } else {
        Serial.println();
      }
    }
  }
  
  // Show first 2 recommendations
  if (doc.containsKey("recommendations")) {
    JsonArray recs = doc["recommendations"];
    if (recs.size() > 0) {
      Serial.println("\nTop Recommendations:");
      int count = 0;
      for (JsonVariant rec : recs) {
        Serial.print("- ");
        Serial.println(rec.as<const char*>());
        count++;
        if (count >= 2) break;  // Limit to 2 for memory
      }
    }
  }
  
  Serial.println("===================\n");
}
