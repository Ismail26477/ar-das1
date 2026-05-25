# DISABLE RLS - COPY AND PASTE THIS

## Step 1: Open Supabase Dashboard
Go to: https://app.supabase.com/

## Step 2: Go to SQL Editor
Click on **SQL Editor** in the left sidebar

## Step 3: Click "New Query"
Click the **+ New Query** button (top right)

## Step 4: Copy this exact SQL code

```sql
-- Disable RLS on all tables
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

## Step 5: Paste into the Query Box
- Clear the default SQL
- Paste the code above
- Make sure it looks exactly like above

## Step 6: Run the Query
Click the **Run** button (or Ctrl+Enter)

## Step 7: Check for "Success"
You should see green text saying "Success" - if you see red text, there's an error

## Step 8: Refresh Your Dashboard
Go to http://localhost:8080/orders
Press Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

## Step 9: Check Console
Press F12 to open Developer Tools
Click **Console** tab
You should see **NO RED 401 ERRORS**

---

## What This Does
- Removes Row Level Security from all tables
- Allows your ANON_KEY to read all data
- Fixes all 401 Unauthorized errors

## After This Works
Once you see data loading on your dashboard, it's working perfectly!

---

## Still Getting 401 Errors?

**Try This:**
1. Close your browser completely
2. Clear browser cache (Ctrl+Shift+Delete)
3. Go to http://localhost:8080
4. Press F5 to refresh

---

## Questions?

If RLS disable didn't work:
1. Go back to Supabase Dashboard
2. Click **Authentication** → **Policies**
3. Check that there are NO RLS policies listed for your tables
4. If policies exist, delete them manually

Or read: `PROPER_RLS_POLICIES.md` for a more permanent solution
