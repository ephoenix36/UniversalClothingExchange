"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Plus, Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";

const formSchema = z.object({
	title: z.string().min(3, "Title must be at least 3 characters").max(100),
	description: z.string().min(10).max(1000).optional(),
	category: z.enum([
		"TOPS",
		"BOTTOMS",
		"DRESSES",
		"OUTERWEAR",
		"SHOES",
		"ACCESSORIES",
		"BAGS",
		"JEWELRY",
	]),
	subcategory: z.string().optional(),
	brand: z.string().max(50).optional(),
	size: z.string().min(1, "Size is required"),
	color: z.array(z.string()).min(1, "Select at least one color"),
	condition: z.enum(["NEW", "LIKE_NEW", "GOOD", "FAIR"]),
	estimatedValue: z.coerce.number().min(0).optional(),
	availableForSwap: z.boolean().default(true),
	availableForSale: z.boolean().default(false),
	salePrice: z.coerce.number().min(0).optional(),
	tags: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const categories = [
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
	{ value: "NEW", label: "New with tags", description: "Never worn, original tags attached" },
	{ value: "LIKE_NEW", label: "Like New", description: "Worn once or twice, excellent condition" },
	{ value: "GOOD", label: "Good", description: "Gently used, minor wear" },
	{ value: "FAIR", label: "Fair", description: "Visible wear, still wearable" },
];

const commonColors = [
	{ name: "Black", hex: "#000000" },
	{ name: "White", hex: "#FFFFFF" },
	{ name: "Gray", hex: "#808080" },
	{ name: "Navy", hex: "#000080" },
	{ name: "Blue", hex: "#0000FF" },
	{ name: "Red", hex: "#FF0000" },
	{ name: "Pink", hex: "#FFC0CB" },
	{ name: "Purple", hex: "#800080" },
	{ name: "Green", hex: "#008000" },
	{ name: "Yellow", hex: "#FFFF00" },
	{ name: "Orange", hex: "#FFA500" },
	{ name: "Brown", hex: "#A52A2A" },
	{ name: "Beige", hex: "#F5F5DC" },
	{ name: "Tan", hex: "#D2B48C" },
];

interface AddItemDialogProps {
	trigger?: React.ReactNode;
	onSuccess?: (itemId: string) => void;
}

export function AddItemDialog({ trigger, onSuccess }: AddItemDialogProps) {
	const [open, setOpen] = useState(false);
	const [step, setStep] = useState(1);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [selectedImages, setSelectedImages] = useState<File[]>([]);
	const [imagePreviews, setImagePreviews] = useState<string[]>([]);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			description: "",
			category: "TOPS",
			size: "",
			color: [],
			condition: "GOOD",
			availableForSwap: true,
			availableForSale: false,
			tags: [],
		},
	});

	const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		if (files.length + selectedImages.length > 5) {
			toast.error("Maximum 5 images allowed");
			return;
		}

		setSelectedImages((prev) => [...prev, ...files]);

		// Create previews
		files.forEach((file) => {
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreviews((prev) => [...prev, reader.result as string]);
			};
			reader.readAsDataURL(file);
		});
	};

	const removeImage = (index: number) => {
		setSelectedImages((prev) => prev.filter((_, i) => i !== index));
		setImagePreviews((prev) => prev.filter((_, i) => i !== index));
	};

	const toggleColor = (colorName: string) => {
		const currentColors = form.getValues("color");
		if (currentColors.includes(colorName)) {
			form.setValue(
				"color",
				currentColors.filter((c) => c !== colorName),
			);
		} else {
			form.setValue("color", [...currentColors, colorName]);
		}
	};

	const addTag = (tag: string) => {
		const currentTags = form.getValues("tags") || [];
		if (!currentTags.includes(tag)) {
			form.setValue("tags", [...currentTags, tag]);
		}
	};

	const removeTag = (tag: string) => {
		const currentTags = form.getValues("tags") || [];
		form.setValue(
			"tags",
			currentTags.filter((t) => t !== tag),
		);
	};

	const onSubmit = async (data: FormValues) => {
		setIsSubmitting(true);

		try {
			// Step 1: Upload images if any
			let imageUrls: string[] = [];
			if (selectedImages.length > 0) {
				const formData = new FormData();
				selectedImages.forEach((file) => formData.append("files", file));

				const uploadRes = await fetch("/api/upload", {
					method: "POST",
					body: formData,
				});

				if (!uploadRes.ok) {
					throw new Error("Failed to upload images");
				}

				const uploadData = await uploadRes.json();
				imageUrls = uploadData.urls;
			}

			// Step 2: Create wardrobe item
			const response = await fetch("/api/wardrobe", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...data,
					images: imageUrls,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to create item");
			}

			const result = await response.json();

			toast.success("Item added to your wardrobe!");
			setOpen(false);
			form.reset();
			setSelectedImages([]);
			setImagePreviews([]);
			setStep(1);
			onSuccess?.(result.id);
		} catch (error) {
			console.error("Error creating item:", error);
			toast.error("Failed to add item. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const progress = (step / 3) * 100;

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{trigger || (
					<Button>
						<Plus className="h-4 w-4 mr-2" />
						Add Item
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Add Item to Wardrobe</DialogTitle>
					<DialogDescription>
						Step {step} of 3: {step === 1 ? "Item Details" : step === 2 ? "Photos & Colors" : "Review"}
					</DialogDescription>
					<Progress value={progress} className="h-2" />
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						{/* Step 1: Basic Details */}
						{step === 1 && (
							<div className="space-y-4">
								<FormField
									control={form.control}
									name="title"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Item Title *</FormLabel>
											<FormControl>
												<Input
													placeholder="e.g., Vintage Levi's 501 Jeans"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="description"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Description</FormLabel>
											<FormControl>
												<Textarea
													placeholder="Describe the item, its style, fit, and any special details..."
													rows={4}
													{...field}
												/>
											</FormControl>
											<FormDescription>
												Min 10 characters (optional but recommended)
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								<div className="grid grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="category"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Category *</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Select category" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{categories.map((cat) => (
															<SelectItem key={cat.value} value={cat.value}>
																{cat.label}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="size"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Size *</FormLabel>
												<FormControl>
													<Input placeholder="e.g., M, 32, 8" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="brand"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Brand</FormLabel>
												<FormControl>
													<Input placeholder="e.g., Levi's, Zara" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="condition"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Condition *</FormLabel>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Select condition" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{conditions.map((cond) => (
															<SelectItem key={cond.value} value={cond.value}>
																{cond.label}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</div>
						)}

						{/* Step 2: Photos & Colors */}
						{step === 2 && (
							<div className="space-y-4">
								<div>
									<FormLabel>Photos (up to 5)</FormLabel>
									<div className="mt-2 space-y-4">
										{/* Image Previews */}
										{imagePreviews.length > 0 && (
											<div className="grid grid-cols-3 gap-2">
												{imagePreviews.map((preview, idx) => (
													<div key={idx} className="relative aspect-square">
														<Image
															src={preview}
															alt={`Preview ${idx + 1}`}
															fill
															className="object-cover rounded-md"
														/>
														<Button
															type="button"
															variant="destructive"
															size="icon"
															className="absolute top-1 right-1 h-6 w-6"
															onClick={() => removeImage(idx)}
														>
															<X className="h-3 w-3" />
														</Button>
														{idx === 0 && (
															<Badge className="absolute bottom-1 left-1 text-xs">
																Primary
															</Badge>
														)}
													</div>
												))}
											</div>
										)}

										{/* Upload Button */}
										{selectedImages.length < 5 && (
											<div className="border-2 border-dashed rounded-md p-6 text-center">
												<input
													type="file"
													accept="image/*"
													multiple
													onChange={handleImageSelect}
													className="hidden"
													id="image-upload"
												/>
												<label htmlFor="image-upload" className="cursor-pointer">
													<Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
													<p className="text-sm text-muted-foreground">
														Click to upload or drag and drop
													</p>
													<p className="text-xs text-muted-foreground mt-1">
														PNG, JPG up to 10MB
													</p>
												</label>
											</div>
										)}
									</div>
								</div>

								<FormField
									control={form.control}
									name="color"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Colors *</FormLabel>
											<div className="grid grid-cols-7 gap-2">
												{commonColors.map((color) => {
													const isSelected = field.value.includes(color.name);
													return (
														<button
															key={color.name}
															type="button"
															onClick={() => toggleColor(color.name)}
															className={`relative aspect-square rounded-md border-2 transition-all ${
																isSelected
																	? "border-primary ring-2 ring-primary"
																	: "border-gray-300"
															}`}
															style={{ backgroundColor: color.hex }}
															title={color.name}
														>
															{isSelected && (
																<div className="absolute inset-0 flex items-center justify-center">
																	<div className="h-4 w-4 rounded-full bg-white flex items-center justify-center">
																		<span className="text-xs">✓</span>
																	</div>
																</div>
															)}
														</button>
													);
												})}
											</div>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						)}

						{/* Step 3: Review & Submit */}
						{step === 3 && (
							<div className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="estimatedValue"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Estimated Value ($)</FormLabel>
												<FormControl>
													<Input type="number" step="0.01" {...field} />
												</FormControl>
												<FormDescription>
													Approximate retail or resale value
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="salePrice"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Sale Price ($)</FormLabel>
												<FormControl>
													<Input type="number" step="0.01" {...field} />
												</FormControl>
												<FormDescription>
													If also selling (optional)
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className="space-y-2">
									<FormLabel>Tags (press Enter to add)</FormLabel>
									<Input
										placeholder="e.g., vintage, summer, casual"
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												const input = e.currentTarget;
												const tag = input.value.trim();
												if (tag) {
													addTag(tag);
													input.value = "";
												}
											}
										}}
									/>
									<div className="flex flex-wrap gap-2 mt-2">
										{(form.getValues("tags") || []).map((tag) => (
											<Badge key={tag} variant="secondary">
												{tag}
												<button
													type="button"
													onClick={() => removeTag(tag)}
													className="ml-1"
												>
													<X className="h-3 w-3" />
												</button>
											</Badge>
										))}
									</div>
								</div>

								{/* Summary */}
								<div className="border rounded-md p-4 space-y-2">
									<h4 className="font-semibold">Item Summary</h4>
									<div className="text-sm space-y-1">
										<p>
											<span className="text-muted-foreground">Title:</span>{" "}
											{form.getValues("title")}
										</p>
										<p>
											<span className="text-muted-foreground">Category:</span>{" "}
											{form.getValues("category")}
										</p>
										<p>
											<span className="text-muted-foreground">Size:</span>{" "}
											{form.getValues("size")}
										</p>
										<p>
											<span className="text-muted-foreground">Condition:</span>{" "}
											{form.getValues("condition")}
										</p>
										<p>
											<span className="text-muted-foreground">Photos:</span>{" "}
											{selectedImages.length}
										</p>
									</div>
								</div>
							</div>
						)}

						<DialogFooter className="flex justify-between sm:justify-between">
							<div>
								{step > 1 && (
									<Button
										type="button"
										variant="outline"
										onClick={() => setStep(step - 1)}
									>
										Back
									</Button>
								)}
							</div>
							<div className="flex gap-2">
								{step < 3 ? (
									<Button
										type="button"
										onClick={() => {
											// Validate current step
											const fieldsToValidate: (keyof FormValues)[] =
												step === 1
													? ["title", "category", "size", "condition"]
													: ["color"];

											form.trigger(fieldsToValidate).then((isValid) => {
												if (isValid) {
													setStep(step + 1);
												}
											});
										}}
									>
										Next
									</Button>
								) : (
									<Button type="submit" disabled={isSubmitting}>
										{isSubmitting && (
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										)}
										Add to Wardrobe
									</Button>
								)}
							</div>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
