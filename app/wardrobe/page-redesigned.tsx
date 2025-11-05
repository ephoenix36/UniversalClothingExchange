"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Filter, 
  Grid3x3, 
  List, 
  Shirt, 
  ShoppingBag,
  Sparkles,
  ArrowUpDown
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WardrobeItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  brand?: string;
  size: string;
  condition: string;
  availableForSwap: boolean;
  availableForSale: boolean;
  salePrice?: number;
  color: string[];
  images: { id: string; url: string; isPrimary: boolean }[];
}

export default function WardrobePage() {
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState({
    category: "",
    search: "",
    availableForSwap: "",
    sortBy: "newest",
  });

  useEffect(() => {
    fetchItems();
  }, [filter]);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter.category && filter.category !== "All") params.append("category", filter.category.toUpperCase());
      if (filter.search) params.append("search", filter.search);
      if (filter.availableForSwap) params.append("availableForSwap", filter.availableForSwap);

      const response = await fetch(`/api/wardrobe?${params.toString()}`);
      const data = await response.json();
      if (data.success) {
        setItems(data.items);
      }
    } catch (error) {
      console.error("Error fetching wardrobe:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    "All",
    "Tops",
    "Bottoms",
    "Dresses",
    "Outerwear",
    "Shoes",
    "Accessories",
    "Bags",
    "Jewelry",
  ];

  const conditionColors: Record<string, string> = {
    NEW: "success",
    LIKE_NEW: "info",
    GOOD: "default",
    FAIR: "warning",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white">
      <Navigation />

      <PageHeader
        title="My Wardrobe"
        description={`${items.length} ${items.length === 1 ? "item" : "items"} in your collection`}
        showHomeButton={false}
        actions={
          <Link href="/wardrobe/add">
            <Button size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Add Item
            </Button>
          </Link>
        }
        stats={[
          { label: "Total Items", value: items.length },
          { label: "For Swap", value: items.filter(i => i.availableForSwap).length },
          { label: "For Sale", value: items.filter(i => i.availableForSale).length },
          { label: "Categories", value: new Set(items.map(i => i.category)).size },
        ]}
      />

      <main className="pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Filters & Search */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="Search your wardrobe..."
                      value={filter.search}
                      onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <select
                    value={filter.category}
                    onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl border-2 border-gray-200 bg-white text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* View Mode */}
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="default"
                    onClick={() => setViewMode("grid")}
                    className="flex-1"
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="default"
                    onClick={() => setViewMode("list")}
                    className="flex-1"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Quick Filters */}
              <div className="flex flex-wrap gap-2 mt-4">
                <button
                  onClick={() => setFilter({ ...filter, availableForSwap: filter.availableForSwap === "true" ? "" : "true" })}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                    filter.availableForSwap === "true"
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30"
                      : "bg-white border-2 border-gray-200 text-gray-700 hover:border-purple-300"
                  )}
                >
                  <Sparkles className="w-4 h-4 inline mr-2" />
                  Available for Swap
                </button>
                <button
                  onClick={() => setFilter({ ...filter, availableForSwap: filter.availableForSwap === "false" ? "" : "false" })}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                    filter.availableForSwap === "false"
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30"
                      : "bg-white border-2 border-gray-200 text-gray-700 hover:border-purple-300"
                  )}
                >
                  <ShoppingBag className="w-4 h-4 inline mr-2" />
                  For Sale Only
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
              <p className="text-gray-600 mt-4">Loading your wardrobe...</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && items.length === 0 && (
            <Card className="text-center py-16">
              <CardContent>
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/30">
                  <Shirt className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Your wardrobe is empty
                </h3>
                <p className="text-gray-600 mb-6">
                  Start adding items to build your digital closet
                </p>
                <Link href="/wardrobe/add">
                  <Button size="lg">
                    <Plus className="w-5 h-5 mr-2" />
                    Add Your First Item
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Grid View */}
          {!isLoading && items.length > 0 && viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <Link key={item.id} href={`/wardrobe/${item.id}`}>
                  <Card className="group hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden">
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      {item.images.length > 0 ? (
                        <img
                          src={item.images[0].url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                          <Shirt className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {item.availableForSwap && (
                          <Badge variant="success" className="shadow-lg">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Swap
                          </Badge>
                        )}
                        {item.availableForSale && (
                          <Badge variant="info" className="shadow-lg">
                            ${item.salePrice?.toFixed(2)}
                          </Badge>
                        )}
                      </div>

                      <div className="absolute top-3 right-3">
                        <Badge variant={conditionColors[item.condition] as any || "default"} className="shadow-lg">
                          {item.condition.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg text-gray-900 mb-1 truncate">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        {item.brand && <span className="font-medium">{item.brand}</span>}
                        {item.brand && item.size && <span>•</span>}
                        {item.size && <span>Size {item.size}</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {item.category}
                        </Badge>
                        {item.color.length > 0 && (
                          <span className="text-xs text-gray-500">
                            {item.color[0]}{item.color.length > 1 && ` +${item.color.length - 1}`}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {/* List View */}
          {!isLoading && items.length > 0 && viewMode === "list" && (
            <div className="space-y-4">
              {items.map((item) => (
                <Link key={item.id} href={`/wardrobe/${item.id}`}>
                  <Card className="group hover:shadow-lg transition-all cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        {/* Image */}
                        <div className="flex-shrink-0 w-32 h-32 rounded-xl overflow-hidden bg-gray-100">
                          {item.images.length > 0 ? (
                            <img
                              src={item.images[0].url}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                              <Shirt className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-1">
                                {item.title}
                              </h3>
                              <div className="flex items-center gap-2 text-gray-600 mb-2">
                                {item.brand && <span className="font-medium">{item.brand}</span>}
                                {item.brand && <span>•</span>}
                                <span>Size {item.size}</span>
                                <span>•</span>
                                <Badge variant={conditionColors[item.condition] as any || "default"}>
                                  {item.condition.replace("_", " ")}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2 items-end">
                              {item.availableForSwap && (
                                <Badge variant="success">
                                  <Sparkles className="w-3 h-3 mr-1" />
                                  Available for Swap
                                </Badge>
                              )}
                              {item.availableForSale && (
                                <Badge variant="info">
                                  For Sale: ${item.salePrice?.toFixed(2)}
                                </Badge>
                              )}
                            </div>
                          </div>

                          {item.description && (
                            <p className="text-gray-600 mb-3 line-clamp-2">
                              {item.description}
                            </p>
                          )}

                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary">{item.category}</Badge>
                            {item.color.map((color) => (
                              <Badge key={color} variant="outline" className="text-xs">
                                {color}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
