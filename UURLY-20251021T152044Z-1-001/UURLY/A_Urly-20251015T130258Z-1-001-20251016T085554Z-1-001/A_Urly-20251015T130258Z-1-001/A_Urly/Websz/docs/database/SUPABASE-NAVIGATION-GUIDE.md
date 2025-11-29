# 🗺️ Supabase Dashboard Navigation Guide

A visual guide to help you navigate the Supabase dashboard step by step.

---

## 📐 Dashboard Layout Overview

```
┌─────────────────────────────────────────────────────────┐
│  SUPABASE  [Project Name ▼]    🔔  👤               │
├──────────┬──────────────────────────────────────────────┤
│          │                                              │
│ SIDEBAR  │           MAIN CONTENT AREA                 │
│          │                                              │
│  🏠 Home │     (Tables, SQL Editor, etc.)              │
│  📊 Table│                                              │
│  </> SQL │                                              │
│  🗄️ DB   │                                              │
│  🔐 Auth │                                              │
│  📁 Store│                                              │
│  ⚡ Edge  │                                              │
│          │                                              │
│  ⚙️ Set  │                                              │
└──────────┴──────────────────────────────────────────────┘
```

---

## 🎯 Step-by-Step Navigation

### Finding Settings → API

```
STEP 1: Look at LEFT SIDEBAR
┌─────────────┐
│  🏠 Home    │  ← You might be here
│  📊 Table   │
│  </> SQL    │
│  🗄️ DB      │
│  🔐 Auth    │
│  📁 Storage │
│             │
│     ↓       │
│  Scroll     │
│   Down      │
│     ↓       │
│             │
│  ⚙️ Settings│  ← CLICK HERE (at bottom)
└─────────────┘

STEP 2: Settings Menu Opens
┌─────────────┬────────────────────────┐
│  ⚙️ Settings│  SETTINGS PAGE         │
│             │                        │
│  General    │                        │
│  API        │  ← CLICK HERE          │
│  Database   │                        │
│  Storage    │                        │
│  Billing    │                        │
└─────────────┴────────────────────────┘

STEP 3: API Page Opens
┌────────────────────────────────────────────┐
│  API Settings                              │
├────────────────────────────────────────────┤
│  📋 Project URL                            │
│  https://abcdefg.supabase.co     [Copy]   │
│                                            │
│  🔑 Project API keys                       │
│  ┌──────────────────────────────────────┐ │
│  │ anon / public                        │ │
│  │ eyJhbGci...              [👁️] [📋]  │ │
│  └──────────────────────────────────────┘ │
│  ┌──────────────────────────────────────┐ │
│  │ service_role                         │ │
│  │ eyJhbGci...              [👁️] [📋]  │ │
│  └──────────────────────────────────────┘ │
└────────────────────────────────────────────┘
```

---

## 📝 Step 2 Detailed: Getting Credentials

### Visual Guide

```
┌─── SUPABASE DASHBOARD ───────────────────────┐
│                                               │
│  1. CLICK: ⚙️ Settings (bottom of sidebar)   │
│     ↓                                         │
│  2. CLICK: API (in settings menu)            │
│     ↓                                         │
│  3. YOU'LL SEE:                              │
│                                               │
│  ┌─────────────────────────────────────┐    │
│  │ 📋 Project URL                      │    │
│  │ https://xxxxx.supabase.co           │    │
│  │ [Copy] ← Click to copy              │    │
│  └─────────────────────────────────────┘    │
│  ✅ Save this as: SUPABASE_URL               │
│                                               │
│  ┌─────────────────────────────────────┐    │
│  │ 🔑 anon / public                    │    │
│  │ eyJhbGc... [👁️ Show] [📋 Copy]     │    │
│  └─────────────────────────────────────┘    │
│  ✅ Save this as: SUPABASE_ANON_KEY          │
│                                               │
│  ┌─────────────────────────────────────┐    │
│  │ 🔑 service_role                     │    │
│  │ ******* [👁️ Show] [📋 Copy]        │    │
│  └─────────────────────────────────────┘    │
│  ✅ Save this as: SUPABASE_SERVICE_KEY       │
│                                               │
└───────────────────────────────────────────────┘
```

---

## 🗄️ Step 4 Detailed: SQL Editor Navigation

### Finding SQL Editor

```
LEFT SIDEBAR VIEW:
┌──────────────┐
│  🏠 Home     │
│  📊 Table    │  ← Don't click here
│  </> SQL     │  ← CLICK HERE (SQL Editor)
│  🗄️ Database │
│  🔐 Auth     │
│  📁 Storage  │
└──────────────┘
```

### SQL Editor Interface

```
┌─── SQL EDITOR ─────────────────────────────────┐
│  [+ New query]  [Save]  [▶ Run]           │
├────────────────────────────────────────────────┤
│  1  -- Paste your SQL here                    │
│  2  CREATE TABLE IF NOT EXISTS scans (        │
│  3    id BIGSERIAL PRIMARY KEY,               │
│  4    url TEXT NOT NULL,                      │
│  5    ...                                     │
│  6  );                                        │
│  7                                            │
│     [Your SQL code goes here]                │
│                                               │
├────────────────────────────────────────────────┤
│  ✅ Success. No rows returned                 │
└────────────────────────────────────────────────┘

STEPS:
1. Click: [+ New query] (top right)
2. Paste your SQL from supabase-schema.sql
3. Click: [▶ Run] button (top right)
4. Wait for success message at bottom
```

### Verifying Tables Were Created

```
LEFT SIDEBAR:
┌──────────────┐
│  🏠 Home     │
│  📊 Table    │  ← CLICK HERE to verify
│  </> SQL     │
└──────────────┘

TABLE EDITOR VIEW:
┌─── TABLE EDITOR ───────────────────────────────┐
│  Tables:                                       │
│  ├─ 📋 blocklist              0 rows          │
│  ├─ ⚙️  configuration         10 rows         │
│  ├─ 💬 scan_recommendations   0 rows          │
│  ├─ 📊 scan_statistics        0 rows          │
│  └─ 🔍 scans                  0 rows          │
│                                                │
│  Click any table to view/edit its data        │
└────────────────────────────────────────────────┘
```

---

## 🎨 Visual Step-by-Step Walkthrough

### Complete Flow for Step 2 (Get Credentials)

```
START HERE:
    ↓
[Supabase Dashboard Home]
    ↓
Look at LEFT sidebar
    ↓
Scroll to BOTTOM
    ↓
Click: ⚙️ Settings
    ↓
[Settings Page Opens]
    ↓
Click: API (in left menu)
    ↓
[API Settings Page]
    ↓
Copy Project URL → Save as SUPABASE_URL
    ↓
Click 👁️ Show on "anon" key
    ↓
Click 📋 Copy → Save as SUPABASE_ANON_KEY
    ↓
(Optional) Click 👁️ Show on "service_role"
    ↓
(Optional) Click 📋 Copy → Save as SUPABASE_SERVICE_KEY
    ↓
✅ DONE! You have your credentials
```

### Complete Flow for Step 4 (Database Setup)

```
START HERE:
    ↓
[Supabase Dashboard]
    ↓
Click: </> SQL Editor (left sidebar)
    ↓
[SQL Editor Opens]
    ↓
Click: [+ New query] button
    ↓
[Empty Query Editor]
    ↓
Open: supabase-schema.sql in VS Code
    ↓
Select All (Ctrl+A) → Copy (Ctrl+C)
    ↓
Paste in SQL Editor (Ctrl+V)
    ↓
Click: [▶ Run] button
    ↓
Wait 2-3 seconds...
    ↓
See: ✅ Success message
    ↓
Click: 📊 Table Editor (left sidebar)
    ↓
[Table Editor Opens]
    ↓
See: 5 tables listed
    ↓
✅ DONE! Database is ready
```

---

## 🔍 What Each Sidebar Icon Means

```
┌──────────────┬─────────────────────────────────────┐
│ Icon         │ Name & Purpose                      │
├──────────────┼─────────────────────────────────────┤
│ 🏠 Home      │ Project overview & quick stats      │
│ 📊 Table     │ Browse & edit table data visually   │
│ </> SQL      │ Write & run SQL queries             │
│ 🗄️ Database  │ Manage tables, triggers, functions  │
│ 🔐 Auth      │ User authentication (optional)      │
│ 📁 Storage   │ File storage (optional)             │
│ ⚡ Edge Func │ Serverless functions (optional)     │
│ ⚙️ Settings  │ Project settings, API keys, etc.    │
└──────────────┴─────────────────────────────────────┘
```

---

## 💡 Pro Tips

### Finding Things Quickly

1. **Can't find Settings?**
   - It's always at the **BOTTOM** of the sidebar
   - Scroll down if you don't see it

2. **Can't find SQL Editor?**
   - Look for `</>` icon in the sidebar
   - Usually 3rd or 4th item from top

3. **Keys are hidden?**
   - Click the 👁️ (eye) icon to reveal
   - Then click 📋 to copy

4. **Confused about which key to use?**
   - Use **anon** key for most operations
   - Use **service_role** only if you need admin access

---

## 🎯 Quick Reference: Where to Find What

| What You Need | Where to Go | What to Click |
|---------------|-------------|---------------|
| **API Keys** | ⚙️ Settings → API | Copy buttons |
| **Project URL** | ⚙️ Settings → API | Copy button |
| **Run SQL** | </> SQL Editor | New query → Run |
| **View Tables** | 📊 Table Editor | Click table name |
| **Edit Data** | 📊 Table Editor | Click row to edit |
| **Database Password** | ⚙️ Settings → Database | Reset if needed |

---

## 📸 What You Should See

### Settings → API Page
```
Look for these sections:
✅ Config (with Project URL)
✅ Project API keys (with anon and service_role)
✅ Each key has [👁️ Show] and [📋 Copy] buttons
```

### SQL Editor Page
```
Look for:
✅ [+ New query] button (top right)
✅ Large text editor in center
✅ [▶ Run] button (top right)
✅ Results panel at bottom
```

### Table Editor Page
```
Look for:
✅ List of tables on left
✅ Table data grid in center
✅ Column names at top
✅ Row count for each table
```

---

## 🆘 Troubleshooting Navigation

| Problem | Solution |
|---------|----------|
| "I don't see Settings" | Scroll down in the sidebar to the very bottom |
| "I don't see API option" | Make sure you clicked Settings first |
| "SQL Editor is empty" | Click "+ New query" button first |
| "Can't see the keys" | Click the 👁️ (eye) icon next to each key |
| "Tables not appearing" | Click "Table Editor" after running SQL |
| "Run button is grayed out" | Make sure you pasted SQL code in the editor |

---

## ✅ Navigation Checklist

Use this to verify you're in the right place:

### For Step 2 (Getting Credentials):
- [ ] I see "Settings" at bottom of sidebar
- [ ] I clicked on Settings
- [ ] I see "API" in the settings menu
- [ ] I clicked on API
- [ ] I see "Project URL" section
- [ ] I see "Project API keys" section
- [ ] I can see Copy buttons

### For Step 4 (Database Setup):
- [ ] I see "SQL Editor" in sidebar
- [ ] I clicked on SQL Editor
- [ ] I see "+ New query" button
- [ ] I clicked New query
- [ ] I have a blank text editor
- [ ] I pasted the SQL code
- [ ] I see the "Run" button
- [ ] I clicked Run
- [ ] I see a success message

---

**Need more help?** The Supabase dashboard is very user-friendly. If you're stuck, look for icons in the left sidebar - they're usually self-explanatory! 🎯

---

Last Updated: October 12, 2025
