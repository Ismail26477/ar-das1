# Testing Supabase Connection - Step by Step

## 1️⃣ Start the Development Server

### Command
```bash
npm run dev
```

### What to Expect
You should see output like:
```
  VITE v4.x.x  build 0.xx.x
  ➜  local:   http://localhost:5173/
  ➜  press h + enter to show help
```

✅ **Success:** Development server is running

---

## 2️⃣ Open the Connection Test Page

### In Your Browser
Go to: **http://localhost:5173/test-connection**

Or click here (if dev server is running):
[Open Connection Test](http://localhost:5173/test-connection)

### What You Should See
A page titled "Supabase Connection Test" with 4 test items below

✅ **Success:** Page loads without errors

---

## 3️⃣ Wait for Tests to Complete

### Initial State
When the page first loads:
- All 4 tests show "Testing..."
- A spinning loader next to each test
- Takes 2-5 seconds

### Example
```
Supabase Connection  ⏳ Testing...
Orders Table         ⏳ Testing...
Profiles Table       ⏳ Testing...
Products Table       ⏳ Testing...
```

✅ **Success:** Tests are running

---

## 4️⃣ Check Test Results

### ✅ All Tests Pass (GREEN)

You should see:
```
✅ Supabase Connection: Connected successfully
   URL: https://wngxgbfusesblyumvsmq.supabase.co

✅ Orders Table: Table accessible
   Found 47 records

✅ Profiles Table: Table accessible
   Found 23 records

✅ Products Table: Table accessible
   Found 156 records
```

**Status Badge:** "All Connected" (green)

**This means:**
- Your environment variables are correct
- Your Supabase account is accessible
- Your database tables exist
- Your dashboard will work perfectly

### ❌ Tests Fail (RED)

Example failure:
```
❌ Supabase Connection: Connection failed
   Error: Network request failed

❌ Orders Table: Cannot access table
   Error: No rows returned (table doesn't exist)
```

**Status Badge:** "Check Errors" (red)

**Next Steps:**
- See **Troubleshooting** section below

---

## 5️⃣ (If All Pass ✅) Visit Your Dashboard

Once all tests pass, visit:

### Dashboard
```
http://localhost:5173/
```
You should see:
- KPI cards with real data
- Revenue metrics
- Order counts
- Customer metrics

### Orders Page
```
http://localhost:5173/orders
```
You should see:
- List of real orders
- Customer names and emails
- Order totals
- Status badges

### Customers Page
```
http://localhost:5173/customers
```
You should see:
- List of real customers
- Total spending per customer
- Customer tiers
- Contact information

✅ **Success:** All pages show data!

---

## Troubleshooting Guide

### ❌ Error: "Cannot reach server"

**Possible Causes:**
1. No internet connection
2. Firewall blocking Supabase
3. Supabase servers are down

**Solutions:**

✅ **Step 1:** Check internet connection
```bash
# Try to ping Google
ping google.com

# If that works, try Supabase
ping wngxgbfusesblyumvsmq.supabase.co
```

✅ **Step 2:** Check Supabase status
- Visit: https://status.supabase.com
- Look for red alerts
- If down, wait for recovery

✅ **Step 3:** Restart dev server
```bash
# Press Ctrl+C to stop
# Then restart
npm run dev
```

---

### ❌ Error: "Cannot access table"

**Possible Causes:**
1. Table doesn't exist in your database
2. Table has a different name
3. RLS policy preventing access

**Solutions:**

✅ **Step 1:** Open browser developer tools
- Press **F12**
- Click **Console** tab
- Look for error message details

✅ **Step 2:** Check table name in Supabase

1. Go to: https://app.supabase.com/project/wngxgbfusesblyumvsmq
2. Click **SQL Editor** on left
3. Check if table `orders` exists
4. If not, it needs to be created

✅ **Step 3:** Verify environment variables
```bash
# Check .env file
cat .env

# Should show:
# VITE_SUPABASE_URL=https://wngxgbfusesblyumvsmq.supabase.co
# VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGc...
```

---

### ❌ Error: "Tests show Testing... forever"

**Possible Causes:**
1. Tests are hanging/frozen
2. Network timeout
3. JavaScript error

**Solutions:**

✅ **Step 1:** Check browser console
- Press **F12**
- Click **Console** tab
- Look for red error messages

✅ **Step 2:** Try refreshing
- Press **F5** or **Ctrl+R**
- Wait 5 seconds
- Check if tests complete

✅ **Step 3:** Try "Run Tests Again" button
- Click the blue button
- Wait for tests to complete

✅ **Step 4:** Restart everything
```bash
# Stop dev server (Ctrl+C)
npm run dev

# In browser, refresh page (F5)
```

---

### ❌ Error: "Page doesn't load at all"

**Possible Causes:**
1. Dev server not running
2. Wrong URL
3. JavaScript error

**Solutions:**

✅ **Step 1:** Verify dev server is running
```bash
# You should see:
# ➜  local:   http://localhost:5173/

# If not, start it:
npm run dev
```

✅ **Step 2:** Check URL is exactly correct
```
http://localhost:5173/test-connection
```
- Must be lowercase
- No extra spaces
- Include `/test-connection` at end

✅ **Step 3:** Check for JavaScript errors
- Press **F12**
- Click **Console**
- Look for red error messages
- Note the error text

---

## Manual Testing (Advanced)

If the test page doesn't work, you can test manually in the browser console:

### Step 1: Open Browser Console
- Press **F12**
- Click **Console** tab

### Step 2: Run This Code
```javascript
// Import and test Supabase
(async () => {
  const { supabase } = await import('/src/integrations/supabase/client.ts');
  
  // Test 1: Check if client exists
  console.log('✅ Supabase client created');
  
  // Test 2: Try a simple query
  const { count, error } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });
  
  if (error) {
    console.error('❌ Error:', error.message);
  } else {
    console.log(`✅ Orders table accessible (${count} records)`);
  }
})();
```

### Step 3: Check Output
You should see in console:
```
✅ Supabase client created
✅ Orders table accessible (47 records)
```

If you see errors, note them for troubleshooting.

---

## Common Errors Explained

| Error | Meaning | Solution |
|-------|---------|----------|
| `Network request failed` | Can't reach Supabase servers | Check internet, restart server |
| `permission denied` | RLS policy blocking access | Shouldn't happen with anon key |
| `relation does not exist` | Table doesn't exist | Create table in Supabase |
| `invalid jwt` | API key is wrong | Check `.env` file |
| `ECONNREFUSED` | Dev server not running | Run `npm run dev` |
| `404 Not Found` | Wrong URL | Check URL spelling |

---

## Environment Variables Checklist

Your `.env` file should have these two lines:

```env
VITE_SUPABASE_URL=https://wngxgbfusesblyumvsmq.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InduZ3hnYmZ1c2VzYmx5dW12c21xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5ODk1MjksImV4cCI6MjA4ODU2NTUyOX0.eXPs8WHEFfzBnOyG9REZowfgDEmFpoF6cFuonjfClI4
```

### Check These:
- ✅ Both lines present
- ✅ `VITE_` prefix on both
- ✅ No spaces around `=`
- ✅ No quotes around values
- ✅ Full API key copied (very long string)

---

## Success Checklist

- [ ] Dev server running (`npm run dev`)
- [ ] Can reach http://localhost:5173
- [ ] Connection test page loads
- [ ] All 4 tests show results (not stuck on "Testing...")
- [ ] All tests have green checkmarks
- [ ] "All Connected" status shown
- [ ] Record counts displayed for each table
- [ ] Can navigate to dashboard and see data
- [ ] Orders page shows real orders
- [ ] Customers page shows real customers

---

## Quick Commands

**Start server:**
```bash
npm run dev
```

**Open connection test:**
```
http://localhost:5173/test-connection
```

**View environment variables:**
```bash
cat .env
```

**Check for errors:**
- Press F12 in browser
- Look for red text in Console

**Restart everything:**
```bash
# Stop: Ctrl+C
# Start again:
npm run dev
```

---

## Still Having Issues?

### Check Documentation
1. [CONFIGURATION_STATUS.md](./CONFIGURATION_STATUS.md) - Current config status
2. [CONNECTION_TEST.md](./CONNECTION_TEST.md) - Detailed test guide
3. [DATABASE_SCHEMA_REFERENCE.md](./DATABASE_SCHEMA_REFERENCE.md) - Schema info

### Check Files
1. `.env` - Environment variables
2. `src/integrations/supabase/client.ts` - Client setup
3. Browser console (F12) - Error messages

### Get More Info
1. Check Supabase dashboard: https://app.supabase.com
2. Check project status: https://status.supabase.com
3. Check internet connection

---

## Next Steps After Success ✅

Once all tests pass green:

1. **Explore Dashboard**
   - http://localhost:5173/

2. **Check Orders**
   - http://localhost:5173/orders

3. **View Customers**
   - http://localhost:5173/customers

4. **Start Building**
   - Add more pages
   - Connect remaining tables
   - Build new features

---

**Test Status:** Ready to begin  
**Test URL:** http://localhost:5173/test-connection  
**Expected Time:** 30 seconds  
**Difficulty:** Easy
