# 🔍 Why GSB (Google Safe Browsing) Sometimes Doesn't Show

## 📋 **Quick Answer**

Google Safe Browsing (GSB) results may not show for certain URLs due to **3 main reasons**:

1. **DNS Failure** - If the domain can't be resolved, GSB check is skipped
2. **Early Exit (Fast Mode)** - High-risk URLs exit before GSB check
3. **API Errors** - GSB API timeout or rate limiting

---

## 🔬 **Detailed Explanation**

### **Reason 1: DNS Resolution Failure** ❌

**What happens:**
When a URL's domain cannot be resolved (DNS lookup fails), the scanner returns **immediately** without checking Google Safe Browsing.

**Code Location:** `scan-server.js` Line 428-438

```javascript
// Fast fail for unreachable hosts
if (!dnsInfo.ok) {
  return res.json({
    inputUrl: url,
    availability: "fail",
    dns: dnsInfo,
    http: httpInfo,
    tls: tlsInfo,
    heuristics: null,
    blocklist,
    gsb: null,  // ← GSB is NULL here!
    verdict: { availability: "fail", risk: "high", notes: "DNS unreachable." }
  });
}
```

**When this happens:**
- ❌ Invalid domains (e.g., `https://doesnotexist123456.com`)
- ❌ Typo domains (e.g., `https://gooogle.com`)
- ❌ Expired domains
- ❌ Domains with no DNS records
- ❌ Temporarily unreachable domains

**Result in Response:**
```json
{
  "gsb": null,  // ← Not checked
  "dns": {
    "ok": false,
    "error": "ENOTFOUND"
  },
  "verdict": {
    "availability": "fail",
    "risk": "high"
  }
}
```

---

### **Reason 2: Early Exit in Fast Mode** ⚡

**What happens:**
If the scanner detects a **very high-risk URL** based on heuristics or blocklist match, it exits early without checking GSB (for speed).

**Code Location:** `scan-server.js` Line 401-420

```javascript
// Early exit if high confidence
if (FAST_MODE && riskEarly === "high") {
  return res.json({
    inputUrl: url,
    availability: "unknown",
    http: null,
    dns: null,
    tls: null,
    heuristics: heuristicFast,
    blocklist,
    gsb: { enabled: !!getGSBKey(), verdict: "unknown" },  // ← Verdict is "unknown"
    verdict: { availability: "unknown", risk: riskEarly, notes: "fast result (early exit)" }
  });
}
```

**When this happens:**
- ✅ URL matches offline blocklist
- ✅ Heuristic score > 35 (very suspicious)
- ✅ Known phishing patterns detected

**Result in Response:**
```json
{
  "gsb": {
    "enabled": true,
    "verdict": "unknown"  // ← Not checked due to early exit
  },
  "heuristics": {
    "score": 50,
    "risk": "high"
  },
  "verdict": {
    "risk": "high",
    "notes": "fast result (early exit)"
  }
}
```

---

### **Reason 3: GSB API Errors** 🔴

**What happens:**
If the Google Safe Browsing API fails (timeout, rate limit, invalid key), GSB returns an error verdict.

**Code Location:** `scan-server.js` Line 110-143

```javascript
async function checkGSB(url) {
  const key = getGSBKey();
  if (!key) return { enabled: false, verdict: "unknown" };
  
  try {
    const r = await fetch(`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(2500)  // ← 2.5 second timeout
    });
    
    if (!r.ok) {
      return { enabled: true, verdict: "error", status: r.status };
    }
    // ... process response
  } catch (e) {
    return { enabled: true, verdict: "error", error: e.message };
  }
}
```

**When this happens:**
- ⏱️ API timeout (> 2.5 seconds)
- 🔑 Invalid API key
- 🚫 Rate limit exceeded (too many requests)
- 🌐 Network connectivity issues
- ⚠️ Google API service disruption

**Result in Response:**
```json
{
  "gsb": {
    "enabled": true,
    "verdict": "error",  // ← Error instead of safe/unsafe
    "error": "timeout"
  }
}
```

---

## 📊 **GSB Status Summary Table**

| Scenario | GSB Enabled | GSB Verdict | GSB Object | Reason |
|----------|-------------|-------------|------------|--------|
| Normal scan (safe URL) | ✅ true | `"safe"` | Full object | ✅ Everything works |
| Normal scan (unsafe URL) | ✅ true | `"unsafe"` | Full object | ✅ Everything works |
| DNS failure | N/A | N/A | `null` | ❌ DNS failed, early return |
| Early exit (high risk) | ✅ true | `"unknown"` | Partial object | ⚡ Fast mode, skipped |
| No API key | ❌ false | `"unknown"` | Partial object | 🔑 API key missing |
| API timeout | ✅ true | `"error"` | Error object | ⏱️ GSB API timeout |
| API rate limit | ✅ true | `"error"` | Error object | 🚫 Too many requests |
| Cached result | ✅ true | `"safe"` or `"unsafe"` | Full object | 💾 From cache (24h) |

---

## 🔍 **How to Identify Why GSB is Missing**

### **Check 1: Is `gsb` null?**
```json
{
  "gsb": null
}
```
**→ Cause**: DNS resolution failed  
**→ Check**: `dns.ok` should be `false`  
**→ Fix**: URL is unreachable or invalid

### **Check 2: Is `gsb.verdict` "unknown"?**
```json
{
  "gsb": {
    "enabled": true,
    "verdict": "unknown"
  }
}
```
**→ Cause**: Early exit (fast mode) or no API key  
**→ Check**: Look for `"notes": "fast result (early exit)"` in verdict  
**→ Fix**: Disable `FAST_MODE` or check `heuristics.score`

### **Check 3: Is `gsb.verdict` "error"?**
```json
{
  "gsb": {
    "enabled": true,
    "verdict": "error",
    "error": "timeout"
  }
}
```
**→ Cause**: GSB API failed  
**→ Check**: `gsb.error` for error message  
**→ Fix**: Check network, API key, rate limits

### **Check 4: Is `gsb.enabled` false?**
```json
{
  "gsb": {
    "enabled": false,
    "verdict": "unknown"
  }
}
```
**→ Cause**: No Google Safe Browsing API key configured  
**→ Fix**: Add API key to `scanner.config.json`

---

## 🛠️ **Solutions**

### **Solution 1: Fix DNS Issues**
If URLs are returning `gsb: null`:

1. **Verify the URL is valid**:
   ```javascript
   // Make sure domain exists
   nslookup example.com
   ```

2. **The scanner will still provide**:
   - Heuristic analysis
   - Blocklist matching
   - Risk verdict

3. **This is expected behavior** for invalid/unreachable domains

### **Solution 2: Disable Fast Mode (Always Check GSB)**

To force GSB check even for high-risk URLs:

**File**: `scan-server.js` Line 33

```javascript
// Change this:
const FAST_MODE = true; // Return immediately on strong signals

// To this:
const FAST_MODE = false; // Always perform full checks including GSB
```

**Trade-off**:
- ✅ GSB always checked
- ❌ Slower scan times (~2-3 seconds per URL)

### **Solution 3: Increase GSB Timeout**

If GSB is timing out frequently:

**File**: `scan-server.js` Line 127

```javascript
// Change this:
signal: AbortSignal.timeout(2500)  // 2.5 seconds

// To this:
signal: AbortSignal.timeout(5000)  // 5 seconds
```

**Trade-off**:
- ✅ More GSB checks complete successfully
- ❌ Slower overall scan time

### **Solution 4: Add Better Error Handling**

I can modify the code to **always include GSB info** even on errors:

```javascript
// Instead of returning gsb: null on DNS failure,
// return gsb: { enabled: true, verdict: "skipped", reason: "dns_failed" }
```

Would you like me to implement this change?

---

## 📈 **Expected GSB Behavior**

### **Typical Scan Flow:**

```
1. Parse URL
2. Check blocklist (offline)
3. Run heuristics
4. [DECISION POINT]
   ├─ If risk > 35 and FAST_MODE = true → SKIP GSB (early exit)
   └─ Otherwise → Continue
5. DNS lookup
   ├─ If DNS fails → SKIP GSB, return with gsb: null
   └─ If DNS succeeds → Continue
6. HTTP probe
7. **Check Google Safe Browsing** ← GSB checked here
8. Combine all results
9. Return verdict
```

### **When GSB is Checked:**
✅ Valid, reachable URLs  
✅ Low to medium risk heuristic scores (< 35)  
✅ Not in offline blocklist (or FAST_MODE disabled)  
✅ DNS resolution successful  
✅ GSB API responds within timeout  

### **When GSB is NOT Checked:**
❌ Invalid/unreachable domains (DNS fails)  
❌ Very high-risk URLs (early exit in fast mode)  
❌ GSB API timeout/error  
❌ No API key configured  

---

## 🎯 **Recommendations**

### **For Maximum GSB Coverage:**

1. **Disable Fast Mode** (Line 33):
   ```javascript
   const FAST_MODE = false;
   ```

2. **Increase Timeout** (Line 127):
   ```javascript
   signal: AbortSignal.timeout(5000)
   ```

3. **Add Retry Logic** (optional):
   ```javascript
   // Retry GSB check once if it fails
   let gsb = await checkGSB(finalToCheck);
   if (gsb.verdict === "error") {
     gsb = await checkGSB(finalToCheck);
   }
   ```

4. **Always Return GSB Object** (recommended):
   ```javascript
   // Even on DNS failure, return:
   gsb: { 
     enabled: true, 
     verdict: "skipped", 
     reason: "dns_failed" 
   }
   ```

### **For Best Performance (Current Setup):**

Keep current settings:
- ✅ `FAST_MODE = true` - Skip GSB for obvious threats
- ✅ `GSB_TIMEOUT = 2500ms` - Fast response times
- ✅ Early exit on DNS failure - Don't waste time on invalid URLs

**Trade-off**: Some URLs won't have GSB results, but scan is much faster.

---

## 💡 **Example Scenarios**

### **Scenario A: Safe URL (google.com)**
```json
{
  "dns": { "ok": true },
  "heuristics": { "score": 0, "risk": "low" },
  "gsb": { "enabled": true, "verdict": "safe" }  ✅
}
```
**GSB Result**: ✅ Checked and returned

---

### **Scenario B: Invalid Domain (doesnotexist123.com)**
```json
{
  "dns": { "ok": false, "error": "ENOTFOUND" },
  "gsb": null  ❌
}
```
**GSB Result**: ❌ Skipped (DNS failed)

---

### **Scenario C: Phishing URL (http://paypal-login-verify.tk)**
```json
{
  "heuristics": { "score": 65, "risk": "high" },
  "blocklist": { "match": true },
  "gsb": { "enabled": true, "verdict": "unknown" }  ⚡
}
```
**GSB Result**: ⚡ Skipped (early exit due to high risk)

---

### **Scenario D: GSB Timeout**
```json
{
  "dns": { "ok": true },
  "gsb": { "enabled": true, "verdict": "error", "error": "timeout" }  ⏱️
}
```
**GSB Result**: ⏱️ Attempted but timed out

---

## ✅ **Summary**

**GSB doesn't show when:**
1. 🚫 DNS resolution fails → `gsb: null`
2. ⚡ Early exit (high risk detected) → `gsb.verdict: "unknown"`
3. ❌ API error/timeout → `gsb.verdict: "error"`

**This is intentional design** for:
- ⚡ Faster scan times
- 🎯 Efficient resource usage
- 🛡️ Still provides risk assessment via heuristics

**To always get GSB results:**
- Set `FAST_MODE = false` in `scan-server.js` line 33
- Expect slower scans (~2-3 seconds per URL)

---

Would you like me to modify the code to:
1. ✅ Always check GSB (disable fast mode)?
2. ✅ Always return GSB object (never null)?
3. ✅ Add retry logic for GSB failures?
4. ✅ Increase timeout for GSB API?

Let me know which changes you'd like! 🚀
