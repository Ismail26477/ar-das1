# AR Computer Dashboard - Supabase Integration

## Overview
This is an admin dashboard for the AR Computer e-commerce platform, connected directly to your Supabase database.

## Connection Details
✅ **Already Configured** - The following Supabase credentials are set in `.env`:

```
VITE_SUPABASE_URL=https://wngxgbfusesblyumvsmq.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InduZ3hnYmZ1c2VzYmx5dW12c21xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5ODk1MjksImV4cCI6MjA4ODU2NTUyOX0.eXPs8WHEFfzBnOyG9REZowfgDEmFpoF6cFuonjfClI4
```

## Database Tables Mapped to Dashboard

### Orders Page (`/orders`)
- **Table:** `orders`
- **Columns Used:**
  - `id` - Order ID
  - `order_number` - Display identifier (e.g., ORD-20260110-XXXXX)
  - `user_id` - Links to customer
  - `total` - Order amount
  - `status` - processing | shipped | delivered | cancelled | returned
  - `payment_status` - pending | paid | failed | refunded
  - `payment_method` - razorpay | cod
  - `shipping_address` - Delivery address
  - `created_at` - Order date
  - `order_items` - Related line items

**Related:** `auth.users`, `profiles`, `order_items`

### Customers Page (`/customers`)
- **Table:** `profiles` (joined with `auth.users` and `orders`)
- **Columns Used:**
  - `user_id` - Customer ID
  - `full_name` - Customer name
  - `phone` - Contact number
  - `avatar_url` - Profile image
  - `created_at` - Join date

**Calculated Fields:**
- `totalOrders` - Count from `orders` table
- `totalSpent` - Sum of `orders.total` where `payment_status='paid'`

### Products Page (`/products`)
- **Table:** `products`
- **Columns:**
  - `id` - Product slug
  - `name` - Product title
  - `description` - Details
  - `brand` - Manufacturer
  - `price` - MRP
  - `discount_price` - Selling price
  - `stock` - Available quantity
  - `rating` - Average rating
  - `review_count` - Total reviews
  - `images` - JSONB array of URLs
  - `category_id` - Links to categories
  - `subcategory_id` - Links to subcategories

### Dashboard Overview (`/`)
**Fetches:**
- Total orders count
- Total revenue (paid orders only)
- New customers (last 30 days)
- Average order value
- Monthly revenue chart data

## Data Fetching Hook
All Supabase queries are in `/src/hooks/useSupabase.ts`:

```typescript
// Examples:
import { useOrders, useCustomers, useProducts, useAnalytics } from "@/hooks/useSupabase";

const { data: orders, isLoading } = useOrders();
const { data: customers } = useCustomers();
```

## Key Features

✅ **No Login Required** - Dashboard is publicly accessible  
✅ **Real-time Data** - Fetches from live Supabase database  
✅ **Search & Filter** - Find orders/customers with advanced filters  
✅ **Status Management** - Track order and payment statuses  
✅ **Customer Tiers** - Auto-calculated based on total spent  
✅ **Responsive Design** - Works on desktop & mobile  

## Available Pages

1. **Dashboard** (`/`) - KPIs and overview
2. **Orders** (`/orders`) - Order management
3. **Products** (`/products`) - Product catalog
4. **Customers** (`/customers`) - Customer database
5. **Analytics** (`/analytics`) - Coming soon
6. **Reviews** (`/reviews`) - Product reviews
7. **And more...** - See sidebar navigation

## Data Models

### Order Status Flow
```
pending → processing → shipped → delivered
             ↓
           cancelled
             ↓
           returned
```

### Payment Statuses
- `pending` - Awaiting payment
- `paid` - Successfully received
- `failed` - Payment failed
- `refunded` - Money returned

### Customer Tiers (by totalSpent)
- Platinum: ₹10,00,000+
- Gold: ₹5,00,000 - ₹9,99,999
- Silver: ₹2,00,000 - ₹4,99,999
- Bronze: < ₹2,00,000

## API Integration

The dashboard uses `@supabase/supabase-js` with React Query for:
- ✅ Automatic caching
- ✅ Background refetching
- ✅ Error handling
- ✅ Loading states

## Security Notes

- ⚠️ This uses the **public ANON key** - read-only by default due to RLS
- ✅ All queries respect Supabase Row Level Security (RLS)
- ✅ No sensitive data exposed in frontend code
- ⚠️ For admin write operations, use the service-role key server-side only

## Running the Dashboard

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Dashboard will be available at `http://localhost:5173`

## Next Steps

1. ✅ Orders page is fully functional
2. ✅ Customers page shows all users with spend data
3. ⏳ Products CRUD operations (ready to add)
4. ⏳ Analytics dashboard (ready to add)
5. ⏳ Review moderation (ready to add)

## Troubleshooting

**"No orders showing"**
- Check that `orders` table has data
- Verify RLS policies allow public SELECT
- Check browser console for errors

**"Customers not loading"**
- Ensure `profiles` table is populated
- Verify `auth.users` has user records
- Check Supabase connection status

**Columns not matching**
- Some columns may need to be added to views
- SQL queries in `useSupabase.ts` are customizable
- Edit queries to match your exact schema

## Support

For questions about:
- **Supabase schema:** Check `/user_read_only_context/text_attachments/ar-computer--website-documentation-U9sjq.md`
- **React/Vite:** See package.json for dependencies
- **Component styling:** Using Tailwind CSS + shadcn/ui
