"use client";

import { useEffect, useState } from "react";
import { Button } from "@whop/react/components";
import Link from "next/link";
import { use } from "react";

interface Creator {
	id: string;
	storeName: string;
	bio?: string;
	brandingColors?: any;
	bannerImageUrl?: string;
	socialLinks?: any;
	totalSales: number;
	isVerified: boolean;
	user: {
		displayName?: string;
		avatarUrl?: string;
		bio?: string;
	};
}

interface Item {
	id: string;
	title: string;
	description?: string;
	category: string;
	size: string;
	condition: string;
	salePrice?: number;
	images: { url: string }[];
}

interface Promotion {
	id: string;
	title: string;
	code: string;
	discountType: string;
	discountValue: number;
	description?: string;
}

export default function StorefrontPage({
	params,
}: {
	params: Promise<{ creatorId: string }>;
}) {
	const resolvedParams = use(params);
	const [creator, setCreator] = useState<Creator | null>(null);
	const [items, setItems] = useState<Item[]>([]);
	const [promotions, setPromotions] = useState<Promotion[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		fetchStorefront();
	}, []);

	const fetchStorefront = async () => {
		try {
			const response = await fetch(`/api/store/${resolvedParams.creatorId}`);
			const data = await response.json();
			if (data.success) {
				setCreator(data.creator);
				setItems(data.items);
				setPromotions(data.promotions);
			}
		} catch (error) {
			console.error("Error fetching storefront:", error);
		} finally {
			setIsLoading(false);
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-gray-10">Loading storefront...</div>
			</div>
		);
	}

	if (!creator) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<h2 className="text-6 font-bold text-gray-12 mb-4">
						Storefront Not Found
					</h2>
					<Link href="/">
						<Button variant="classic" size="3">
							← Back Home
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
			{/* Banner */}
			<div
				className="h-64 bg-gradient-to-r from-purple-a3 to-blue-a3 relative"
				style={
					creator.bannerImageUrl
						? { backgroundImage: `url(${creator.bannerImageUrl})` }
						: undefined
				}
			>
				<div className="absolute inset-0 bg-black/20" />
				<div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
					<div className="max-w-7xl mx-auto flex items-end gap-6">
						{creator.user.avatarUrl ? (
							<img
								src={creator.user.avatarUrl}
								alt={creator.storeName}
								className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
							/>
						) : (
							<div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-gray-a5 flex items-center justify-center text-6 text-gray-10">
								{creator.storeName[0]}
							</div>
						)}
						<div className="flex-1 pb-2">
							<div className="flex items-center gap-3 mb-2">
								<h1 className="text-8 font-bold text-white">
									{creator.storeName}
								</h1>
								{creator.isVerified && (
									<span className="text-4 text-blue-a9">✓</span>
								)}
							</div>
							<div className="flex items-center gap-4 text-white/90">
								<span className="text-3">{creator.totalSales} sales</span>
								{creator.socialLinks?.instagram && (
									<a
										href={`https://instagram.com/${creator.socialLinks.instagram}`}
										target="_blank"
										rel="noopener noreferrer"
										className="text-3 hover:text-white"
									>
										Instagram
									</a>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-4 py-8">
				{/* Bio & Promotions */}
				<div className="grid md:grid-cols-3 gap-6 mb-8">
					<div className="md:col-span-2">
						{creator.bio && (
							<div className="bg-white rounded-xl border border-gray-a4 p-6 mb-6">
								<h2 className="text-5 font-bold text-gray-12 mb-3">About</h2>
								<p className="text-3 text-gray-11">{creator.bio}</p>
							</div>
						)}
					</div>

					{promotions.length > 0 && (
						<div className="bg-gradient-to-br from-purple-a3 to-pink-a3 rounded-xl p-6">
							<h3 className="text-5 font-bold text-gray-12 mb-4">
								Active Promotions
							</h3>
							<div className="space-y-3">
								{promotions.map((promo) => (
									<div
										key={promo.id}
										className="bg-white rounded-lg p-4 shadow"
									>
										<div className="font-semibold text-gray-12 mb-1">
											{promo.title}
										</div>
										<div className="text-2 text-gray-10 mb-2">
											{promo.description}
										</div>
										<div className="flex items-center gap-2">
											<code className="bg-purple-a3 text-purple-a11 px-3 py-1 rounded font-mono text-2">
												{promo.code}
											</code>
											<span className="text-2 text-gray-10">
												{promo.discountType === "PERCENTAGE"
													? `${promo.discountValue}% off`
													: `$${promo.discountValue} off`}
											</span>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
				</div>

				{/* Items Grid */}
				<div>
					<h2 className="text-6 font-bold text-gray-12 mb-6">
						Items for Sale ({items.length})
					</h2>

					{items.length === 0 ? (
						<div className="bg-white rounded-xl border border-gray-a4 p-12 text-center">
							<div className="w-16 h-16 rounded-full bg-gray-a3 flex items-center justify-center mx-auto mb-4">
								<span className="text-6">🛍️</span>
							</div>
							<p className="text-3 text-gray-10">
								No items currently available
							</p>
						</div>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{items.map((item) => (
								<Link
									key={item.id}
									href={`/wardrobe/${item.id}`}
									className="group"
								>
									<div className="bg-white rounded-xl border border-gray-a4 overflow-hidden hover:shadow-lg transition-shadow">
										{/* Image */}
										<div className="aspect-square bg-gray-a2 relative">
											{item.images.length > 0 ? (
												<img
													src={item.images[0].url}
													alt={item.title}
													className="w-full h-full object-cover group-hover:scale-105 transition-transform"
												/>
											) : (
												<div className="w-full h-full flex items-center justify-center text-7 text-gray-a6">
													📷
												</div>
											)}
										</div>

										{/* Info */}
										<div className="p-4">
											<h3 className="text-3 font-semibold text-gray-12 mb-1 line-clamp-2 group-hover:text-blue-a11 transition-colors">
												{item.title}
											</h3>
											<div className="flex items-center gap-2 mb-2 text-2 text-gray-10">
												<span>{item.size}</span>
												<span>•</span>
												<span>{item.condition}</span>
											</div>
											{item.salePrice && (
												<div className="text-5 font-bold text-green-a11">
													${item.salePrice.toFixed(2)}
												</div>
											)}
										</div>
									</div>
								</Link>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
