# 📱 INTERFACE WIREFRAMES — KEY SCREENS

**Project:** Link Safety Authenticator (URly Scanner)  
**Date:** October 19, 2025  
**Course:** COE 221

---

## 🎯 OVERVIEW

This document presents the key user interface screens for the Link Safety Authenticator system. These wireframes demonstrate the complete scanning workflow from URL input to result display, highlighting the core functionality and user experience.

---

## 📋 SCREEN INDEX

1. **Screen 1:** Main Scanning Interface (Input)
2. **Screen 2:** Scanning in Progress
3. **Screen 3:** Safe Result Display (Green)
4. **Screen 4:** Unsafe Result Display (Red)
5. **Screen 5:** Caution Result Display (Yellow)
6. **Screen 6:** Risk Score Calculation Modal (NEW FEATURE)

---

## 🖥️ SCREEN 1: MAIN SCANNING INTERFACE

**Purpose:** Primary entry point where users input URLs for safety scanning

**User Action:** Paste URLs and click "Scan Links" button

```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│                                                                            │
│                        Link Safety Checker                                 │
│                                                                            │
│      Paste one or more links (one per line). We'll check HTTPS, scan      │
│      for suspicious wording, count external links, and record the         │
│      time scanned.                                                         │
│                                                                            │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │                                                                    │    │
│  │                                                                    │    │
│  │                                                                    │    │
│  │                                                                    │    │
│  │                                                                    │    │
│  │                                                    [👁️ Toggle]     │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                      (Multi-line textarea for URL input)                   │
│                                                                            │
│                                                                            │
│                   [ Scan Links ]  [ Restart ]  [ Clear History ]           │
│                                                                            │
│                                                                            │
│                                                                            │
│  Examples: 90-100% Very Safe — 80% Safe but with minor concerns —         │
│           70% and below Proceed with caution / potentially unsafe          │
│                                                                            │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

**Key Elements:**
- **Background:** Dark gradient (navy/blue tones)
- **Title:** "Link Safety Checker" (large, white, centered)
- **Instructions:** Clear white text explaining functionality
- **Textarea:** 
  - Dark gray background (`#2D3748`)
  - Multi-line input (6 rows)
  - Placeholder text (not shown when empty)
  - Toggle button (👁️) in bottom-right corner for show/hide
- **Action Buttons (3 buttons):**
  - **"Scan Links"** - Primary button (blue `#3B82F6`)
  - **"Restart"** - Secondary button (darker)
  - **"Clear History"** - Secondary button (darker)
- **Legend:** Safety score interpretation guide (bottom)

**Color Scheme:**
- Background: Dark gradient (`#1E293B` to `#3B5A9A`)
- Title: `#FFFFFF` (White)
- Instructions: `#CBD5E1` (Light gray)
- Textarea Background: `#2D3748` (Dark gray)
- Textarea Text: `#F9FAFB` (White)
- Textarea Border: `#4B5563` (Medium gray)
- Primary Button: `#3B82F6` (Blue)
- Secondary Buttons: `#475569` (Dark gray)
- Legend Text: `#94A3B8` (Light gray)

**User Flow:**
1. User lands on homepage with dark gradient background
2. Reads instructions about what the scanner checks
3. Pastes URL(s) into textarea (one per line)
4. Can toggle visibility with eye icon
5. Clicks "Scan Links" button
6. System transitions to scanning phase

**Interactive Elements:**
- Textarea expands as user types
- Toggle button shows/hides URL text
- Scan button becomes disabled during scanning
- Restart clears input and results
- Clear History removes scan history

---

## ⏳ SCREEN 2: SCANNING IN PROGRESS

**Purpose:** Provide visual feedback during URL analysis

**User Action:** Wait for scan completion (1-2 seconds)

```
┌────────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│                        Link Safety Checker                                 │
│                                                                            │
│      Paste one or more links (one per line). We'll check HTTPS, scan      │
│      for suspicious wording, count external links, and record the         │
│      time scanned.                                                         │
│                                                                            │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │                                                                    │    │
│  │  https://www.messenger.com/e2ee/t/9489423491106310                │    │
│  │                                                                    │    │
│  │                                                                    │    │
│  │                                                                    │    │
│  │                                                    [👁️ Toggle]     │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                      (Textarea with URL input and visibility toggle)       │
│                                                                            │
│                                                                            │
│                   [ Scan Links ]  [ Restart ]  [ Clear History ]           │
│                                                                            │
│                            Scanning (0/1)...                               │
│                                                                            │
│                                                                            │
│  Examples: 90-100% Very Safe — 80% Safe but with minor concerns —         │
│           70% and below Proceed with caution / potentially unsafe          │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

**Key Elements:**
- **Title:** "Link Safety Checker" (large, centered)
- **Instructions:** Clear guidance text above textarea
- **Textarea:** URL input field with entered link visible
- **Toggle Button:** Eye icon (👁️) for show/hide URL visibility
- **Action Buttons:** "Scan Links" (primary), "Restart", "Clear History"
- **Progress Text:** "Scanning (0/1)..." below buttons
- **Legend:** Safety score interpretation guide at bottom

**Visual States:**
- **Before Scan:** Buttons enabled, textarea editable
- **During Scan:** "Scanning (0/1)..." text appears, buttons disabled
- **Progress Counter:** Shows current/total URLs being scanned

**Color Scheme:**
- Background: Dark gradient (navy to blue)
- Textarea: `#2D3748` (Dark gray)
- Buttons: `#3B82F6` (Blue) for primary action
- Text: `#F9FAFB` (White/light gray)
- Progress Text: `#60A5FA` (Light blue)

**Technical Details:**
- Duration: 500ms - 2000ms per URL
- Counter updates: (0/1) → (1/1) → Results shown
- Smooth transition to results screen

---

## 🟢 SCREEN 3: SAFE RESULT DISPLAY

**Purpose:** Show successful scan with no security threats detected

**Status:** SAFE (Green theme)

```
┌────────────────────────────────────────────────────────────────────────────┐
│  GSB: SAFE                                                                 │
│                                                                            │
│  ┌─────────────────┐  ┌──────────────────────┐  ┌────────────────────┐   │
│  │ � SCORE        │  │  🔵 SCAN RESULT     │  │  💡 RECOMMENDATIONS│   │
│  │  BREAKDOWN      │  │                      │  │                    │   │
│  ├─────────────────┤  ├──────────────────────┤  ├────────────────────┤   │
│  │                 │  │                      │  │                    │   │
│  │ 🟢 Heuristic    │  │      ┌─────────┐    │  │ ✅ This site       │   │
│  │    Analysis     │  │      │         │    │  │    appears         │   │
│  │    0 points     │  │      │  100%   │    │  │    legitimate      │   │
│  │   Flags: 0 ✓    │  │      │         │    │  │    and safe        │   │
│  │                 │  │      └─────────┘    │  │                    │   │
│  │ 🟢 Google Safe  │  │                      │  │ ✅ All security    │   │
│  │    Browsing     │  │       Safe           │  │    checks passed   │   │
│  │    0 points     │  │                      │  │    successfully    │   │
│  │   Status: safe  │  │  100% — Safe. All    │  │                    │   │
│  │                 │  │  security checks     │  │ ✅ No suspicious   │   │
│  │ 🟢 Blocklist    │  │  passed.             │  │    patterns        │   │
│  │    0 points     │  │  No deep scan        │  │    detected        │   │
│  │   No match      │  │  No misspellings     │  │                    │   │
│  │                 │  │                      │  │ Technical Details: │   │
│  │ 🟢 DNS Lookup   │  │  PROTOCOL:   HTTPS ✓ │  │                    │   │
│  │    0 points     │  │  CATEGORY:   Search  │  │ 🔒 Valid SSL       │   │
│  │   Resolved      │  │                      │  │    certificate     │   │
│  │                 │  │  EXTERNAL LINKS: 0   │  │                    │   │
│  │                 │  │                      │  │ 🛡️ TLS 1.3         │   │
│  │                 │  │  RISK SCORE:         │  │    encryption      │   │
│  │                 │  │   0 (SAFE) ✓         │  │                    │   │
│  │                 │  │                      │  │ ✓ Certificate      │   │
│  │                 │  │  SCANNED AT:         │  │   expires in       │   │
│  │                 │  │   10/19/2025,        │  │   62 days          │   │
│  │                 │  │   10:25 AM           │  │                    │   │
│  │                 │  │                      │  │ ✓ Issued by        │   │
│  │                 │  │  NOTES:              │  │   Google Trust     │   │
│  │                 │  │   No deep scan       │  │   Services         │   │
│  │                 │  │   No misspellings    │  │                    │   │
│  │                 │  │                      │  │                    │   │
│  │                 │  │  REPUTATION:         │  │                    │   │
│  │                 │  │   No blocklist       │  │                    │   │
│  │                 │  │   match, GSB safe    │  │                    │   │
│  └─────────────────┘  └──────────────────────┘  └────────────────────┘   │
└────────────────────────────────────────────────────────────────────────────┘
```

**Key Elements:**
- **3-Column Layout:** Score Breakdown (green) | Scan Result (dark) | Recommendations (blue)
- **Score Breakdown Panel:** All checks show 0 points with green checkmarks
- **Scan Result Panel:** Large 100% circle (green), "Safe" status, detailed info
- **Recommendations Panel:** All positive (✅), SSL/TLS details
- **Status Badge:** "GSB: SAFE" at top

**Color Scheme (Light Mode):**
- Score Breakdown Border: `#10B981` (Green)
- Scan Result Background: `#1E293B` (Dark navy)
- Recommendations Border: `#3B82F6` (Blue)
- Risk Circle: `#10B981` (Green for safe)
- Text: `#F9FAFB` (White on dark panels)

---

## 🔴 SCREEN 4: UNSAFE RESULT DISPLAY

**Purpose:** Show critical security threats detected

**Status:** UNSAFE (Red theme)

```
┌────────────────────────────────────────────────────────────────────────────┐
│  GSB: UNSAFE (DERIVED)                                                     │
│                                                                            │
│  ┌─────────────────┐  ┌──────────────────────┐  ┌────────────────────┐   │
│  │ 📊 SCORE        │  │  🔵 SCAN RESULT     │  │  � RECOMMENDATIONS│   │
│  │  BREAKDOWN      │  │                      │  │                    │   │
│  ├─────────────────┤  ├──────────────────────┤  ├────────────────────┤   │
│  │                 │  │                      │  │                    │   │
│  │ 🔴 Heuristic    │  │      ┌─────────┐    │  │ ⚠️ Exercise        │   │
│  │    Analysis     │  │      │         │    │  │    caution when    │   │
│  │   50 points     │  │      │   10%   │    │  │    visiting this   │   │
│  │   Flags: 1 🔴   │  │      │         │    │  │    site.           │   │
│  │                 │  │      └─────────┘    │  │                    │   │
│  │ 🔵 Google Safe  │  │                      │  │ ⚠️ Multiple risk   │   │
│  │    Browsing     │  │    Very Unsafe       │  │    indicators      │   │
│  │   100 points    │  │                      │  │    detected.       │   │
│  │   Status: safe  │  │  10% — Extremely     │  │                    │   │
│  │                 │  │  Unsafe. Multiple    │  │ 🔒 Site uses HTTP  │   │
│  │ ⬛ Blocklist    │  │  severe indicators.  │  │    - data not      │   │
│  │   100 points    │  │  Key signals: No     │  │    encrypted       │   │
│  │   No match      │  │  misspellings, few   │  │                    │   │
│  │                 │  │  external links      │  │ Suggested Actions: │   │
│  │ 🌐 DNS Lookup   │  │                      │  │                    │   │
│  │   100 points    │  │  PROTOCOL:    HTTP   │  │ • Avoid entering   │   │
│  │   Resolved      │  │  CATEGORY:  General  │  │   personal info    │   │
│  │                 │  │                      │  │                    │   │
│  │                 │  │  EXTERNAL LINKS: 1🔴│  │ • Verify site      │   │
│  │                 │  │                      │  │   legitimacy       │   │
│  │                 │  │  RISK SCORE:         │  │                    │   │
│  │                 │  │   100 (UNSAFE) 🔴    │  │ • Check for HTTPS  │   │
│  │                 │  │                      │  │   before entering  │   │
│  │                 │  │  SCANNED AT:         │  │   sensitive data   │   │
│  │                 │  │   10/18/2025,        │  │                    │   │
│  │                 │  │   5:32:01 PM         │  │ • Look for trust   │   │
│  │                 │  │                      │  │   indicators       │   │
│  │                 │  │  NOTES:              │  │                    │   │
│  │                 │  │   No misspellings,   │  │ Technical Context: │   │
│  │                 │  │   few external links │  │                    │   │
│  │                 │  │                      │  │ 🔒 No HTTPS        │   │
│  │                 │  │  REPUTATION:         │  │    encryption -    │   │
│  │                 │  │   no blocklist       │  │    data sent in    │   │
│  │                 │  │   match, GSB         │  │    plain text      │   │
│  │                 │  │   unsafe (derived)   │  │                    │   │
│  └─────────────────┘  └──────────────────────┘  └────────────────────┘   │
└────────────────────────────────────────────────────────────────────────────┘
```

**Key Elements:**
- **3-Column Layout:** Score Breakdown (green) | Scan Result (dark) | Recommendations (blue)
- **Score Breakdown Panel:** Individual scores for Heuristics, GSB, Blocklist, DNS
- **Scan Result Panel:** Large percentage circle (10%), detailed metrics, protocol info
- **Recommendations Panel:** Warning icons, suggested actions, technical context
- **Status Badge:** "GSB: UNSAFE (DERIVED)" at top

**Color Scheme:**
- Score Breakdown Panel: `#10B981` (Green border)
- Scan Result Panel: `#1E293B` (Dark navy background)
- Recommendations Panel: `#3B82F6` (Blue border)
- Risk Circle: `#EF4444` (Red for unsafe)
- Text: White on dark, Dark gray on light

---

## 🟡 SCREEN 5: CAUTION RESULT DISPLAY

**Purpose:** Show moderate security concerns requiring user awareness

**Status:** CAUTION (Yellow/Orange theme)

```
┌────────────────────────────────────────────────────────────────────────────┐
│  GSB: CAUTION (MIXED INDICATORS)                                           │
│                                                                            │
│  ┌─────────────────┐  ┌──────────────────────┐  ┌────────────────────┐   │
│  │ 📊 SCORE        │  │  🔵 SCAN RESULT     │  │  💡 RECOMMENDATIONS│   │
│  │  BREAKDOWN      │  │                      │  │                    │   │
│  ├─────────────────┤  ├──────────────────────┤  ├────────────────────┤   │
│  │                 │  │                      │  │                    │   │
│  │ 🟡 Heuristic    │  │      ┌─────────┐    │  │ ⚠️ Exercise        │   │
│  │    Analysis     │  │      │         │    │  │    caution - some  │   │
│  │   15 points     │  │      │   45%   │    │  │    concerns        │   │
│  │   Flags: 1 ⚠️   │  │      │         │    │  │    detected        │   │
│  │                 │  │      └─────────┘    │  │                    │   │
│  │ 🟢 Google Safe  │  │                      │  │ ⚠️ Uses a less     │   │
│  │    Browsing     │  │     Not Safe         │  │    common TLD      │   │
│  │    0 points     │  │                      │  │    (.xyz) - extra  │   │
│  │   Status: safe  │  │  45% — Not Safe.     │  │    vigilance       │   │
│  │                 │  │  Significant red     │  │                    │   │
│  │ 🟢 Blocklist    │  │  flags detected      │  │ ✓  Valid SSL       │   │
│  │    0 points     │  │  (Suspicious TLD,    │  │    certificate     │   │
│  │   No match      │  │  many external       │  │    found           │   │
│  │                 │  │  links)              │  │                    │   │
│  │ 🟢 DNS Lookup   │  │                      │  │ Suggested Actions: │   │
│  │    0 points     │  │  PROTOCOL:   HTTPS ✓ │  │                    │   │
│  │   Resolved      │  │  CATEGORY:   General │  │ • Verify source    │   │
│  │                 │  │                      │  │   before entering  │   │
│  │                 │  │  EXTERNAL LINKS: 25  │  │   personal info    │   │
│  │                 │  │                      │  │                    │   │
│  │                 │  │  RISK SCORE:         │  │ • Check for trust  │   │
│  │                 │  │   55 (CAUTION) ⚠️    │  │   indicators       │   │
│  │                 │  │                      │  │                    │   │
│  │                 │  │  SCANNED AT:         │  │ • Be cautious with │   │
│  │                 │  │   10/19/2025,        │  │   .xyz domains     │   │
│  │                 │  │   2:15 PM            │  │                    │   │
│  │                 │  │                      │  │ Technical Context: │   │
│  │                 │  │  NOTES:              │  │                    │   │
│  │                 │  │   Suspicious TLD,    │  │ ⬛ TLD Risk: .xyz  │   │
│  │                 │  │   many external      │  │    commonly used   │   │
│  │                 │  │   links detected     │  │    in phishing/    │   │
│  │                 │  │                      │  │    scam sites      │   │
│  │                 │  │  REPUTATION:         │  │                    │   │
│  │                 │  │   No blocklist       │  │ 🔒 SSL valid but   │   │
│  │                 │  │   match, GSB safe    │  │    verify content  │   │
│  └─────────────────┘  └──────────────────────┘  └────────────────────┘   │
└────────────────────────────────────────────────────────────────────────────┘
```

**Key Elements:**
- **3-Column Layout:** Score Breakdown (green/yellow) | Scan Result (dark) | Recommendations (blue)
- **Score Breakdown Panel:** Mixed scores - Heuristics flagged (15 pts), others safe
- **Scan Result Panel:** 45% circle (yellow/orange), mixed verdict
- **Recommendations Panel:** Warning icons (⚠️), caution messages, context about TLD
- **Status Badge:** "GSB: CAUTION (MIXED INDICATORS)" at top

**Color Scheme:**
- Score Breakdown Border: `#F59E0B` (Orange/Yellow for mixed)
- Scan Result Background: `#1E293B` (Dark navy)
- Recommendations Border: `#3B82F6` (Blue)
- Risk Circle: `#F59E0B` (Orange for caution)
- Warning Background: `#FEF3C7` (Light yellow)

---

## 🔍 SCREEN 6: RISK SCORE CALCULATION MODAL

**Purpose:** Detailed breakdown of risk score calculation (NEW FEATURE)

**Trigger:** Click on "Risk Score" box in any result screen

```
┌────────────────────────────────────────────────────────────────────────────┐
│  ╔══════════════════════════════════════════════════════════════════════╗  │
│  ║  RISK SCORE CALCULATION                                        [X]  ║  │
│  ╠══════════════════════════════════════════════════════════════════════╣  │
│  ║                                                                      ║  │
│  ║  URL: https://instagram.com                                          ║  │
│  ║  Final Risk Score: 67 (High Risk) | Safety: 33%                      ║  │
│  ║                                                                      ║  │
│  ║  ┌────────────────────────────────────────────────────────────────┐  ║  │
│  ║  │  📍 STEP 1: URL Pattern Analysis (Heuristics)                 │  ║  │
│  ║  ├────────────────────────────────────────────────────────────────┤  ║  │
│  ║  │  Analyzing URL for suspicious patterns...                     │  ║  │
│  ║  │                                                                │  ║  │
│  ║  │  ⚠️ Suspicious TLD                                             │  ║  │
│  ║  │     Points: +15                                                │  ║  │
│  ║  │     Impact: Moderate risk                                      │  ║  │
│  ║  │                                                                │  ║  │
│  ║  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │  ║  │
│  ║  │  Total Heuristic Score: 15 points | Flags Detected: 1         │  ║  │
│  ║  └────────────────────────────────────────────────────────────────┘  ║  │
│  ║                                                                      ║  │
│  ║  ┌────────────────────────────────────────────────────────────────┐  ║  │
│  ║  │  📍 STEP 2: Base Safety Calculation                           │  ║  │
│  ║  ├────────────────────────────────────────────────────────────────┤  ║  │
│  ║  │  Formula: Base Safety = 100% - Heuristic Score                │  ║  │
│  ║  │  Calculation: 100% - 15 points = 85%                           │  ║  │
│  ║  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │  ║  │
│  ║  │  Base Safety Score: 85%                                        │  ║  │
│  ║  └────────────────────────────────────────────────────────────────┘  ║  │
│  ║                                                                      ║  │
│  ║  ┌────────────────────────────────────────────────────────────────┐  ║  │
│  ║  │  📍 STEP 3: Apply ALL Penalties & Adjustments    [EXPANDED]  │  ║  │
│  ║  ├────────────────────────────────────────────────────────────────┤  ║  │
│  ║  │  🎬 STARTING POINT: 85% Safety Score                           │  ║  │
│  ║  │                                                                │  ║  │
│  ║  │  ⚡ PENALTIES APPLIED:                                         │  ║  │
│  ║  │                                                                │  ║  │
│  ║  │  ┌──────────────────────────────────────────────────────────┐  │  ║  │
│  ║  │  │ ⚠️ 1. Many External Links                    -12.0%     │  │  ║  │
│  ║  │  │    30 external links detected (> 20 threshold)           │  │  ║  │
│  ║  │  │    Calculation: 85% - 12% = 73%                          │  │  ║  │
│  ║  │  └──────────────────────────────────────────────────────────┘  │  ║  │
│  ║  │                                                                │  ║  │
│  ║  │  ┌──────────────────────────────────────────────────────────┐  │  ║  │
│  ║  │  │ ⚠️ 2. Misspellings Detected                  -10.0%     │  │  ║  │
│  ║  │  │    3 common brand misspellings found                     │  │  ║  │
│  ║  │  │    Calculation: 73% - 10% = 63%                          │  │  ║  │
│  ║  │  └──────────────────────────────────────────────────────────┘  │  ║  │
│  ║  │                                                                │  ║  │
│  ║  │  ┌──────────────────────────────────────────────────────────┐  │  ║  │
│  ║  │  │ ⚠️ 3. Additional Adjustments                 -30.0%     │  │  ║  │
│  ║  │  │    Other risk factors detected                           │  │  ║  │
│  ║  │  │    Calculation: 63% - 30% = 33%                          │  │  ║  │
│  ║  │  └──────────────────────────────────────────────────────────┘  │  ║  │
│  ║  │                                                                │  ║  │
│  ║  │  📊 COMPLETE CALCULATION:                                      │  ║  │
│  ║  │  Start:           85%                                          │  ║  │
│  ║  │  -12% External Links      → 73%                                │  ║  │
│  ║  │  -10% Misspellings        → 63%                                │  ║  │
│  ║  │  -30% Adjustments         → 33%                                │  ║  │
│  ║  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │  ║  │
│  ║  │  FINAL SAFETY: 33%                                             │  ║  │
│  ║  └────────────────────────────────────────────────────────────────┘  ║  │
│  ║                                                                      ║  │
│  ║  ┌────────────────────────────────────────────────────────────────┐  ║  │
│  ║  │  📍 STEP 4: Final Risk Calculation                            │  ║  │
│  ║  ├────────────────────────────────────────────────────────────────┤  ║  │
│  ║  │  Formula: Risk Score = 100 - Final Safety                     │  ║  │
│  ║  │  Calculation: 100 - 33% = 67                                   │  ║  │
│  ║  │  Risk Level: HIGH RISK (50-75 range)                          │  ║  │
│  ║  │  Status: ⚠️ CAUTION                                            │  ║  │
│  ║  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │  ║  │
│  ║  │  Final Risk Score: 67                                          │  ║  │
│  ║  └────────────────────────────────────────────────────────────────┘  ║  │
│  ║                                                                      ║  │
│  ║                          [ Close ]                                   ║  │
│  ╚══════════════════════════════════════════════════════════════════════╝  │
└────────────────────────────────────────────────────────────────────────────┘
```

**Key Features (NEW ENHANCEMENT):**

**Step 1:** Heuristic flags with point values  
**Step 2:** Base safety calculation formula  
**Step 3:** DETAILED penalty breakdown with individual formulas  
**Step 4:** Final risk conversion

**Innovation Highlights:**
- ✅ Complete transparency in calculation
- ✅ Each penalty shown individually
- ✅ Progressive calculation (85% → 73% → 63% → 33%)
- ✅ Educational value for users

---

## 📐 DESIGN SPECIFICATIONS

### **Color Palette:**

**Light Mode:**
- Background: `#FFFFFF` (White)
- Text Primary: `#1F2937` (Dark Gray)
- Safe/Green: `#10B981` (Emerald)
- Caution/Yellow: `#F59E0B` (Amber)
- Unsafe/Red: `#EF4444` (Red)
- Accent/Blue: `#3B82F6` (Blue)

**Dark Mode:**
- Background: `#111827` (Dark Blue-Gray)
- Text Primary: `#F9FAFB` (Off-White)
- Safe/Green: `#34D399` (Bright Emerald)
- Caution/Yellow: `#FBBF24` (Bright Amber)
- Unsafe/Red: `#F87171` (Bright Red)

### **Typography:**
- Main Title: 36px, Bold
- Section Headings: 24px, Semibold
- Body Text: 16px, Regular
- Formulas: 14px, Monospace

### **Layout:**
- Container Max Width: 1200px
- Card Padding: 20px
- Border Radius: 12px (cards), 8px (buttons)

---

## 🎯 USER FLOW SUMMARY

```
┌─────────────────┐
│  1. Home Page   │  User inputs URLs
│   (Screen 1)    │
└────────┬────────┘
         │ Clicks "Scan Links"
         ↓
┌─────────────────┐
│  2. Scanning    │  Progress feedback
│   (Screen 2)    │
└────────┬────────┘
         │ Scan completes
         ↓
┌─────────────────┐
│  3. Results     │  Color-coded cards:
│ (Screens 3,4,5) │  Green/Red/Yellow
└────────┬────────┘
         │ Clicks "Risk Score"
         ↓
┌─────────────────┐
│  4. Detail      │  4-step calculation
│   (Screen 6)    │  with formulas
└─────────────────┘
```

---

## ✅ SCREEN SUMMARY TABLE

| Screen | Status | Color | Purpose |
|--------|--------|-------|---------|
| 1 | Input | Blue | URL entry |
| 2 | Processing | Blue | Progress |
| 3 | Safe | Green | No threats |
| 4 | Unsafe | Red | Danger |
| 5 | Caution | Yellow | Moderate risk |
| 6 | Details | Purple | Calculation |

---

## 📄 DOCUMENT INFORMATION

**Team:**
- Jester Penaloza (Project Leader / Backend Developer)
- Ryzen Magpayo (Frontend Developer / UI Designer)
- Carl Jazhly Bartolome (Database Manager / System Tester)
- Kean Raven Indon (Research & Documentation Lead)
- Jancel Concepcion (Deployment & QA Officer)

**Course:** COE 221  
**Date:** October 19, 2025

---

**END OF WIREFRAME DOCUMENTATION**
