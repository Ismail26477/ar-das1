// Auto-generated types matching your Supabase schema
export type UUID = string;
export type Timestamp = string;

// Enum types
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type UserRole = 'admin' | 'moderator' | 'user';
export type AddressType = 'billing' | 'shipping' | 'other';

// Database Tables
export interface Profile {
  id: UUID;
  email: string;
  full_name: string;
  phone_number: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface Category {
  id: UUID;
  name: string;
  slug: string;
  description: string | null;
  icon_url: string | null;
  image_url: string | null;
  display_order: number;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface Subcategory {
  id: UUID;
  category_id: UUID;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface Product {
  id: UUID;
  category_id: UUID;
  subcategory_id: UUID | null;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  price: number;
  discount_price: number | null;
  sku: string;
  stock_quantity: number;
  rating: number;
  review_count: number;
  image_url: string | null;
  images_json: Array<{ url: string; alt: string }> | null;
  specifications_json: Record<string, string> | null;
  is_featured: boolean;
  is_active: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface Review {
  id: UUID;
  product_id: UUID;
  user_id: UUID;
  rating: number;
  title: string;
  comment: string | null;
  helpful_count: number;
  unhelpful_count: number;
  is_verified_purchase: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface Address {
  id: UUID;
  user_id: UUID;
  type: AddressType;
  street_address: string;
  city: string;
  state_province: string;
  postal_code: string;
  country: string;
  phone_number: string | null;
  is_default: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface Order {
  id: UUID;
  user_id: UUID;
  order_number: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  total_amount: number;
  discount_amount: number;
  tax_amount: number;
  shipping_amount: number;
  shipping_address_id: UUID | null;
  billing_address_id: UUID | null;
  notes: string | null;
  tracking_number: string | null;
  created_at: Timestamp;
  updated_at: Timestamp;
  delivered_at: Timestamp | null;
}

export interface OrderItem {
  id: UUID;
  order_id: UUID;
  product_id: UUID;
  quantity: number;
  unit_price: number;
  discount_amount: number;
  line_total: number;
  created_at: Timestamp;
}

export interface CartItem {
  id: UUID;
  user_id: UUID;
  product_id: UUID;
  quantity: number;
  added_at: Timestamp;
  updated_at: Timestamp;
}

export interface WishlistItem {
  id: UUID;
  user_id: UUID;
  product_id: UUID;
  added_at: Timestamp;
}

export interface UserRoleRecord {
  id: UUID;
  user_id: UUID;
  role: UserRole;
  created_at: Timestamp;
}

// Combined/Extended Types
export interface OrderWithDetails extends Order {
  order_items: OrderItem[];
  customer: Profile | null;
  shipping_address: Address | null;
  billing_address: Address | null;
}

export interface ProductWithCategory extends Product {
  category: Category | null;
  subcategory: Subcategory | null;
  reviews: Review[];
}

export interface ReviewWithDetails extends Review {
  product: Product | null;
  user: Profile | null;
}

export interface CartItemWithProduct extends CartItem {
  product: Product | null;
}

export interface WishlistItemWithProduct extends WishlistItem {
  product: Product | null;
}

// API Response Types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
