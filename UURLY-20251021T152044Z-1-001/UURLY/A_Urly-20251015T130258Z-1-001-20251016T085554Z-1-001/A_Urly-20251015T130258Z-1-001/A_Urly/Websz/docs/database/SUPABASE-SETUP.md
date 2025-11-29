# 🚀 Supabase Migration Guide for URLY Scanner

This guide will help you migrate from MySQL to Supabase for the URLY Scanner project.

---

## 📋 Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Node.js and npm installed
- Your existing URLY Scanner project

---

## 🎯 Step 1: Create a Supabase Project

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click **"New Project"**
3. Fill in the details:
   - **Name**: `urly-scanner` (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the closest region to your users
4. Click **"Create new project"**
5. Wait 1-2 minutes for your project to be provisioned

---

## 🔑 Step 2: Get Your Supabase Credentials

> **📘 New to Supabase?** 
> - Quick Guide: [STEP-2-GUIDE.md](./STEP-2-GUIDE.md) - Simple step-by-step instructions
> - Visual Guide: [SUPABASE-NAVIGATION-GUIDE.md](./SUPABASE-NAVIGATION-GUIDE.md) - Dashboard diagrams

Once your project is ready (you'll see a dashboard with your project), follow these detailed steps:

### 2.1 Navigate to Settings
1. Look at the **left sidebar** of your Supabase dashboard
2. Scroll down to the **bottom** of the sidebar
3. Click the **⚙️ Settings** icon (gear icon at the very bottom)

### 2.2 Open API Settings
1. In the Settings page, you'll see a menu on the left
2. Click on **"API"** (should be near the top of the settings menu)
3. You're now on the API settings page

### 2.3 Find Your Project URL
1. Look for the section labeled **"Project URL"** or **"Config"**
2. You'll see a URL like: `https://abcdefghijklmnop.supabase.co`
3. Click the **📋 Copy** button next to it
4. **Save this** - you'll need it for your `.env` file

### 2.4 Find Your API Keys
1. Scroll down to the **"Project API keys"** section
2. You'll see two keys:
   
   **A. anon / public key:**
   - Look for the one labeled **"anon"** or **"public"**
   - This is a long string starting with `eyJ...`
   - Click the **👁️ Show** button to reveal it
   - Click the **📋 Copy** button
   - **Save this** as your `SUPABASE_ANON_KEY`
   
   **B. service_role key (optional but recommended):**
   - Look for the one labeled **"service_role"**
   - Click the **👁️ Show** button to reveal it
   - Click the **📋 Copy** button
   - **Save this** as your `SUPABASE_SERVICE_KEY`
   - ⚠️ **Keep this secret!** Only use server-side

### 2.5 Keep These Safe
You should now have:
- ✅ Project URL: `https://xxxxx.supabase.co`
- ✅ Anon Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- ✅ Service Role Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (optional)

**Keep these safe!** You'll use them in the next step.

---

## 📝 Step 3: Configure Environment Variables

1. In your project root, create a `.env` file:

```bash
# Copy .env.example to .env
copy .env.example .env
```

2. Edit `.env` and add your Supabase credentials:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# Optional: For admin operations (keep this secret!)
SUPABASE_SERVICE_KEY=your-service-role-key-here
```

**Important**: Add `.env` to your `.gitignore` to keep credentials secure!

```bash
echo ".env" >> .gitignore
```

---

## 🗄️ Step 4: Set Up Database Schema

> **📘 Need visual guidance?** See [SUPABASE-NAVIGATION-GUIDE.md](./SUPABASE-NAVIGATION-GUIDE.md) for detailed diagrams showing exactly where to click!

Now let's create your database tables. Follow these steps carefully:

### 4.1 Navigate to SQL Editor
1. Go back to your **Supabase dashboard** homepage
2. Look at the **left sidebar** menu
3. Find and click on **"SQL Editor"** icon (looks like `</>` or a database icon)
   - It should be in the middle section of the sidebar
   - Usually below "Table Editor" and above "Database"

### 4.2 Create a New Query
1. You're now in the SQL Editor page
2. Look for a green **"+ New query"** button (top right area)
3. Click it to create a new blank query
4. You'll see an empty text editor with a cursor

### 4.3 Prepare the Schema File
1. In VS Code (or your text editor), open the file: `supabase-schema.sql`
2. Select **ALL** the contents (Ctrl+A or Cmd+A)
3. Copy it (Ctrl+C or Cmd+C)

### 4.4 Paste and Run the Schema
1. Go back to your **Supabase SQL Editor** tab in your browser
2. Click inside the empty query editor
3. **Paste** the copied SQL (Ctrl+V or Cmd+V)
4. You should see a lot of SQL code appear
5. Look for the **green "Run"** button (top right of the editor)
6. Click **"Run"** (or press Ctrl+Enter)

### 4.5 Verify Success
1. Wait a few seconds while it runs
2. You should see a **green success message** at the bottom:
   - ✅ "Success. No rows returned"
   - Or similar success indicator
3. If you see an error, double-check you copied the entire file

### 4.6 Verify Tables Were Created
1. In the **left sidebar**, click **"Table Editor"** (above SQL Editor)
2. You should now see **5 tables** listed:
   - ✅ `blocklist`
   - ✅ `configuration`
   - ✅ `scan_recommendations`
   - ✅ `scan_statistics`
   - ✅ `scans`
3. Click on any table to see its structure
4. The `configuration` table should have **10 rows** of default settings

This will create:
- ✅ `scans` table (stores all scan results)
- ✅ `scan_recommendations` table (safety recommendations)
- ✅ `scan_statistics` table (daily statistics)
- ✅ `blocklist` table (custom blocklist)
- ✅ `configuration` table (system settings)
- ✅ Indexes for performance
- ✅ Default configuration values

---

## 📦 Step 5: Install Dependencies

The Supabase client has already been installed. If you need to reinstall:

```bash
npm install @supabase/supabase-js dotenv
```

---

## 🔄 Step 6: Migration Summary

### ✅ What's Changed:

1. **Database**: MySQL → Supabase (PostgreSQL)
2. **Package**: `mysql2` → `@supabase/supabase-js`
3. **Config File**: `db-config.js` → `supabase-config.js`
4. **Connection**: MySQL connection pool → Supabase client
5. **Queries**: SQL strings → Supabase query builder

### 📁 New Files:

- ✅ `supabase-config.js` - Supabase client configuration
- ✅ `supabase-schema.sql` - Database schema for Supabase
- ✅ `.env.example` - Environment variables template
- ✅ `.env` - Your actual credentials (don't commit!)

### 🔧 Modified Files:

- ✅ `db-manager.js` - Rewritten to use Supabase
- ✅ `package.json` - Dependencies updated
- ✅ `scan-server.js` - Imports updated (automatic)

### 🗑️ Removed Files:

- ❌ `db-config.js` (replaced by `supabase-config.js`)
- ❌ MySQL-related scripts

---

## 🧪 Step 7: Test the Connection

1. Start your scan server:

```bash
npm run scan
```

2. You should see:
```
✅ Supabase connected successfully!
```

If you see an error:
- ❌ Check your `.env` file has correct credentials
- ❌ Make sure you ran the schema SQL in Supabase
- ❌ Verify your Supabase project is active

---

## 🚀 Step 8: Run Your Application

Everything should work exactly as before!

```bash
# Start the scan server
npm run scan

# In another terminal, start the dev server
npm run dev

# Or run both together
npm run dev:all
```

Test by scanning a URL - it should save to your Supabase database!

---

## 📊 Step 9: View Your Data in Supabase

1. Go to your Supabase dashboard
2. Click **"Table Editor"** in the sidebar
3. You'll see all your tables:
   - `scans` - View all scan results
   - `scan_statistics` - See daily stats
   - `blocklist` - Manage blocked URLs
   - `configuration` - System settings

You can:
- 👀 Browse data
- ✏️ Edit records
- 🗑️ Delete entries
- 📈 View insights

---

## 🔐 Security Best Practices

### 1. Environment Variables
- ✅ Never commit `.env` to git
- ✅ Use `.env.example` as a template
- ✅ Keep `service_role` key secret (server-only)
- ✅ Use `anon` key for client-side if needed

### 2. Row Level Security (RLS)
The schema includes commented-out RLS policies. To enable:

```sql
-- Enable RLS on tables
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_recommendations ENABLE ROW LEVEL SECURITY;
-- ... etc

-- Create policies
CREATE POLICY "Enable all for service role" 
  ON scans FOR ALL 
  USING (auth.role() = 'service_role');
```

### 3. API Keys
- 🔑 Rotate keys periodically in Supabase dashboard
- 🔑 Use environment-specific keys (dev/prod)

---

## 🔄 Migrating Existing Data (Optional)

If you have existing MySQL data to migrate:

### Option 1: Export from MySQL
```bash
# Export your MySQL database
node export-database.cjs
```

Then manually import into Supabase using the SQL Editor or CSV import.

### Option 2: Fresh Start
Just use the new Supabase database from now on. Old scans can be archived.

---

## 🆘 Troubleshooting

### Error: "Missing Supabase configuration"
✅ **Solution**: Create `.env` file with your credentials

### Error: "relation 'scans' does not exist"
✅ **Solution**: Run `supabase-schema.sql` in SQL Editor

### Error: "Invalid API key"
✅ **Solution**: Double-check your keys in Supabase dashboard → Settings → API

### Connection timeout
✅ **Solution**: Check your internet connection and Supabase project status

### Data not saving
✅ **Solution**: Check server logs for specific errors. Verify table permissions.

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [PostgreSQL vs MySQL](https://supabase.com/docs/guides/database/postgres-vs-mysql)

---

## 🎉 Benefits of Supabase

✅ **No local database needed** - Everything in the cloud  
✅ **Built-in API** - REST and GraphQL included  
✅ **Real-time subscriptions** - Live data updates  
✅ **Dashboard** - Visual data management  
✅ **Backups** - Automatic daily backups  
✅ **Scalable** - Grows with your needs  
✅ **Free tier** - 500MB database, 2GB bandwidth  

---

## 🏁 You're All Set!

Your URLY Scanner is now running on Supabase! 🎊

If you encounter any issues, check the troubleshooting section or open an issue.

Happy scanning! 🔍✨
