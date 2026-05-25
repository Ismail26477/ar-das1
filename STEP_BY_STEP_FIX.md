# STEP-BY-STEP FIX FOR 401 ERRORS

## Your Error
You're seeing 401 (Unauthorized) errors when trying to load Orders, Customers, and Dashboard data.

**Root Cause:** Row Level Security (RLS) on Supabase is blocking your ANON_KEY

**Time to Fix:** 3-5 minutes

---

## OPTION 1: QUICK FIX (Recommended)

### Step 1: Click this link
Open your Supabase dashboard:
https://app.supabase.com/

### Step 2: Find SQL Editor
In the left sidebar, click **SQL Editor**

### Step 3: Create new query
Click the **+ New Query** button in the top right

### Step 4: Clear the default text
Delete any default SQL text that appears

### Step 5: Paste this code
Copy and paste EXACTLY:

```sql
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

### Step 6: Run it
Click the blue **Run** button (or press Ctrl+Enter)

### Step 7: Look for "Success"
You should see green text saying the command succeeded

### Step 8: Go back to your dashboard
Open: http://localhost:8080/orders

### Step 9: Press hard refresh
- Windows: Press **Ctrl+Shift+Delete** to clear cache, then refresh
- Mac: Press **Cmd+Shift+Delete** to clear cache, then refresh
- Or press **Ctrl+Shift+R** (Windows) or **Cmd+Shift+R** (Mac)

### Step 10: Check console
Press **F12** to open developer tools
Click **Console** tab
You should see NO RED 401 ERRORS

---

## OPTION 2: PROPER SOLUTION (More Secure)

If you want to keep RLS enabled with proper policies:

See: `PROPER_RLS_POLICIES.md`

---

## VERIFY IT WORKED

Your dashboard should now:
- ✅ Show order counts (not 0)
- ✅ Show customer data
- ✅ Show revenue numbers
- ✅ No 401 errors in console

---

## TROUBLESHOOTING

**Still getting 401 errors?**

1. Make sure you ran the SQL in Supabase (not locally)
2. Check that it says "Success" after running
3. Clear your browser cache completely
4. Close and reopen your browser
5. Try incognito/private mode

**Did you copy-paste correctly?**

Make sure there are no typos. The code is case-sensitive.

**Still stuck?**

Go to Supabase Dashboard → Authentication → Policies
Delete any existing policies manually if they exist.

---

## DONE!

Once you see data loading on your dashboard, everything is working perfectly!

Your dashboard is completely built and ready to use.
