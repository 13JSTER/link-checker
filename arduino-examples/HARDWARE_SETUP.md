# Hardware Setup Guide

## ESP8266 NodeMCU Setup

### Pinout Diagram

```
NodeMCU ESP8266
┌─────────────────┐
│                 │
│     [ USB ]     │  ← Connect to computer for power and programming
│                 │
├─────────────────┤
│ RSV          3V3│
│ A0           GND│
│ RSV           D8│
│ RSV           D7│
│ SD3           D6│
│ SD2           D5│
│ SD1           D4│  ← Built-in LED (optional)
│ CMD           D3│
│ SD0           D2│
│ CLK           D1│
│ GND           D0│
│ 3V3          RSV│
│ EN           RSV│
│ RST          RSV│
│ GND          GND│
│ VIN           5V│
└─────────────────┘
```

### Basic Setup (No External Components Required!)

The ESP8266 has built-in WiFi and can run standalone:

1. **Power**: USB cable to computer or 5V power adapter
2. **Programming**: Same USB cable (data + power)
3. **No additional wiring needed** for basic URL scanning

### Optional: Add LED Indicator

```
ESP8266 NodeMCU          RGB LED (Common Cathode)
┌─────────────┐          ┌─────────┐
│ D1 (GPIO5)  ├─[220Ω]──┤ R (Red) │
│ D2 (GPIO4)  ├─[220Ω]──┤ G (Grn) │
│ D3 (GPIO0)  ├─[220Ω]──┤ B (Blu) │
│ GND         ├─────────┤ Cathode │
└─────────────┘          └─────────┘
```

**LED Color Meanings:**
- 🟢 Green = Safe URL
- 🟡 Yellow = Caution (medium risk)
- 🔴 Red = Unsafe URL

### Optional: Add LCD Display (I2C)

```
ESP8266 NodeMCU          16x2 LCD (I2C)
┌─────────────┐          ┌─────────┐
│ D1 (SCL)    ├─────────┤ SCL     │
│ D2 (SDA)    ├─────────┤ SDA     │
│ 3V3         ├─────────┤ VCC     │
│ GND         ├─────────┤ GND     │
└─────────────┘          └─────────┘
```

## Arduino Uno + Ethernet Shield Setup

### Hardware Stack

```
From Bottom to Top:
┌─────────────────────┐
│  Arduino Uno R3     │  ← Bottom layer
├─────────────────────┤
│  Ethernet Shield    │  ← Stacks on top
└─────────────────────┘
         │
         └─ RJ45 Ethernet Cable to Router/Switch
```

### Pinout Details

```
Arduino Uno
┌─────────────────────┐
│                     │
│    [ USB ]          │  ← Power & Programming
│                     │
├─────────────────────┤
│ D0  (RX)       AREF │
│ D1  (TX)        GND │
│ D2               D13│  ← Used by Ethernet Shield (SPI)
│ D3               D12│  ← Used by Ethernet Shield (SPI)
│ D4  (SD Card)    D11│  ← Used by Ethernet Shield (SPI)
│ D5               D10│  ← Used by Ethernet Shield (CS)
│ D6                D9│
│ D7                D8│
│ D8                D7│
│ D9                D6│
│ D10 (CS)          D5│
│ D11 (MOSI)        D4│
│ D12 (MISO)        D3│
│ D13 (SCK)         D2│
│ GND              GND│
│ AREF             RST│
│ SDA               5V│
│ SCL             VIN │
└─────────────────────┘
```

**Ethernet Shield Pins Used:**
- D10: CS (Chip Select for W5100/W5500)
- D11: MOSI (SPI)
- D12: MISO (SPI)
- D13: SCK (SPI)
- D4: SD Card CS (if using SD card)

**Available Pins for Expansion:**
- D2, D3, D5, D6, D7, D8, D9 (digital)
- A0-A5 (analog)

### Network Connection

```
Arduino Uno + Ethernet Shield
         │
    [Ethernet Cable]
         │
    ┌────┴────┐
    │ Router  │  ← Must be on same network as scanner server
    │  or     │
    │ Switch  │
    └─────────┘
```

## Component Recommendations

### ESP8266 Boards (Recommended)

1. **NodeMCU V3** (~$3-5)
   - Easy to use
   - Built-in USB
   - Breadboard compatible

2. **Wemos D1 Mini** (~$2-4)
   - Compact size
   - Built-in USB
   - Good for permanent installations

3. **ESP-01** (~$2)
   - Very cheap
   - Requires USB adapter for programming
   - Limited pins

### Arduino Uno + Shields

1. **Arduino Uno R3** (~$20-25)
   - Official or compatible

2. **W5100 Ethernet Shield** (~$5-10)
   - Most common
   - Good compatibility

3. **W5500 Ethernet Shield** (~$8-15)
   - Faster and more efficient
   - Better stability

### Optional Components

**For Visual Feedback:**
- RGB LED (common cathode): $0.50
- 3x 220Ω resistors: $0.10
- Or 3x separate LEDs (Red, Yellow, Green)

**For Display:**
- 16x2 LCD I2C Display: $2-5
- 4 jumper wires

**For Buttons:**
- Push buttons: $0.20 each
- 10kΩ resistors for pull-down

## Power Requirements

### ESP8266
- **Voltage**: 3.3V (5V via USB)
- **Current**: ~80mA normal, 170mA peak
- **Power via**: Micro USB cable

### Arduino Uno + Ethernet Shield
- **Voltage**: 5V
- **Current**: ~200mA (Uno) + ~150mA (Shield) = ~350mA total
- **Power via**: 
  - USB cable (up to 500mA), OR
  - DC barrel jack (7-12V, 1A recommended)
  - Power-over-Ethernet (if shield supports it)

## Wiring Best Practices

1. **Always disconnect power** before wiring
2. **Check polarity** for LEDs and power
3. **Use appropriate resistors** for LEDs (220Ω-1kΩ)
4. **Keep wires short** to reduce noise
5. **Use quality jumper wires** for reliability
6. **Double-check connections** before powering on

## Common Wiring Mistakes

❌ **Reversed LED polarity** → LED won't light up  
✅ Long leg (anode) to positive, short leg to GND

❌ **No resistor on LED** → LED burns out  
✅ Always use current-limiting resistor

❌ **3.3V to 5V pin** → Damage ESP8266  
✅ ESP8266 pins are 3.3V tolerant only

❌ **Loose connections** → Intermittent failures  
✅ Ensure firm connections, consider soldering

## Testing Your Setup

### 1. Basic Power Test
- Upload "Blink" example from Arduino IDE
- LED should blink (built-in LED)
- Confirms board is working

### 2. Network Test (ESP8266)
```cpp
void setup() {
  Serial.begin(115200);
  WiFi.begin("SSID", "PASSWORD");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println(WiFi.localIP());
}
```

### 3. Network Test (Arduino Ethernet)
```cpp
void setup() {
  Serial.begin(9600);
  byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };
  Ethernet.begin(mac);
  Serial.println(Ethernet.localIP());
}
```

## Troubleshooting Hardware

**ESP8266 won't connect to WiFi:**
- Ensure 2.4GHz WiFi (not 5GHz)
- Check SSID and password
- Ensure good signal strength
- Try different power source (some USB ports are weak)

**Ethernet shield not working:**
- Check shield is properly seated
- Verify Ethernet cable is good
- Test cable with another device
- Check router/switch has available port
- Look for link LED on shield (should be lit)

**Upload fails:**
- Select correct board in Arduino IDE
- Select correct port
- Close Serial Monitor during upload
- Press reset button on board if needed
- Try different USB cable

## Safety Notes

⚠️ **Important:**
- Don't exceed voltage ratings (3.3V for ESP8266, 5V for Arduino)
- Use proper power supply (1A minimum recommended)
- Don't short circuit power pins
- Work on non-conductive surface
- Keep liquids away from electronics

## Next Steps

Once your hardware is set up:

1. Test the basic examples
2. Customize for your needs
3. Add visual indicators (LEDs/LCD)
4. Build an enclosure
5. Deploy in your project!

---

**Need help?** Check the main README.md or the Arduino integration guide.
