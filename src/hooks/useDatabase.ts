import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type {
  Profile,
  Category,
  Subcategory,
  Product,
  Review,
  Address,
  Order,
  OrderItem,
  CartItem,
  WishlistItem,
  UserRoleRecord,
  OrderWithDetails,
  ProductWithCategory,
  ReviewWithDetails,
  CartItemWithProduct,
  PaginatedResponse,
  ApiResponse,
} from '@/types/database';

// ============= PROFILE QUERIES =============
export function useProfiles() {
  return useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Profile[];
    },
  });
}

export function useProfile(userId: string) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data as Profile;
    },
    enabled: !!userId,
  });
}

// ============= CATEGORY QUERIES =============
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as Category[];
    },
    staleTime: 60000,
  });
}

export function useCategory(categoryId: string) {
  return useQuery({
    queryKey: ['category', categoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', categoryId)
        .single();

      if (error) throw error;
      return data as Category;
    },
    enabled: !!categoryId,
  });
}

// ============= SUBCATEGORY QUERIES =============
export function useSubcategories() {
  return useQuery({
    queryKey: ['subcategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subcategories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as Subcategory[];
    },
  });
}

export function useSubcategoriesByCategory(categoryId: string) {
  return useQuery({
    queryKey: ['subcategories', categoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subcategories')
        .select('*')
        .eq('category_id', categoryId)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as Subcategory[];
    },
    enabled: !!categoryId,
  });
}

// ============= PRODUCT QUERIES =============
export function useProducts(limit = 50, offset = 0) {
  return useQuery({
    queryKey: ['products', limit, offset],
    queryFn: async () => {
      const { data, error, count } = await supabase
        .from('products')
        .select('*', { count: 'exact' })
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return {
        items: data as Product[],
        total: count || 0,
        hasMore: (count || 0) > offset + limit,
      };
    },
  });
}

export function useProduct(productId: string) {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          reviews(*),
          categories!category_id(*),
          subcategories!subcategory_id(*)
        `)
        .eq('id', productId)
        .single();

      if (error) throw error;
      return data as ProductWithCategory;
    },
    enabled: !!productId,
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .eq('is_active', true)
        .limit(12);

      if (error) throw error;
      return data as Product[];
    },
    staleTime: 60000,
  });
}

export function useSearchProducts(searchTerm: string) {
  return useQuery({
    queryKey: ['search-products', searchTerm],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .limit(20);

      if (error) throw error;
      return data as Product[];
    },
    enabled: !!searchTerm && searchTerm.length > 2,
  });
}

export function useProductsByCategory(categoryId: string) {
  return useQuery({
    queryKey: ['products-by-category', categoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', categoryId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Product[];
    },
    enabled: !!categoryId,
  });
}

// ============= REVIEW QUERIES =============
export function useReviews() {
  return useQuery({
    queryKey: ['reviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          product_id(*),
          user_id(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ReviewWithDetails[];
    },
  });
}

export function useProductReviews(productId: string) {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Review[];
    },
    enabled: !!productId,
  });
}

export function useUserReviews(userId: string) {
  return useQuery({
    queryKey: ['user-reviews', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Review[];
    },
    enabled: !!userId,
  });
}

// ============= ADDRESS QUERIES =============
export function useAddresses(userId: string) {
  return useQuery({
    queryKey: ['addresses', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Address[];
    },
    enabled: !!userId,
  });
}

export function useDefaultAddress(userId: string) {
  return useQuery({
    queryKey: ['default-address', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', userId)
        .eq('is_default', true)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as Address | null;
    },
    enabled: !!userId,
  });
}

// ============= ORDER QUERIES =============
export function useOrders(userId?: string) {
  return useQuery({
    queryKey: ['orders', userId],
    queryFn: async () => {
      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items(*),
          profiles!user_id(*),
          addresses!shipping_address_id(*),
          addresses!billing_address_id(*)
        `)
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as OrderWithDetails[];
    },
    enabled: !userId || !!userId,
  });
}

export function useOrder(orderId: string) {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(*),
          profiles!user_id(*),
          addresses!shipping_address_id(*),
          addresses!billing_address_id(*)
        `)
        .eq('id', orderId)
        .single();

      if (error) throw error;
      return data as OrderWithDetails;
    },
    enabled: !!orderId,
  });
}

export function useUserOrders(userId: string) {
  return useQuery({
    queryKey: ['user-orders', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*,order_items(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as OrderWithDetails[];
    },
    enabled: !!userId,
  });
}

// ============= CART QUERIES =============
export function useCart(userId: string) {
  return useQuery({
    queryKey: ['cart', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*,products(*)')
        .eq('user_id', userId);

      if (error) throw error;
      return data as CartItemWithProduct[];
    },
    enabled: !!userId,
  });
}

export function useCartSummary(userId: string) {
  return useQuery({
    queryKey: ['cart-summary', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*,products(price,discount_price)')
        .eq('user_id', userId);

      if (error) throw error;

      const items = data as CartItem[];
      const total = items.reduce((sum, item) => sum + item.quantity, 0);
      
      return {
        itemCount: total,
        items,
      };
    },
    enabled: !!userId,
  });
}

// ============= WISHLIST QUERIES =============
export function useWishlist(userId: string) {
  return useQuery({
    queryKey: ['wishlist', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wishlist_items')
        .select('*,products(*)')
        .eq('user_id', userId);

      if (error) throw error;
      return data as WishlistItem[];
    },
    enabled: !!userId,
  });
}

// ============= USER ROLE QUERIES =============
export function useUserRole(userId: string) {
  return useQuery({
    queryKey: ['user-role', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as UserRoleRecord | null;
    },
    enabled: !!userId,
  });
}

// ============= MUTATIONS =============
export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (review: Omit<Review, 'id' | 'created_at' | 'updated_at' | 'helpful_count' | 'unhelpful_count'>) => {
      const { data, error } = await supabase
        .from('reviews')
        .insert([review])
        .select()
        .single();

      if (error) throw error;
      return data as Review;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}

export function useUpdateCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: CartItem) => {
      const { data, error } = await supabase
        .from('cart_items')
        .update(item)
        .eq('id', item.id)
        .select()
        .single();

      if (error) throw error;
      return data as CartItem;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: Omit<CartItem, 'id' | 'added_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('cart_items')
        .insert([{ ...item, added_at: new Date().toISOString(), updated_at: new Date().toISOString() }])
        .select()
        .single();

      if (error) throw error;
      return data as CartItem;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cart', variables.user_id] });
    },
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cartItemId: string) => {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useAddToWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: Omit<WishlistItem, 'id' | 'added_at'>) => {
      const { data, error } = await supabase
        .from('wishlist_items')
        .insert([{ ...item, added_at: new Date().toISOString() }])
        .select()
        .single();

      if (error) throw error;
      return data as WishlistItem;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', variables.user_id] });
    },
  });
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (wishlistItemId: string) => {
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('id', wishlistItemId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (order: Omit<Order, 'id' | 'created_at' | 'updated_at' | 'delivered_at'>) => {
      const { data, error } = await supabase
        .from('orders')
        .insert([order])
        .select()
        .single();

      if (error) throw error;
      return data as Order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useUpdateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (order: Partial<Order> & { id: string }) => {
      const { data, error } = await supabase
        .from('orders')
        .update(order)
        .eq('id', order.id)
        .select()
        .single();

      if (error) throw error;
      return data as Order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
