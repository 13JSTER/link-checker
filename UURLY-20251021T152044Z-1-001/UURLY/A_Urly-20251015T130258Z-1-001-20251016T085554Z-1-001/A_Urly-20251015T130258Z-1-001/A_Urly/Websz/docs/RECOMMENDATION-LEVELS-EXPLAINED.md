# 📊 URly Warning System - Recommendation Levels

## Overview
The URly Warning System provides **3 distinct recommendation levels** based on the safety score (0-100%) of each scanned URL.

---

## 🎯 The 3 Status Levels

### **1. 🟢 SAFE** (86-100% Safety Score)

**When this appears:**
- Safety Score: 86% or higher
- Status: `safe`
- Badge Color: Green with radiating glow

**What it means:**
- URL passed most/all security checks
- Low risk detected
- Generally safe to visit

**Typical Recommendations:**

#### **For "Very Safe" (90-100%):**
```
✅ This site appears legitimate and safe to visit.
✅ All security checks passed successfully.
✅ HTTPS encryption is active and valid.
✅ No suspicious patterns detected.
```

#### **For "Safe" (86-89%):**
```
✓ This site appears safe with minor concerns.
✓ No major threats detected, but stay vigilant.
⚠️ Uses a less common TLD - use extra caution (if applicable)
⚠️ Domain registered recently - verify legitimacy (if applicable)
⚠️ Site uses HTTP - data not encrypted (if HTTP)
```

**Example URLs:**
- `https://google.com` → 100% Safe
- `https://github.com` → 98% Safe
- `https://wikipedia.org` → 95% Safe
- `http://example.com` → 88% Safe (HTTP penalty)

---

### **2. 🟡 CAUTION** (71-85% Safety Score)

**When this appears:**
- Safety Score: 71-85%
- Status: `caution`
- Badge Color: Orange/Yellow with radiating glow

**What it means:**
- Multiple minor risk indicators detected
- Some suspicious patterns found
- Proceed with awareness and verification

**Typical Recommendations:**

```
⚠️ Exercise caution when visiting this site.
⚠️ Multiple risk indicators detected.
🔍 Site uses HTTP - data not encrypted
🔍 Contains suspicious keywords (if detected)
🔍 Using IP address instead of domain name (if applicable)
🔍 URL shortener detected - final destination unknown (if applicable)
```

**Recommended Actions:**
- ✓ Verify site legitimacy before proceeding
- ✓ Check for HTTPS before entering sensitive data
- ✓ Look for trust indicators (reviews, contact info)
- ✓ Avoid entering personal information

**Example URLs:**
- `http://suspicious-keyword-login.com` → 75% Caution
- `http://192.168.1.1` → 72% Caution (IP address)
- `https://bit.ly/abc123` → 78% Caution (URL shortener)
- `http://verify-account-now.xyz` → 80% Caution (keywords + TLD)

---

### **3. 🔴 UNSAFE** (0-70% Safety Score)

**When this appears:**
- Safety Score: 70% or lower
- Status: `unsafe`
- Badge Color: Red with radiating glow

**What it means:**
- Significant security threats detected
- High risk of phishing, malware, or scam
- **DO NOT VISIT** or enter any information

**Typical Recommendations:**

#### **For "Unsafe" (30-70%):**
```
⛔ This site shows signs of being unsafe.
⛔ Multiple security threats detected.
🚨 Google Safe Browsing flagged as: [threat type] (if flagged)
🚨 Found in phishing/malware blocklist (if listed)
🚨 Contains [X] phishing indicators
🚨 URL structure matches known scam patterns
```

**Recommended Actions:**
- ❌ DO NOT enter passwords or credit card information
- ❌ DO NOT download files from this site
- ✓ Verify the correct URL if you intended to visit a legitimate service
- ✓ Report this site if it's impersonating a known brand

#### **For "Very Unsafe" (0-29%):**
```
🚫 DANGER: This site is very likely malicious!
🚫 DO NOT VISIT this site.
⛔ Confirmed threat by Google Safe Browsing (if flagged)
⛔ Listed in multiple security blocklists
⛔ Failed all security validations
```

**Critical Actions:**
- 🚨 IMMEDIATELY close this page if already opened
- ❌ DO NOT enter any information whatsoever
- ❌ DO NOT download or run any files
- ✓ Report to: abuse@registrar.com or phishing services
- ✓ If you received this link via email/SMS, mark as spam
- ✓ Warn others who may have received the same link

**Example URLs:**
- `http://paypa1-secure-verify.tk` → 35% Unsafe (typosquatting + TLD + keywords)
- `http://free-iphone-giveaway-claim.ml` → 25% Unsafe (scam pattern)
- `http://192.168.1.100/malware.exe` → 15% Unsafe (IP + suspicious path)
- Blocklisted phishing domains → 5-20% Unsafe

---

## 📊 Score Breakdown & Factors

### **How Safety Score is Calculated:**

```javascript
Base Score: 100%

Then SUBTRACT points for:
- HTTP instead of HTTPS: -100 points
- IP address in URL: -30 points
- Suspicious TLD (.tk, .ml, .xyz): -10 points
- Phishing keywords: -10 points per keyword
- URL shortener: -6 points
- Many subdomains: -10 points
- Long hostname: -8 points
- Special characters: -6-8 points
- Typosquatting: -14 points
- Google Safe Browsing threat: -80 points (major penalty)
- Blocklist match: -75 points (major penalty)

Final Safety Score = 100 - (total penalties)
```

### **Status Assignment:**

```javascript
if (safetyScore >= 86) {
  status = 'safe';        // 🟢 Green badge
  color = '#10b981';
}
else if (safetyScore >= 71) {
  status = 'caution';     // 🟡 Orange badge
  color = '#f59e0b';
}
else {
  status = 'unsafe';      // 🔴 Red badge
  color = '#ef4444';
}
```

---

## 🎨 Visual Representation

```
┌────────────────────────────────────────────────────────────┐
│                  SAFETY SCORE SCALE                        │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  0%    10%   20%   30%   40%   50%   60%   70%   85%  100%│
│  ├─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤ │
│  🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴│🟡🟡🟡│🟢🟢🟢🟢🟢│ │
│                                                            │
│  └──────── UNSAFE ────────┘│ CAUTION │  SAFE ──┘          │
│                            │         │                    │
│  Very Dangerous            │  Medium │  Generally Safe    │
│  DO NOT VISIT              │  Risk   │  Proceed Normally  │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## 🧪 Real Examples from Your System

### **Example 1: Google.com (SAFE)**
```json
{
  "url": "https://google.com",
  "safetyScore": 100,
  "status": "safe",
  "recommendations": {
    "rating": "Very Safe",
    "messages": [
      "✅ This site appears legitimate and safe to visit.",
      "✅ All security checks passed successfully.",
      "✅ HTTPS encryption is active and valid.",
      "✅ No suspicious patterns detected."
    ]
  }
}
```

### **Example 2: HTTP Site (CAUTION)**
```json
{
  "url": "http://example.com",
  "safetyScore": 80,
  "status": "caution",
  "recommendations": {
    "rating": "Use Caution",
    "messages": [
      "⚠️ Exercise caution when visiting this site.",
      "⚠️ Multiple risk indicators detected.",
      "🔍 Site uses HTTP - data not encrypted"
    ],
    "actions": [
      "Verify site legitimacy before proceeding",
      "Check for HTTPS before entering sensitive data",
      "Look for trust indicators (reviews, contact info)"
    ]
  }
}
```

### **Example 3: Suspicious URL (UNSAFE)**
```json
{
  "url": "http://paypa1-verify-account.tk",
  "safetyScore": 35,
  "status": "unsafe",
  "recommendations": {
    "rating": "Unsafe",
    "messages": [
      "⛔ This site shows signs of being unsafe.",
      "⛔ Multiple security threats detected.",
      "🚨 Contains phishing indicators",
      "🚨 URL structure matches known scam patterns"
    ],
    "actions": [
      "DO NOT enter passwords or credit card information",
      "DO NOT download files from this site",
      "Verify the correct URL if you intended to visit a legitimate service",
      "Report this site if it's impersonating a known brand"
    ]
  }
}
```

---

## 📋 Quick Reference Table

| Status | Score Range | Badge Color | Meaning | Action |
|--------|-------------|-------------|---------|--------|
| **SAFE** | 86-100% | 🟢 Green | Low risk, minimal concerns | Proceed normally |
| **CAUTION** | 71-85% | 🟡 Orange | Medium risk, some red flags | Verify before proceeding |
| **UNSAFE** | 0-70% | 🔴 Red | High risk, significant threats | **DO NOT VISIT** |

---

## 🔍 How to Interpret Results

### **If you see SAFE (Green):**
✅ You can generally trust this link
✅ Still read any specific warnings (e.g., "HTTP" or "new domain")
✅ Use common sense - even safe sites can have malicious content

### **If you see CAUTION (Orange):**
⚠️ Don't ignore this warning
⚠️ Double-check the URL carefully
⚠️ Don't enter sensitive information without verification
⚠️ Look for additional trust signals (reviews, official sources)

### **If you see UNSAFE (Red):**
🚫 **STOP!** Do not click or visit
🚫 Close the page immediately if already open
🚫 Do not enter ANY information
🚫 Report the link if received via email/SMS
🚫 Warn others who may have received the same link

---

## 🎯 Key Differences Between Levels

### **Messages Tone:**
- **SAFE**: Positive, reassuring (✅ checkmarks)
- **CAUTION**: Warning, advisory (⚠️ warning signs)
- **UNSAFE**: Urgent, prohibitive (⛔ stop signs, 🚨 alarms)

### **Action Items:**
- **SAFE**: No actions needed, proceed normally
- **CAUTION**: Verification steps, cautious proceeding
- **UNSAFE**: **DO NOT** commands, immediate cessation, reporting

### **Language Strength:**
- **SAFE**: "appears", "generally", "safe"
- **CAUTION**: "exercise caution", "verify", "avoid"
- **UNSAFE**: "DANGER", "DO NOT", "IMMEDIATELY", "NEVER"

---

## ✅ Summary

Your URly Warning System uses **3 clear, distinct recommendation levels**:

1. **🟢 SAFE (86-100%)** - Proceed with confidence
2. **🟡 CAUTION (71-85%)** - Verify before proceeding
3. **🔴 UNSAFE (0-70%)** - **DO NOT VISIT**

Each level has:
- ✓ Different safety score thresholds
- ✓ Unique badge colors and animations
- ✓ Specific warning messages and recommendations
- ✓ Tailored action items based on risk level

**The recommendations are NOT the same** - they escalate in severity from informational (SAFE) to advisory (CAUTION) to prohibitive (UNSAFE).

---

**System:** URly Warning System v1.0  
**Date:** October 15, 2025  
**Status Levels:** 3 (Safe, Caution, Unsafe)  
**Score Range:** 0-100%
