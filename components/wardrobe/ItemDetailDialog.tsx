"use client";

import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
	Edit2,
	Trash2,
	Share2,
	X,
	Calendar,
	Tag,
	Repeat,
	TrendingUp,
	Package,
	ImageIcon,
} from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import type { WardrobeItem, ItemImage, ItemHistoryEvent } from "@prisma/client";

type ItemWithDetails = WardrobeItem & {
	images: ItemImage[];
	history?: ItemHistoryEvent[];
};

interface ItemDetailDialogProps {
	item: ItemWithDetails;
	open: boolean;
	onClose: () => void;
	onEdit?: (id: string) => void;
	onDelete?: (id: string) => void;
}

const conditionColors: Record<string, string> = {
	NEW: "bg-green-500/10 text-green-700 dark:text-green-400",
	LIKE_NEW: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
	GOOD: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
	FAIR: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
};

const statusColors: Record<string, string> = {
	AVAILABLE: "bg-green-500 text-white",
	ON_LOAN: "bg-blue-500 text-white",
	IN_TRANSIT: "bg-purple-500 text-white",
	UNAVAILABLE: "bg-gray-500 text-white",
};

export function ItemDetailDialog({
	item,
	open,
	onClose,
	onEdit,
	onDelete,
}: ItemDetailDialogProps) {
	const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const handleShare = async () => {
		const url = `${window.location.origin}/wardrobe/${item.id}`;
		try {
			await navigator.clipboard.writeText(url);
			toast.success("Link copied to clipboard!");
		} catch (error) {
			toast.error("Failed to copy link");
		}
	};

	const handleDelete = () => {
		onDelete?.(item.id);
		setDeleteDialogOpen(false);
		onClose();
	};

	return (
		<>
			<Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
				<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<div className="flex items-start justify-between">
							<div className="flex-1">
								<DialogTitle className="text-2xl">{item.title}</DialogTitle>
								{item.brand && (
									<DialogDescription className="text-lg mt-1">
										{item.brand}
									</DialogDescription>
								)}
							</div>
							<Button
								variant="ghost"
								size="icon"
								onClick={onClose}
								aria-label="Close"
							>
								<X className="h-4 w-4" />
							</Button>
						</div>
					</DialogHeader>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Left Column - Images */}
						<div className="space-y-4">
							{item.images.length > 0 ? (
								<Carousel className="w-full" aria-label="Image carousel">
									<CarouselContent>
										{item.images.map((image, index) => (
											<CarouselItem key={image.id}>
												<div
													className="relative aspect-square rounded-lg overflow-hidden bg-muted cursor-zoom-in"
													onClick={() => setFullScreenImage(image.url)}
												>
													<Image
														src={image.url}
														alt={`${item.title} image ${index + 1}`}
														fill
														className="object-cover"
														sizes="(max-width: 768px) 100vw, 50vw"
														priority={index === 0}
													/>
													{image.isPrimary && (
														<Badge className="absolute top-2 left-2">
															Primary
														</Badge>
													)}
												</div>
											</CarouselItem>
										))}
									</CarouselContent>
									{item.images.length > 1 && (
										<>
											<CarouselPrevious />
											<CarouselNext />
										</>
									)}
								</Carousel>
							) : (
								<div className="aspect-square rounded-lg bg-muted flex items-center justify-center">
									<div className="text-center text-muted-foreground">
										<ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
										<p>No images available</p>
									</div>
								</div>
							)}

							{/* Quick Stats */}
							<div className="grid grid-cols-3 gap-2">
								<div className="p-3 rounded-lg bg-muted text-center">
									<Repeat className="h-5 w-5 mx-auto mb-1 text-primary" />
									<p className="text-sm font-semibold">{item.swapCount}</p>
									<p className="text-xs text-muted-foreground">Swaps</p>
								</div>
								<div className="p-3 rounded-lg bg-muted text-center">
									<TrendingUp className="h-5 w-5 mx-auto mb-1 text-blue-500" />
									<p className="text-sm font-semibold">
										${item.estimatedValue?.toFixed(0) || "-"}
									</p>
									<p className="text-xs text-muted-foreground">Value</p>
								</div>
								<div className="p-3 rounded-lg bg-muted text-center">
									<Calendar className="h-5 w-5 mx-auto mb-1 text-purple-500" />
									<p className="text-sm font-semibold">
										{format(new Date(item.createdAt), "MMM")}
									</p>
									<p className="text-xs text-muted-foreground">Added</p>
								</div>
							</div>
						</div>

						{/* Right Column - Details */}
						<div className="space-y-4">
							{/* Status Badges */}
							<div className="flex flex-wrap gap-2">
								<Badge className={statusColors[item.status]}>
									{item.status.replace("_", " ")}
								</Badge>
								<Badge
									variant="outline"
									className={conditionColors[item.condition]}
								>
									{item.condition.replace("_", " ")}
								</Badge>
								{item.availableForSwap && (
									<Badge variant="outline" className="bg-green-50">
										Available for Swap
									</Badge>
								)}
							</div>

							{/* Description */}
							{item.description && (
								<div>
									<h3 className="font-semibold mb-2">Description</h3>
									<p className="text-sm text-muted-foreground">
										{item.description}
									</p>
								</div>
							)}

							<Separator />

							{/* Item Details */}
							<div className="grid grid-cols-2 gap-4">
								<div>
									<p className="text-sm text-muted-foreground">Category</p>
									<p className="font-medium">
										{item.category.replace("_", " ")}
									</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Size</p>
									<p className="font-medium">{item.size}</p>
								</div>
								{item.subcategory && (
									<div>
										<p className="text-sm text-muted-foreground">Type</p>
										<p className="font-medium">{item.subcategory}</p>
									</div>
								)}
								<div>
									<p className="text-sm text-muted-foreground">Swaps</p>
									<p className="font-medium">{item.swapCount} swaps</p>
								</div>
							</div>

							{/* Colors */}
							{item.color && item.color.length > 0 && (
								<div>
									<p className="text-sm text-muted-foreground mb-2">Colors</p>
									<div className="flex flex-wrap gap-2">
										{item.color.map((color) => (
											<Badge key={color} variant="secondary">
												{color}
											</Badge>
										))}
									</div>
								</div>
							)}

							{/* Tags */}
							{item.tags && item.tags.length > 0 && (
								<div>
									<p className="text-sm text-muted-foreground mb-2">Tags</p>
									<div className="flex flex-wrap gap-2">
										{item.tags.map((tag) => (
											<Badge key={tag} variant="outline">
												<Tag className="h-3 w-3 mr-1" />
												{tag}
											</Badge>
										))}
									</div>
								</div>
							)}

							<Separator />

							{/* Date Information */}
							<div className="text-sm space-y-1">
								<p className="text-muted-foreground">
									<strong>Added:</strong>{" "}
									{format(new Date(item.createdAt), "MMMM d, yyyy")}
								</p>
								{item.updatedAt.getTime() !== item.createdAt.getTime() && (
									<p className="text-muted-foreground">
										<strong>Updated:</strong>{" "}
										{format(new Date(item.updatedAt), "MMMM d, yyyy")}
									</p>
								)}
							</div>

							{/* Action Buttons */}
							<div className="flex gap-2 pt-4">
								{onEdit && (
									<Button
										onClick={() => onEdit(item.id)}
										variant="outline"
										className="flex-1"
										aria-label="Edit item"
									>
										<Edit2 className="h-4 w-4 mr-2" />
										Edit
									</Button>
								)}
								<Button
									onClick={handleShare}
									variant="outline"
									className="flex-1"
									aria-label="Share item"
								>
									<Share2 className="h-4 w-4 mr-2" />
									Share
								</Button>
								{onDelete && (
									<Button
										onClick={() => setDeleteDialogOpen(true)}
										variant="outline"
										className="flex-1 text-destructive hover:text-destructive"
										aria-label="Delete item"
									>
										<Trash2 className="h-4 w-4 mr-2" />
										Delete
									</Button>
								)}
							</div>
						</div>
					</div>

					{/* Additional Tabs */}
					<Tabs defaultValue="details" className="mt-6">
						<TabsList className="grid w-full grid-cols-3">
							<TabsTrigger value="details">Details</TabsTrigger>
							<TabsTrigger value="history">Swap History</TabsTrigger>
							<TabsTrigger value="similar">Similar Items</TabsTrigger>
						</TabsList>
						
						<TabsContent value="details" className="space-y-4">
							<div className="p-4 rounded-lg border">
								<h4 className="font-semibold mb-3">Full Details</h4>
								<dl className="space-y-2 text-sm">
									<div className="flex justify-between">
										<dt className="text-muted-foreground">Item ID:</dt>
										<dd className="font-mono text-xs">{item.id}</dd>
									</div>
									{item.estimatedValue && (
										<div className="flex justify-between">
											<dt className="text-muted-foreground">Estimated Value:</dt>
											<dd className="font-semibold">
												${item.estimatedValue.toFixed(2)}
											</dd>
										</div>
									)}
									{item.salePrice && (
										<div className="flex justify-between">
											<dt className="text-muted-foreground">Sale Price:</dt>
											<dd className="font-semibold">
												${item.salePrice.toFixed(2)}
											</dd>
										</div>
									)}
								</dl>
							</div>
						</TabsContent>

						<TabsContent value="history" className="space-y-4">
							{item.history && item.history.length > 0 ? (
								<div className="space-y-2">
									{item.history.map((event) => (
										<div
											key={event.id}
											className="p-3 rounded-lg border flex items-start gap-3"
										>
											<Package className="h-5 w-5 text-muted-foreground mt-0.5" />
											<div className="flex-1">
												<p className="font-medium text-sm">{event.type}</p>
												<p className="text-xs text-muted-foreground">
													{event.notes}
												</p>
												<p className="text-xs text-muted-foreground mt-1">
													{format(new Date(event.timestamp), "PPP")}
												</p>
											</div>
										</div>
									))}
								</div>
							) : (
								<div className="text-center py-8 text-muted-foreground">
									<Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
									<p className="text-sm">No swap history yet</p>
								</div>
							)}
						</TabsContent>

						<TabsContent value="similar" className="space-y-4">
							<div className="text-center py-8 text-muted-foreground">
								<ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
								<p className="text-sm">Similar items coming soon</p>
							</div>
						</TabsContent>
					</Tabs>
				</DialogContent>
			</Dialog>

			{/* Full Screen Image Dialog */}
			{fullScreenImage && (
				<Dialog
					open={!!fullScreenImage}
					onOpenChange={() => setFullScreenImage(null)}
				>
					<DialogContent
						className="max-w-screen-xl h-[90vh]"
						aria-label="Full screen image"
					>
						<div className="relative w-full h-full">
							<Image
								src={fullScreenImage}
								alt="Full screen view"
								fill
								className="object-contain"
								sizes="100vw"
							/>
						</div>
					</DialogContent>
				</Dialog>
			)}

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete this item?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete "{item.title}"
							from your wardrobe.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
