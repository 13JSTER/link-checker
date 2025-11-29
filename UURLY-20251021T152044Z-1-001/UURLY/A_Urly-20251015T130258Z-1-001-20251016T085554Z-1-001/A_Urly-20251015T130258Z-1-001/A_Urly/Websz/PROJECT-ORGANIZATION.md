# URLY Project Organization Guide

## 📁 Project Structure

This document describes the organized folder structure of the URLY Link Scanner project. All files have been reorganized for easier navigation and maintenance **without any code changes**.

---

## 📂 Root Directory Structure

```
UURLY/
├── config/                      # Configuration files
├── database/                    # Database related files
│   ├── schemas/                 # Database schemas
│   └── scripts/                 # Database utility scripts
├── docs/                        # All documentation
│   ├── api/                     # API documentation
│   ├── configuration/           # Configuration guides
│   ├── database/                # Database documentation
│   ├── testing/                 # Testing documentation
│   ├── system-analysis/         # System analysis & reports
│   └── wireframes/              # Design wireframes
├── feeds/                       # Blocklist feeds (unchanged)
├── node_modules/                # Dependencies (unchanged)
├── public/                      # Public assets (unchanged)
├── scanner/                     # Scanner server & related files
├── scripts/                     # Build & utility scripts (unchanged)
├── src/                         # React frontend source (unchanged)
├── tests/                       # Test files
├── utilities/                   # Utility scripts
├── database-exports/            # Database exports (unchanged)
├── package.json                 # Project dependencies
├── vite.config.js              # Vite configuration
├── .env                         # Environment variables
└── README.md                    # Project overview
```

---

## 📋 Detailed Folder Contents

### 🔧 `/config` - Configuration Files
Contains all configuration files for the application:
- `scanner.config.json` - Scanner settings and API keys
- `db-config.js` - MySQL database configuration
- `supabase-config.js` - Supabase database configuration

**Location**: Root level → `/config/`

---

### 🗄️ `/database` - Database Files
All database-related code and operations:

#### Core Files
- `db-manager.js` - Database operations manager
- `db-routes.js` - Database API routes

#### `/database/schemas` - Database Schemas
- `database-schema.sql` - MySQL database schema
- `supabase-schema.sql` - Supabase database schema

#### `/database/scripts` - Database Utility Scripts
- `init-db.js` - Initialize database
- `export-database.cjs` - Export database to JSON
- `import-database.cjs` - Import database from JSON
- `verify-database.cjs` - Verify database integrity
- `view-all-data.cjs` - View all database records
- `populate-blocklist.js` - Populate blocklist
- `view-blocklist.js` - View blocklist entries

**Location**: Root level → `/database/`

---

### 📚 `/docs` - Documentation
Comprehensive project documentation organized by category:

#### `/docs/api` - API Documentation
- `API-DOCUMENTATION.md` - Complete API reference
- `API-STATUS.md` - API status and endpoints
- `API-WORKING-CONFIRMATION.md` - API functionality confirmation

#### `/docs/configuration` - Configuration Guides
- `CONFIGURATION-GUIDE.md` - Configuration setup guide
- `CONFIGURATION-ISSUE-REPORT.md` - Configuration troubleshooting
- `CONFIGURATION-SYSTEM.md` - Configuration system details
- `SCANNING-OPTIONS-VERIFICATION.md` - Scanning options explained
- `SSL-VALIDATION-EXPLANATION.md` - SSL/TLS validation details

#### `/docs/database` - Database Documentation
- `DATABASE-SECURITY-GUIDE.md` - Database security best practices
- `GSB-STATUS-AND-DATABASE-UPDATE.md` - GSB integration status
- `SUPABASE-MIGRATION.md` - Migration to Supabase
- `SUPABASE-NAVIGATION-GUIDE.md` - Supabase navigation
- `SUPABASE-REFERENCE.md` - Supabase API reference
- `SUPABASE-SETUP.md` - Supabase setup instructions
- `SUPABASE-VERIFICATION.md` - Supabase verification steps

#### `/docs/testing` - Testing Documentation
- `INTEGRATION-TEST-REPORT.md` - Integration test results
- `TESTING-REPORT.md` - Comprehensive testing report
- `VERIFICATION_CHECKLIST.md` - Feature verification checklist

#### `/docs/system-analysis` - System Analysis & Reports
- `SYSTEM-ANALYSIS-BPMN-COMPLETE.md` - BPMN process diagrams
- `SYSTEM-ANALYSIS-PRESENTATION.md` - System presentation
- `SYSTEM-FLOW-DIAGRAM.md` - System flow diagrams
- `SYSTEM-STATUS-COMPARISON.md` - Status comparison
- `SYSTEM-STATUS-SUMMARY.md` - Status summary
- `SYSTEM-STATUS.md` - Current system status
- `PRODUCTION-READY-REPORT.md` - Production readiness
- `UPDATE-SUMMARY.md` - Update summary

#### `/docs/wireframes` - Design Wireframes
- `INTERFACE-WIREFRAMES.md` - Wireframe documentation
- `INTERFACE-WIREFRAMES.pdf` - Wireframe PDF
- `LUCIDCHART-IMPORT-GUIDE.md` - Lucidchart import guide
- `QUICK-START-LUCIDCHART.md` - Lucidchart quick start
- `URly-Wireframes-Import.drawio` - Drawio wireframe
- `URly-Wireframes-Lucidchart-FINAL.drawio` - Final wireframe
- `URly-Wireframes-Lucidchart-Import.drawio` - Import wireframe
- `URly-Wireframes-Lucidchart.json` - JSON wireframe data

#### `/docs` - General Documentation
- `GSB-EXPLANATION.md` - Google Safe Browsing explanation
- `GSB-IMPACT-ANALYSIS.md` - GSB impact analysis
- `RECOMMENDATION-BUG-FIX.md` - Recommendation bug fixes
- `RECOMMENDATION-LEVELS-EXPLAINED.md` - Risk level explanations

**Location**: Root level → `/docs/`

---

### 🔍 `/scanner` - Scanner Server
Scanner server and related functionality:
- `scan-server.js` - Main scanner server (Express API)
- `add-detection-sensitivity.js` - Detection sensitivity settings
- `enable-ssl-check.js` - SSL check enabler
- `check-latest-scan.cjs` - Latest scan checker
- `view-recommendations.js` - View scan recommendations

**Location**: Root level → `/scanner/`

---

### 🧪 `/tests` - Test Files
All testing files and test data:
- `test-config-system.js` - Configuration system tests
- `test-db-operations.js` - Database operation tests
- `test-db.js` - Database connection tests
- `test-integration.js` - Integration tests
- `test-urls.txt` - Test URL list
- `phishing-test-urls.txt` - Phishing URL test cases
- `verified-test-urls.txt` - Verified test URLs
- `verify-integration.html` - HTML integration test

**Location**: Root level → `/tests/`

---

### 🛠️ `/utilities` - Utility Scripts
Helper scripts for various tasks:
- `convert-to-pdf.cjs` - Convert documents to PDF
- `generate-pdf.cjs` - Generate PDF reports

**Location**: Root level → `/utilities/`

---

## 🚀 Running the Application

### Start Both Servers
```powershell
npm run dev:all
```

### Start Scanner Only
```powershell
npm run scan
```

### Start Frontend Only
```powershell
npm run dev
```

---

## 📍 Quick File Finder

### Need to find...

#### **API Documentation?**
→ `/docs/api/API-DOCUMENTATION.md`

#### **Configuration Setup?**
→ `/docs/configuration/CONFIGURATION-GUIDE.md`

#### **Database Schema?**
→ `/database/schemas/database-schema.sql` (MySQL)
→ `/database/schemas/supabase-schema.sql` (Supabase)

#### **Scanner Server?**
→ `/scanner/scan-server.js`

#### **Configuration Files?**
→ `/config/scanner.config.json` (Scanner settings)
→ `/config/db-config.js` (Database settings)

#### **Test Files?**
→ `/tests/` (All test files)

#### **Database Scripts?**
→ `/database/scripts/` (All DB utilities)

#### **System Status Reports?**
→ `/docs/system-analysis/SYSTEM-STATUS.md`

#### **Wireframes/Designs?**
→ `/docs/wireframes/`

---

## ✅ What Changed?

### Files Moved (Path Updates in Code)
1. **package.json** - Updated scan script path
2. **scan-server.js** - Updated import paths for database modules and config
3. **db-manager.js** - Updated import path for supabase-config

### Files Moved (No Code Changes)
All other files were simply moved to their new locations without any code modifications.

### Files Unchanged
- `/src/` - React frontend source code
- `/public/` - Public assets
- `/node_modules/` - Dependencies
- `/scripts/` - Existing build scripts
- `/feeds/` - Blocklist feeds
- `/database-exports/` - Existing exports
- Root configuration files (`.env`, `.gitignore`, `vite.config.js`, etc.)

---

## 🔄 Code Changes Summary

Only **3 files** had code changes (path updates only):

1. **package.json**
   - `"scan": "node ./scan-server.js"` → `"scan": "node ./scanner/scan-server.js"`

2. **scanner/scan-server.js**
   - `import dbManager from "./db-manager.js"` → `import dbManager from "../database/db-manager.js"`
   - `import * as dbRoutes from "./db-routes.js"` → `import * as dbRoutes from "../database/db-routes.js"`
   - Feed paths updated to use `"../"` prefix
   - Config path updated to `"../config/scanner.config.json"`

3. **database/db-manager.js**
   - `import { supabase } from './supabase-config.js'` → `import { supabase } from '../config/supabase-config.js'`

**No functional code was changed - only file paths were updated!**

---

## 🎯 Benefits of This Organization

✅ **Easy Navigation** - Find files by category instantly
✅ **Clear Separation** - Docs, code, tests, and config are separated
✅ **Better Maintenance** - Easier to update and manage
✅ **Professional Structure** - Industry-standard organization
✅ **Scalability** - Easy to add new features
✅ **No Code Impact** - All functionality remains the same

---

## 📞 Need Help?

Refer to the main **README.md** for project overview and setup instructions.

For specific topics:
- API Usage → `/docs/api/API-DOCUMENTATION.md`
- Configuration → `/docs/configuration/CONFIGURATION-GUIDE.md`
- Testing → `/docs/testing/TESTING-REPORT.md`
- Database Setup → `/docs/database/SUPABASE-SETUP.md`

---

**Last Updated**: October 21, 2025
**Version**: 1.0.0
