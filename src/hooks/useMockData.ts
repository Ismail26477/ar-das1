import { useQuery } from "@tanstack/react-query";

export const useMockOrders = () => {
  return useQuery({
    queryKey: ["mock-orders"],
    queryFn: async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return [
        {
          id: 1,
          order_number: "ORD-20260512-001",
          buyer_name: "Rajesh Kumar",
          buyer_email: "rajesh@example.com",
          total: 45000,
          status: "delivered",
          payment_status: "paid",
          payment_method: "credit_card",
          shipping_address: "123 Main St, Mumbai, MH 400001",
          created_at: "2026-05-10T10:30:00Z",
        },
        {
          id: 2,
          order_number: "ORD-20260512-002",
          buyer_name: "Priya Singh",
          buyer_email: "priya@example.com",
          total: 78500,
          status: "shipped",
          payment_status: "paid",
          payment_method: "upi",
          shipping_address: "456 Park Ave, Delhi, DL 110001",
          created_at: "2026-05-11T14:20:00Z",
        },
        {
          id: 3,
          order_number: "ORD-20260512-003",
          buyer_name: "Amit Patel",
          buyer_email: "amit@example.com",
          total: 125000,
          status: "processing",
          payment_status: "paid",
          payment_method: "net_banking",
          shipping_address: "789 Tech Park, Bangalore, KA 560001",
          created_at: "2026-05-12T08:15:00Z",
        },
        {
          id: 4,
          order_number: "ORD-20260512-004",
          buyer_name: "Sneha Desai",
          buyer_email: "sneha@example.com",
          total: 32000,
          status: "processing",
          payment_status: "paid",
          payment_method: "credit_card",
          shipping_address: "321 Cyber City, Pune, MH 411001",
          created_at: "2026-05-12T09:45:00Z",
        },
        {
          id: 5,
          order_number: "ORD-20260512-005",
          buyer_name: "Vikram Mehta",
          buyer_email: "vikram@example.com",
          total: 95000,
          status: "delivered",
          payment_status: "paid",
          payment_method: "upi",
          shipping_address: "654 Business Hub, Hyderabad, TS 500001",
          created_at: "2026-05-11T16:30:00Z",
        },
      ];
    },
    staleTime: 30000,
  });
};

export const useMockCustomers = () => {
  return useQuery({
    queryKey: ["mock-customers"],
    queryFn: async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return [
        {
          id: 1,
          user_id: "user-1",
          name: "Rajesh Kumar",
          email: "rajesh@example.com",
          phone: "+91-9876543210",
          totalSpent: 250000,
          totalOrders: 5,
          created_at: "2025-12-01T10:00:00Z",
        },
        {
          id: 2,
          user_id: "user-2",
          name: "Priya Singh",
          email: "priya@example.com",
          phone: "+91-9876543211",
          totalSpent: 450000,
          totalOrders: 8,
          created_at: "2025-11-15T14:30:00Z",
        },
        {
          id: 3,
          user_id: "user-3",
          name: "Amit Patel",
          email: "amit@example.com",
          phone: "+91-9876543212",
          totalSpent: 675000,
          totalOrders: 12,
          created_at: "2025-10-20T08:00:00Z",
        },
        {
          id: 4,
          user_id: "user-4",
          name: "Sneha Desai",
          email: "sneha@example.com",
          phone: "+91-9876543213",
          totalSpent: 125000,
          totalOrders: 3,
          created_at: "2025-12-10T11:20:00Z",
        },
        {
          id: 5,
          user_id: "user-5",
          name: "Vikram Mehta",
          email: "vikram@example.com",
          phone: "+91-9876543214",
          totalSpent: 850000,
          totalOrders: 15,
          created_at: "2025-09-05T09:15:00Z",
        },
      ];
    },
    staleTime: 30000,
  });
};

export const useMockAnalytics = () => {
  return useQuery({
    queryKey: ["mock-analytics"],
    queryFn: async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return {
        totalRevenue: 2827500,
        totalOrders: 47,
        newCustomers: 8,
        averageOrderValue: 60159,
        monthlyTrend: [
          { date: "Jan", revenue: 245000, orders: 5 },
          { date: "Feb", revenue: 320000, orders: 7 },
          { date: "Mar", revenue: 410000, orders: 9 },
          { date: "Apr", revenue: 385000, orders: 8 },
          { date: "May", revenue: 467500, orders: 10 },
        ],
      };
    },
    staleTime: 30000,
  });
};

export const useMockProducts = () => {
  return useQuery({
    queryKey: ["mock-products"],
    queryFn: async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return [
        {
          id: 1,
          name: "Gaming Laptop Pro",
          sku: "GLAP-001",
          price: 125000,
          stock: 45,
          category: "Laptops",
          sales: 234,
        },
        {
          id: 2,
          name: "Wireless Keyboard RGB",
          sku: "WKRG-001",
          price: 3500,
          stock: 120,
          category: "Peripherals",
          sales: 456,
        },
        {
          id: 3,
          name: "4K Monitor UltraWide",
          sku: "MONU-001",
          price: 45000,
          stock: 23,
          category: "Monitors",
          sales: 89,
        },
        {
          id: 4,
          name: "Gaming Mouse Pro",
          sku: "GMOU-001",
          price: 4500,
          stock: 98,
          category: "Peripherals",
          sales: 523,
        },
        {
          id: 5,
          name: "Desktop PC Workstation",
          sku: "DPCK-001",
          price: 189000,
          stock: 12,
          category: "Desktops",
          sales: 67,
        },
      ];
    },
    staleTime: 30000,
  });
};
