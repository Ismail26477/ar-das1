# Troubleshooting 401 Unauthorized Errors

Your dashboard is showing **401 (Unauthorized)** errors when trying to fetch data from Supabase. This guide will help you fix it.

---

## What's Happening?

The 401 error means:
- Your app is correctly connecting to Supabase
- Your app is correctly sending requests
- **BUT** Supabase is rejecting the requests as unauthorized

This is almost always caused by **Row Level Security (RLS)** being enabled on your tables.

---

## Quick Diagnosis

### Step 1: Check the Diagnostic Page
1. Open your app: http://localhost:8080/diagnostic
2. Look at the test results
3. If you see "Orders Table Access: error" or "Profiles Table Access: error" with 401, continue to Step 2

### Step 2: Verify Console Errors
1. Press F12 to open Developer Tools
2. Click the "Console" tab
3. Look for red errors mentioning:
   - `401 (Unauthorized)`
   - `orders`
   - `profiles`
   - `GET https://wngxgbfusesblyumvsmq.supabase.co/rest/...`

---

## Solution: Fix RLS (Row Level Security)

### Option A: Disable RLS (Easiest - Development Only)

**Step 1: Open Supabase Dashboard**
1. Go to https://app.supabase.com
2. Sign in with your account
3. Select your project: **wngxgbfusesblyumvsmq**

**Step 2: Run SQL to Disable RLS**
1. Click **SQL Editor** in the left sidebar
2. Click **+ New Query**
3. Copy and paste this SQL:

```sql
-- Disable RLS on all tables
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories DISABLE ROW LEVEL SECURITY;
```

4. Click **Run** (or press Cmd/Ctrl + Enter)
5. You should see "Executed successfully"

**Step 3: Refresh Your App**
1. Go back to http://localhost:8080
2. Press **Ctrl+Shift+R** (Windows/Linux) or **Cmd+Shift+R** (Mac) to hard refresh
3. Check the console - errors should be gone
4. Dashboard should now show data

---

### Option B: Keep RLS Enabled (Production Safe)

If you want to keep RLS enabled for security, create policies that allow anonymous SELECT:

**Step 1: In Supabase SQL Editor, run:**

```sql
-- Create policies for anonymous access
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous select" ON public.orders
  FOR SELECT
  USING (true);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous select" ON public.order_items
  FOR SELECT
  USING (true);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous select" ON public.profiles
  FOR SELECT
  USING (true);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous select" ON public.products
  FOR SELECT
  USING (true);
```

**Step 2: Refresh your app** (Ctrl+Shift+R)

---

## Verify It's Fixed

After making changes, check these indicators:

### 1. No More Red Errors in Console
- Press F12 → Console tab
- You should NOT see any red 401 errors
- Only blue info messages or warnings are fine

### 2. Dashboard Shows Data
- Visit http://localhost:8080
- The KPI cards should show numbers (not 0)
- Revenue Overview should show data

### 3. Orders Page Loads
- Visit http://localhost:8080/orders
- Table should show orders (not spinning loader)
- Search and filters should work

### 4. Customers Page Works
- Visit http://localhost:8080/customers
- Customer table should show data
- No loading spinner forever

---

## If Still Getting Errors

### Check 1: Did RLS Actually Disable?
1. In Supabase, go to **Authentication > Policies**
2. Click on "orders" table
3. Look for any policies listed
4. If policies exist:
   - Click the three dots (...) next to each one
   - Click "Delete" to remove them
5. Repeat for "profiles", "products", etc.

### Check 2: Is the Right Key in .env?

Your `.env` file should have:
```
VITE_SUPABASE_URL=https://wngxgbfusesblyumvsmq.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGci...
```

**To get the correct key:**
1. In Supabase, click **Settings > API** (left sidebar)
2. Under "Your API keys", copy the `anon` public key
3. Paste it in your `.env` as `VITE_SUPABASE_PUBLISHABLE_KEY`
4. Save the file
5. The dev server will auto-reload

### Check 3: Restart Dev Server

Sometimes the server caches old values:
1. In your terminal, press **Ctrl+C** to stop the server
2. Run: `npm run dev`
3. Wait for "ready in X ms" message
4. Refresh the browser

### Check 4: Clear Browser Cache

Old cached data might be causing issues:
1. Press F12 to open DevTools
2. Right-click the refresh button
3. Click "Empty cache and hard refresh"
4. Wait for the page to fully reload

---

## Understanding RLS

Row Level Security (RLS) in Supabase works like this:

**Without RLS (Default):**
- Any request with a valid API key can read/write
- Perfect for public data
- Anyone with your ANON_KEY can access data

**With RLS Enabled:**
- Tables are locked by default
- Only authenticated users can access
- Policies control what data they see
- Anonymous requests (no user session) get 401

Your app uses an **anonymous API key**, which means:
- ✅ Without RLS: Everything works
- ❌ With RLS: 401 errors unless you have policies

---

## Next Steps

After fixing the 401 errors:

1. ✅ Verify all pages load without errors
2. ✅ Check that data displays correctly
3. ✅ Test search and filter functionality
4. ✅ Review browser console (should be clean)

Then you can:
- View dashboard metrics
- Manage orders
- View customer data
- Explore other features

---

## Need More Help?

**Error says "User not found"?**
- This happens when RLS policies check for a user
- Solution: Disable RLS or use Option B above

**Error says "permission denied"?**
- Your API key lacks permission
- Solution: Use the correct ANON_KEY or disable RLS

**Still stuck?**
1. Read FIX_401_ERRORS.md
2. Try the Diagnostic page: /diagnostic
3. Run all tests again
4. Check Supabase Dashboard for any alerts

---

## Summary

| Issue | Cause | Fix |
|-------|-------|-----|
| 401 errors | RLS enabled | Disable RLS or create policies |
| undefined values | Data not loading | Same as above |
| Spinning loader | API call stuck | Same as above |
| API key error | Wrong key in .env | Copy correct key from Supabase |

After you disable RLS (or create policies), everything should work perfectly!
