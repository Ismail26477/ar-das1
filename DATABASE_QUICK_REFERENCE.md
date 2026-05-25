# Database Schema - Quick Reference

## All Tables & Columns at a Glance

### 1. **profiles** (Users)
```
id (UUID) | email | full_name | phone_number | avatar_url | bio | created_at | updated_at
```

### 2. **categories** (Product Categories)
```
id (UUID) | name | slug | description | icon_url | image_url | display_order | created_at | updated_at
```

### 3. **subcategories** (Product Subcategories)
```
id (UUID) | category_id* | name | slug | description | display_order | created_at | updated_at
```

### 4. **products** (Products)
```
id (UUID) | category_id* | subcategory_id* | name | slug | description | short_description
price | discount_price | sku | stock_quantity | rating | review_count | image_url
images_json | specifications_json | is_featured | is_active | created_at | updated_at
```

### 5. **reviews** (Product Reviews)
```
id (UUID) | product_id* | user_id* | rating | title | comment | helpful_count
unhelpful_count | is_verified_purchase | created_at | updated_at
```

### 6. **addresses** (User Addresses)
```
id (UUID) | user_id* | type | street_address | city | state_province | postal_code
country | phone_number | is_default | created_at | updated_at
```

### 7. **orders** (Orders)
```
id (UUID) | user_id* | order_number | status | payment_status | total_amount
discount_amount | tax_amount | shipping_amount | shipping_address_id* | billing_address_id*
notes | tracking_number | created_at | updated_at | delivered_at
```

### 8. **order_items** (Order Items)
```
id (UUID) | order_id* | product_id* | quantity | unit_price | discount_amount | line_total | created_at
```

### 9. **cart_items** (Shopping Cart)
```
id (UUID) | user_id* | product_id* | quantity | added_at | updated_at
```

### 10. **wishlist_items** (Wishlist)
```
id (UUID) | user_id* | product_id* | added_at
```

### 11. **user_roles** (User Roles)
```
id (UUID) | user_id* | role | created_at
```

*Key: `*` = Foreign Key (links to another table)

---

## Import All Hooks

```typescript
// Query Hooks
import {
  useProfiles,
  useProfile,
  useCategories,
  useCategory,
  useSubcategories,
  useSubcategoriesByCategory,
  useProducts,
  useProduct,
  useFeaturedProducts,
  useSearchProducts,
  useProductsByCategory,
  useReviews,
  useProductReviews,
  useUserReviews,
  useAddresses,
  useDefaultAddress,
  useOrders,
  useOrder,
  useUserOrders,
  useCart,
  useCartSummary,
  useWishlist,
  useUserRole,
} from '@/hooks/useDatabase';

// Mutation Hooks
import {
  useCreateReview,
  useUpdateCart,
  useAddToCart,
  useRemoveFromCart,
  useAddToWishlist,
  useRemoveFromWishlist,
  useCreateOrder,
  useUpdateOrder,
} from '@/hooks/useDatabase';

// Service Functions
import {
  testDatabaseConnection,
  verifyAllTables,
  getTableStats,
  getAllProducts,
  getProductById,
  searchProducts,
  getAllCategories,
  getUserOrders,
  getOrderById,
  getProfile,
  updateProfile,
  getProductReviews,
  createReview,
  getUserAddresses,
  createAddress,
  getUserCart,
  addToCart,
  getUserWishlist,
  addToWishlist,
} from '@/services/databaseService';
```

---

## Common Patterns

### Fetch & Display Data
```typescript
const { data, isLoading, error } = useProducts();

if (isLoading) return <p>Loading...</p>;
if (error) return <p>Error: {error.message}</p>;
return <div>{data?.items.length} products</div>;
```

### Add Item to Cart
```typescript
const { mutate: addToCart } = useAddToCart();

addToCart({
  user_id: currentUserId,
  product_id: productId,
  quantity: 1,
});
```

### Create an Order
```typescript
const { mutate: createOrder } = useCreateOrder();

createOrder({
  user_id: userId,
  order_number: `ORD-${Date.now()}`,
  status: 'processing',
  payment_status: 'pending',
  total_amount: 99.99,
  discount_amount: 0,
  tax_amount: 8.00,
  shipping_amount: 5.00,
  shipping_address_id: addressId,
  billing_address_id: addressId,
});
```

### Search Products
```typescript
const { data: results } = useSearchProducts('laptop');

// Only searches when term is 3+ characters
```

### Test Database
```typescript
import { testDatabaseConnection } from '@/services/databaseService';

const result = await testDatabaseConnection();
console.log(result.success); // true if connected
```

---

## Relationship Diagram

```
profiles (users)
  ├─ orders (one-to-many)
  │   ├─ order_items (one-to-many)
  │   │   └─ products (many-to-one)
  │   ├─ addresses (shipping_address_id)
  │   └─ addresses (billing_address_id)
  ├─ addresses (one-to-many)
  ├─ reviews (one-to-many)
  ├─ cart_items (one-to-many)
  │   └─ products
  ├─ wishlist_items (one-to-many)
  │   └─ products
  └─ user_roles (one-to-many)

products
  ├─ categories (many-to-one)
  ├─ subcategories (many-to-one)
  ├─ reviews (one-to-many)
  ├─ order_items (one-to-many)
  ├─ cart_items (one-to-many)
  └─ wishlist_items (one-to-many)

categories
  └─ subcategories (one-to-many)
```

---

## Data Types

| Type | Details |
|------|---------|
| UUID | Unique identifier (string) |
| VARCHAR | Text with length limit |
| TEXT | Unlimited text |
| INTEGER | Whole numbers |
| NUMERIC | Decimals (for prices) |
| BOOLEAN | True/False |
| TIMESTAMP | Date & time with timezone |
| JSONB | JSON data (arrays/objects) |

---

## Status Enums

**Order Status:**
- `pending` - Awaiting confirmation
- `processing` - Being prepared
- `shipped` - In transit
- `delivered` - Received
- `cancelled` - Cancelled
- `returned` - Returned

**Payment Status:**
- `pending` - Awaiting payment
- `paid` - Payment received
- `failed` - Payment failed
- `refunded` - Payment refunded

**User Roles:**
- `admin` - Admin access
- `moderator` - Moderator access
- `user` - Regular user

**Address Types:**
- `billing` - Billing address
- `shipping` - Shipping address
- `other` - Other address

---

## File Locations

| File | Purpose |
|------|---------|
| `/src/types/database.ts` | TypeScript interfaces for all tables |
| `/src/hooks/useDatabase.ts` | React Query hooks for all tables |
| `/src/services/databaseService.ts` | Direct database access functions |
| `/src/integrations/supabase/client.ts` | Supabase client configuration |
| `DATABASE_SCHEMA.md` | Full documentation |
| `DATABASE_QUICK_REFERENCE.md` | This file |

---

## Example: Complete Product Page

```typescript
import { useProduct, useProductReviews, useAddToCart } from '@/hooks/useDatabase';
import { useAuth } from '@/hooks/useAuth';

export function ProductPage({ productId }: { productId: string }) {
  const { user } = useAuth();
  const { data: product, isLoading } = useProduct(productId);
  const { data: reviews } = useProductReviews(productId);
  const { mutate: addToCart } = useAddToCart();

  if (isLoading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div>
      <h1>{product.name}</h1>
      <img src={product.image_url} alt={product.name} />
      
      <p className="price">
        {product.discount_price ? (
          <>
            <span className="original">${product.price}</span>
            <span className="discount">${product.discount_price}</span>
          </>
        ) : (
          <span>${product.price}</span>
        )}
      </p>

      <p>Stock: {product.stock_quantity}</p>
      <p>Rating: {product.rating}/5 ({product.review_count} reviews)</p>

      <button
        onClick={() => addToCart({
          user_id: user!.id,
          product_id: productId,
          quantity: 1,
        })}
      >
        Add to Cart
      </button>

      <h2>Reviews</h2>
      {reviews?.map(review => (
        <div key={review.id}>
          <h4>{review.title}</h4>
          <p>Rating: {review.rating}/5</p>
          <p>{review.comment}</p>
          {review.is_verified_purchase && <badge>✓ Verified Purchase</badge>}
        </div>
      ))}
    </div>
  );
}
```

---

## Next: Build Your Features

Now that your database is connected and documented, you can:

1. **Create product listing page** - Use `useProducts()` and `useFeaturedProducts()`
2. **Build product detail page** - Use `useProduct()` and `useProductReviews()`
3. **Implement shopping cart** - Use `useCart()`, `useAddToCart()`, `useRemoveFromCart()`
4. **Add wishlist feature** - Use `useWishlist()`, `useAddToWishlist()`
5. **Order management** - Use `useOrders()`, `useCreateOrder()`, `useOrder()`
6. **User profiles** - Use `useProfile()`, `useAddresses()`
7. **Reviews** - Use `useProductReviews()`, `useCreateReview()`
8. **Search** - Use `useSearchProducts()`

Good luck building! 🚀
