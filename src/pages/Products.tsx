import { useState, useMemo } from "react";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { useProducts } from "@/hooks/useSupabase";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Loader2,
  Package,
  Layers,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

function formatAmount(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export default function Products() {
  const { data: products, isLoading, error } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  // Get unique categories
  const categories = useMemo(() => {
    if (!products) return [];
    const cats = [...new Set(products.map((p: any) => p.category))];
    return cats.sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter((product: any) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        product.name?.toLowerCase().includes(searchLower) ||
        product.sku?.toLowerCase().includes(searchLower);

      const matchesCategory =
        categoryFilter === "all" || product.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, categoryFilter]);

  const clearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
  };

  const hasActiveFilters = searchQuery || categoryFilter !== "all";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Products</h1>
            <p className="text-muted-foreground">
              View your product catalog
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Products</p>
                  <p className="text-2xl font-bold">{products?.length || 0}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Categories</p>
                  <p className="text-2xl font-bold">{categories.length}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-2xl font-bold text-green-600">Active</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="text-xl font-bold">Today</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Layers className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button variant="ghost" onClick={clearFilters} className="gap-2">
                  <X className="w-4 h-4" />
                  Clear
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {hasActiveFilters
                ? `Filtered Products (${filteredProducts.length})`
                : "All Products"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Package className="w-12 h-12 mb-4 opacity-50" />
                <p>Failed to load products</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Package className="w-12 h-12 mb-4 opacity-50" />
                <p>No products found</p>
                {hasActiveFilters && (
                  <Button variant="link" onClick={clearFilters} className="mt-2">
                    Clear filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product: any) => (
                      <TableRow
                        key={product.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedProduct(product)}
                      >
                        <TableCell className="font-medium">
                          {product.name}
                        </TableCell>
                        <TableCell className="font-mono text-sm text-muted-foreground">
                          {product.sku}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{product.category}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatAmount(product.price)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Product Details Modal */}
        <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Product Details
              </DialogTitle>
              <DialogDescription>
                {selectedProduct?.sku}
              </DialogDescription>
            </DialogHeader>

            {selectedProduct && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Product Name</p>
                  <p className="text-lg font-semibold">{selectedProduct.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <Badge variant="outline">{selectedProduct.category}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="text-lg font-semibold text-emerald-600">
                    {formatAmount(selectedProduct.price)}
                  </p>
                </div>
                {selectedProduct.description && (
                  <div>
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="text-foreground">{selectedProduct.description}</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
