# Using Mock Data - Temporary Solution

If you haven't fixed the RLS issues in Supabase yet, you can temporarily use mock data to see your dashboard working.

## Quick Switch to Mock Data

### Step 1: Edit Orders.tsx

Replace this line:
```tsx
import { useOrdersWithBuyers } from "@/hooks/useSupabase";
```

With:
```tsx
import { useMockOrders as useOrdersWithBuyers } from "@/hooks/useMockData";
```

### Step 2: Edit Customers.tsx

Replace this line:
```tsx
import { useCustomers } from "@/hooks/useSupabase";
```

With:
```tsx
import { useMockCustomers as useCustomers } from "@/hooks/useMockData";
```

### Step 3: Edit Index.tsx (Dashboard)

Replace this line:
```tsx
import { useAnalytics } from "@/hooks/useSupabase";
```

With:
```tsx
import { useMockAnalytics as useAnalytics } from "@/hooks/useMockData";
```

### Step 4: Edit Products.tsx

Replace this line:
```tsx
import { useProducts } from "@/hooks/useSupabase";
```

With:
```tsx
import { useMockProducts as useProducts } from "@/hooks/useMockData";
```

## What You'll See

With mock data enabled:
- Dashboard shows realistic numbers
- Orders page shows 5 sample orders
- Customers page shows 5 sample customers
- Products page shows 5 sample products
- No 401 errors in console

## When to Switch Back

Once you've disabled RLS in Supabase:
1. Undo the above changes (use original imports)
2. Hard refresh browser (Ctrl+Shift+R)
3. Your real data will load

## Benefits of Mock Data

- See your dashboard working immediately
- Test functionality without backend
- Verify UI is correct
- Share progress with team

## Drawbacks

- Data is fake/hardcoded
- Changes aren't saved
- Only 5 items per category
- Doesn't reflect real business

## How to Use Both

You could create an environment variable:
```
VITE_USE_MOCK_DATA=true
```

Then in your hooks:
```tsx
const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';
const { data } = useMockData ? useMockOrders() : useOrdersWithBuyers();
```

But for now, manual switching is simplest.
