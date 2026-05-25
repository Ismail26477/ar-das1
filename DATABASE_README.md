# 🗄️ Database Integration - Complete Guide

Your Supabase database has been fully integrated with proper TypeScript types, React Query hooks, and comprehensive documentation.

## ⚡ Quick Start (5 Minutes)

### 1️⃣ Test Connection
```typescript
import DatabaseTest from '@/components/DatabaseTest';

export default function TestPage() {
  return <DatabaseTest />;
}
```
Visit the page → You should see green checkmarks for all 11 tables.

### 2️⃣ Use Hooks in Components
```typescript
import { useProducts } from '@/hooks/useDatabase';

function ProductList() {
  const { data: products, isLoading } = useProducts();
  
  if (isLoading) return <p>Loading...</p>;
  
  return (
    <div>
      {products?.items.map(p => (
        <div key={p.id}>
          <h3>{p.name}</h3>
          <p>${p.price}</p>
        </div>
      ))}
    </div>
  );
}
```

### 3️⃣ Add to Cart
```typescript
import { useAddToCart } from '@/hooks/useDatabase';

function AddToCart({ productId, userId }: any) {
  const { mutate: addToCart } = useAddToCart();
  
  return (
    <button onClick={() => addToCart({
      user_id: userId,
      product_id: productId,
      quantity: 1,
    })}>
      Add to Cart
    </button>
  );
}
```

## 📦 What You Have

### Code Files (1,556 lines)
| File | Purpose |
|------|---------|
| `src/types/database.ts` | TypeScript types for all tables |
| `src/hooks/useDatabase.ts` | 30+ React Query hooks |
| `src/services/databaseService.ts` | Direct database access functions |
| `src/components/DatabaseTest.tsx` | Diagnostic component |

### Documentation (4 Guides)
| File | Content |
|------|---------|
| `DATABASE_SETUP_GUIDE.md` | Getting started & examples |
| `DATABASE_SCHEMA.md` | Full table documentation |
| `DATABASE_QUICK_REFERENCE.md` | Quick lookup guide |
| `DATABASE_INDEX.md` | File organization |

## 🎯 Your 11 Tables

```
📦 profiles          → User accounts & profiles
📦 categories        → Product categories  
📦 subcategories     → Product subcategories
📦 products          → Product catalog (with pricing, stock, ratings)
📦 reviews           → Product reviews & ratings
📦 addresses         → User shipping/billing addresses
📦 orders            → Customer orders with tracking
📦 order_items       → Items in each order
📦 cart_items        → Shopping cart items
📦 wishlist_items    → User wishlists
📦 user_roles        → User permissions (admin, moderator, user)
```

## 🪝 Available Hooks

### Reading Data
```typescript
// Products
useProducts(limit?, offset?)         // All products with pagination
useProduct(productId)                // Single product
useFeaturedProducts()                // Featured only
useSearchProducts(term)              // Search functionality

// Categories
useCategories()                      // All categories
useSubcategories()                   // All subcategories
useSubcategoriesByCategory(catId)   // Subcats in category

// Orders & Cart
useOrders()                          // All orders (admin)
useUserOrders(userId)                // User's orders
useCart(userId)                      // Shopping cart
useWishlist(userId)                  // User's wishlist

// User Data
useProfile(userId)                   // User profile
useAddresses(userId)                 // User addresses
useUserRole(userId)                  // User role/permissions

// Reviews
useProductReviews(productId)         // Product reviews
useReviews()                         // All reviews
```

### Writing Data
```typescript
// Shopping
useAddToCart()                       // Add to cart
useRemoveFromCart()                  // Remove from cart
useAddToWishlist()                   // Add to wishlist
useRemoveFromWishlist()              // Remove from wishlist

// Orders
useCreateOrder()                     // Create new order
useUpdateOrder()                     // Update order status

// Reviews
useCreateReview()                    // Create review
```

## 📚 Documentation Order

1. **Read First:** `DATABASE_SETUP_GUIDE.md`
   - Complete how-to guide
   - Quick start examples
   - Troubleshooting

2. **Reference:** `DATABASE_QUICK_REFERENCE.md`
   - All hooks listed
   - Common patterns
   - Code snippets

3. **Details:** `DATABASE_SCHEMA.md`
   - Complete table documentation
   - Column definitions
   - Advanced examples

4. **Overview:** `DATABASE_INDEX.md`
   - File organization
   - Learning paths

## 💡 Common Patterns

### Display List with Search
```typescript
import { useSearchProducts } from '@/hooks/useDatabase';
import { useState } from 'react';

function SearchProducts() {
  const [query, setQuery] = useState('');
  const { data: results } = useSearchProducts(query);

  return (
    <div>
      <input 
        placeholder="Search..." 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {results?.map(p => <div key={p.id}>{p.name}</div>)}
    </div>
  );
}
```

### Complete Checkout
```typescript
import { useCreateOrder, useCart, useRemoveFromCart } from '@/hooks/useDatabase';

async function checkout(userId: string, data: any) {
  const { mutate: createOrder } = useCreateOrder();
  
  createOrder({
    user_id: userId,
    order_number: `ORD-${Date.now()}`,
    status: 'processing',
    payment_status: 'pending',
    total_amount: data.total,
    tax_amount: data.tax,
    shipping_amount: data.shipping,
    discount_amount: data.discount,
    shipping_address_id: data.addressId,
    billing_address_id: data.addressId,
  });
}
```

### Get User's Order History
```typescript
import { useUserOrders } from '@/hooks/useDatabase';

function OrderHistory({ userId }: { userId: string }) {
  const { data: orders, isLoading } = useUserOrders(userId);

  return (
    <table>
      <thead>
        <tr>
          <th>Order #</th>
          <th>Date</th>
          <th>Total</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {orders?.map(order => (
          <tr key={order.id}>
            <td>{order.order_number}</td>
            <td>{new Date(order.created_at).toLocaleDateString()}</td>
            <td>${order.total_amount}</td>
            <td>{order.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

## 🧪 Testing

Run the diagnostic component to verify everything works:

```typescript
// Add to any page temporarily
import DatabaseTest from '@/components/DatabaseTest';

export default function Test() {
  return <DatabaseTest />;
}
```

This will:
- ✅ Test database connection
- ✅ Verify all 11 tables exist
- ✅ Show record count per table
- ✅ Display any errors

## 🔍 Troubleshooting

### Connection Failed?
1. Check Supabase environment variables are set
2. Verify Supabase project is active in dashboard
3. Run diagnostic component for specific errors
4. Check browser console (F12) for error details

### "Unauthorized" Error?
- Disable RLS for development (Supabase Dashboard → SQL Editor)
- Or set up proper RLS policies
- Or use service role key for admin operations

### Missing Data?
- Verify table has records in Supabase dashboard
- Check correct user ID or filters
- Ensure RLS policies allow access

### Hook Not Found?
- See `DATABASE_QUICK_REFERENCE.md` → "Import All Hooks"
- Check file exists and is correct location

## 🏗️ Architecture

```
Components
    ↓ (use hooks)
React Query Hooks (src/hooks/useDatabase.ts)
    ↓ (query/mutate)
Database Service (src/services/databaseService.ts)
    ↓ (SQL queries)
Supabase Client (src/integrations/supabase/client.ts)
    ↓ (REST API)
Supabase PostgreSQL Database
```

## 📊 Schema Overview

```
USERS
├─ profiles (user account info)
├─ addresses (shipping/billing)
├─ orders (customer orders)
│  └─ order_items (items ordered)
├─ cart_items (shopping cart)
├─ wishlist_items (saved items)
└─ user_roles (permissions)

PRODUCTS
├─ categories (product categories)
├─ subcategories (sub-categories)
├─ products (product catalog)
├─ reviews (product reviews)

Relationships connect users to products through orders, reviews, cart, wishlist
```

## ⚙️ Configuration

Supabase is configured at:
- **Client:** `src/integrations/supabase/client.ts`
- **Environment Variables:** Your `.env` file
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_PUBLISHABLE_KEY`

## 🚀 Build a Feature

### Feature: Product Listing with Search
1. Use `useProducts()` for list
2. Add `useSearchProducts()` for search
3. Show loading state
4. Handle errors gracefully
5. Add pagination with limit/offset

### Feature: Shopping Cart
1. Use `useCart()` to display items
2. Use `useAddToCart()` to add items
3. Use `useRemoveFromCart()` to remove
4. Calculate total from products array
5. Show cart summary

### Feature: Checkout
1. Get user's cart with `useCart()`
2. Get addresses with `useAddresses()`
3. Create order with `useCreateOrder()`
4. Clear cart after success
5. Show order confirmation

## 📖 Next Steps

1. ✅ Run diagnostic to verify connection (1 min)
2. ✅ Read DATABASE_SETUP_GUIDE.md (5 mins)
3. ✅ Review DATABASE_QUICK_REFERENCE.md (3 mins)
4. ✅ Start using hooks in components (Begin building!)
5. ✅ Refer to DATABASE_SCHEMA.md as needed

## 🎓 Learning Resources

- 📖 Complete documentation in 4 guides
- 💻 Code examples for every feature
- 🧪 Diagnostic component for testing
- 📋 Quick reference guide
- 🎯 Troubleshooting section

## 💬 FAQ

**Q: Can I use this without React?**
A: Yes, use service functions from `src/services/databaseService.ts`

**Q: How do I add real-time updates?**
A: See DATABASE_SCHEMA.md → Advanced Usage → Real-time Updates

**Q: Do I need to create migrations?**
A: No, your database schema is already created in Supabase

**Q: Can I customize the hooks?**
A: Yes, modify `src/hooks/useDatabase.ts` as needed

**Q: Is the data type-safe?**
A: Yes, 100% TypeScript with full type inference

## 🎉 You're Ready!

Your database is fully integrated and documented.
Start building your features using the hooks!

---

**Questions?** Check the documentation files included with this project.

**Version:** 1.0  
**Created:** 2026-05-25  
**Status:** ✅ Complete & Ready to Use

Happy coding! 🚀
