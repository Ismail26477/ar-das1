# Fix 401 Unauthorized Errors

Your dashboard is getting **401 Unauthorized** errors from Supabase. This means Row Level Security (RLS) is blocking anonymous access.

## Quick Fix - Disable RLS (Development Only)

### Step 1: Go to Supabase Dashboard
1. Visit: https://app.supabase.com
2. Login with your account
3. Click on project: **wngxgbfusesblyumvsmq**

### Step 2: Disable RLS on Tables
1. Go to **SQL Editor**
2. Run this SQL to disable RLS on all tables:

```sql
-- Disable RLS on orders table
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;

-- Disable RLS on order_items table
ALTER TABLE public.order_items DISABLE ROW LEVEL SECURITY;

-- Disable RLS on profiles table
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Disable RLS on products table
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;

-- Disable RLS on categories table
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;

-- Disable RLS on other tables as needed
ALTER TABLE public.reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories DISABLE ROW LEVEL SECURITY;
```

### Step 3: Verify Table Permissions
1. Go to **Authentication > Policies** in left sidebar
2. Click on each table (orders, profiles, etc.)
3. Look for RLS policies - if any exist, they may be blocking access
4. Either delete them or modify them to allow anonymous SELECT

### Step 4: Refresh Your App
```bash
# In your project terminal, hard refresh the browser:
# Press Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
```

Then try again:
- Dashboard: http://localhost:8080
- Orders: http://localhost:8080/orders

---

## Alternative - Allow Anonymous Access with RLS Enabled

If you want to keep RLS enabled, create policies that allow anonymous users to SELECT:

```sql
-- Allow anonymous users to read from orders
CREATE POLICY "Allow anonymous select on orders" ON public.orders
  FOR SELECT
  USING (true);

-- Allow anonymous users to read from profiles
CREATE POLICY "Allow anonymous select on profiles" ON public.profiles
  FOR SELECT
  USING (true);

-- Allow anonymous users to read from products
CREATE POLICY "Allow anonymous select on products" ON public.products
  FOR SELECT
  USING (true);

-- Allow anonymous users to read from order_items
CREATE POLICY "Allow anonymous select on order_items" ON public.order_items
  FOR SELECT
  USING (true);
```

---

## Verify It's Fixed

After making changes, check the console for these errors to disappear:
- `401 (Unauthorized)`
- `Failed to load resource: net::ERR_FAILED`

If they're gone, you should see:
- Dashboard KPI cards with actual numbers
- Orders list loading data
- Customers showing real data

---

## If Still Getting 401 Errors

1. **Check API Key**
   - Make sure your `.env` file has the correct ANON_KEY
   - The key should start with `eyJ...` (a JWT token)

2. **Verify Key has Correct Permissions**
   - In Supabase, go to Settings > API
   - Copy the correct `anon public` key
   - Update your `.env` file with the exact key

3. **Check Table Exists**
   - In Supabase, go to SQL Editor
   - Run: `SELECT * FROM public.orders LIMIT 1;`
   - If table doesn't exist, it won't work

4. **Clear Browser Cache**
   - Press F12 to open DevTools
   - Right-click refresh button > "Empty cache and hard refresh"
   - Or clear browser cache manually

---

## What's Happening

When Row Level Security (RLS) is enabled on a table:
- Users must authenticate
- Policies control what data they can see
- Anonymous requests (without a user session) get 401 errors

Your app uses the ANON_KEY which is meant for public data, but RLS policies are blocking it because they likely require a logged-in user.

**Solution:** Either disable RLS (simplest for development) or create permissive policies (better for production).

---

## Next Steps After Fix

1. Refresh your browser
2. Check that data loads on Dashboard, Orders, and Customers pages
3. No more red 401 errors in console
4. All KPI cards should show actual numbers

If you complete these steps and still get errors, we'll debug further!
