# Supabase Connection Test Guide

## Quick Test (30 seconds)

Visit this URL while your app is running:
```
http://localhost:5173/test-connection
```

## What Gets Tested

The connection test page verifies:

1. **Supabase Connection** - Can your app reach Supabase servers?
2. **Orders Table** - Can you read from the orders table?
3. **Profiles Table** - Can you read from the profiles table?
4. **Products Table** - Can you read from the products table?

## Expected Results

### ✅ All Tests Pass

You should see:
- All 4 tests with green checkmarks
- "All Connected" status at the top
- Record counts for each table

This means:
- Your Supabase credentials are correct
- Your environment variables are set properly
- Your database tables are accessible
- Your dashboard will work perfectly

### ⚠️ Some Tests Fail

**Possible causes:**

1. **"Connection failed"**
   - Check your internet connection
   - Verify `.env` file has correct values
   - Make sure `VITE_` prefix is present

2. **"Cannot access table"**
   - Table doesn't exist in your database
   - RLS policies prevent read access (unlikely with anon key)
   - Wrong project ID in .env

## Environment Variables

Your `.env` file should have:

```env
VITE_SUPABASE_URL=https://wngxgbfusesblyumvsmq.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InduZ3hnYmZ1c2VzYmx5dW12c21xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5ODk1MjksImV4cCI6MjA4ODU2NTUyOX0.eXPs8WHEFfzBnOyG9REZowfgDEmFpoF6cFuonjfClI4
```

**Important:** Must use `VITE_` prefix for Vite to expose to client!

## Troubleshooting

### Issue: "Cannot reach server"

**Solution:**
1. Check internet connection
2. Verify Supabase is not down (check status.supabase.com)
3. Restart dev server: `npm run dev`

### Issue: "Cannot access table"

**Solution:**
1. Verify table name is correct in Supabase dashboard
2. Check if RLS is enabled (shouldn't block anon read)
3. Make sure your project ID matches (.supabase.co)

### Issue: Tests show "Testing..." forever

**Solution:**
1. Check browser console (F12 > Console tab)
2. Look for error messages
3. Restart the dev server
4. Clear browser cache

## How to Read the Console

If tests fail, check browser console for detailed errors:

1. Press **F12** to open Developer Tools
2. Click **Console** tab
3. Look for red error messages
4. Error will show exact problem (missing table, permission denied, etc.)

## What Each Error Means

**"permission denied for schema public"**
- RLS policy issue (shouldn't happen with public schema)

**"relation does not exist"**
- Table name is wrong or doesn't exist
- Check table spelling in Supabase dashboard

**"could not connect to server"**
- Network issue or wrong URL
- Check `.env` file URL is exactly correct

**"invalid jwt"**
- API key is wrong or expired
- Copy/paste the full key from Supabase dashboard

## Next Steps After Passing

Once all tests pass, visit:

- **Dashboard:** http://localhost:5173/
- **Orders:** http://localhost:5173/orders
- **Customers:** http://localhost:5173/customers

You should see real data from your database!

## Manual Connection Test (No UI)

Open browser console (F12) and run:

```javascript
// Check if Supabase is initialized
const { supabase } = await import('/src/integrations/supabase/client.ts');
console.log('Supabase client:', supabase);

// Try a simple query
const { data, error } = await supabase.from('orders').select('count', { count: 'exact' });
console.log('Orders count:', data);
console.log('Error:', error);
```

You should see a count of orders and no error.

## Environment Check Script

Add this to your browser console to debug:

```javascript
// Check environment variables
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_PUBLISHABLE_KEY:', import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.substring(0, 20) + '...');

// Check Supabase client
import { supabase } from '/src/integrations/supabase/client.ts';
console.log('Supabase ready:', !!supabase);
```

## Verified Configuration

Your Supabase project details:

- **Project ID:** wngxgbfusesblyumvsmq
- **URL:** https://wngxgbfusesblyumvsmq.supabase.co
- **Region:** (inferred from URL)
- **API Key Type:** Anon (public, read-only by default)

## Security Notes

✅ **Safe to Share:**
- Project URL (public)
- Anon API key (read-only)
- Project ID (public)

❌ **Never Share:**
- Service role key (write access)
- Database password
- Private keys

## FAQ

**Q: Do I need to run any database migrations?**  
A: No, the tables should already exist in your Supabase project.

**Q: Can I modify the test page?**  
A: Yes! It's just a regular React component in `src/pages/ConnectionTest.tsx`.

**Q: What if tests pass but dashboard is empty?**  
A: Your tables exist but might not have data. Add test data in Supabase dashboard.

**Q: How often should I run this test?**  
A: Once after setup. If your dashboard stops working, run it again to diagnose.

**Q: Can this test write data?**  
A: No, it's read-only. Safe to run anytime.

## Still Having Issues?

Check these files for clues:

1. **`.env`** - Environment variables
2. **`src/integrations/supabase/client.ts`** - Supabase client setup
3. **`src/hooks/useSupabase.ts`** - Data fetching logic
4. Browser **Console** (F12) - Error messages

---

**Status:** Ready to test  
**Test URL:** http://localhost:5173/test-connection  
**Command:** `npm run dev`
