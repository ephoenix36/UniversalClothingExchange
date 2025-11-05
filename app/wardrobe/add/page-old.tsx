"use client";

import { useState } from "react";
import { Button } from "@whop/react/components";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
		"Black",
		"White",
		"Gray",
		"Navy",
		"Blue",
		"Red",
		"Pink",
		"Purple",
		"Green",
		"Yellow",
		"Orange",
		"Brown",
		"Beige",
		"Multi-color",
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
		if (newTag && !formData.tags.includes(newTag)) {
			setFormData({
				...formData,
				tags: [...formData.tags, newTag],
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
		if (newImageUrl && !imageUrls.includes(newImageUrl)) {
			setImageUrls([...imageUrls, newImageUrl]);
			setNewImageUrl("");
		}
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
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-white py-8">
			<div className="max-w-3xl mx-auto px-4">
				<div className="mb-6">
					<Link href="/wardrobe">
						<Button variant="surface" size="2">
							← Back to Wardrobe
						</Button>
					</Link>
				</div>

				<div className="bg-white rounded-2xl border border-gray-a4 p-8">
					<h1 className="text-7 font-bold text-gray-12 mb-2">
						Add New Item
					</h1>
					<p className="text-3 text-gray-10 mb-8">
						Share an item from your wardrobe to swap or sell
					</p>

					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Title */}
						<div>
							<label className="block text-3 font-medium text-gray-11 mb-2">
								Title *
							</label>
							<input
								type="text"
								required
								value={formData.title}
								onChange={(e) =>
									setFormData({ ...formData, title: e.target.value })
								}
								placeholder="e.g., Vintage Levi's Denim Jacket"
								className="w-full px-4 py-3 rounded-lg bg-gray-a1 border border-gray-a4 text-gray-12 focus:outline-none focus:border-gray-a6"
							/>
						</div>

						{/* Description */}
						<div>
							<label className="block text-3 font-medium text-gray-11 mb-2">
								Description
							</label>
							<textarea
								value={formData.description}
								onChange={(e) =>
									setFormData({ ...formData, description: e.target.value })
								}
								rows={4}
								placeholder="Describe the item, its fit, any unique features..."
								className="w-full px-4 py-3 rounded-lg bg-gray-a1 border border-gray-a4 text-gray-12 focus:outline-none focus:border-gray-a6"
							/>
						</div>

						{/* Category & Subcategory */}
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-3 font-medium text-gray-11 mb-2">
									Category *
								</label>
								<select
									required
									value={formData.category}
									onChange={(e) =>
										setFormData({ ...formData, category: e.target.value })
									}
									className="w-full px-4 py-3 rounded-lg bg-gray-a1 border border-gray-a4 text-gray-12 focus:outline-none focus:border-gray-a6"
								>
									{categories.map((cat) => (
										<option key={cat} value={cat}>
											{cat.charAt(0) + cat.slice(1).toLowerCase()}
										</option>
									))}
								</select>
							</div>

							<div>
								<label className="block text-3 font-medium text-gray-11 mb-2">
									Subcategory
								</label>
								<input
									type="text"
									value={formData.subcategory}
									onChange={(e) =>
										setFormData({ ...formData, subcategory: e.target.value })
									}
									placeholder="e.g., T-shirt, Jeans..."
									className="w-full px-4 py-3 rounded-lg bg-gray-a1 border border-gray-a4 text-gray-12 focus:outline-none focus:border-gray-a6"
								/>
							</div>
						</div>

						{/* Brand & Size */}
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-3 font-medium text-gray-11 mb-2">
									Brand
								</label>
								<input
									type="text"
									value={formData.brand}
									onChange={(e) =>
										setFormData({ ...formData, brand: e.target.value })
									}
									placeholder="e.g., Levi's, Zara..."
									className="w-full px-4 py-3 rounded-lg bg-gray-a1 border border-gray-a4 text-gray-12 focus:outline-none focus:border-gray-a6"
								/>
							</div>

							<div>
								<label className="block text-3 font-medium text-gray-11 mb-2">
									Size *
								</label>
								<input
									type="text"
									required
									value={formData.size}
									onChange={(e) =>
										setFormData({ ...formData, size: e.target.value })
									}
									placeholder="e.g., M, 32, 8, L..."
									className="w-full px-4 py-3 rounded-lg bg-gray-a1 border border-gray-a4 text-gray-12 focus:outline-none focus:border-gray-a6"
								/>
							</div>
						</div>

						{/* Color */}
						<div>
							<label className="block text-3 font-medium text-gray-11 mb-3">
								Color(s) *
							</label>
							<div className="flex flex-wrap gap-2">
								{commonColors.map((color) => (
									<button
										key={color}
										type="button"
										onClick={() => handleColorToggle(color)}
										className={`px-3 py-2 rounded-lg text-2 transition-colors ${
											formData.color.includes(color)
												? "bg-blue-a9 text-white"
												: "bg-gray-a2 text-gray-11 hover:bg-gray-a3"
										}`}
									>
										{color}
									</button>
								))}
							</div>
						</div>

						{/* Condition */}
						<div>
							<label className="block text-3 font-medium text-gray-11 mb-3">
								Condition *
							</label>
							<div className="grid grid-cols-4 gap-3">
								{conditions.map((cond) => (
									<button
										key={cond}
										type="button"
										onClick={() =>
											setFormData({ ...formData, condition: cond })
										}
										className={`px-4 py-3 rounded-lg text-3 transition-colors ${
											formData.condition === cond
												? "bg-blue-a9 text-white"
												: "bg-gray-a2 text-gray-11 hover:bg-gray-a3"
										}`}
									>
										{cond.replace("_", " ")}
									</button>
								))}
							</div>
						</div>

						{/* Images */}
						<div>
							<label className="block text-3 font-medium text-gray-11 mb-2">
								Images
							</label>
							<div className="space-y-3">
								<div className="flex gap-2">
									<input
										type="url"
										value={newImageUrl}
										onChange={(e) => setNewImageUrl(e.target.value)}
										placeholder="Enter image URL"
										className="flex-1 px-4 py-2 rounded-lg bg-gray-a1 border border-gray-a4 text-gray-12 focus:outline-none focus:border-gray-a6"
									/>
									<Button
										type="button"
										variant="surface"
										size="3"
										onClick={handleAddImage}
									>
										Add
									</Button>
								</div>
								{imageUrls.length > 0 && (
									<div className="grid grid-cols-4 gap-3">
										{imageUrls.map((url, index) => (
											<div key={index} className="relative group">
												<img
													src={url}
													alt={`Preview ${index + 1}`}
													className="w-full aspect-square object-cover rounded-lg"
												/>
												<button
													type="button"
													onClick={() =>
														setImageUrls(imageUrls.filter((_, i) => i !== index))
													}
													className="absolute top-1 right-1 bg-red-a9 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
												>
													×
												</button>
											</div>
										))}
									</div>
								)}
							</div>
						</div>

						{/* Tags */}
						<div>
							<label className="block text-3 font-medium text-gray-11 mb-2">
								Tags
							</label>
							<div className="space-y-3">
								<div className="flex gap-2">
									<input
										type="text"
										value={newTag}
										onChange={(e) => setNewTag(e.target.value)}
										onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
										placeholder="Add tags (e.g., vintage, summer)"
										className="flex-1 px-4 py-2 rounded-lg bg-gray-a1 border border-gray-a4 text-gray-12 focus:outline-none focus:border-gray-a6"
									/>
									<Button
										type="button"
										variant="surface"
										size="3"
										onClick={handleAddTag}
									>
										Add
									</Button>
								</div>
								{formData.tags.length > 0 && (
									<div className="flex flex-wrap gap-2">
										{formData.tags.map((tag) => (
											<span
												key={tag}
												className="bg-gray-a3 text-gray-11 px-3 py-1 rounded-full text-2 flex items-center gap-2"
											>
												{tag}
												<button
													type="button"
													onClick={() => handleRemoveTag(tag)}
													className="text-gray-10 hover:text-gray-12"
												>
													×
												</button>
											</span>
										))}
									</div>
								)}
							</div>
						</div>

						{/* Availability */}
						<div className="space-y-4 p-4 bg-gray-a2 rounded-lg">
							<div className="flex items-center gap-3">
								<input
									type="checkbox"
									id="availableForSwap"
									checked={formData.availableForSwap}
									onChange={(e) =>
										setFormData({
											...formData,
											availableForSwap: e.target.checked,
										})
									}
									className="w-5 h-5 rounded"
								/>
								<label
									htmlFor="availableForSwap"
									className="text-3 font-medium text-gray-12"
								>
									Available for swap
								</label>
							</div>

							<div className="flex items-center gap-3">
								<input
									type="checkbox"
									id="availableForSale"
									checked={formData.availableForSale}
									onChange={(e) =>
										setFormData({
											...formData,
											availableForSale: e.target.checked,
										})
									}
									className="w-5 h-5 rounded"
								/>
								<label
									htmlFor="availableForSale"
									className="text-3 font-medium text-gray-12"
								>
									Available for sale
								</label>
							</div>

							{formData.availableForSale && (
								<div className="ml-8">
									<label className="block text-2 font-medium text-gray-11 mb-2">
										Sale Price
									</label>
									<input
										type="number"
										step="0.01"
										value={formData.salePrice}
										onChange={(e) =>
											setFormData({ ...formData, salePrice: e.target.value })
										}
										placeholder="0.00"
										className="w-full px-4 py-2 rounded-lg bg-white border border-gray-a4 text-gray-12 focus:outline-none focus:border-gray-a6"
									/>
								</div>
							)}
						</div>

						{/* Submit */}
						<div className="flex gap-3 pt-4">
							<Button
								type="submit"
								variant="classic"
								size="4"
								disabled={isSubmitting}
								className="flex-1"
							>
								{isSubmitting ? "Adding Item..." : "Add to Wardrobe"}
							</Button>
							<Link href="/wardrobe" className="flex-1">
								<Button variant="surface" size="4" className="w-full">
									Cancel
								</Button>
							</Link>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
