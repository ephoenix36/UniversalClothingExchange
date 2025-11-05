"use client";

import { useEffect, useState } from "react";
import { Button } from "@whop/react/components";
import Link from "next/link";

interface CreatorProfile {
	id: string;
	storeName: string;
	bio?: string;
	totalSales: number;
	totalRevenue: number;
	commissionRate: number;
	stripeConnectAccountId?: string;
	isVerified: boolean;
	promotions: Promotion[];
}

interface Promotion {
	id: string;
	title: string;
	code: string;
	discountType: string;
	discountValue: number;
	timesUsed: number;
	maxUses?: number;
	expiresAt?: string;
	isActive: boolean;
}

export default function CreatorDashboard() {
	const [profile, setProfile] = useState<CreatorProfile | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [showCreatePromotion, setShowCreatePromotion] = useState(false);
	const [newPromotion, setNewPromotion] = useState({
		title: "",
		description: "",
		code: "",
		discountType: "PERCENTAGE",
		discountValue: 0,
	});

	useEffect(() => {
		fetchProfile();
	}, []);

	const fetchProfile = async () => {
		try {
			const response = await fetch("/api/creator/profile");
			const data = await response.json();
			if (data.success) {
				setProfile(data.creatorProfile);
			}
		} catch (error) {
			console.error("Error fetching profile:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleCreatePromotion = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await fetch("/api/creator/promotions", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(newPromotion),
			});
			const data = await response.json();
			if (data.success) {
				fetchProfile();
				setShowCreatePromotion(false);
				setNewPromotion({
					title: "",
					description: "",
					code: "",
					discountType: "PERCENTAGE",
					discountValue: 0,
				});
			}
		} catch (error) {
			console.error("Error creating promotion:", error);
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-gray-10">Loading...</div>
			</div>
		);
	}

	if (!profile) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-50 to-white py-12">
				<div className="max-w-4xl mx-auto px-4">
					<div className="bg-white rounded-2xl border border-gray-a4 p-12 text-center">
						<div className="w-20 h-20 rounded-full bg-purple-a3 flex items-center justify-center mx-auto mb-6">
							<span className="text-8">🎨</span>
						</div>
						<h2 className="text-6 font-bold text-gray-12 mb-3">
							Become a Creator
						</h2>
						<p className="text-3 text-gray-10 mb-8 max-w-md mx-auto">
							Set up your creator profile to start selling items and earning
							commissions.
						</p>
						<Link href="/creator/setup">
							<Button variant="classic" size="4">
								Set Up Creator Profile
							</Button>
						</Link>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-white py-8">
			<div className="max-w-7xl mx-auto px-4">
				{/* Header */}
				<div className="mb-8">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-7 font-bold text-gray-12">
								Creator Dashboard
							</h1>
							<p className="text-3 text-gray-10 mt-1">{profile.storeName}</p>
						</div>
						<Link href="/">
							<Button variant="surface" size="3">
								← Home
							</Button>
						</Link>
					</div>
				</div>

				{/* Stats Grid */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
					<div className="bg-white rounded-xl border border-gray-a4 p-6">
						<div className="text-2 text-gray-10 mb-1">Total Sales</div>
						<div className="text-7 font-bold text-gray-12">
							{profile.totalSales}
						</div>
					</div>
					<div className="bg-white rounded-xl border border-gray-a4 p-6">
						<div className="text-2 text-gray-10 mb-1">Total Revenue</div>
						<div className="text-7 font-bold text-green-a11">
							${profile.totalRevenue.toFixed(2)}
						</div>
					</div>
					<div className="bg-white rounded-xl border border-gray-a4 p-6">
						<div className="text-2 text-gray-10 mb-1">Commission Rate</div>
						<div className="text-7 font-bold text-gray-12">
							{profile.commissionRate}%
						</div>
					</div>
				</div>

				{/* Promotions Section */}
				<div className="bg-white rounded-2xl border border-gray-a4 p-6 mb-8">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-5 font-bold text-gray-12">
							Active Promotions
						</h2>
						<Button
							variant="classic"
							size="3"
							onClick={() => setShowCreatePromotion(true)}
						>
							+ New Promotion
						</Button>
					</div>

					{profile.promotions.length === 0 ? (
						<div className="text-center py-12">
							<div className="w-16 h-16 rounded-full bg-purple-a3 flex items-center justify-center mx-auto mb-4">
								<span className="text-6">🎁</span>
							</div>
							<p className="text-3 text-gray-10">
								No active promotions. Create one to drive sales!
							</p>
						</div>
					) : (
						<div className="space-y-4">
							{profile.promotions.map((promo) => (
								<div
									key={promo.id}
									className="flex items-center justify-between p-4 bg-gray-a2 rounded-lg"
								>
									<div className="flex-1">
										<h3 className="text-4 font-semibold text-gray-12 mb-1">
											{promo.title}
										</h3>
										<div className="flex items-center gap-3 text-2 text-gray-10">
											<span className="font-mono bg-purple-a3 text-purple-a11 px-2 py-1 rounded">
												{promo.code}
											</span>
											<span>
												{promo.discountType === "PERCENTAGE"
													? `${promo.discountValue}% off`
													: `$${promo.discountValue} off`}
											</span>
											<span>•</span>
											<span>
												{promo.timesUsed}
												{promo.maxUses ? `/${promo.maxUses}` : ""} uses
											</span>
										</div>
									</div>
									{promo.expiresAt && (
										<div className="text-2 text-gray-10">
											Expires{" "}
											{new Date(promo.expiresAt).toLocaleDateString()}
										</div>
									)}
								</div>
							))}
						</div>
					)}
				</div>

				{/* Storefront Link */}
				<div className="bg-gradient-to-r from-purple-a3 to-blue-a3 rounded-2xl p-8 text-center">
					<h3 className="text-5 font-bold text-gray-12 mb-3">
						Your Storefront
					</h3>
					<p className="text-3 text-gray-11 mb-6">
						Share your personalized storefront link with customers
					</p>
					<div className="max-w-md mx-auto mb-4">
						<input
							type="text"
							readOnly
							value={`https://yourapp.com/store/${profile.id}`}
							className="w-full px-4 py-3 rounded-lg bg-white border border-gray-a4 text-gray-12 text-center font-mono text-3"
						/>
					</div>
					<Link href={`/store/${profile.id}`}>
						<Button variant="classic" size="3">
							View Storefront
						</Button>
					</Link>
				</div>
			</div>

			{/* Create Promotion Modal */}
			{showCreatePromotion && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-2xl p-8 max-w-md w-full">
						<h2 className="text-6 font-bold text-gray-12 mb-6">
							Create Promotion
						</h2>

						<form onSubmit={handleCreatePromotion} className="space-y-4">
							<div>
								<label className="block text-3 font-medium text-gray-11 mb-2">
									Title *
								</label>
								<input
									type="text"
									required
									value={newPromotion.title}
									onChange={(e) =>
										setNewPromotion({ ...newPromotion, title: e.target.value })
									}
									placeholder="e.g., Summer Sale"
									className="w-full px-4 py-3 rounded-lg bg-gray-a1 border border-gray-a4 text-gray-12 focus:outline-none focus:border-gray-a6"
								/>
							</div>

							<div>
								<label className="block text-3 font-medium text-gray-11 mb-2">
									Code *
								</label>
								<input
									type="text"
									required
									value={newPromotion.code}
									onChange={(e) =>
										setNewPromotion({
											...newPromotion,
											code: e.target.value.toUpperCase(),
										})
									}
									placeholder="SUMMER20"
									className="w-full px-4 py-3 rounded-lg bg-gray-a1 border border-gray-a4 text-gray-12 font-mono focus:outline-none focus:border-gray-a6"
								/>
							</div>

							<div>
								<label className="block text-3 font-medium text-gray-11 mb-2">
									Discount Type *
								</label>
								<select
									value={newPromotion.discountType}
									onChange={(e) =>
										setNewPromotion({
											...newPromotion,
											discountType: e.target.value,
										})
									}
									className="w-full px-4 py-3 rounded-lg bg-gray-a1 border border-gray-a4 text-gray-12 focus:outline-none focus:border-gray-a6"
								>
									<option value="PERCENTAGE">Percentage</option>
									<option value="FIXED_AMOUNT">Fixed Amount</option>
								</select>
							</div>

							<div>
								<label className="block text-3 font-medium text-gray-11 mb-2">
									Discount Value *
								</label>
								<input
									type="number"
									required
									min="1"
									max={newPromotion.discountType === "PERCENTAGE" ? 100 : undefined}
									value={newPromotion.discountValue}
									onChange={(e) =>
										setNewPromotion({
											...newPromotion,
											discountValue: parseFloat(e.target.value),
										})
									}
									placeholder={
										newPromotion.discountType === "PERCENTAGE" ? "20" : "10.00"
									}
									className="w-full px-4 py-3 rounded-lg bg-gray-a1 border border-gray-a4 text-gray-12 focus:outline-none focus:border-gray-a6"
								/>
							</div>

							<div className="flex gap-3 pt-4">
								<Button type="submit" variant="classic" size="3" className="flex-1">
									Create
								</Button>
								<Button
									type="button"
									variant="surface"
									size="3"
									onClick={() => setShowCreatePromotion(false)}
									className="flex-1"
								>
									Cancel
								</Button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
