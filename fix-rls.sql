-- ============================================================================
-- FIX 401 UNAUTHORIZED ERRORS - DISABLE RLS FOR TESTING
-- ============================================================================
-- 
-- If your tables have RLS enabled, anonymous users get 401 Unauthorized.
-- Run this script in your Supabase SQL Editor to allow public access.
--
-- CAUTION: This disables RLS. Only do this for testing/development.
-- For production, configure specific RLS policies instead.
--
-- ============================================================================

-- Disable RLS on all tables to allow public read access
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE addresses DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- AFTER TESTING: ENABLE PROPER RLS POLICIES
-- ============================================================================
-- 
-- Once you verify data loads, replace the above with proper RLS policies:
--
-- For PUBLIC READ access (products, categories):
-- 
-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow public read" ON products
--   FOR SELECT USING (true);
--
-- For USER-SPECIFIC access (orders, cart):
--
-- ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users can view own orders" ON orders
--   FOR SELECT USING (auth.uid() = user_id);
--
-- ============================================================================
