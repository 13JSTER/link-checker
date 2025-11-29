# ⚡ Supabase Quick Reference

Quick commands and snippets for working with Supabase in URLY Scanner.

---

## 🔑 Environment Variables

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
```

---

## 📦 Installation

```bash
npm install @supabase/supabase-js dotenv
```

---

## 🚀 Quick Start

```javascript
import { supabase } from './supabase-config.js';

// Query data
const { data, error } = await supabase
  .from('scans')
  .select('*')
  .limit(10);

// Insert data
const { data, error } = await supabase
  .from('scans')
  .insert({ url: 'https://example.com', status: 'safe' });

// Update data
const { data, error } = await supabase
  .from('scans')
  .update({ status: 'unsafe' })
  .eq('id', 123);

// Delete data
const { data, error } = await supabase
  .from('scans')
  .delete()
  .eq('id', 123);
```

---

## 🔍 Common Queries

### Get Recent Scans
```javascript
const { data } = await supabase
  .from('scans')
  .select('*')
  .order('scanned_at', { ascending: false })
  .limit(100);
```

### Search URLs
```javascript
const { data } = await supabase
  .from('scans')
  .select('*')
  .ilike('url', '%example%');
```

### Count Records
```javascript
const { count } = await supabase
  .from('scans')
  .select('*', { count: 'exact', head: true });
```

### Filter by Date
```javascript
const { data } = await supabase
  .from('scans')
  .select('*')
  .gte('scanned_at', '2025-01-01')
  .lte('scanned_at', '2025-12-31');
```

### Join Tables
```javascript
const { data } = await supabase
  .from('scans')
  .select(`
    *,
    scan_recommendations (*)
  `)
  .eq('id', scanId);
```

---

## 🎯 Filter Operators

| Operator | Method | Example |
|----------|--------|---------|
| Equal | `.eq()` | `.eq('status', 'safe')` |
| Not Equal | `.neq()` | `.neq('status', 'safe')` |
| Greater Than | `.gt()` | `.gt('risk_score', 50)` |
| Greater/Equal | `.gte()` | `.gte('risk_score', 50)` |
| Less Than | `.lt()` | `.lt('risk_score', 30)` |
| Less/Equal | `.lte()` | `.lte('risk_score', 30)` |
| Like | `.like()` | `.like('url', '%example%')` |
| Case-insensitive Like | `.ilike()` | `.ilike('hostname', '%example%')` |
| In Array | `.in()` | `.in('status', ['safe', 'caution'])` |
| Is Null | `.is()` | `.is('gsb_verdict', null)` |
| Or | `.or()` | `.or('status.eq.safe,risk_score.lt.20')` |

---

## 📊 Aggregation

### Average
```javascript
const { data } = await supabase
  .from('scans')
  .select('risk_score');

const avg = data.reduce((sum, scan) => sum + scan.risk_score, 0) / data.length;
```

### Count by Group
```javascript
const { data } = await supabase
  .rpc('get_status_breakdown');
// Returns: [{ status: 'safe', count: 100 }, ...]
```

---

## 🔄 Upsert (Insert or Update)

```javascript
const { data, error } = await supabase
  .from('configuration')
  .upsert({
    config_key: 'max_scans',
    config_value: '1000'
  }, {
    onConflict: 'config_key'
  });
```

---

## 🗑️ Batch Operations

### Insert Multiple
```javascript
const { data, error } = await supabase
  .from('blocklist')
  .insert([
    { entry_type: 'url', value: 'evil.com' },
    { entry_type: 'url', value: 'bad.com' }
  ]);
```

### Delete Multiple
```javascript
const { data, error } = await supabase
  .from('scans')
  .delete()
  .in('id', [1, 2, 3, 4, 5]);
```

---

## 🔐 Error Handling

```javascript
const { data, error } = await supabase
  .from('scans')
  .select('*');

if (error) {
  console.error('Error:', error.message);
  console.error('Code:', error.code);
  console.error('Details:', error.details);
  console.error('Hint:', error.hint);
}
```

### Common Error Codes
- `PGRST116` - No rows found (not really an error)
- `23505` - Unique constraint violation
- `23503` - Foreign key violation
- `42P01` - Table doesn't exist

---

## 📡 Real-time Subscriptions (Optional)

```javascript
// Listen to new scans
const subscription = supabase
  .channel('scans-channel')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'scans' },
    (payload) => {
      console.log('New scan:', payload.new);
    }
  )
  .subscribe();

// Unsubscribe later
subscription.unsubscribe();
```

---

## 🛠️ Database Management

### View Tables
Go to: **Supabase Dashboard → Table Editor**

### Run SQL
Go to: **Supabase Dashboard → SQL Editor**

### View API Docs
Go to: **Supabase Dashboard → API**

### Monitor Usage
Go to: **Supabase Dashboard → Usage**

---

## 🔧 Useful SQL Queries

### Total Scans
```sql
SELECT COUNT(*) FROM scans;
```

### Status Breakdown
```sql
SELECT status, COUNT(*) 
FROM scans 
GROUP BY status;
```

### Top Domains
```sql
SELECT hostname, COUNT(*) as scan_count
FROM scans
GROUP BY hostname
ORDER BY scan_count DESC
LIMIT 10;
```

### Recent Activity
```sql
SELECT DATE(scanned_at) as date, COUNT(*) as scans
FROM scans
WHERE scanned_at > NOW() - INTERVAL '7 days'
GROUP BY DATE(scanned_at)
ORDER BY date DESC;
```

### Dangerous URLs
```sql
SELECT url, risk_score, status
FROM scans
WHERE risk_score > 70
ORDER BY risk_score DESC
LIMIT 20;
```

---

## 🎨 Dashboard Features

| Feature | Location | Description |
|---------|----------|-------------|
| **Table Editor** | Left sidebar | Browse and edit data |
| **SQL Editor** | Left sidebar | Run custom SQL queries |
| **API** | Left sidebar | View auto-generated API docs |
| **Database** | Left sidebar | Manage tables, functions, triggers |
| **Authentication** | Left sidebar | User management (if needed) |
| **Storage** | Left sidebar | File storage (if needed) |
| **Settings** | Bottom left | API keys, database password, etc. |

---

## 📖 Documentation Links

- [Supabase Docs](https://supabase.com/docs)
- [JS Client Reference](https://supabase.com/docs/reference/javascript)
- [Database Guide](https://supabase.com/docs/guides/database)
- [API Routes](https://supabase.com/docs/guides/api)

---

## 💡 Pro Tips

1. **Use `.select()` wisely** - Only fetch columns you need
2. **Limit results** - Always use `.limit()` for large tables
3. **Index columns** - Add indexes for frequently queried columns
4. **Use RLS** - Enable Row Level Security for production
5. **Monitor usage** - Check dashboard for limits
6. **Backup data** - Export important data regularly
7. **Use transactions** - For complex multi-step operations

---

## 🎯 Performance Tips

```javascript
// ❌ Bad - Fetches all columns
const { data } = await supabase.from('scans').select('*');

// ✅ Good - Only fetch what you need
const { data } = await supabase
  .from('scans')
  .select('id, url, status, risk_score')
  .limit(100);

// ❌ Bad - No index on filtered column
const { data } = await supabase
  .from('scans')
  .eq('some_rare_field', value);

// ✅ Good - Filter on indexed columns (id, scanned_at, status, etc.)
const { data } = await supabase
  .from('scans')
  .eq('status', 'unsafe')
  .order('scanned_at', { ascending: false });
```

---

**Quick Reference Last Updated**: October 12, 2025
