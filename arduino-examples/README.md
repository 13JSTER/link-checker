# URLY Scanner - Arduino Integration Guide

This guide shows you how to integrate the URLY Scanner with Arduino-compatible devices for real-time URL scanning and threat detection.

## 🎯 Overview

The URLY Scanner provides a REST API that can be accessed from Arduino devices with network connectivity. This allows you to:

- ✅ Scan URLs for malware, phishing, and other threats
- ✅ Check SSL/TLS certificates
- ✅ Verify URLs against blocklists
- ✅ Get real-time safety scores
- ✅ Receive recommendations for safe browsing

## 🔌 Hardware Requirements

### Option 1: ESP8266 (Recommended)
- **Board**: NodeMCU, Wemos D1 Mini, or any ESP8266-based board
- **Connectivity**: Built-in WiFi
- **Memory**: 4MB Flash, 80KB RAM
- **Cost**: ~$3-5
- **Pros**: Built-in WiFi, more memory, easier to use

### Option 2: ESP32
- **Board**: ESP32 DevKit or compatible
- **Connectivity**: Built-in WiFi + Bluetooth
- **Memory**: 4MB Flash, 520KB RAM
- **Cost**: ~$5-10
- **Pros**: More powerful, dual-core, more memory

### Option 3: Arduino Uno + Ethernet Shield
- **Board**: Arduino Uno R3
- **Shield**: W5100 or W5500 Ethernet Shield
- **Connectivity**: Wired Ethernet
- **Memory**: 32KB Flash, 2KB RAM (limited!)
- **Cost**: ~$25-30
- **Pros**: Stable wired connection
- **Cons**: Limited memory, requires Ethernet cable

### Option 4: Arduino with WiFi Shield
- **Board**: Arduino Uno/Mega
- **Shield**: WiFi Shield or ESP8266 WiFi module
- **Connectivity**: WiFi
- **Cost**: ~$15-30

## 📁 Examples Included

### 1. ESP8266 Example (`URLScanner_Arduino_ESP8266.ino`)
- Full-featured example for ESP8266 boards
- WiFi connectivity
- JSON parsing with ArduinoJson
- Interactive Serial Monitor interface
- Auto-scanning capability

### 2. Arduino Uno + Ethernet Example (`URLScanner_Arduino_Ethernet.ino`)
- Optimized for limited memory (2KB RAM)
- Wired Ethernet connection
- Simplified JSON parsing
- Works with standard Ethernet shields

## 🚀 Quick Start

### Step 1: Set Up the Scanner Server

First, you need to have the URLY Scanner server running on your computer or a server.

```bash
# Navigate to the scanner directory
cd UURLY-20251021T152044Z-1-001/UURLY/A_Urly-20251015T130258Z-1-001-20251016T085554Z-1-001/A_Urly-20251015T130258Z-1-001/A_Urly/Websz

# Install dependencies
npm install

# Start the scanner server
npm run scan
```

The server will start on port 3000 by default.

### Step 2: Find Your Computer's IP Address

**Windows:**
```cmd
ipconfig
```
Look for "IPv4 Address" (e.g., 192.168.1.100)

**Mac/Linux:**
```bash
ifconfig
```
Look for "inet" address (e.g., 192.168.1.100)

### Step 3: Install Arduino Libraries

Open Arduino IDE and install these libraries:

1. **ArduinoJson** (by Benoit Blanchon)
   - Go to: Sketch > Include Library > Manage Libraries
   - Search for "ArduinoJson"
   - Install version 6.x (NOT version 5.x)

2. **For ESP8266:**
   - Go to: File > Preferences
   - Add to "Additional Board Manager URLs":
     ```
     http://arduino.esp8266.com/stable/package_esp8266com_index.json
     ```
   - Go to: Tools > Board > Boards Manager
   - Search for "esp8266" and install

3. **For ESP32:**
   - Go to: File > Preferences
   - Add to "Additional Board Manager URLs":
     ```
     https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
     ```
   - Go to: Tools > Board > Boards Manager
   - Search for "esp32" and install

### Step 4: Configure and Upload

1. Open the appropriate example:
   - For ESP8266: `URLScanner_Arduino_ESP8266.ino`
   - For Arduino Uno: `URLScanner_Arduino_Ethernet.ino`

2. Update the configuration:

**For ESP8266:**
```cpp
const char* WIFI_SSID = "YourWiFiName";        // Your WiFi network name
const char* WIFI_PASSWORD = "YourWiFiPassword"; // Your WiFi password
const char* SCANNER_HOST = "192.168.1.100";    // Your computer's IP address
```

**For Arduino Uno:**
```cpp
IPAddress scannerServer(192, 168, 1, 100);  // Your computer's IP address
```

3. Select your board:
   - Tools > Board > Select your board (e.g., "NodeMCU 1.0" for ESP8266)

4. Select your port:
   - Tools > Port > Select your Arduino's port

5. Upload the sketch:
   - Click the Upload button (→)

### Step 5: Test It!

1. Open Serial Monitor (Tools > Serial Monitor)
2. Set baud rate:
   - ESP8266: 115200
   - Arduino Uno: 9600
3. Watch the output as it scans URLs
4. Type a URL in the input box and press Enter to scan it

## 📡 API Usage

### Basic Scan Request

**Endpoint:** `POST http://your-server-ip:3000/api/scan`

**Request Body:**
```json
{
  "url": "https://example.com",
  "options": {
    "enableDNS": true,
    "enableSSL": true,
    "enableHeuristics": true
  }
}
```

**Response:**
```json
{
  "status": "safe",
  "scores": {
    "safety": 95,
    "risk": 5,
    "heuristic": 5
  },
  "verdict": {
    "availability": "available",
    "risk": "low"
  },
  "blocklist": {
    "match": false
  },
  "tls": {
    "ok": true,
    "daysToExpire": 365
  },
  "recommendations": [
    "This URL appears safe to visit"
  ]
}
```

## 🔧 Troubleshooting

### Common Issues

#### "WiFi Connection Failed"
- Check WiFi credentials (SSID and password)
- Ensure WiFi network is 2.4GHz (ESP8266 doesn't support 5GHz)
- Check WiFi signal strength

#### "Could not connect to scanner server"
- Verify scanner server is running (`npm run scan`)
- Check the server IP address is correct
- Ensure Arduino and server are on the same network
- Try pinging the server from another computer
- Check firewall settings (allow port 3000)

#### "JSON Parse Error" on Arduino Uno
- Response may be too large for Arduino's 2KB RAM
- The example uses simplified parsing
- Consider using ESP8266/ESP32 for full features

#### "Out of Memory" errors
- Arduino Uno has only 2KB RAM - very limited!
- Reduce `DynamicJsonDocument` size if needed
- Use ESP8266 (80KB RAM) or ESP32 (520KB RAM) for better performance

#### Board not detected
- Install USB drivers for your board
- Try a different USB cable (some cables are power-only)
- Check Device Manager (Windows) or `ls /dev/tty*` (Mac/Linux)

## 🌐 Network Configuration

### Running on a Remote Server

If you're running the scanner on a remote server instead of localhost:

```cpp
// For cloud/VPS server
const char* SCANNER_HOST = "yourdomain.com";
const int SCANNER_PORT = 3000;

// Or use IP address
const char* SCANNER_HOST = "203.0.113.10";
```

### Using HTTPS

For production deployments, use HTTPS:

1. Set up SSL certificate on your server
2. Update Arduino code to use WiFiClientSecure (ESP8266/ESP32)
3. Change port to 443

**Example for ESP8266:**
```cpp
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecure.h>

WiFiClientSecure wifiClient;
wifiClient.setInsecure(); // For testing only!
// In production, use proper certificate validation
```

## 💡 Use Cases

### 1. Smart URL Filter
Build a device that checks URLs before allowing network access.

### 2. Parental Control Device
Monitor and filter URLs accessed by children.

### 3. IoT Security Gateway
Scan URLs before IoT devices access them.

### 4. Educational Projects
Learn about REST APIs, JSON, and network security.

### 5. Link Safety Checker
Build a physical device with LCD screen that shows URL safety status.

## 📊 Example Projects

### Project Idea: URL Safety Display

Add an LCD display to show scan results:

```cpp
#include <LiquidCrystal.h>

LiquidCrystal lcd(12, 11, 5, 4, 3, 2);

void displayResult(const char* status) {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("URL Status:");
  lcd.setCursor(0, 1);
  
  if (strcmp(status, "safe") == 0) {
    lcd.print("SAFE");
  } else if (strcmp(status, "caution") == 0) {
    lcd.print("CAUTION");
  } else {
    lcd.print("UNSAFE");
  }
}
```

### Project Idea: LED Indicator

Add RGB LED to show safety status:

```cpp
const int redPin = 9;
const int greenPin = 10;
const int bluePin = 11;

void showStatus(const char* status) {
  if (strcmp(status, "safe") == 0) {
    // Green
    analogWrite(redPin, 0);
    analogWrite(greenPin, 255);
    analogWrite(bluePin, 0);
  } else if (strcmp(status, "caution") == 0) {
    // Yellow
    analogWrite(redPin, 255);
    analogWrite(greenPin, 255);
    analogWrite(bluePin, 0);
  } else {
    // Red
    analogWrite(redPin, 255);
    analogWrite(greenPin, 0);
    analogWrite(bluePin, 0);
  }
}
```

## 📚 Additional Resources

- [Arduino Reference](https://www.arduino.cc/reference/en/)
- [ESP8266 Arduino Core Documentation](https://arduino-esp8266.readthedocs.io/)
- [ESP32 Arduino Core Documentation](https://docs.espressif.com/projects/arduino-esp32/)
- [ArduinoJson Documentation](https://arduinojson.org/)
- [Arduino Ethernet Library](https://www.arduino.cc/en/Reference/Ethernet)

## ⚠️ Important Notes

### Memory Limitations

**Arduino Uno (2KB RAM):**
- Can handle basic scanning
- Limited JSON parsing
- May struggle with large responses

**ESP8266 (80KB RAM):**
- Can handle full-featured scanning
- Complete JSON parsing
- Recommended for most projects

**ESP32 (520KB RAM):**
- Can handle complex operations
- Best for advanced projects
- Supports HTTPS easily

### Security Considerations

1. **Don't hardcode WiFi passwords** in production
2. **Use HTTPS** for sensitive applications
3. **Validate certificates** in production (don't use `setInsecure()`)
4. **Limit scan rate** to avoid overwhelming the server
5. **Keep firmware updated** for security patches

## 🤝 Support

For issues or questions:
- Check the main README.md
- Review the troubleshooting section above
- Check the example code comments
- Open an issue on GitHub

## 📄 License

This integration guide and examples are part of the URLY Scanner project and follow the same license.

---

**Made with ❤️ for the Arduino community**
