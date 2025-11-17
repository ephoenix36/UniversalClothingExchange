"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { WardrobeItemCard, WardrobeItemCardSkeleton } from "@/components/wardrobe/WardrobeItemCard";
import { WardrobeTable } from "@/components/wardrobe/WardrobeTable";
import { AddItemDialog } from "@/components/wardrobe/AddItemDialog";
import { toast } from "sonner";
import {
	Grid3x3,
	List,
	Search,
	Filter,
	Plus,
	TrendingUp,
	Package,
	Repeat,
} from "lucide-react";
import type { WardrobeItem, ItemImage } from "@prisma/client";

type WardrobeItemWithImages = WardrobeItem & {
	images: ItemImage[];
};

interface WardrobeStats {
	totalItems: number;
	availableForSwap: number;
	totalValue: number;
	totalSwaps: number;
}

export default function WardrobePage() {
	const [items, setItems] = useState<WardrobeItemWithImages[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [filter, setFilter] = useState({
		category: "",
		search: "",
		availableForSwap: "",
		condition: "",
		status: "",
	});
	const [stats, setStats] = useState<WardrobeStats>({
		totalItems: 0,
		availableForSwap: 0,
		totalValue: 0,
		totalSwaps: 0,
	});

	useEffect(() => {
		fetchItems();
	}, [filter]);

	const fetchItems = async () => {
		try {
			setIsLoading(true);
			const params = new URLSearchParams();
			if (filter.category) params.append("category", filter.category);
			if (filter.search) params.append("search", filter.search);
			if (filter.availableForSwap)
				params.append("availableForSwap", filter.availableForSwap);
			if (filter.condition) params.append("condition", filter.condition);
			if (filter.status) params.append("status", filter.status);

			const response = await fetch(`/api/wardrobe?${params.toString()}`);
			const data = await response.json();
			
			if (data.success) {
				setItems(data.items);
				calculateStats(data.items);
			} else {
				toast.error("Failed to load wardrobe");
			}
		} catch (error) {
			console.error("Error fetching wardrobe:", error);
			toast.error("Error loading wardrobe");
		} finally {
			setIsLoading(false);
		}
	};

	const calculateStats = (items: WardrobeItemWithImages[]) => {
		const stats: WardrobeStats = {
			totalItems: items.length,
			availableForSwap: items.filter((item) => item.availableForSwap).length,
			totalValue: items.reduce(
				(sum, item) => sum + (item.estimatedValue || 0),
				0,
			),
			totalSwaps: items.reduce((sum, item) => sum + item.swapCount, 0),
		};
		setStats(stats);
	};

	const handleAddSuccess = () => {
		fetchItems();
		toast.success("Item added to wardrobe!");
	};

	const handleEdit = (id: string) => {
		// TODO: Implement edit dialog
		toast.info("Edit feature coming soon!");
	};

	const handleDelete = async (id: string) => {
		if (!confirm("Are you sure you want to delete this item?")) return;

		try {
			const response = await fetch(`/api/wardrobe/${id}`, {
				method: "DELETE",
			});

			if (response.ok) {
				toast.success("Item deleted");
				fetchItems();
			} else {
				toast.error("Failed to delete item");
			}
		} catch (error) {
			console.error("Error deleting item:", error);
			toast.error("Error deleting item");
		}
	};

	const handleView = (id: string) => {
		window.location.href = `/wardrobe/${id}`;
	};

	const handleShare = (id: string) => {
		const url = `${window.location.origin}/wardrobe/${id}`;
		navigator.clipboard.writeText(url);
		toast.success("Link copied to clipboard!");
	};

	const categories = [
		{ value: "", label: "All Categories" },
		{ value: "TOPS", label: "Tops" },
		{ value: "BOTTOMS", label: "Bottoms" },
		{ value: "DRESSES", label: "Dresses" },
		{ value: "OUTERWEAR", label: "Outerwear" },
		{ value: "SHOES", label: "Shoes" },
		{ value: "ACCESSORIES", label: "Accessories" },
		{ value: "BAGS", label: "Bags" },
		{ value: "JEWELRY", label: "Jewelry" },
	];

	const conditions = [
		{ value: "", label: "All Conditions" },
		{ value: "NEW", label: "New" },
		{ value: "LIKE_NEW", label: "Like New" },
		{ value: "GOOD", label: "Good" },
		{ value: "FAIR", label: "Fair" },
	];

	const statuses = [
		{ value: "", label: "All Statuses" },
		{ value: "AVAILABLE", label: "Available" },
		{ value: "ON_LOAN", label: "On Loan" },
		{ value: "IN_TRANSIT", label: "In Transit" },
		{ value: "UNAVAILABLE", label: "Unavailable" },
	];

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<div className="border-b bg-card">
				<div className="max-w-7xl mx-auto px-4 py-6">
					<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
						<div>
							<h1 className="text-3xl font-bold tracking-tight">My Wardrobe</h1>
							<p className="text-muted-foreground mt-1">
								Manage your clothing collection
							</p>
						</div>
						<AddItemDialog
							trigger={
								<Button size="lg">
									<Plus className="h-5 w-5 mr-2" />
									Add Item
								</Button>
							}
							onSuccess={handleAddSuccess}
						/>
					</div>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-4 py-6">
				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
					<div className="p-4 rounded-lg border bg-card">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-muted-foreground">Total Items</p>
								<p className="text-2xl font-bold mt-1">{stats.totalItems}</p>
							</div>
							<Package className="h-8 w-8 text-primary opacity-80" />
						</div>
					</div>
					<div className="p-4 rounded-lg border bg-card">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-muted-foreground">Available</p>
								<p className="text-2xl font-bold mt-1">
									{stats.availableForSwap}
								</p>
							</div>
							<Repeat className="h-8 w-8 text-green-500 opacity-80" />
						</div>
					</div>
					<div className="p-4 rounded-lg border bg-card">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-muted-foreground">Total Value</p>
								<p className="text-2xl font-bold mt-1">
									${stats.totalValue.toFixed(0)}
								</p>
							</div>
							<TrendingUp className="h-8 w-8 text-blue-500 opacity-80" />
						</div>
					</div>
					<div className="p-4 rounded-lg border bg-card">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-muted-foreground">Total Swaps</p>
								<p className="text-2xl font-bold mt-1">{stats.totalSwaps}</p>
							</div>
							<Repeat className="h-8 w-8 text-purple-500 opacity-80" />
						</div>
					</div>
				</div>

				{/* Filters & View Toggle */}
				<div className="flex flex-col md:flex-row gap-4 mb-6">
					{/* Search */}
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search items..."
							value={filter.search}
							onChange={(e) =>
								setFilter({ ...filter, search: e.target.value })
							}
							className="pl-10"
						/>
					</div>

					{/* Category Filter */}
					<Select
						value={filter.category}
						onValueChange={(value) =>
							setFilter({ ...filter, category: value })
						}
					>
						<SelectTrigger className="w-full md:w-[180px]">
							<SelectValue placeholder="Category" />
						</SelectTrigger>
						<SelectContent>
							{categories.map((cat) => (
								<SelectItem key={cat.value} value={cat.value}>
									{cat.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					{/* Condition Filter */}
					<Select
						value={filter.condition}
						onValueChange={(value) =>
							setFilter({ ...filter, condition: value })
						}
					>
						<SelectTrigger className="w-full md:w-[180px]">
							<SelectValue placeholder="Condition" />
						</SelectTrigger>
						<SelectContent>
							{conditions.map((cond) => (
								<SelectItem key={cond.value} value={cond.value}>
									{cond.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					{/* Status Filter */}
					<Select
						value={filter.status}
						onValueChange={(value) => setFilter({ ...filter, status: value })}
					>
						<SelectTrigger className="w-full md:w-[180px]">
							<SelectValue placeholder="Status" />
						</SelectTrigger>
						<SelectContent>
							{statuses.map((status) => (
								<SelectItem key={status.value} value={status.value}>
									{status.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					{/* View Toggle */}
					<div className="flex gap-2">
						<Button
							variant={viewMode === "grid" ? "default" : "outline"}
							size="icon"
							onClick={() => setViewMode("grid")}
						>
							<Grid3x3 className="h-4 w-4" />
						</Button>
						<Button
							variant={viewMode === "list" ? "default" : "outline"}
							size="icon"
							onClick={() => setViewMode("list")}
						>
							<List className="h-4 w-4" />
						</Button>
					</div>
				</div>

				{/* Content */}
				{isLoading ? (
					viewMode === "grid" ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{Array.from({ length: 8 }).map((_, i) => (
								<WardrobeItemCardSkeleton key={i} />
							))}
						</div>
					) : (
						<div className="space-y-4">
							{Array.from({ length: 5 }).map((_, i) => (
								<Skeleton key={i} className="h-20 w-full" />
							))}
						</div>
					)
				) : items.length === 0 ? (
					<div className="text-center py-20">
						<div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mx-auto mb-8 border-4 border-primary/20">
							<Package className="w-16 h-16 text-primary" />
						</div>
						<h3 className="text-3xl font-bold mb-4">Your wardrobe is empty</h3>
						<p className="text-muted-foreground mb-8 max-w-md mx-auto">
							Start adding items to your wardrobe to begin swapping with the
							community!
						</p>
						<AddItemDialog
							trigger={
								<Button size="lg">
									<Plus className="h-5 w-5 mr-2" />
									Add Your First Item
								</Button>
							}
							onSuccess={handleAddSuccess}
						/>
					</div>
				) : viewMode === "grid" ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{items.map((item) => (
							<WardrobeItemCard
								key={item.id}
								item={item}
								onEdit={handleEdit}
								onDelete={handleDelete}
								onShare={handleShare}
								onView={handleView}
							/>
						))}
					</div>
				) : (
					<WardrobeTable
						items={items}
						onEdit={handleEdit}
						onDelete={handleDelete}
						onView={handleView}
					/>
				)}
			</div>
		</div>
	);
}
