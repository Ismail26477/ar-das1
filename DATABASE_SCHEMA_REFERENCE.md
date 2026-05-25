# Database Schema Reference

Complete mapping of all Supabase tables used in the dashboard.

## Tables in Use

### 1. `orders` Table
**Primary Table for Order Management**

```
Column              Type        Description
─────────────────────────────────────────────────────────
id                  uuid        Primary key
order_number        text        Auto-formatted (ORD-YYYYMMDD-XXXXXX)
user_id             uuid        Links to auth.users.id
total               numeric     Final amount paid
status              enum        processing|shipped|delivered|cancelled|returned
payment_status      enum        pending|paid|failed|refunded
payment_method      text        razorpay|cod
razorpay_payment_id text        Razorpay transaction ID
shipping_address    text        Flattened address string
created_at          timestamp   Order creation time
updated_at          timestamp   Last modification
```

**Used By:** Orders page, Analytics, Dashboard

**Example Query:**
```sql
SELECT order_number, total, status, payment_status, created_at
FROM orders
WHERE payment_status = 'paid'
ORDER BY created_at DESC;
```

---

### 2. `order_items` Table
**Line Items for Each Order**

```
Column              Type        Description
─────────────────────────────────────────────────────────
id                  uuid        Primary key
order_id            uuid        Links to orders.id
product_id          text        Links to products.id
product_name        text        Name of product at time of order
quantity            int         Number of units
unit_price          numeric     Price per unit
created_at          timestamp   Item creation time
```

**Used By:** Orders detail view

---

### 3. `profiles` Table
**User Profile Information**

```
Column              Type        Description
─────────────────────────────────────────────────────────
user_id             uuid        Links to auth.users.id (unique)
full_name           text        Customer full name
phone               text        Contact number
avatar_url          text        Profile picture URL
created_at          timestamp   Account creation time
updated_at          timestamp   Last profile update
```

**Used By:** Customers page, Orders (for buyer name)

**Key Point:** Every user in `auth.users` should have a matching `profiles` row (auto-created by trigger)

---

### 4. `products` Table
**Product Catalog**

```
Column              Type        Description
─────────────────────────────────────────────────────────
id                  text        Product slug (unique)
name                text        Product title
description         text        Full description
brand               text        Manufacturer name
category_id         text        Links to categories.id
subcategory_id      text        Links to subcategories.id
price               numeric     MRP (original price)
discount_price      numeric     Selling price (nullable)
stock               int         Available units
rating              numeric     Average rating (0-5)
review_count        int         Total review count
images              jsonb       Array of image URLs
specs               jsonb       Specification object {RAM: "16GB", ...}
tags                text[]      Array of tags
is_featured         bool        Featured product flag
is_trending         bool        Trending flag
is_best_seller      bool        Best seller flag
is_new_arrival      bool        New arrival flag
created_at          timestamp   Record creation
updated_at          timestamp   Last modification
```

**Used By:** Products page, Inventory alerts, Top products

**Example Query for Low Stock:**
```sql
SELECT id, name, stock FROM products
WHERE stock < 5
ORDER BY stock ASC;
```

---

### 5. `categories` Table
**Top-Level Categories**

```
Column              Type        Description
─────────────────────────────────────────────────────────
id                  text        Category slug (unique)
name                text        Display name
slug                text        URL-friendly slug
icon                text        Lucide icon name
image_url           text        Category image
sort_order          int         Display order
created_at          timestamp   Record creation
updated_at          timestamp   Last modification
```

**Used By:** Products filtering, Navigation

---

### 6. `subcategories` Table
**Product Subcategories**

```
Column              Type        Description
─────────────────────────────────────────────────────────
id                  text        Subcategory slug (unique)
category_id         text        Links to categories.id
name                text        Display name
slug                text        URL-friendly slug
created_at          timestamp   Record creation
updated_at          timestamp   Last modification
```

**Used By:** Products filtering

---

### 7. `reviews` Table
**Product Reviews**

```
Column              Type        Description
─────────────────────────────────────────────────────────
id                  uuid        Primary key
user_id             uuid        Links to auth.users.id
product_id          text        Links to products.id
rating              int         1-5 stars
comment             text        Review text
created_at          timestamp   Review creation
updated_at          timestamp   Last modification
```

**Used By:** Reviews page, Product ratings

---

### 8. `addresses` Table
**Saved Shipping Addresses**

```
Column              Type        Description
─────────────────────────────────────────────────────────
id                  uuid        Primary key
user_id             uuid        Links to auth.users.id
label               text        Home|Office|Other
full_name           text        Recipient name
phone               text        Contact number
address_line        text        Full address
city                text        City
state               text        State/Province
pincode             text        Postal code
is_default          bool        Default address flag
created_at          timestamp   Record creation
updated_at          timestamp   Last modification
```

---

### 9. `cart_items` Table
**Shopping Cart Items**

```
Column              Type        Description
─────────────────────────────────────────────────────────
id                  uuid        Primary key
user_id             uuid        Links to auth.users.id
product_id          text        Links to products.id
quantity            int         Quantity in cart
created_at          timestamp   Item added time
updated_at          timestamp   Last modification
```

---

### 10. `wishlist_items` Table
**User Wishlist**

```
Column              Type        Description
─────────────────────────────────────────────────────────
id                  uuid        Primary key
user_id             uuid        Links to auth.users.id
product_id          text        Links to products.id
created_at          timestamp   Item added time
updated_at          timestamp   Last modification
```

---

### 11. `user_roles` Table
**Admin/Moderator Roles**

```
Column              Type        Description
─────────────────────────────────────────────────────────
id                  uuid        Primary key
user_id             uuid        Links to auth.users.id
role                enum        admin|moderator|user
created_at          timestamp   Record creation
updated_at          timestamp   Last modification
```

**Enum Values:**
- `admin` - Full access
- `moderator` - Limited moderation access
- `user` - Regular user (default)

---

## Special Tables (Auth)

### `auth.users` Table
**Built-in Supabase Auth Table**

```
Column              Type        Description
─────────────────────────────────────────────────────────
id                  uuid        User ID (links to profiles.user_id)
email               text        Email address (unique)
encrypted_password  text        Hashed password
created_at          timestamp   Account creation
```

**Note:** Direct access limited by RLS policies. Email accessible through public queries when needed.

---

## Enums

### `order_status`
```
'processing'  → Order received, preparing
'shipped'     → Left warehouse
'delivered'   → Delivered to customer
'cancelled'   → Order cancelled
'returned'    → Return initiated
```

### `payment_status`
```
'pending'   → Awaiting payment
'paid'      → Payment received
'failed'    → Payment failed
'refunded'  → Refund issued
```

### `app_role`
```
'admin'     → Full system access
'moderator' → Can moderate content
'user'      → Regular customer
```

---

## Important Relationships

### Orders Flow
```
auth.users (1)
    ↓
    └── profiles (1)
        └── orders (*)
            └── order_items (*)
                └── products (*)
```

### Product Hierarchy
```
categories (1)
    ├── subcategories (*)
    └── products (*)
        ├── reviews (*)
        └── order_items (*)
```

### Customer Data
```
auth.users (1)
    ├── profiles (1)
    ├── orders (*)
    ├── addresses (*)
    ├── cart_items (*)
    ├── wishlist_items (*)
    ├── reviews (*)
    └── user_roles (1)
```

---

## SQL Views & Functions

### `handle_new_user()` Trigger
**Automatically creates profile when user signs up**
- Creates row in `profiles` with `user_id`
- Assigns default role `'user'` in `user_roles`

### `has_role(user_id UUID, role app_role)` Function
**Security function to check user roles**
```sql
-- Usage in RLS policy:
WHERE has_role(auth.uid(), 'admin')
```

### `update_updated_at_column()` Trigger
**Automatically updates `updated_at` on INSERT/UPDATE**

---

## Data Consistency Rules

✅ **Enforced Constraints:**
- Every `user_id` in `profiles` must exist in `auth.users`
- Every `order_id` in `order_items` must exist in `orders`
- Every `product_id` in `order_items` must exist in `products`
- `order_number` is unique across all orders
- `email` in `auth.users` is unique

⚠️ **Business Rules:**
- When order is deleted, `order_items` should be deleted (cascade)
- Completed orders (`payment_status='paid'`) should not be modified
- Product `stock` must be ≥ 0

---

## Dashboard Data Aggregations

### Total Revenue
```sql
SELECT COALESCE(SUM(total), 0) AS total_revenue
FROM orders
WHERE payment_status = 'paid'
AND created_at > now() - interval '30 days';
```

### Customer Statistics
```sql
SELECT 
    COUNT(DISTINCT user_id) AS total_customers,
    SUM(total) AS total_revenue,
    AVG(total) AS avg_order_value
FROM orders
WHERE payment_status = 'paid';
```

### Monthly Revenue
```sql
SELECT 
    date_trunc('month', created_at)::date AS month,
    SUM(total) AS revenue,
    COUNT(*) AS orders
FROM orders
WHERE payment_status = 'paid'
GROUP BY 1
ORDER BY 1 DESC;
```

---

## Column Naming Convention

- `id` - Always UUID primary key
- `*_id` - Foreign key references
- `created_at`, `updated_at` - Timestamp tracking
- `is_*` - Boolean flags
- Enum columns use lowercase values

## Notes for Developers

1. **RLS is Active** - All queries respect Row Level Security
2. **Auth Required** - Most write operations need `auth.uid()`
3. **Text Columns** - `address`, `name`, `comment` are all TEXT (no length limit)
4. **JSONB Columns** - `images`, `specs` can be queried with `->` operator
5. **Array Columns** - `tags` uses PostgreSQL array type

---

Last Updated: 2026-05-12
