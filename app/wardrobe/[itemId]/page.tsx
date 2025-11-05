"use client";

import { useEffect, useState } from "react";
import { Button } from "@whop/react/components";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface WardrobeItem {
	id: string;
	title: string;
	description?: string;
	category: string;
	subcategory?: string;
	brand?: string;
	size: string;
	color: string[];
	condition: string;
	status: string;
	availableForSwap: boolean;
	availableForSale: boolean;
	salePrice?: number;
	swapCount: number;
	estimatedValue?: number;
	tags: string[];
	images: { id: string; url: string; isPrimary: boolean }[];
	history: {
		id: string;
		timestamp: string;
		type: string;
		notes?: string;
	}[];
	owner: {
		displayName?: string;
		avatarUrl?: string;
		membershipTier: string;
	};
	createdAt: string;
}

export default function ItemDetailPage({
	params,
}: {
	params: { itemId: string };
}) {
	const router = useRouter();
	const [item, setItem] = useState<WardrobeItem | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isEditing, setIsEditing] = useState(false);
	const [selectedImage, setSelectedImage] = useState(0);

	useEffect(() => {
		fetchItem();
	}, []);

	const fetchItem = async () => {
		try {
			const response = await fetch(`/api/wardrobe/${params.itemId}`);
			const data = await response.json();
			if (data.success) {
				setItem(data.item);
			}
		} catch (error) {
			console.error("Error fetching item:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async () => {
		if (!confirm("Are you sure you want to delete this item?")) return;

		try {
			const response = await fetch(`/api/wardrobe/${params.itemId}`, {
				method: "DELETE",
			});
			const data = await response.json();
			if (data.success) {
				router.push("/wardrobe");
			}
		} catch (error) {
			console.error("Error deleting item:", error);
			alert("Failed to delete item");
		}
	};

	const handleToggleAvailability = async (field: string, value: boolean) => {
		try {
			const response = await fetch(`/api/wardrobe/${params.itemId}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ [field]: value }),
			});
			const data = await response.json();
			if (data.success) {
				setItem(data.item);
			}
		} catch (error) {
			console.error("Error updating item:", error);
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-gray-10">Loading...</div>
			</div>
		);
	}

	if (!item) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<h2 className="text-6 font-bold text-gray-12 mb-4">
						Item Not Found
					</h2>
					<Link href="/wardrobe">
						<Button variant="classic" size="3">
							← Back to Wardrobe
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-white py-8">
			<div className="max-w-6xl mx-auto px-4">
				{/* Header */}
				<div className="mb-6 flex items-center justify-between">
					<Link href="/wardrobe">
						<Button variant="surface" size="2">
							← Back to Wardrobe
						</Button>
					</Link>
					<div className="flex gap-2">
						<Link href={`/wardrobe/${item.id}/edit`}>
							<Button variant="surface" size="2">
								Edit
							</Button>
						</Link>
						<Button variant="surface" size="2" onClick={handleDelete}>
							Delete
						</Button>
					</div>
				</div>

				<div className="grid md:grid-cols-2 gap-8">
					{/* Left Column - Images */}
					<div>
						{/* Main Image */}
						<div className="bg-white rounded-2xl border border-gray-a4 overflow-hidden mb-4">
							<div className="aspect-square bg-gray-a2 relative">
								{item.images.length > 0 ? (
									<img
										src={item.images[selectedImage]?.url}
										alt={item.title}
										className="w-full h-full object-cover"
									/>
								) : (
									<div className="w-full h-full flex items-center justify-center text-9 text-gray-a6">
										📷
									</div>
								)}

								{/* Navigation Arrows */}
								{item.images.length > 1 && (
									<>
										<button
											type="button"
											onClick={() =>
												setSelectedImage(
													(selectedImage - 1 + item.images.length) %
														item.images.length,
												)
											}
											className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 rounded-full w-10 h-10 flex items-center justify-center hover:bg-white transition-colors"
										>
											←
										</button>
										<button
											type="button"
											onClick={() =>
												setSelectedImage(
													(selectedImage + 1) % item.images.length,
												)
											}
											className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 rounded-full w-10 h-10 flex items-center justify-center hover:bg-white transition-colors"
										>
											→
										</button>
									</>
								)}
							</div>
						</div>

						{/* Thumbnail Gallery */}
						{item.images.length > 1 && (
							<div className="grid grid-cols-4 gap-3">
								{item.images.map((img, index) => (
									<button
										key={img.id}
										type="button"
										onClick={() => setSelectedImage(index)}
										className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
											selectedImage === index
												? "border-blue-a9"
												: "border-gray-a4 hover:border-gray-a6"
										}`}
									>
										<img
											src={img.url}
											alt={`${item.title} ${index + 1}`}
											className="w-full h-full object-cover"
										/>
									</button>
								))}
							</div>
						)}
					</div>

					{/* Right Column - Details */}
					<div className="space-y-6">
						{/* Title & Basic Info */}
						<div className="bg-white rounded-2xl border border-gray-a4 p-6">
							<h1 className="text-7 font-bold text-gray-12 mb-3">
								{item.title}
							</h1>

							<div className="flex items-center gap-3 mb-4">
								<span className="text-3 text-gray-10 bg-gray-a3 px-3 py-1 rounded-full">
									{item.category}
								</span>
								<span className="text-3 text-gray-10 bg-gray-a3 px-3 py-1 rounded-full">
									{item.condition.replace("_", " ")}
								</span>
								<span className="text-3 text-gray-10 bg-gray-a3 px-3 py-1 rounded-full">
									{item.swapCount} swaps
								</span>
							</div>

							{item.description && (
								<p className="text-3 text-gray-11 mb-4">{item.description}</p>
							)}

							<div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-a4">
								<div>
									<div className="text-2 text-gray-10 mb-1">Brand</div>
									<div className="text-3 font-medium text-gray-12">
										{item.brand || "No brand"}
									</div>
								</div>
								<div>
									<div className="text-2 text-gray-10 mb-1">Size</div>
									<div className="text-3 font-medium text-gray-12">
										{item.size}
									</div>
								</div>
								<div>
									<div className="text-2 text-gray-10 mb-1">Color</div>
									<div className="flex gap-2 flex-wrap">
										{item.color.map((c) => (
											<span
												key={c}
												className="text-2 text-gray-11 bg-gray-a2 px-2 py-1 rounded"
											>
												{c}
											</span>
										))}
									</div>
								</div>
								<div>
									<div className="text-2 text-gray-10 mb-1">Status</div>
									<div className="text-3 font-medium text-gray-12">
										{item.status.replace("_", " ")}
									</div>
								</div>
							</div>

							{item.tags.length > 0 && (
								<div className="pt-4 border-t border-gray-a4">
									<div className="text-2 text-gray-10 mb-2">Tags</div>
									<div className="flex gap-2 flex-wrap">
										{item.tags.map((tag) => (
											<span
												key={tag}
												className="text-2 text-gray-11 bg-blue-a2 px-2 py-1 rounded"
											>
												#{tag}
											</span>
										))}
									</div>
								</div>
							)}
						</div>

						{/* Availability */}
						<div className="bg-white rounded-2xl border border-gray-a4 p-6">
							<h3 className="text-5 font-bold text-gray-12 mb-4">
								Availability
							</h3>

							<div className="space-y-3">
								<label className="flex items-center gap-3 p-3 rounded-lg bg-gray-a2 cursor-pointer">
									<input
										type="checkbox"
										checked={item.availableForSwap}
										onChange={(e) =>
											handleToggleAvailability(
												"availableForSwap",
												e.target.checked,
											)
										}
										className="w-5 h-5 rounded"
									/>
									<span className="text-3 font-medium text-gray-12">
										Available for swap
									</span>
								</label>

								<label className="flex items-center gap-3 p-3 rounded-lg bg-gray-a2 cursor-pointer">
									<input
										type="checkbox"
										checked={item.availableForSale}
										onChange={(e) =>
											handleToggleAvailability(
												"availableForSale",
												e.target.checked,
											)
										}
										className="w-5 h-5 rounded"
									/>
									<div className="flex-1">
										<span className="text-3 font-medium text-gray-12">
											Available for sale
										</span>
										{item.availableForSale && item.salePrice && (
											<div className="text-5 font-bold text-green-a11 mt-1">
												${item.salePrice.toFixed(2)}
											</div>
										)}
									</div>
								</label>
							</div>
						</div>

						{/* Item History & Provenance */}
						<div className="bg-white rounded-2xl border border-gray-a4 p-6">
							<h3 className="text-5 font-bold text-gray-12 mb-4">
								Item History & Provenance
							</h3>

							<div className="space-y-4">
								{item.history.map((event, index) => (
									<div key={event.id} className="flex gap-3">
										<div className="flex flex-col items-center">
											<div
												className={`w-10 h-10 rounded-full flex items-center justify-center text-4 ${
													event.type === "UPLOAD"
														? "bg-blue-a3"
														: event.type === "SWAP"
															? "bg-green-a3"
															: event.type === "REPAIR"
																? "bg-orange-a3"
																: event.type === "UPCYCLE"
																	? "bg-purple-a3"
																	: "bg-gray-a3"
												}`}
											>
												{event.type === "UPLOAD"
													? "📸"
													: event.type === "SWAP"
														? "🔄"
														: event.type === "REPAIR"
															? "🔧"
															: event.type === "UPCYCLE"
																? "✨"
																: "💰"}
											</div>
											{index < item.history.length - 1 && (
												<div className="w-0.5 flex-1 bg-gray-a4 my-2" />
											)}
										</div>
										<div className="flex-1 pb-4">
											<div className="text-3 font-medium text-gray-12">
												{event.type.charAt(0) +
													event.type.slice(1).toLowerCase()}
											</div>
											<div className="text-2 text-gray-10 mt-1">
												{new Date(event.timestamp).toLocaleDateString()}
											</div>
											{event.notes && (
												<div className="text-2 text-gray-11 mt-2">
													{event.notes}
												</div>
											)}
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Owner Info */}
						<div className="bg-white rounded-2xl border border-gray-a4 p-6">
							<h3 className="text-5 font-bold text-gray-12 mb-4">Owner</h3>
							<div className="flex items-center gap-3">
								{item.owner.avatarUrl ? (
									<img
										src={item.owner.avatarUrl}
										alt="Owner"
										className="w-12 h-12 rounded-full"
									/>
								) : (
									<div className="w-12 h-12 rounded-full bg-gray-a5 flex items-center justify-center text-3 text-gray-10">
										{item.owner.displayName?.[0] || "U"}
									</div>
								)}
								<div>
									<div className="text-3 font-medium text-gray-12">
										{item.owner.displayName || "User"}
									</div>
									<div className="text-2 text-gray-10">
										{item.owner.membershipTier} Member
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
