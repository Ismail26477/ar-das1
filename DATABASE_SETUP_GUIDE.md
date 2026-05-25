# Database Setup Guide - Complete

This guide explains everything that has been set up for your Supabase database integration.

## ✅ What's Been Done

Your Supabase database now has:

### 1. **Type Definitions** (`src/types/database.ts`)
- Complete TypeScript interfaces for all 11 tables
- Proper type safety for IDE autocomplete
- Combined/extended types for relationships
- API response types for standardized responses

### 2. **React Query Hooks** (`src/hooks/useDatabase.ts`)
- 30+ custom React Query hooks for data fetching
- Automatic caching and invalidation
- Query hooks for reading data
- Mutation hooks for creating/updating data
- Supports pagination and search

### 3. **Database Service** (`src/services/databaseService.ts`)
- Direct database access functions (no React needed)
- Diagnostic functions to test connection
- Table verification utilities
- Table statistics collection
- All CRUD operations

### 4. **Diagnostic Component** (`src/components/DatabaseTest.tsx`)
- Visual UI to test database connection
- Shows which tables are accessible
- Displays record counts per table
- Identify connection issues immediately

### 5. **Documentation**
- `DATABASE_SCHEMA.md` - Complete documentation with examples
- `DATABASE_QUICK_REFERENCE.md` - Quick lookup guide
- `DATABASE_SETUP_GUIDE.md` - This file

## 📊 Your 11 Tables

| # | Table | Purpose | Records |
|---|-------|---------|---------|
| 1 | `profiles` | User account information | |
| 2 | `categories` | Product categories | |
| 3 | `subcategories` | Product subcategories | |
| 4 | `products` | Product catalog | |
| 5 | `reviews` | Product reviews | |
| 6 | `addresses` | User addresses | |
| 7 | `orders` | Customer orders | |
| 8 | `order_items` | Items in orders | |
| 9 | `cart_items` | Shopping cart | |
| 10 | `wishlist_items` | Wishlist | |
| 11 | `user_roles` | User permissions | |

## 🚀 Quick Start

### Step 1: Test Your Connection
Add the diagnostic component to a page to verify your database is connected:

```typescript
import DatabaseTest from '@/components/DatabaseTest';

export default function DebugPage() {
  return <DatabaseTest />;
}
```

Visit this page in your browser. You should see:
- ✓ Green checkmarks for all tables
- Record counts for each table
- "Database connection successful" message

### Step 2: Use Hooks in Components

**Example 1: Display Products**
```typescript
import { useProducts } from '@/hooks/useDatabase';

export function Products() {
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

**Example 2: Add to Cart**
```typescript
import { useAddToCart } from '@/hooks/useDatabase';

export function ProductCard({ productId }: { productId: string }) {
  const { mutate: addToCart } = useAddToCart();

  return (
    <button onClick={() => addToCart({
      user_id: currentUserId,
      product_id: productId,
      quantity: 1,
    })}>
      Add to Cart
    </button>
  );
}
```

**Example 3: Show User Orders**
```typescript
import { useUserOrders } from '@/hooks/useDatabase';

export function OrderHistory({ userId }: { userId: string }) {
  const { data: orders } = useUserOrders(userId);

  return (
    <table>
      <tbody>
        {orders?.map(order => (
          <tr key={order.id}>
            <td>{order.order_number}</td>
            <td>${order.total_amount}</td>
            <td>{order.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### Step 3: Use Service Functions (Optional)

For non-React code or server-side code:

```typescript
import { getAllProducts, getProfile } from '@/services/databaseService';

// In an async function or event handler
const result = await getAllProducts(20, 0);
if (result.success) {
  console.log(result.data?.items);
} else {
  console.error(result.error);
}
```

## 📚 Hook Reference

### Query Hooks (Read Data)

```typescript
// Products
useProducts(limit?, offset?)           // All products with pagination
useProduct(productId)                   // Single product with details
useFeaturedProducts()                   // Featured products only
useSearchProducts(term)                 // Search products by name/description
useProductsByCategory(categoryId)       // Products in a category

// Categories
useCategories()                         // All categories
useCategory(categoryId)                 // Single category
useSubcategories()                      // All subcategories
useSubcategoriesByCategory(catId)      // Subcategories in category

// Orders
useOrders()                             // All orders (admin)
useOrder(orderId)                       // Single order with items
useUserOrders(userId)                   // User's orders

// Profiles & Users
useProfile(userId)                      // User profile
useProfiles()                           // All user profiles
useUserRole(userId)                     // User's role (admin/moderator/user)

// Shopping & Wishlist
useCart(userId)                         // User's cart items
useCartSummary(userId)                  // Cart summary
useWishlist(userId)                     // Wishlist items

// Addresses
useAddresses(userId)                    // All user addresses
useDefaultAddress(userId)               // Default address only

// Reviews
useReviews()                            // All reviews
useProductReviews(productId)            // Reviews for product
useUserReviews(userId)                  // User's reviews
```

### Mutation Hooks (Write Data)

```typescript
// Cart
useAddToCart()                          // Add item to cart
useUpdateCart()                         // Update cart item quantity
useRemoveFromCart()                     // Remove item from cart

// Wishlist
useAddToWishlist()                      // Add to wishlist
useRemoveFromWishlist()                 // Remove from wishlist

// Orders
useCreateOrder()                        // Create new order
useUpdateOrder()                        // Update order status

// Reviews
useCreateReview()                       // Create product review
```

### Service Functions (Direct Access)

```typescript
// Connection Testing
testDatabaseConnection()                // Test DB connection
verifyAllTables()                       // Check all tables accessible
getTableStats()                         // Get record counts

// Products
getAllProducts(limit, offset)           // Fetch products
getProductById(productId)               // Get one product
searchProducts(term, limit)             // Search products

// Orders & Users
getUserOrders(userId)                   // User's orders
getOrderById(orderId)                   // Order details
getProfile(userId)                      // User profile
updateProfile(userId, updates)          // Update profile

// And more...
```

## 🔧 Advanced Usage

### Filtering Results

```typescript
// Filter in hook options
const { data: products } = useProducts();

const filtered = products?.items.filter(p => p.price < 100);
```

### Real-time Updates

Supabase supports real-time subscriptions. To add this:

```typescript
import { supabase } from '@/integrations/supabase/client';

useEffect(() => {
  const subscription = supabase
    .from('products')
    .on('*', (payload) => {
      console.log('Product updated:', payload);
      // Refresh your data
    })
    .subscribe();

  return () => subscription.unsubscribe();
}, []);
```

### Error Handling

```typescript
const { data, error, isLoading } = useProducts();

if (isLoading) return <p>Loading...</p>;
if (error) return <p>Error: {error.message}</p>;
return <div>{data?.items.length} products</div>;
```

### Caching & Revalidation

React Query automatically caches data. To manually refresh:

```typescript
const { refetch } = useProducts();

<button onClick={() => refetch()}>Refresh Products</button>
```

## 📝 Best Practices

### 1. Use TypeScript
Always import types for IDE autocomplete:

```typescript
import { Product, Order, Review } from '@/types/database';

const product: Product = data;  // Full type safety
```

### 2. Handle Loading States
Always show loading/error states:

```typescript
const { data, isLoading, error } = useProducts();

if (isLoading) return <Skeleton />;
if (error) return <ErrorComponent />;
return <ProductList products={data} />;
```

### 3. Use Optimistic Updates
Show UI change before server confirms:

```typescript
const { mutate: addToCart } = useAddToCart({
  onSuccess: () => {
    // Server confirmed - data is fresh
  },
  onError: () => {
    // Revert optimistic change
  },
});
```

### 4. Pagination for Large Sets
Don't fetch all records at once:

```typescript
const { data: products } = useProducts(50, offset);  // 50 at a time
```

### 5. Filter at Database Level
Use search instead of filtering in JavaScript:

```typescript
// ✓ Good - filters at database
const { data } = useSearchProducts('laptop');

// ✗ Bad - loads all, filters in JS
const { data: all } = useProducts();
const filtered = all?.filter(p => p.name.includes('laptop'));
```

## 🐛 Troubleshooting

### Database Connection Fails

Check:
1. Supabase environment variables are set (check `.env` file)
2. Run the diagnostic component to see specific table issues
3. Check browser console for error messages
4. Verify Supabase project is active

### "Unauthorized" Errors

This means RLS (Row Level Security) is blocking access. Either:
1. Disable RLS for development: Supabase Dashboard → SQL Editor → Run `ALTER TABLE tablename DISABLE ROW LEVEL SECURITY;`
2. Or set up proper RLS policies
3. Or use service role key for admin access

### Slow Queries

Tips:
1. Use pagination (`limit` and `offset`)
2. Select only needed columns in advanced queries
3. Add database indexes on frequently filtered columns
4. Use React Query caching (default)

### Missing Data

Check:
1. Table has records (use diagnostic component)
2. Correct user ID or filters
3. RLS policies aren't blocking access
4. No typos in table names

## 🎯 Next Steps

1. **Test Connection** - Use the diagnostic component
2. **Explore Data** - View tables in Supabase Dashboard
3. **Build Features**:
   - Product listing/search
   - Product details page
   - Shopping cart
   - Order management
   - User profiles
   - Reviews/ratings
4. **Deploy** - Push to production when ready

## 📚 Resources

- **Full Documentation**: See `DATABASE_SCHEMA.md`
- **Quick Reference**: See `DATABASE_QUICK_REFERENCE.md`
- **Supabase Docs**: https://supabase.com/docs
- **React Query Docs**: https://tanstack.com/query/latest

## 🆘 Need Help?

If something isn't working:

1. Check the error message in browser console (`F12` → Console tab)
2. Run the diagnostic component to test connection
3. Review `DATABASE_SCHEMA.md` for table definitions
4. Check your Supabase dashboard for data
5. Make sure environment variables are set correctly

## Summary

You now have:
- ✅ Complete TypeScript types
- ✅ 30+ React Query hooks
- ✅ Database service functions
- ✅ Diagnostic tools
- ✅ Full documentation
- ✅ Working examples

Start using the hooks in your components and your e-commerce site will be fully connected to your database!

Happy coding! 🚀
