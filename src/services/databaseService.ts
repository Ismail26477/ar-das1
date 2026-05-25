import { supabase } from '@/integrations/supabase/client';
import type {
  Product,
  Category,
  Order,
  Profile,
  Review,
  Address,
  CartItem,
  WishlistItem,
  ApiResponse,
  PaginatedResponse,
} from '@/types/database';

// ============= DIAGNOSTIC FUNCTIONS =============
export async function testDatabaseConnection(): Promise<ApiResponse<string>> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('id')
      .limit(1);

    if (error) {
      return {
        data: null,
        error: `Database connection failed: ${error.message}`,
        success: false,
      };
    }

    return {
      data: 'Database connection successful',
      error: null,
      success: true,
    };
  } catch (err) {
    return {
      data: null,
      error: `Connection test error: ${err instanceof Error ? err.message : 'Unknown error'}`,
      success: false,
    };
  }
}

export async function verifyAllTables(): Promise<ApiResponse<Record<string, boolean>>> {
  const tables = [
    'profiles',
    'categories',
    'subcategories',
    'products',
    'reviews',
    'addresses',
    'orders',
    'order_items',
    'cart_items',
    'wishlist_items',
    'user_roles',
  ];

  const results: Record<string, boolean> = {};

  for (const table of tables) {
    try {
      const { error } = await supabase
        .from(table as any)
        .select('id')
        .limit(1);

      results[table] = !error;
    } catch (err) {
      results[table] = false;
    }
  }

  const allSuccessful = Object.values(results).every((v) => v);

  return {
    data: results,
    error: allSuccessful ? null : 'Some tables could not be accessed',
    success: allSuccessful,
  };
}

export async function getTableStats(): Promise<
  ApiResponse<
    Record<
      string,
      {
        count: number;
        error?: string;
      }
    >
  >
> {
  const tables = [
    'profiles',
    'categories',
    'subcategories',
    'products',
    'reviews',
    'addresses',
    'orders',
    'order_items',
    'cart_items',
    'wishlist_items',
    'user_roles',
  ];

  const stats: Record<string, { count: number; error?: string }> = {};

  for (const table of tables) {
    try {
      const { count, error } = await supabase
        .from(table as any)
        .select('*', { count: 'exact', head: true });

      if (error) {
        stats[table] = { count: 0, error: error.message };
      } else {
        stats[table] = { count: count || 0 };
      }
    } catch (err) {
      stats[table] = {
        count: 0,
        error: err instanceof Error ? err.message : 'Unknown error',
      };
    }
  }

  return {
    data: stats,
    error: null,
    success: true,
  };
}

// ============= PRODUCT SERVICES =============
export async function getAllProducts(
  limit = 50,
  offset = 0
): Promise<ApiResponse<PaginatedResponse<Product>>> {
  try {
    const { data, error, count } = await supabase
      .from('products')
      .select('*', { count: 'exact' })
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      data: {
        items: data as Product[],
        total: count || 0,
        page: Math.floor(offset / limit) + 1,
        limit,
        hasMore: (count || 0) > offset + limit,
      },
      error: null,
      success: true,
    };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Failed to fetch products',
      success: false,
    };
  }
}

export async function getProductById(productId: string): Promise<ApiResponse<Product>> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (error) throw error;

    return {
      data: data as Product,
      error: null,
      success: true,
    };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Failed to fetch product',
      success: false,
    };
  }
}

export async function searchProducts(
  searchTerm: string,
  limit = 20
): Promise<ApiResponse<Product[]>> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .limit(limit);

    if (error) throw error;

    return {
      data: data as Product[],
      error: null,
      success: true,
    };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Search failed',
      success: false,
    };
  }
}

// ============= CATEGORY SERVICES =============
export async function getAllCategories(): Promise<ApiResponse<Category[]>> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;

    return {
      data: data as Category[],
      error: null,
      success: true,
    };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Failed to fetch categories',
      success: false,
    };
  }
}

// ============= ORDER SERVICES =============
export async function getUserOrders(userId: string): Promise<ApiResponse<Order[]>> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      data: data as Order[],
      error: null,
      success: true,
    };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Failed to fetch orders',
      success: false,
    };
  }
}

export async function getOrderById(orderId: string): Promise<ApiResponse<Order>> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(*)
      `)
      .eq('id', orderId)
      .single();

    if (error) throw error;

    return {
      data: data as any as Order,
      error: null,
      success: true,
    };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Failed to fetch order',
      success: false,
    };
  }
}

// ============= PROFILE SERVICES =============
export async function getProfile(userId: string): Promise<ApiResponse<Profile>> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;

    return {
      data: data as Profile,
      error: null,
      success: true,
    };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Failed to fetch profile',
      success: false,
    };
  }
}

export async function updateProfile(
  userId: string,
  updates: Partial<Profile>
): Promise<ApiResponse<Profile>> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    return {
      data: data as Profile,
      error: null,
      success: true,
    };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Failed to update profile',
      success: false,
    };
  }
}

// ============= REVIEW SERVICES =============
export async function getProductReviews(productId: string): Promise<ApiResponse<Review[]>> {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .eq('is_verified_purchase', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      data: data as Review[],
      error: null,
      success: true,
    };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Failed to fetch reviews',
      success: false,
    };
  }
}

export async function createReview(review: Omit<Review, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Review>> {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .insert([review])
      .select()
      .single();

    if (error) throw error;

    return {
      data: data as Review,
      error: null,
      success: true,
    };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Failed to create review',
      success: false,
    };
  }
}

// ============= ADDRESS SERVICES =============
export async function getUserAddresses(userId: string): Promise<ApiResponse<Address[]>> {
  try {
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      data: data as Address[],
      error: null,
      success: true,
    };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Failed to fetch addresses',
      success: false,
    };
  }
}

export async function createAddress(
  address: Omit<Address, 'id' | 'created_at' | 'updated_at'>
): Promise<ApiResponse<Address>> {
  try {
    const { data, error } = await supabase
      .from('addresses')
      .insert([address])
      .select()
      .single();

    if (error) throw error;

    return {
      data: data as Address,
      error: null,
      success: true,
    };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Failed to create address',
      success: false,
    };
  }
}

// ============= CART SERVICES =============
export async function getUserCart(userId: string): Promise<ApiResponse<CartItem[]>> {
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;

    return {
      data: data as CartItem[],
      error: null,
      success: true,
    };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Failed to fetch cart',
      success: false,
    };
  }
}

export async function addToCart(
  item: Omit<CartItem, 'id' | 'added_at' | 'updated_at'>
): Promise<ApiResponse<CartItem>> {
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .insert([{ ...item, added_at: new Date().toISOString(), updated_at: new Date().toISOString() }])
      .select()
      .single();

    if (error) throw error;

    return {
      data: data as CartItem,
      error: null,
      success: true,
    };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Failed to add to cart',
      success: false,
    };
  }
}

// ============= WISHLIST SERVICES =============
export async function getUserWishlist(userId: string): Promise<ApiResponse<WishlistItem[]>> {
  try {
    const { data, error } = await supabase
      .from('wishlist_items')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;

    return {
      data: data as WishlistItem[],
      error: null,
      success: true,
    };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Failed to fetch wishlist',
      success: false,
    };
  }
}

export async function addToWishlist(
  item: Omit<WishlistItem, 'id' | 'added_at'>
): Promise<ApiResponse<WishlistItem>> {
  try {
    const { data, error } = await supabase
      .from('wishlist_items')
      .insert([{ ...item, added_at: new Date().toISOString() }])
      .select()
      .single();

    if (error) throw error;

    return {
      data: data as WishlistItem,
      error: null,
      success: true,
    };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Failed to add to wishlist',
      success: false,
    };
  }
}
