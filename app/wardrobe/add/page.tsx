"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Upload, X, Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AddItemPage() {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		category: "TOPS",
		subcategory: "",
		brand: "",
		size: "",
		color: [] as string[],
		condition: "GOOD",
		tags: [] as string[],
		estimatedValue: "",
		availableForSwap: true,
		availableForSale: false,
		salePrice: "",
	});

	const [newTag, setNewTag] = useState("");
	const [imageUrls, setImageUrls] = useState<string[]>([]);
	const [newImageUrl, setNewImageUrl] = useState("");

	const categories = [
		"TOPS",
		"BOTTOMS",
		"DRESSES",
		"OUTERWEAR",
		"SHOES",
		"ACCESSORIES",
		"BAGS",
		"JEWELRY",
	];

	const conditions = ["NEW", "LIKE_NEW", "GOOD", "FAIR"];

	const commonColors = [
		{ name: "Black", class: "bg-black" },
		{ name: "White", class: "bg-white border-2 border-gray-300" },
		{ name: "Gray", class: "bg-gray-500" },
		{ name: "Navy", class: "bg-blue-900" },
		{ name: "Blue", class: "bg-blue-600" },
		{ name: "Red", class: "bg-red-600" },
		{ name: "Pink", class: "bg-pink-500" },
		{ name: "Purple", class: "bg-purple-600" },
		{ name: "Green", class: "bg-green-600" },
		{ name: "Yellow", class: "bg-yellow-400" },
		{ name: "Orange", class: "bg-orange-500" },
		{ name: "Brown", class: "bg-amber-800" },
		{ name: "Beige", class: "bg-amber-200" },
	];

	const handleColorToggle = (color: string) => {
		if (formData.color.includes(color)) {
			setFormData({
				...formData,
				color: formData.color.filter((c) => c !== color),
			});
		} else {
			setFormData({
				...formData,
				color: [...formData.color, color],
			});
		}
	};

	const handleAddTag = () => {
		if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
			setFormData({
				...formData,
				tags: [...formData.tags, newTag.trim()],
			});
			setNewTag("");
		}
	};

	const handleRemoveTag = (tag: string) => {
		setFormData({
			...formData,
			tags: formData.tags.filter((t) => t !== tag),
		});
	};

	const handleAddImage = () => {
		if (newImageUrl.trim() && !imageUrls.includes(newImageUrl.trim())) {
			setImageUrls([...imageUrls, newImageUrl.trim()]);
			setNewImageUrl("");
		}
	};

	const handleRemoveImage = (index: number) => {
		setImageUrls(imageUrls.filter((_, i) => i !== index));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			const response = await fetch("/api/wardrobe", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...formData,
					estimatedValue: formData.estimatedValue
						? Number.parseFloat(formData.estimatedValue)
						: undefined,
					salePrice:
						formData.availableForSale && formData.salePrice
							? Number.parseFloat(formData.salePrice)
							: undefined,
					images: imageUrls.map((url) => ({ url })),
				}),
			});

			const data = await response.json();

			if (data.success) {
				router.push(`/wardrobe/${data.item.id}`);
			} else {
				alert(`Error: ${data.error}`);
			}
		} catch (error) {
			console.error("Error adding item:", error);
			alert("Failed to add item. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="pb-20 md:pb-8">
			<div className="max-w-4xl mx-auto px-4 py-8">
				{/* Header */}
				<div className="mb-8">
					<Link href="/wardrobe">
						<Button variant="ghost" size="sm" className="mb-4">
							<ArrowLeft className="w-4 h-4 mr-2" />
							Back to Wardrobe
						</Button>
					</Link>
					
					<h1 className="text-4xl font-bold bg-gradient-to-r from-[#4a8a62] to-[#d98960] bg-clip-text text-transparent mb-2">
						Add New Item
					</h1>
						<p className="text-lg text-muted-foreground">
							Share an item from your wardrobe to swap or sell
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Basic Information */}
						<Card>
							<CardHeader>
								<CardTitle className="text-card-foreground">Basic Information</CardTitle>
								<CardDescription>Tell us about your item</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-card-foreground mb-2">
										Title <span className="text-destructive">*</span>
									</label>
									<Input
										required
										value={formData.title}
										onChange={(e) =>
											setFormData({ ...formData, title: e.target.value })
										}
										placeholder="e.g., Vintage Levi's Denim Jacket"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-card-foreground mb-2">
										Description
									</label>
									<textarea
										value={formData.description}
										onChange={(e) =>
											setFormData({ ...formData, description: e.target.value })
										}
										rows={4}
										placeholder="Describe the item, its fit, any unique features..."
										className="w-full px-4 py-2 rounded-xl border-2 border-input bg-background text-foreground focus:border-ring focus:outline-none focus:ring-4 focus:ring-ring/10 transition-all"
									/>
								</div>

								<div className="grid md:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-card-foreground mb-2">
											Category <span className="text-destructive">*</span>
										</label>
										<select
											required
											value={formData.category}
											onChange={(e) =>
												setFormData({ ...formData, category: e.target.value })
											}
											className="w-full px-4 py-2 rounded-xl border-2 border-input bg-background text-foreground focus:border-ring focus:outline-none focus:ring-4 focus:ring-ring/10 transition-all"
										>
											{categories.map((cat) => (
												<option key={cat} value={cat}>
													{cat.charAt(0) + cat.slice(1).toLowerCase()}
												</option>
											))}
										</select>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-900 mb-2">
											Subcategory
										</label>
										<Input
											value={formData.subcategory}
											onChange={(e) =>
												setFormData({ ...formData, subcategory: e.target.value })
											}
											placeholder="e.g., T-shirt, Jeans"
										/>
									</div>
								</div>

								<div className="grid md:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-card-foreground mb-2">
											Brand
										</label>
										<Input
											value={formData.brand}
											onChange={(e) =>
												setFormData({ ...formData, brand: e.target.value })
											}
											placeholder="e.g., Levi's, Zara"
										/>
									</div>

									<div>
										<label className="block text-sm font-medium text-card-foreground mb-2">
											Size <span className="text-destructive">*</span>
										</label>
										<Input
											required
											value={formData.size}
											onChange={(e) =>
												setFormData({ ...formData, size: e.target.value })
											}
											placeholder="e.g., M, 32, 8"
										/>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Color Selection */}
						<Card>
							<CardHeader>
								<CardTitle className="text-card-foreground">Color(s)</CardTitle>
								<CardDescription>Select all that apply</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
									{commonColors.map((color) => {
										const isSelected = formData.color.includes(color.name);
										return (
											<button
												key={color.name}
												type="button"
												onClick={() => handleColorToggle(color.name)}
												className={cn(
													"relative flex items-center gap-3 p-3 rounded-xl border-2 transition-all",
													isSelected
														? "border-primary bg-primary/10 shadow-md"
														: "border-border hover:border-primary/50 bg-card"
												)}
											>
												<div className={cn("w-8 h-8 rounded-full", color.class)} />
												<span className="text-sm font-medium text-card-foreground">
													{color.name}
												</span>
												{isSelected && (
													<Check className="absolute top-2 right-2 w-4 h-4 text-primary" />
												)}
											</button>
										);
									})}
								</div>
							</CardContent>
						</Card>

						{/* Condition */}
						<Card>
							<CardHeader>
								<CardTitle className="text-card-foreground">Condition</CardTitle>
								<CardDescription>How would you rate the item?</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
									{conditions.map((cond) => {
										const isSelected = formData.condition === cond;
										return (
											<button
												key={cond}
												type="button"
												onClick={() =>
													setFormData({ ...formData, condition: cond })
												}
												className={cn(
													"p-4 rounded-xl border-2 font-medium transition-all",
													isSelected
														? "border-primary bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-lg shadow-primary/30"
														: "border-border bg-card text-card-foreground hover:border-primary/50"
												)}
											>
												{cond.replace("_", " ")}
											</button>
										);
									})}
								</div>
							</CardContent>
						</Card>

						{/* Images */}
						<Card>
							<CardHeader>
								<CardTitle className="text-card-foreground">
									<Upload className="w-5 h-5 inline mr-2" />
									Images
								</CardTitle>
								<CardDescription>Add photos of your item</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex gap-2">
									<Input
										type="url"
										value={newImageUrl}
										onChange={(e) => setNewImageUrl(e.target.value)}
										onKeyPress={(e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												handleAddImage();
											}
										}}
										placeholder="Paste image URL here"
										className="flex-1"
									/>
									<Button
										type="button"
										onClick={handleAddImage}
										disabled={!newImageUrl.trim()}
									>
										Add Image
									</Button>
								</div>

								{imageUrls.length > 0 && (
									<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
										{imageUrls.map((url, index) => (
											<div
												key={index}
												className="relative group aspect-square rounded-xl overflow-hidden border-2 border-border"
											>
												<img
													src={url}
													alt={`Preview ${index + 1}`}
													className="w-full h-full object-cover"
												/>
												<button
													type="button"
													onClick={() => handleRemoveImage(index)}
													className="absolute top-2 right-2 w-8 h-8 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-destructive/90"
												>
													<X className="w-4 h-4" />
												</button>
											</div>
										))}
									</div>
								)}

								{imageUrls.length === 0 && (
									<div className="text-center py-8 border-2 border-dashed border-border rounded-xl">
										<Upload className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
										<p className="text-muted-foreground">No images yet</p>
										<p className="text-sm text-muted-foreground mt-1">
											Add image URLs to showcase your item
										</p>
									</div>
								)}
							</CardContent>
						</Card>

						{/* Tags */}
						<Card>
							<CardHeader>
								<CardTitle className="text-card-foreground">Tags</CardTitle>
								<CardDescription>
									Add keywords to help others find your item
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex gap-2">
									<Input
										value={newTag}
										onChange={(e) => setNewTag(e.target.value)}
										onKeyPress={(e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												handleAddTag();
											}
										}}
										placeholder="e.g., vintage, summer, casual"
										className="flex-1"
									/>
									<Button
										type="button"
										onClick={handleAddTag}
										disabled={!newTag.trim()}
									>
										Add Tag
									</Button>
								</div>

								{formData.tags.length > 0 && (
									<div className="flex flex-wrap gap-2">
										{formData.tags.map((tag) => (
											<Badge
												key={tag}
												variant="default"
												className="pl-3 pr-1 py-1.5 text-sm bg-primary text-primary-foreground"
											>
												{tag}
												<button
													type="button"
													onClick={() => handleRemoveTag(tag)}
													className="ml-2 w-5 h-5 rounded-full hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
												>
													<X className="w-3 h-3" />
												</button>
											</Badge>
										))}
									</div>
								)}
							</CardContent>
						</Card>

						{/* Availability */}
						<Card>
							<CardHeader>
								<CardTitle className="text-card-foreground">Availability</CardTitle>
								<CardDescription>How do you want to share this item?</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<label className="flex items-start gap-3 p-4 rounded-xl border-2 border-border hover:border-primary/50 cursor-pointer transition-all">
									<input
										type="checkbox"
										checked={formData.availableForSwap}
										onChange={(e) =>
											setFormData({
												...formData,
												availableForSwap: e.target.checked,
											})
										}
										className="mt-1 w-5 h-5 rounded border-input text-primary focus:ring-ring"
									/>
									<div>
										<div className="font-medium text-card-foreground">
											Available for Swap
										</div>
										<p className="text-sm text-muted-foreground">
											Trade this item with other members
										</p>
									</div>
								</label>

								<label className="flex items-start gap-3 p-4 rounded-xl border-2 border-border hover:border-primary/50 cursor-pointer transition-all">
									<input
										type="checkbox"
										checked={formData.availableForSale}
										onChange={(e) =>
											setFormData({
												...formData,
												availableForSale: e.target.checked,
											})
										}
										className="mt-1 w-5 h-5 rounded border-input text-primary focus:ring-ring"
									/>
									<div className="flex-1">
										<div className="font-medium text-card-foreground">
											Available for Sale
										</div>
										<p className="text-sm text-muted-foreground mb-3">
											Sell this item for a fixed price
										</p>
										
										{formData.availableForSale && (
											<div className="ml-0">
												<label className="block text-sm font-medium text-card-foreground mb-2">
													Sale Price ($)
												</label>
												<Input
													type="number"
													step="0.01"
													min="0"
													value={formData.salePrice}
													onChange={(e) =>
														setFormData({ ...formData, salePrice: e.target.value })
													}
													placeholder="0.00"
												/>
											</div>
										)}
									</div>
								</label>
							</CardContent>
						</Card>

						{/* Submit Buttons */}
						<div className="flex flex-col sm:flex-row gap-3 sticky bottom-4 bg-background/80 backdrop-blur-lg p-4 rounded-2xl border border-border shadow-lg">
							<Button
								type="submit"
								size="lg"
								disabled={isSubmitting}
								className="flex-1"
							>
								{isSubmitting ? (
									<>
										<Sparkles className="w-5 h-5 mr-2 animate-spin" />
										Adding to Wardrobe...
									</>
								) : (
									<>
										<Check className="w-5 h-5 mr-2" />
										Add to Wardrobe
									</>
								)}
							</Button>
							<Link href="/wardrobe" className="flex-1">
								<Button
									type="button"
									variant="outline"
									size="lg"
									className="w-full"
								>
									Cancel
								</Button>
							</Link>
						</div>
					</form>
			</div>
		</div>
	);
}