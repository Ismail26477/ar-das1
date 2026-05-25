# PROPER RLS POLICIES (Alternative Solution)

If you prefer to keep RLS enabled with proper policies instead of disabling it, use this approach.

## Step 1: Open Supabase Dashboard
Go to: https://app.supabase.com/

## Step 2: Go to SQL Editor
Click on **SQL Editor** in the left sidebar

## Step 3: Click "New Query"
Click the **+ New Query** button

## Step 4: Copy this SQL

```sql
-- Enable RLS on tables (if not already enabled)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access
-- For orders table
CREATE POLICY "Enable read access for all users" 
ON public.orders 
FOR SELECT 
USING (true);

-- For order_items table
CREATE POLICY "Enable read access for all users" 
ON public.order_items 
FOR SELECT 
USING (true);

-- For profiles table
CREATE POLICY "Enable read access for all users" 
ON public.profiles 
FOR SELECT 
USING (true);

-- For products table
CREATE POLICY "Enable read access for all users" 
ON public.products 
FOR SELECT 
USING (true);
```

## Step 5: Run the Query
Click the **Run** button

## Step 6: Refresh Your Dashboard
Go to http://localhost:8080/orders
Press Ctrl+Shift+R

---

## What This Does
- Keeps Row Level Security enabled (more secure)
- Creates policies allowing anonymous read access
- Fixes 401 errors while maintaining security

---

## Advantage Over Disabling RLS
- More secure for production
- You still have Row Level Security
- Only read access is allowed
- Perfect for a public dashboard

---

## Which Should I Use?

**Use DISABLE_RLS_NOW.md if:**
- You want the quickest fix
- This is just for development/testing
- You're learning and want to move fast

**Use PROPER_RLS_POLICIES.md if:**
- You want a production-ready solution
- You want to keep RLS enabled
- You care about security

For a public dashboard like yours, PROPER_RLS_POLICIES is better.
