# Quick Start: Arduino "Chatbot" URL Scanner

This guide helps you create an **interactive URL scanning "chatbot"** using Arduino that responds with colored lights and messages - similar to how a chatbot responds to queries!

## 🤖 What You'll Build

An interactive device that:
- ✅ "Listens" for URLs you send it (via Serial Monitor)
- 🔵 Shows blue light while "thinking" (scanning)
- 🟢 Responds with green light for safe URLs
- 🟡 Shows yellow light for suspicious URLs  
- 🔴 Flashes red for dangerous URLs
- 💬 Gives you text feedback like a chatbot

Think of it as a **physical chatbot** that answers "Is this URL safe?" with colored lights!

## 🎯 Choose Your Setup

### Option 1: Simple ESP8266 (Text-Only Chatbot)
**What you need:**
- ESP8266 board (NodeMCU or Wemos D1)
- USB cable
- WiFi connection

**Time:** 15 minutes  
**Cost:** ~$3-5

👉 Use example: `URLScanner_Arduino_ESP8266.ino`

### Option 2: ESP8266 + LED (Visual Chatbot) ⭐ RECOMMENDED
**What you need:**
- ESP8266 board
- RGB LED (or 3 separate LEDs: red, yellow, green)
- 3x 220Ω resistors
- Breadboard + wires

**Time:** 30 minutes  
**Cost:** ~$5-7

👉 Use example: `URLScanner_ESP8266_With_LED.ino`

### Option 3: Arduino Uno (For Beginners)
**What you need:**
- Arduino Uno
- Ethernet Shield
- Ethernet cable

**Time:** 20 minutes  
**Cost:** ~$25-30

👉 Use example: `URLScanner_Arduino_Ethernet.ino`

## 🚀 Ultra-Quick Setup (5 Steps!)

### Step 1: Start the Scanner Server
```bash
# In your computer terminal
cd UURLY-20251021T152044Z-1-001/UURLY/A_Urly-20251015T130258Z-1-001-20251016T085554Z-1-001/A_Urly-20251015T130258Z-1-001/A_Urly/Websz
npm install
npm run scan
```

Leave this running! It's your "chatbot brain" 🧠

### Step 2: Find Your Computer's IP Address

**Windows:** Open Command Prompt, type `ipconfig`  
**Mac:** Open Terminal, type `ifconfig`  
**Look for:** Something like `192.168.1.100`

### Step 3: Open Arduino IDE

1. Install **ArduinoJson** library:
   - Tools > Manage Libraries
   - Search "ArduinoJson"
   - Install version 6.x

2. For ESP8266, add board support:
   - File > Preferences
   - Add URL: `http://arduino.esp8266.com/stable/package_esp8266com_index.json`
   - Tools > Board Manager > Install "esp8266"

### Step 4: Configure Your Sketch

Open one of the examples and update these lines:

```cpp
// Your WiFi credentials
const char* WIFI_SSID = "YourWiFiName";
const char* WIFI_PASSWORD = "YourPassword123";

// Your computer's IP address (from Step 2)
const char* SCANNER_HOST = "192.168.1.100";  // ← Change this!
```

### Step 5: Upload and Chat!

1. Connect your board via USB
2. Select: Tools > Board > NodeMCU 1.0 (or your board)
3. Select: Tools > Port > (your port)
4. Click Upload button (→)
5. Open Serial Monitor (🔍 icon)
6. Set baud rate to **115200** (bottom right)

**Now you're chatting with your URL scanner bot!** 🎉

## 💬 How to "Chat" With Your Bot

### Via Serial Monitor

Type a URL and press Enter:

```
https://www.google.com
```

The bot responds:
```
🤖 Bot: I'll check that URL for you!
🤖 Bot: This URL looks SAFE! 🟢✓
     Safety score: 95/100
```

### Watch the LED Responses

- 🔵 **Blue blinking** = "Connecting to WiFi..."
- 🔵 **Solid blue** = "Scanning your URL..."
- 🟢 **Green** = "Safe! You're good to go!"
- 🟡 **Yellow** = "Hmm, be careful with this one..."
- 🔴 **Red flashing** = "DANGER! Don't visit this!"

### Auto-Demo Mode

The bot automatically scans test URLs every 30-60 seconds to show you how it works!

## 🎨 Wiring for LED Version

If you're using the LED example, connect like this:

```
ESP8266         RGB LED         Resistor
D1 (GPIO5)  →   [220Ω]  →      Red pin
D2 (GPIO4)  →   [220Ω]  →      Green pin  
D3 (GPIO0)  →   [220Ω]  →      Blue pin
GND         →   Common cathode (long pin)
```

**Don't have RGB LED?** Use 3 separate LEDs:
- D1 → Red LED → GND
- D2 → Yellow LED → GND
- D3 → Green LED → GND

## 🎯 Example "Conversation"

```
You: https://www.google.com

🤖 Bot: Scanning... 🔵
🤖 Bot: This URL looks SAFE! 🟢✓
     Safety score: 95/100
     SSL: Valid (365 days left)
💡 Tip: This URL appears safe to visit

─────────────────

You: http://suspicious-site.xyz

🤖 Bot: Scanning... 🔵
🤖 Bot: Be CAREFUL with this URL! 🟡⚠
     Risk score: 45/100
     ⚠️ Uses insecure HTTP
💡 Tip: Avoid entering personal information
```

## 🔧 Troubleshooting

**"WiFi Connection Failed"**
- Double-check SSID and password (case-sensitive!)
- ESP8266 only works with 2.4GHz WiFi (not 5GHz)

**"Could not connect to scanner server"**
- Make sure scanner server is running (`npm run scan`)
- Verify IP address is correct
- Try pinging the IP from another computer
- Turn off firewall temporarily to test

**"LED not working"**
- Check polarity: Long leg = positive (to pin), short = negative (to GND)
- Make sure you have resistors (220Ω)
- Test LEDs individually with a simple blink sketch

**"Board not detected"**
- Try a different USB cable (must be data+power, not power-only)
- Install USB drivers for your board

## 🎓 Next Steps

Once it's working, try:

1. **Add more LEDs** - Show different info with different colors
2. **Add an LCD screen** - Display full scan results
3. **Add buttons** - Trigger scans with button presses
4. **Build an enclosure** - Make it look professional
5. **Create auto-scanner** - Scan URLs from a file/database

## 💡 Why This is Like a Chatbot

Traditional chatbots respond with text. Your Arduino "chatbot" responds with:
- ✅ Text messages (via Serial Monitor)
- ✅ Visual feedback (colored LEDs)
- ✅ Different "moods" (colors based on scan results)
- ✅ Interactive conversation (send URL, get response)
- ✅ Real-time responses (just like chatting!)

It's a **physical chatbot** that helps you stay safe online! 🛡️

## 📹 Expected Behavior

### When Starting Up:
```
=================================
URLY Scanner - Interactive LED Bot
=================================

LED: White (Ready)
🤖 Bot: Connecting to WiFi.....
🤖 Bot: Connected! ✓
IP: 192.168.1.177

🤖 Interactive URL Scanner Bot Ready!
Watch the LED for real-time feedback:
  🔵 Blue   = Scanning...
  🟢 Green  = Safe URL
  🟡 Yellow = Caution
  🔴 Red    = Unsafe
```

### When Scanning:
1. LED turns **blue** (scanning)
2. Text shows "Scanning..."
3. LED changes to **green/yellow/red** based on result
4. Text shows detailed analysis

## 🎉 Success!

If you see:
- ✅ WiFi connected
- ✅ Scanner responds to URLs
- ✅ LED changes colors
- ✅ Serial Monitor shows results

**Congratulations! You've built an interactive URL safety chatbot!** 🎊

Now you can:
- Check any URL for safety
- Learn about web security
- Show it to friends
- Build even cooler projects!

---

**Having fun?** Share your project on social media and tag the author!

**Need help?** Check the full [Arduino Integration Guide](README.md) or [Hardware Setup Guide](HARDWARE_SETUP.md)
