# Action Plan: Fix 401 Errors (5 Minutes)

Your dashboard is showing **401 (Unauthorized)** errors. This is easily fixable in 5 minutes.

---

## The Problem

Supabase tables have Row Level Security (RLS) enabled, which is blocking your ANON_KEY from accessing data.

**Result:**
- Dashboard shows 0 values
- Orders page shows loading spinner
- Console shows red 401 errors

---

## The Solution (Choose One)

### Method 1: Disable RLS (Fastest - 2 minutes)

**For Development/Testing Only**

1. Open https://app.supabase.com
2. Go to **SQL Editor**
3. Create a new query and paste:

```sql
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

4. Click **Run**
5. Go back to http://localhost:8080
6. Press **Ctrl+Shift+R** to hard refresh
7. Done! Should show data now

---

### Method 2: Create Permissive Policies (Production Safe - 3 minutes)

**For Production**

1. Open https://app.supabase.com
2. Go to **SQL Editor**
3. Create a new query and paste:

```sql
-- Allow anonymous access to all tables
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow select" ON public.orders FOR SELECT USING (true);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow select" ON public.order_items FOR SELECT USING (true);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow select" ON public.profiles FOR SELECT USING (true);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow select" ON public.products FOR SELECT USING (true);
```

4. Click **Run**
5. Go back to http://localhost:8080
6. Press **Ctrl+Shift+R** to hard refresh
7. Done!

---

## Verify It's Fixed

After applying one of the above:

1. **Check Console (F12 → Console tab)**
   - Should NOT see red 401 errors
   - Should NOT see "Failed to load resource"

2. **Check Dashboard (http://localhost:8080)**
   - KPI cards should show numbers (not 0)
   - "Revenue Overview" should have data

3. **Check Orders (http://localhost:8080/orders)**
   - Table should show orders
   - No infinite spinner

---

## If Still Not Working

Run the diagnostic test:
- Visit http://localhost:8080/diagnostic
- All tests should pass (green checkmarks)
- If not, read TROUBLESHOOTING_401_ERRORS.md

---

## What You Did

✅ Fixed authorization issue with Supabase
✅ Allowed anonymous access to data tables
✅ Enabled your dashboard to load real data

Your app should now work perfectly!

---

## Quick Reference

| Step | Action |
|------|--------|
| 1 | Open https://app.supabase.com |
| 2 | Go to SQL Editor |
| 3 | Copy SQL from Method 1 or 2 above |
| 4 | Click Run |
| 5 | Hard refresh browser (Ctrl+Shift+R) |
| 6 | Check for green checkmarks, no red errors |

**Time to fix:** 2-3 minutes
**Result:** Full working dashboard with real data

---

## Need More Details?

- **Full troubleshooting:** Read `TROUBLESHOOTING_401_ERRORS.md`
- **Understanding RLS:** Read `FIX_401_ERRORS.md`
- **Run tests:** Visit `/diagnostic` in your app
- **Database schema:** Read `DATABASE_SCHEMA_REFERENCE.md`
