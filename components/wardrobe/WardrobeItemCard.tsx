"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
	Heart,
	MoreVertical,
	Edit2,
	Trash2,
	Share2,
	Eye,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { WardrobeItem, ItemImage, ItemCondition, ItemStatus } from "@prisma/client";

export interface WardrobeItemCardProps {
	item: WardrobeItem & {
		images: ItemImage[];
	};
	onEdit?: (id: string) => void;
	onDelete?: (id: string) => void;
	onShare?: (id: string) => void;
	onView?: (id: string) => void;
	showOwner?: boolean;
	className?: string;
}

const conditionColors: Record<ItemCondition, string> = {
	NEW: "bg-green-50 text-green-700 border-green-200",
	LIKE_NEW: "bg-blue-50 text-blue-700 border-blue-200",
	GOOD: "bg-yellow-50 text-yellow-700 border-yellow-200",
	FAIR: "bg-orange-50 text-orange-700 border-orange-200",
};

const statusColors: Record<ItemStatus, string> = {
	AVAILABLE: "bg-green-500 text-white",
	ON_LOAN: "bg-blue-500 text-white",
	IN_TRANSIT: "bg-purple-500 text-white",
	UNAVAILABLE: "bg-gray-500 text-white",
};

export function WardrobeItemCard({
	item,
	onEdit,
	onDelete,
	onShare,
	onView,
	showOwner = false,
	className,
}: WardrobeItemCardProps) {
	const [isLiked, setIsLiked] = useState(false);
	const [isImageLoading, setIsImageLoading] = useState(true);

	const primaryImage = item.images.find((img) => img.isPrimary) || item.images[0];
	const imageUrl = primaryImage?.url || "/placeholder-clothing.png";

	const handleEdit = () => {
		onEdit?.(item.id);
	};

	const handleDelete = () => {
		onDelete?.(item.id);
	};

	const handleShare = () => {
		onShare?.(item.id);
	};

	const handleView = () => {
		onView?.(item.id);
	};

	return (
		<Card
			className={cn(
				"group relative overflow-hidden transition-all hover:shadow-xl bg-white/90 backdrop-blur-sm border-gray-200",
				className,
			)}
		>
			{/* Image Container */}
			<Link href={`/wardrobe/${item.id}`} className="block relative">
				<div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
					<Image
						src={imageUrl}
						alt={item.title}
						fill
						className={cn(
							"object-cover transition-all duration-300 group-hover:scale-105",
							isImageLoading && "blur-sm",
						)}
						onLoad={() => setIsImageLoading(false)}
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					/>

					{/* Overlay with quick actions on hover */}
					<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

					{/* Status Badge */}
					<div className="absolute top-2 left-2">
						<Badge className={statusColors[item.status]}>
							{item.status.replace("_", " ")}
						</Badge>
					</div>

					{/* Swap Count */}
					{item.swapCount > 0 && (
						<div className="absolute top-2 right-2">
							<Badge variant="secondary" className="bg-white/90 text-black">
								{item.swapCount} {item.swapCount === 1 ? "swap" : "swaps"}
							</Badge>
						</div>
					)}

					{/* Image Count Indicator */}
					{item.images.length > 1 && (
						<div className="absolute bottom-2 right-2 flex gap-1">
							{item.images.slice(0, 5).map((_, idx) => (
								<div
									key={idx}
									className={cn(
										"w-1.5 h-1.5 rounded-full",
										idx === 0 ? "bg-white" : "bg-white/50",
									)}
								/>
							))}
						</div>
					)}
				</div>
			</Link>

			{/* Card Content */}
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between gap-2">
					<div className="flex-1 min-w-0">
						<Link href={`/wardrobe/${item.id}`}>
							<h3 className="font-semibold text-base leading-tight line-clamp-1 hover:underline">
								{item.title}
							</h3>
						</Link>
						{item.brand && (
							<p className="text-sm text-muted-foreground mt-0.5">
								{item.brand}
							</p>
						)}
					</div>

					{/* Actions Menu */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8 shrink-0"
							>
								<MoreVertical className="h-4 w-4" />
								<span className="sr-only">Open menu</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={handleView}>
								<Eye className="mr-2 h-4 w-4" />
								View Details
							</DropdownMenuItem>
							<DropdownMenuItem onClick={handleEdit}>
								<Edit2 className="mr-2 h-4 w-4" />
								Edit Item
							</DropdownMenuItem>
							<DropdownMenuItem onClick={handleShare}>
								<Share2 className="mr-2 h-4 w-4" />
								Share
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={handleDelete}
								className="text-destructive focus:text-destructive"
							>
								<Trash2 className="mr-2 h-4 w-4" />
								Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</CardHeader>

			<CardContent className="pb-3 space-y-2">
				{/* Category and Size */}
				<div className="flex items-center gap-2 text-sm">
					<span className="text-muted-foreground">
						{item.category.replace("_", " ")}
					</span>
					<span className="text-muted-foreground">•</span>
					<span className="font-medium">Size {item.size}</span>
				</div>

				{/* Condition Badge */}
				<div className="flex items-center gap-2">
					<Badge
						variant="outline"
						className={conditionColors[item.condition]}
					>
						{item.condition.replace("_", " ")}
					</Badge>

					{/* Colors */}
					{item.color && item.color.length > 0 && (
						<div className="flex gap-1">
							{item.color.slice(0, 3).map((color, idx) => (
								<div
									key={idx}
									className="w-4 h-4 rounded-full border border-border"
									style={{ backgroundColor: color.toLowerCase() }}
									title={color}
								/>
							))}
							{item.color.length > 3 && (
								<div className="w-4 h-4 rounded-full border border-border bg-muted flex items-center justify-center">
									<span className="text-[8px] font-medium">
										+{item.color.length - 3}
									</span>
								</div>
							)}
						</div>
					)}
				</div>

				{/* Tags */}
				{item.tags && item.tags.length > 0 && (
					<div className="flex flex-wrap gap-1">
						{item.tags.slice(0, 3).map((tag, idx) => (
							<Badge
								key={idx}
								variant="secondary"
								className="text-xs px-2 py-0"
							>
								{tag}
							</Badge>
						))}
						{item.tags.length > 3 && (
							<Badge variant="secondary" className="text-xs px-2 py-0">
								+{item.tags.length - 3}
							</Badge>
						)}
					</div>
				)}

				{/* Description Preview */}
				{item.description && (
					<p className="text-sm text-muted-foreground line-clamp-2">
						{item.description}
					</p>
				)}

				{/* Estimated Value */}
				{item.estimatedValue && (
					<div className="flex items-center justify-between pt-1">
						<span className="text-sm text-muted-foreground">Est. Value</span>
						<span className="text-sm font-semibold">
							${item.estimatedValue.toFixed(2)}
						</span>
					</div>
				)}
			</CardContent>

			<CardFooter className="pt-0 flex items-center justify-between">
				<Button
					variant="ghost"
					size="sm"
					className="h-8"
					onClick={() => setIsLiked(!isLiked)}
				>
					<Heart
						className={cn(
							"h-4 w-4 mr-1",
							isLiked && "fill-current text-red-500",
						)}
					/>
					{isLiked ? "Saved" : "Save"}
				</Button>

				<div className="flex items-center gap-2">
					{item.availableForSwap && (
						<Badge variant="outline" className="text-xs">
							Available to Swap
						</Badge>
					)}
					{item.availableForSale && item.salePrice && (
						<Badge variant="outline" className="text-xs">
							${item.salePrice.toFixed(2)}
						</Badge>
					)}
				</div>
			</CardFooter>
		</Card>
	);
}

// Skeleton loading state
export function WardrobeItemCardSkeleton({ className }: { className?: string }) {
	return (
		<Card className={cn("overflow-hidden", className)}>
			<div className="aspect-[3/4] bg-muted animate-pulse" />
			<CardHeader className="pb-3">
				<div className="space-y-2">
					<div className="h-5 bg-muted rounded animate-pulse" />
					<div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
				</div>
			</CardHeader>
			<CardContent className="pb-3 space-y-2">
				<div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
				<div className="h-6 bg-muted rounded w-1/3 animate-pulse" />
				<div className="h-12 bg-muted rounded animate-pulse" />
			</CardContent>
			<CardFooter className="pt-0">
				<div className="h-8 bg-muted rounded w-full animate-pulse" />
			</CardFooter>
		</Card>
	);
}
