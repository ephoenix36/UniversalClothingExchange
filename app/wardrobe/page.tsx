"use client";

import { useEffect, useState } from "react";
import { Button } from "@whop/react/components";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";

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
	images: { id: string; url: string; isPrimary: boolean }[];
}

export default function WardrobePage() {
	const [items, setItems] = useState<WardrobeItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [filter, setFilter] = useState({
		category: "",
		search: "",
		availableForSwap: "",
	});

	useEffect(() => {
		fetchItems();
	}, [filter]);

	const fetchItems = async () => {
		try {
			const params = new URLSearchParams();
			if (filter.category) params.append("category", filter.category);
			if (filter.search) params.append("search", filter.search);
			if (filter.availableForSwap)
				params.append("availableForSwap", filter.availableForSwap);

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

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<PageHeader
				title="My Wardrobe"
				description={`${items.length} ${items.length === 1 ? "item" : "items"} in your collection`}
				backLink="/"
				backLabel="Home"
				actions={
					<Link href="/wardrobe/add">
						<Button variant="classic" size="3">
							+ Add Item
						</Button>
					</Link>
				}
				showHomeButton={false}
			/>

			<div className="max-w-7xl mx-auto px-4 py-6">
				{/* Filters */}
				<div className="flex flex-wrap gap-3 mb-6">
					{/* Search */}
					<input
						type="text"
						placeholder="Search items..."
						value={filter.search}
						onChange={(e) =>
							setFilter({ ...filter, search: e.target.value })
						}
						className="px-4 py-2 rounded-lg bg-muted border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring flex-1 min-w-[200px]"
					/>

					{/* Category Filter */}
					<select
						value={filter.category}
						onChange={(e) =>
							setFilter({ ...filter, category: e.target.value })
						}
						className="px-4 py-2 rounded-lg bg-muted border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
					>
						{categories.map((cat) => (
							<option key={cat} value={cat === "All" ? "" : cat.toUpperCase()}>
								{cat}
							</option>
						))}
					</select>

					{/* Availability Filter */}
					<select
						value={filter.availableForSwap}
						onChange={(e) =>
							setFilter({ ...filter, availableForSwap: e.target.value })
						}
						className="px-4 py-2 rounded-lg bg-muted border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
					>
						<option value="">All Items</option>
						<option value="true">Available for Swap</option>
						<option value="false">Not Available</option>
					</select>
				</div>

				{/* Content */}
				{isLoading ? (
					<div className="flex items-center justify-center py-20">
						<div className="text-muted-foreground">Loading wardrobe...</div>
					</div>
				) : items.length === 0 ? (
					<div className="text-center py-20">
						<div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mx-auto mb-8 border-4 border-primary/20">
							<svg 
								className="w-16 h-16 text-primary" 
								fill="none" 
								stroke="currentColor" 
								viewBox="0 0 24 24"
							>
								<path 
									strokeLinecap="round" 
									strokeLinejoin="round" 
									strokeWidth={1.5} 
									d="M12 4v16m8-8H4" 
								/>
							</svg>
						</div>
						<h3 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
							Your wardrobe is empty
						</h3>
						<p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
							Start building your digital wardrobe by adding items you're
							willing to swap or sell.
						</p>
						<Link href="/wardrobe/add">
							<Button variant="classic" size="4" className="shadow-lg hover:shadow-xl transition-shadow">
								Add Your First Item
							</Button>
						</Link>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
						{items.map((item) => (
							<Link
								key={item.id}
								href={`/wardrobe/${item.id}`}
								className="group"
							>
								<div className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow">
									{/* Image */}
									<div className="aspect-square bg-muted relative overflow-hidden">
										{item.images.length > 0 ? (
											<img
												src={item.images[0].url}
												alt={item.title}
												className="w-full h-full object-cover group-hover:scale-105 transition-transform"
											/>
										) : (
											<div className="w-full h-full flex items-center justify-center text-4xl text-muted-foreground">
												📷
											</div>
										)}

										{/* Badges */}
										<div className="absolute top-2 right-2 flex flex-col gap-2">
											{item.availableForSwap && (
												<span className="bg-success text-success-foreground text-xs px-2 py-1 rounded-full font-medium">
													Swap
												</span>
											)}
											{item.availableForSale && (
												<span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
													${item.salePrice}
												</span>
											)}
										</div>
									</div>

									{/* Info */}
									<div className="p-4">
										<h3 className="text-lg font-semibold text-card-foreground mb-1 line-clamp-1">
											{item.title}
										</h3>
										<p className="text-sm text-muted-foreground mb-2">
											{item.brand || "No brand"} • {item.size}
										</p>
										<div className="flex items-center gap-2">
											<span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
												{item.category}
											</span>
											<span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
												{item.condition}
											</span>
										</div>
									</div>
								</div>
							</Link>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
