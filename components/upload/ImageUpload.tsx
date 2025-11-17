"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
	maxFiles?: number;
	maxFileSize?: number; // in bytes
	onUploadComplete: (urls: string[]) => void;
	onUploadError?: (error: string) => void;
	existingImages?: string[];
	disabled?: boolean;
	className?: string;
}

interface UploadFile {
	file: File;
	preview: string;
	progress: number;
	error?: string;
}

export function ImageUpload({
	maxFiles = 5,
	maxFileSize = 10 * 1024 * 1024, // 10MB default
	onUploadComplete,
	onUploadError,
	existingImages = [],
	disabled = false,
	className,
}: ImageUploadProps) {
	const [files, setFiles] = useState<UploadFile[]>([]);
	const [isUploading, setIsUploading] = useState(false);

	const onDrop = useCallback(
		(acceptedFiles: File[]) => {
			// Check total file count
			if (files.length + acceptedFiles.length + existingImages.length > maxFiles) {
				const error = `Maximum ${maxFiles} images allowed`;
				onUploadError?.(error);
				toast.error(error);
				return;
			}

			// Validate each file
			const validFiles: UploadFile[] = [];
			for (const file of acceptedFiles) {
				// Check file type
				if (!file.type.startsWith("image/")) {
					const error = `${file.name} is not an image file`;
					onUploadError?.(error);
					toast.error(error);
					continue;
				}

				// Check file size
				if (file.size > maxFileSize) {
					const error = `${file.name} exceeds size limit of ${(maxFileSize / (1024 * 1024)).toFixed(0)}MB`;
					onUploadError?.(error);
					toast.error(error);
					continue;
				}

				validFiles.push({
					file,
					preview: URL.createObjectURL(file),
					progress: 0,
				});
			}

			setFiles((prev) => [...prev, ...validFiles]);
		},
		[files.length, existingImages.length, maxFiles, maxFileSize, onUploadError],
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			"image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif"],
		},
		maxFiles: maxFiles - files.length - existingImages.length,
		disabled: disabled || isUploading,
	});

	const removeFile = (index: number) => {
		setFiles((prev) => {
			const newFiles = [...prev];
			URL.revokeObjectURL(newFiles[index].preview);
			newFiles.splice(index, 1);
			return newFiles;
		});
	};

	const handleUpload = async () => {
		if (files.length === 0) return;

		setIsUploading(true);

		try {
			// Create form data
			const formData = new FormData();
			files.forEach((fileObj) => {
				formData.append("files", fileObj.file);
			});

			// Upload to API
			const response = await fetch("/api/uploadthing/wardrobe", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				throw new Error("Upload failed");
			}

			const data = await response.json();
			const urls = data.urls || data.map((item: any) => item.url);

			onUploadComplete(urls);
			
			// Clear files after successful upload
			files.forEach((file) => URL.revokeObjectURL(file.preview));
			setFiles([]);
			
			toast.success(`${files.length} image${files.length > 1 ? "s" : ""} uploaded successfully!`);
		} catch (error) {
			const errorMessage = "Failed to upload images";
			onUploadError?.(errorMessage);
			toast.error(errorMessage);
			console.error("Upload error:", error);
		} finally {
			setIsUploading(false);
		}
	};

	const totalImages = existingImages.length + files.length;
	const canAddMore = totalImages < maxFiles;

	return (
		<div className={cn("space-y-4", className)}>
			{/* Dropzone */}
			{canAddMore && (
				<div
					{...getRootProps()}
					className={cn(
						"border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
						isDragActive
							? "border-primary bg-primary/5"
							: "border-muted-foreground/25 hover:border-primary/50",
						(disabled || isUploading) && "opacity-50 cursor-not-allowed",
					)}
				>
					<input {...getInputProps()} aria-label="Upload images" />
					<Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
					<div className="space-y-2">
						<p className="text-sm font-medium">
							{isDragActive
								? "Drop images here..."
								: "Click to upload or drag and drop"}
						</p>
						<p className="text-xs text-muted-foreground">
							PNG, JPG, WEBP up to {(maxFileSize / (1024 * 1024)).toFixed(0)}MB
						</p>
						<p className="text-xs text-muted-foreground">
							Up to {maxFiles} images ({totalImages}/{maxFiles} used)
						</p>
					</div>
				</div>
			)}

			{/* Preview Grid */}
			{files.length > 0 && (
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
					{files.map((fileObj, index) => (
						<div key={index} className="relative group">
							<div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
								<Image
									src={fileObj.preview}
									alt={`Preview ${index + 1}`}
									fill
									className="object-cover"
									sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
								/>

								{/* Remove button */}
								<Button
									type="button"
									variant="destructive"
									size="icon"
									className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
									onClick={() => removeFile(index)}
									disabled={isUploading}
									aria-label="Remove image"
								>
									<X className="h-3 w-3" />
								</Button>

								{/* Primary badge */}
								{index === 0 && (
									<Badge className="absolute bottom-2 left-2 text-xs">
										Primary
									</Badge>
								)}

								{/* Upload progress */}
								{isUploading && (
									<div className="absolute inset-0 bg-black/50 flex items-center justify-center">
										<Loader2 className="h-8 w-8 animate-spin text-white" />
									</div>
								)}
							</div>

							{/* File info */}
							<p className="text-xs text-muted-foreground mt-1 truncate">
								{fileObj.file.name}
							</p>
							<p className="text-xs text-muted-foreground">
								{(fileObj.file.size / 1024).toFixed(0)} KB
							</p>
						</div>
					))}
				</div>
			)}

			{/* Existing Images */}
			{existingImages.length > 0 && (
				<div>
					<p className="text-sm font-medium mb-2">Existing Images</p>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
						{existingImages.map((url, index) => (
							<div key={url} className="relative">
								<div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
									<Image
										src={url}
										alt={`Existing ${index + 1}`}
										fill
										className="object-cover"
										sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
									/>
									{index === 0 && (
										<Badge className="absolute bottom-2 left-2 text-xs">
											Primary
										</Badge>
									)}
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Upload button */}
			{files.length > 0 && (
				<div className="flex items-center justify-between pt-4 border-t">
					<p className="text-sm text-muted-foreground">
						{files.length} image{files.length > 1 ? "s" : ""} ready to upload
					</p>
					<Button
						onClick={handleUpload}
						disabled={files.length === 0 || isUploading}
						aria-label="Upload images"
					>
						{isUploading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Uploading...
							</>
						) : (
							<>
								<Upload className="mr-2 h-4 w-4" />
								Upload {files.length} Image{files.length > 1 ? "s" : ""}
							</>
						)}
					</Button>
				</div>
			)}

			{/* Empty state */}
			{files.length === 0 && existingImages.length === 0 && (
				<div className="text-center py-8 text-muted-foreground">
					<ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
					<p className="text-sm">No images selected</p>
				</div>
			)}
		</div>
	);
}
