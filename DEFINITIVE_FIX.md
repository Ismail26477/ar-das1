# How to Fix 401 Errors - Definitive Guide

## Problem Status
Your dashboard shows 401 errors because Supabase Row Level Security (RLS) is enabled and blocking your ANON_KEY from accessing data.

## Solution Steps

### Step 1: Verify RLS Status in Supabase

1. Go to: https://app.supabase.com/project/wngxgbfusesblyumvsmq
2. Click: **Authentication** (left sidebar)
3. Click: **Policies** tab
4. Look at each table (orders, profiles, products, etc.)
5. You should see RLS is either:
   - **Enabled** (red) = Still blocked
   - **Disabled** (green) = Should be working

### Step 2: Disable RLS on All Tables

If you see RLS is still **Enabled (red)**, follow these steps:

**Method A: Using SQL (Fastest)**

1. Go to: https://app.supabase.com/project/wngxgbfusesblyumvsmq
2. Click: **SQL Editor** (left sidebar)
3. Click: **+ New Query** (top right)
4. **IMPORTANT:** Copy the EXACT code below:

```sql
-- Disable RLS on all tables
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories DISABLE ROW LEVEL SECURITY;
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE addresses DISABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE shipments DISABLE ROW LEVEL SECURITY;
```

5. Click the blue **Run** button (bottom right)
6. Wait for: "Success" message in green
7. You should see output like:
   ```
   ALTER TABLE
   ```

**Method B: Using UI (If SQL doesn't work)**

1. Go to: https://app.supabase.com/project/wngxgbfusesblyumvsmq
2. Click: **Authentication** (left sidebar)
3. Click: **Policies** tab
4. For each table (orders, profiles, products, etc.):
   - Click the table name
   - Find the toggle: **Enable RLS**
   - Toggle it **OFF** (should be gray/disabled)
5. Repeat for all tables

### Step 3: Verify the Fix Worked

1. Go to: http://localhost:8080
2. Press: **Ctrl+Shift+R** (Windows) or **Cmd+Shift+R** (Mac)
   - This does a hard refresh to clear cache
3. Open: **F12 Developer Tools** → **Console**
4. Look for 401 errors:
   - If you still see red 401 errors = RLS not disabled
   - If you see NO 401 errors = Success!

### Step 4: Check Your Dashboard

After successful RLS fix, you should see:

- Dashboard: Numbers showing (not 0)
- Orders page: Order list displaying
- Customers page: Customer list displaying
- No red errors in console

## If It Still Doesn't Work

**Try These Steps:**

1. **Hard refresh the page:**
   - Ctrl+Shift+R (Windows)
   - Cmd+Shift+R (Mac)
   - Or: Close and reopen browser tab

2. **Check your .env file:**
   ```
   cat .env
   ```
   You should see:
   ```
   VITE_SUPABASE_URL=https://wngxgbfusesblyumvsmq.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGc...
   ```

3. **Check if RLS is actually disabled:**
   - Go to: https://app.supabase.com/project/wngxgbfusesblyumvsmq/auth/policies
   - Look for each table
   - Click each one
   - Verify the toggle says **RLS is disabled**

4. **Clear browser cache:**
   - Press: Ctrl+Shift+Delete
   - Select: "All time"
   - Click: Clear data

## Complete SQL Script (Copy All)

If the above SQL doesn't work, try this complete version:

```sql
-- First, try simple disable commands
ALTER TABLE IF EXISTS public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.subcategories DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.addresses DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.cart_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.payment_transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.shipments DISABLE ROW LEVEL SECURITY;
```

## Success Indicators

Once RLS is disabled, you'll see:
- No more 401 errors in console
- Dashboard shows real data
- All pages load correctly
- Orders show actual order numbers
- Customers show real customer data

## Contact Support

If none of this works:
- Go to: https://app.supabase.com/support
- Describe: "RLS is blocking ANON_KEY access"
- Include: Project ID: wngxgbfusesblyumvsmq
