import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  total: number;
  status: "processing" | "shipped" | "delivered" | "cancelled" | "returned";
  payment_status: "pending" | "paid" | "failed" | "refunded";
  razorpay_payment_id?: string;
  shipping_address: string;
  payment_method: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  created_at: string;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
  buyer_email: string;
  buyer_name: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  brand: string;
  category_id: string;
  subcategory_id: string;
  price: number;
  discount_price?: number;
  stock: number;
  rating: number;
  review_count: number;
  images: string[];
  specs: Record<string, string>;
  tags: string[];
  is_featured: boolean;
  is_trending: boolean;
  is_best_seller: boolean;
  is_new_arrival: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  user_id: string;
  full_name: string;
  phone: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  image_url: string;
  sort_order: number;
  created_at: string;
}

export interface UserRole {
  user_id: string;
  role: "admin" | "moderator" | "user";
  created_at: string;
}

// Fetch all orders with buyer details
export function useOrders() {
  return useQuery({
    queryKey: ["supabase", "orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items(*)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    staleTime: 30000,
  });
}

// Fetch orders with buyer info
export function useOrdersWithBuyers() {
  return useQuery({
    queryKey: ["supabase", "orders-with-buyers"],
    queryFn: async () => {
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (ordersError) throw ordersError;

      // Get all unique user_ids
      const userIds = [...new Set((orders || []).map((o) => o.user_id))];

      // Fetch auth emails (we'll need to get this from auth.users)
      const { data: authUsers, error: authError } = await supabase.auth.admin?.listUsers() || { data: null, error: null };

      if (authError) {
        console.error("Auth fetch failed, using fallback");
      }

      // Map user_id to email
      const userEmailMap: Record<string, string> = {};
      if (authUsers) {
        authUsers.users.forEach((user) => {
          userEmailMap[user.id] = user.email || "";
        });
      }

      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .in("user_id", userIds);

      if (profilesError) throw profilesError;

      // Create profile map
      const profileMap: Record<string, any> = {};
      (profiles || []).forEach((p) => {
        profileMap[p.user_id] = p;
      });

      // Enrich orders with buyer info
      return (orders || []).map((order) => ({
        ...order,
        buyer_email: userEmailMap[order.user_id] || "unknown",
        buyer_name: profileMap[order.user_id]?.full_name || "N/A",
      }));
    },
    staleTime: 30000,
  });
}

// Fetch all products
export function useProducts() {
  return useQuery({
    queryKey: ["supabase", "products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    staleTime: 30000,
  });
}

// Fetch low stock products
export function useInventoryAlerts() {
  return useQuery({
    queryKey: ["supabase", "inventory-alerts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .lt("stock", 5)
        .order("stock", { ascending: true });

      if (error) throw error;
      return data || [];
    },
    staleTime: 30000,
  });
}

// Fetch top products by sales
export function useTopProducts() {
  return useQuery({
    queryKey: ["supabase", "top-products"],
    queryFn: async () => {
      // This would need an RPC function or aggregation in the frontend
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("review_count", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    },
    staleTime: 30000,
  });
}

// Fetch all customers (users with profiles)
export function useCustomers() {
  return useQuery({
    queryKey: ["supabase", "customers"],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Get auth users to fetch emails
      const { data: authUsers } = await supabase.auth.admin?.listUsers() || { data: null };

      // Create user map
      const userMap: Record<string, any> = {};
      if (authUsers) {
        authUsers.users.forEach((user) => {
          userMap[user.id] = user;
        });
      }

      // Fetch orders for each user
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select("user_id, total")
        .eq("payment_status", "paid");

      if (ordersError) throw ordersError;

      // Calculate stats per user
      const orderStats: Record<string, { count: number; total: number }> = {};
      (orders || []).forEach((order) => {
        if (!orderStats[order.user_id]) {
          orderStats[order.user_id] = { count: 0, total: 0 };
        }
        orderStats[order.user_id].count++;
        orderStats[order.user_id].total += order.total || 0;
      });

      // Enrich profiles with order data
      return (profiles || []).map((profile) => ({
        name: profile.full_name,
        email: userMap[profile.user_id]?.email || "unknown@example.com",
        phone: profile.phone,
        totalOrders: orderStats[profile.user_id]?.count || 0,
        totalSpent: orderStats[profile.user_id]?.total || 0,
        joinedAt: profile.created_at,
        user_id: profile.user_id,
      }));
    },
    staleTime: 30000,
  });
}

// Fetch analytics dashboard data
export function useAnalytics() {
  return useQuery({
    queryKey: ["supabase", "analytics"],
    queryFn: async () => {
      // Fetch all relevant data
      const [ordersRes, productsRes, profilesRes, ordersItemsRes] = await Promise.all([
        supabase.from("orders").select("*").eq("payment_status", "paid"),
        supabase.from("products").select("*"),
        supabase.from("profiles").select("*"),
        supabase.from("order_items").select("*"),
      ]);

      const orders = ordersRes.data || [];
      const products = productsRes.data || [];
      const profiles = profilesRes.data || [];
      const orderItems = ordersItemsRes.data || [];

      const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
      const totalOrders = orders.length;
      const newCustomers = profiles.filter(
        (p) => new Date(p.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ).length;
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Monthly revenue data (last 12 months)
      const monthlyRevenue = Array(12)
        .fill(0)
        .map((_, i) => {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          const monthStr = date.toLocaleString("en-IN", { month: "short" });
          const monthRevenue = orders
            .filter((o) => {
              const oDate = new Date(o.created_at);
              return (
                oDate.getMonth() === date.getMonth() &&
                oDate.getFullYear() === date.getFullYear()
              );
            })
            .reduce((sum, o) => sum + (o.total || 0), 0);
          return { month: monthStr, revenue: monthRevenue, orders: 0 };
        })
        .reverse();

      return {
        totalRevenue,
        totalOrders,
        newCustomers,
        avgOrderValue,
        pendingOrders: orders.filter((o) => o.status === "processing").length,
        monthlyRevenue,
      };
    },
    staleTime: 60000,
  });
}

// Fetch reviews
export function useReviews() {
  return useQuery({
    queryKey: ["supabase", "reviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    staleTime: 30000,
  });
}

// Fetch categories
export function useCategories() {
  return useQuery({
    queryKey: ["supabase", "categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return data || [];
    },
    staleTime: 60000,
  });
}

// Fetch single order with items
export function useOrderDetail(orderId: string) {
  return useQuery({
    queryKey: ["supabase", "order", orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items(*)
        `)
        .eq("id", orderId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!orderId,
  });
}

export type {
  Order,
  OrderItem,
  OrderWithItems,
  Product,
  Profile,
  Review,
  Category,
  UserRole,
};
