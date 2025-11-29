# 🎯 URLY Scanner - URL Link Checker

## ⚠️ THIS IS A DEMO VERSION

**You are viewing a LIMITED DEMO VERSION for evaluation purposes.**

This public repository showcases the concept and basic functionality of URLY Scanner.

### 🆓 Demo Version Includes:
- ✅ Basic URL scanning (3 scans per session)
- ✅ Simple threat detection
- ✅ Basic UI demonstration
- ✅ Code structure for learning

### 🔒 Full Version Includes:
- 💎 **Unlimited scans** - No limitations
- 🔌 **Full API access** - RESTful API endpoints
- 📊 **Advanced analytics** - Detailed threat intelligence
- 📈 **Historical data** - Track all scans over time
- 🎯 **Custom threat feeds** - Add your own blocklists
- 🛡️ **Premium features** - SSL analysis, email alerts, and more
- 📱 **Complete source code** - All features unlocked
- ✅ **Commercial license** - Use in production
- 🚀 **Lifetime updates** - All future updates included
- 💬 **Priority support** - Email support included

---

## 💰 Get Full Version

**Price: $49 (one-time payment)**

📧 Email: penalozajester@gmail.com  
📋 Subject: URLY Scanner - Full Version Purchase

[📖 Read more about demo vs full version](DEMO_VERSION.md)

---

## About URLY Scanner

A modern URL scanning and validation tool built with Vite, React, and MySQL.

## 🚀 Features

- **URL Validation & Scanning** - Check URLs for safety and validity
- **MySQL Database Integration** - Store and manage scan results
- **Modern React UI** - Built with React 18 and Vite
- **Real-time Configuration** - Dynamic settings management
- **Google Safe Browsing API** - Integration with GSB for threat detection
- **Phishing Detection** - Advanced URL analysis

## 📋 Prerequisites

- Node.js (v16 or higher)
- MySQL Server
- npm or yarn

## 🛠️ Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/urly-scanner.git
   cd urly-scanner
   ```

2. **Navigate to the project folder:**
   ```bash
   cd UURLY-20251021T152044Z-1-001/UURLY/A_Urly-20251015T130258Z-1-001-20251016T085554Z-1-001/A_Urly-20251015T130258Z-1-001/A_Urly/Websz
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Configure database:**
   ```bash
   # Copy the example config
   cp config/db-config.example.js config/db-config.js
   
   # Edit config/db-config.js with your MySQL credentials
   ```

5. **Set up MySQL database:**
   ```sql
   CREATE DATABASE urly;
   ```

## 🚀 Running the Application

### Development Mode

```bash
# Run Vite development server only
npm run dev

# Run scanner server only
npm run scan

# Run both simultaneously (Windows)
npm run dev:all
```

The application will be available at `http://localhost:5173/`

### Production Build

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
Websz/
├── config/               # Configuration files
│   ├── db-config.js     # Database config (gitignored)
│   ├── supabase-config.js
│   └── scanner.config.json
├── src/                 # React source files
│   ├── components/      # React components
│   ├── pages/          # Page components
│   └── utils/          # Utility functions
├── public/             # Static assets
├── scanner/            # URL scanning server
├── database/           # Database schemas and scripts
├── docs/               # Documentation
└── tests/              # Test files
```

## 🔐 Environment Variables

**IMPORTANT:** Never commit your actual database credentials to GitHub!

1. Copy `config/db-config.example.js` to `config/db-config.js`
2. Update with your credentials:
   ```javascript
   export const dbConfig = {
     host: 'localhost',
     user: 'your_mysql_username',
     password: 'your_mysql_password',
     database: 'urly',
     // ...
   };
   ```

## 📝 Available Scripts

- `npm run dev` - Start Vite development server
- `npm run scan` - Start scanner server
- `npm run dev:all` - Run both servers simultaneously
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run feeds:update` - Update threat feeds

## 🧪 Testing

```bash
# Run database tests
node tests/test-db.js

# Run integration tests
node tests/test-integration.js

# Test configuration system
node tests/test-config-system.js
```

## 📚 Documentation

Detailed documentation is available in the `/docs` folder:

- [GSB Explanation](docs/GSB-EXPLANATION.md)
- [Database Documentation](docs/database/)
- [API Documentation](docs/api/)
- [Configuration Guide](docs/configuration/)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## ⚠️ Security Notes

- **Never commit `db-config.js`** - Contains sensitive credentials
- Database credentials are protected via `.gitignore`
- Use environment variables in production
- Keep dependencies updated

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

JESTER PENALOZA

## 🙏 Acknowledgments

- Google Safe Browsing API
- React & Vite communities
- MySQL community
