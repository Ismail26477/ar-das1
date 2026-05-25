# Database Schema Documentation

This document describes all tables and columns in your Supabase database and how to use them in your application.

## Table of Contents

1. [Overview](#overview)
2. [Tables](#tables)
3. [Usage Examples](#usage-examples)
4. [API Reference](#api-reference)

---

## Overview

Your e-commerce database consists of 11 main tables:

- **profiles** - User account information
- **categories** - Product categories
- **subcategories** - Product subcategories
- **products** - Product details
- **reviews** - Product reviews
- **addresses** - User addresses
- **orders** - Customer orders
- **order_items** - Items in orders
- **cart_items** - Shopping cart items
- **wishlist_items** - Wishlist entries
- **user_roles** - User role assignments

---

## Tables

### 1. profiles

Stores user profile information linked to Supabase Auth.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | User ID from Supabase Auth |
| email | VARCHAR | User email address |
| full_name | VARCHAR | User's full name |
| phone_number | VARCHAR | Contact phone number |
| avatar_url | TEXT | Profile picture URL |
| bio | TEXT | User biography |
| created_at | TIMESTAMP | Account creation date |
| updated_at | TIMESTAMP | Last update date |

**Usage in Code:**
```typescript
import { useProfile } from '@/hooks/useDatabase';

function UserProfile({ userId }: { userId: string }) {
  const { data: profile, isLoading } = useProfile(userId);
  
  return <div>{profile?.full_name}</div>;
}
```

---

### 2. categories

Product categories with display ordering.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Category ID |
| name | VARCHAR | Category name |
| slug | VARCHAR | URL-friendly name |
| description | TEXT | Category description |
| icon_url | TEXT | Category icon URL |
| image_url | TEXT | Category image URL |
| display_order | INTEGER | Sort order for display |
| created_at | TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | Last update date |

**Usage in Code:**
```typescript
import { useCategories } from '@/hooks/useDatabase';

function CategoryList() {
  const { data: categories } = useCategories();
  
  return (
    <div>
      {categories?.map(cat => (
        <div key={cat.id}>{cat.name}</div>
      ))}
    </div>
  );
}
```

---

### 3. subcategories

Subcategories within main categories.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Subcategory ID |
| category_id | UUID (FK) | Parent category ID |
| name | VARCHAR | Subcategory name |
| slug | VARCHAR | URL-friendly name |
| description | TEXT | Description |
| display_order | INTEGER | Sort order |
| created_at | TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | Last update date |

**Relationship:** Many subcategories → One category

**Usage in Code:**
```typescript
import { useSubcategoriesByCategory } from '@/hooks/useDatabase';

function Subcategories({ categoryId }: { categoryId: string }) {
  const { data: subcats } = useSubcategoriesByCategory(categoryId);
  
  return (
    <ul>
      {subcats?.map(sub => (
        <li key={sub.id}>{sub.name}</li>
      ))}
    </ul>
  );
}
```

---

### 4. products

Product information with pricing, inventory, and media.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Product ID |
| category_id | UUID (FK) | Main category |
| subcategory_id | UUID (FK) | Subcategory (optional) |
| name | VARCHAR | Product name |
| slug | VARCHAR | URL-friendly name |
| description | TEXT | Full description |
| short_description | VARCHAR | Brief description |
| price | NUMERIC | Base price |
| discount_price | NUMERIC | Discounted price (optional) |
| sku | VARCHAR | Stock keeping unit |
| stock_quantity | INTEGER | Available quantity |
| rating | NUMERIC | Average rating (0-5) |
| review_count | INTEGER | Number of reviews |
| image_url | TEXT | Main product image |
| images_json | JSONB | Array of additional images |
| specifications_json | JSONB | Product specifications |
| is_featured | BOOLEAN | Featured on homepage |
| is_active | BOOLEAN | Product is available |
| created_at | TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | Last update date |

**Usage in Code:**
```typescript
import { useProduct, useProducts } from '@/hooks/useDatabase';

// Get all products with pagination
function ProductList() {
  const { data: products } = useProducts(50, 0);
  
  return (
    <div>
      {products?.items.map(p => (
        <div key={p.id}>
          <h3>{p.name}</h3>
          <p>Price: ${p.price}</p>
          <p>Stock: {p.stock_quantity}</p>
        </div>
      ))}
    </div>
  );
}

// Get single product details
function ProductDetail({ productId }: { productId: string }) {
  const { data: product } = useProduct(productId);
  
  return (
    <div>
      <h1>{product?.name}</h1>
      <p>{product?.description}</p>
      <p>Rating: {product?.rating}/5 ({product?.review_count} reviews)</p>
    </div>
  );
}
```

---

### 5. reviews

Customer product reviews.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Review ID |
| product_id | UUID (FK) | Product being reviewed |
| user_id | UUID (FK) | Reviewer's user ID |
| rating | INTEGER | Rating 1-5 |
| title | VARCHAR | Review title |
| comment | TEXT | Review text |
| helpful_count | INTEGER | Helpful votes |
| unhelpful_count | INTEGER | Unhelpful votes |
| is_verified_purchase | BOOLEAN | Verified buyer |
| created_at | TIMESTAMP | Review date |
| updated_at | TIMESTAMP | Last update date |

**Usage in Code:**
```typescript
import { useProductReviews, useCreateReview } from '@/hooks/useDatabase';

function ProductReviews({ productId }: { productId: string }) {
  const { data: reviews } = useProductReviews(productId);
  const { mutate: createReview } = useCreateReview();

  const handleSubmit = (reviewData: any) => {
    createReview({
      product_id: productId,
      user_id: currentUser.id,
      rating: reviewData.rating,
      title: reviewData.title,
      comment: reviewData.comment,
      is_verified_purchase: true,
      helpful_count: 0,
      unhelpful_count: 0,
    });
  };

  return (
    <div>
      {reviews?.map(r => (
        <div key={r.id}>
          <h4>{r.title}</h4>
          <p>Rating: {'⭐'.repeat(r.rating)}</p>
          <p>{r.comment}</p>
        </div>
      ))}
    </div>
  );
}
```

---

### 6. addresses

User delivery and billing addresses.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Address ID |
| user_id | UUID (FK) | User who owns address |
| type | VARCHAR | Type: 'billing', 'shipping', 'other' |
| street_address | VARCHAR | Street address |
| city | VARCHAR | City name |
| state_province | VARCHAR | State/Province |
| postal_code | VARCHAR | Postal/ZIP code |
| country | VARCHAR | Country name |
| phone_number | VARCHAR | Contact phone |
| is_default | BOOLEAN | Default address flag |
| created_at | TIMESTAMP | Creation date |
| updated_at | TIMESTAMP | Last update date |

**Usage in Code:**
```typescript
import { useAddresses, useDefaultAddress } from '@/hooks/useDatabase';

function UserAddresses({ userId }: { userId: string }) {
  const { data: addresses } = useAddresses(userId);
  const { data: defaultAddr } = useDefaultAddress(userId);

  return (
    <div>
      <p>Default: {defaultAddr?.street_address}</p>
      <h3>All Addresses:</h3>
      {addresses?.map(addr => (
        <div key={addr.id}>
          <p>{addr.type}: {addr.street_address}, {addr.city}</p>
        </div>
      ))}
    </div>
  );
}
```

---

### 7. orders

Customer orders and their status.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Order ID |
| user_id | UUID (FK) | Customer user ID |
| order_number | VARCHAR | Unique order number |
| status | VARCHAR | Order status (enum) |
| payment_status | VARCHAR | Payment status (enum) |
| total_amount | NUMERIC | Order total |
| discount_amount | NUMERIC | Applied discount |
| tax_amount | NUMERIC | Tax amount |
| shipping_amount | NUMERIC | Shipping cost |
| shipping_address_id | UUID (FK) | Delivery address |
| billing_address_id | UUID (FK) | Billing address |
| notes | TEXT | Order notes |
| tracking_number | VARCHAR | Shipping tracking number |
| created_at | TIMESTAMP | Order date |
| updated_at | TIMESTAMP | Last update date |
| delivered_at | TIMESTAMP | Delivery date |

**Status Values:**
- `pending` - Order awaiting confirmation
- `processing` - Being prepared
- `shipped` - In transit
- `delivered` - Received by customer
- `cancelled` - Cancelled order
- `returned` - Returned by customer

**Payment Status Values:**
- `pending` - Awaiting payment
- `paid` - Payment received
- `failed` - Payment failed
- `refunded` - Payment refunded

**Usage in Code:**
```typescript
import { useOrders, useOrder, useUserOrders } from '@/hooks/useDatabase';

function OrderHistory({ userId }: { userId: string }) {
  const { data: orders } = useUserOrders(userId);

  return (
    <table>
      <thead>
        <tr>
          <th>Order #</th>
          <th>Date</th>
          <th>Total</th>
          <th>Status</th>
          <th>Payment</th>
        </tr>
      </thead>
      <tbody>
        {orders?.map(order => (
          <tr key={order.id}>
            <td>{order.order_number}</td>
            <td>{new Date(order.created_at).toLocaleDateString()}</td>
            <td>${order.total_amount}</td>
            <td>{order.status}</td>
            <td>{order.payment_status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function OrderDetail({ orderId }: { orderId: string }) {
  const { data: order } = useOrder(orderId);

  return (
    <div>
      <h2>Order {order?.order_number}</h2>
      <p>Status: {order?.status}</p>
      <p>Total: ${order?.total_amount}</p>
      <p>Tracking: {order?.tracking_number}</p>
      {order?.delivered_at && (
        <p>Delivered: {new Date(order.delivered_at).toLocaleDateString()}</p>
      )}
    </div>
  );
}
```

---

### 8. order_items

Individual items within an order.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Item ID |
| order_id | UUID (FK) | Parent order |
| product_id | UUID (FK) | Product ordered |
| quantity | INTEGER | Quantity ordered |
| unit_price | NUMERIC | Price per unit at purchase |
| discount_amount | NUMERIC | Applied discount |
| line_total | NUMERIC | Total for this line |
| created_at | TIMESTAMP | Creation date |

**Relationship:** Many order_items → One order

---

### 9. cart_items

Items in user shopping carts.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Cart item ID |
| user_id | UUID (FK) | Cart owner |
| product_id | UUID (FK) | Product in cart |
| quantity | INTEGER | Quantity selected |
| added_at | TIMESTAMP | Added to cart date |
| updated_at | TIMESTAMP | Last update date |

**Usage in Code:**
```typescript
import { useCart, useAddToCart, useRemoveFromCart } from '@/hooks/useDatabase';

function ShoppingCart({ userId }: { userId: string }) {
  const { data: cart } = useCart(userId);
  const { mutate: removeFromCart } = useRemoveFromCart();

  const total = cart?.reduce((sum, item) => {
    return sum + (item.quantity * (item.product?.price || 0));
  }, 0) || 0;

  return (
    <div>
      <h2>Shopping Cart</h2>
      {cart?.map(item => (
        <div key={item.id}>
          <p>{item.product?.name} x {item.quantity}</p>
          <button onClick={() => removeFromCart(item.id)}>Remove</button>
        </div>
      ))}
      <p>Total: ${total}</p>
    </div>
  );
}
```

---

### 10. wishlist_items

Items users want to purchase later.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Wishlist item ID |
| user_id | UUID (FK) | Wishlist owner |
| product_id | UUID (FK) | Desired product |
| added_at | TIMESTAMP | Added date |

**Usage in Code:**
```typescript
import { useWishlist, useAddToWishlist } from '@/hooks/useDatabase';

function Wishlist({ userId }: { userId: string }) {
  const { data: wishlist } = useWishlist(userId);
  const { mutate: addToWishlist } = useAddToWishlist();

  return (
    <div>
      {wishlist?.map(item => (
        <div key={item.id}>
          <p>{item.product?.name}</p>
          <p>${item.product?.price}</p>
        </div>
      ))}
    </div>
  );
}
```

---

### 11. user_roles

Role assignments for user access control.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Role assignment ID |
| user_id | UUID (FK) | User assigned role |
| role | TEXT | Role: 'admin', 'moderator', 'user' |
| created_at | TIMESTAMP | Assignment date |

**Usage in Code:**
```typescript
import { useUserRole } from '@/hooks/useDatabase';

function AdminPanel({ userId }: { userId: string }) {
  const { data: userRole } = useUserRole(userId);

  if (userRole?.role !== 'admin') {
    return <p>Access denied</p>;
  }

  return <div>Admin dashboard</div>;
}
```

---

## Usage Examples

### Example 1: Display Featured Products

```typescript
import { useFeaturedProducts } from '@/hooks/useDatabase';

export function FeaturedProducts() {
  const { data: products, isLoading } = useFeaturedProducts();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="featured-grid">
      {products?.map(product => (
        <div key={product.id} className="product-card">
          <img src={product.image_url} alt={product.name} />
          <h3>{product.name}</h3>
          <p className="price">${product.price}</p>
          {product.discount_price && (
            <p className="discount">${product.discount_price}</p>
          )}
          <div className="rating">
            Rating: {product.rating}/5 ({product.review_count} reviews)
          </div>
        </div>
      ))}
    </div>
  );
}
```

### Example 2: Search Products

```typescript
import { useState } from 'react';
import { useSearchProducts } from '@/hooks/useDatabase';

export function ProductSearch() {
  const [query, setQuery] = useState('');
  const { data: results } = useSearchProducts(query);

  return (
    <div>
      <input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {results?.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

### Example 3: Complete Checkout Flow

```typescript
import { useCreateOrder, useRemoveFromCart } from '@/hooks/useDatabase';

export function Checkout({ userId }: { userId: string }) {
  const { mutate: createOrder } = useCreateOrder();
  const { mutate: clearCart } = useRemoveFromCart();

  const handleCheckout = async (data: CheckoutData) => {
    try {
      const newOrder = await createOrder({
        user_id: userId,
        order_number: `ORD-${Date.now()}`,
        status: 'processing',
        payment_status: 'pending',
        total_amount: data.total,
        discount_amount: data.discount,
        tax_amount: data.tax,
        shipping_amount: data.shipping,
        shipping_address_id: data.shippingAddressId,
        billing_address_id: data.billingAddressId,
      });

      // Clear cart after order
      if (newOrder.id) {
        // Clear cart items...
      }
    } catch (error) {
      console.error('Checkout failed:', error);
    }
  };

  return <button onClick={handleCheckout}>Complete Purchase</button>;
}
```

### Example 4: Database Diagnostics

```typescript
import { useEffect, useState } from 'react';
import {
  testDatabaseConnection,
  verifyAllTables,
  getTableStats,
} from '@/services/databaseService';

export function DatabaseDiagnostics() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function runDiagnostics() {
      const connection = await testDatabaseConnection();
      const tables = await verifyAllTables();
      const tableStats = await getTableStats();

      console.log('Connection:', connection);
      console.log('Tables:', tables);
      console.log('Stats:', tableStats);

      setStats({
        connection,
        tables,
        tableStats,
      });
      setLoading(false);
    }

    runDiagnostics();
  }, []);

  if (loading) return <div>Running diagnostics...</div>;

  return (
    <div>
      <h2>Database Status</h2>
      <pre>{JSON.stringify(stats, null, 2)}</pre>
    </div>
  );
}
```

---

## API Reference

### Query Hooks

All query hooks use React Query and support:
- `data` - Query result
- `isLoading` - Loading state
- `error` - Error object
- `refetch()` - Manual refetch function

### Mutation Hooks

All mutations support:
- `mutate()` - Execute mutation
- `isPending` - Loading state
- `error` - Error object
- `isSuccess` - Success state

### Service Functions

Direct database access without React Query:

```typescript
import {
  testDatabaseConnection,
  getTableStats,
  getAllProducts,
  searchProducts,
  getProfile,
  updateProfile,
  getUserOrders,
} from '@/services/databaseService';

// Example
const result = await getAllProducts(50, 0);
if (result.success) {
  console.log(result.data?.items);
} else {
  console.error(result.error);
}
```

---

## Performance Tips

1. **Use pagination** for large result sets with `limit` and `offset`
2. **Cache results** using React Query's built-in caching (enabled by default)
3. **Filter at database level** instead of in JavaScript
4. **Use specific selects** - only fetch columns you need
5. **Enable RLS** (Row Level Security) for data privacy

---

## Next Steps

Your database is fully configured and connected. You can now:

1. Start using hooks in your components
2. Create API routes that use `databaseService`
3. Build features like products, orders, and user profiles
4. Add real-time subscriptions using Supabase Realtime

Happy building! 🚀
