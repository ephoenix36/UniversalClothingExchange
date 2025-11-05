"use client";

import { useEffect, useState } from "react";
import { Button } from "@whop/react/components";
import Link from "next/link";
import {
	TIER_FEATURES,
	TIER_PRICING,
	MembershipTier,
	type TierFeatures,
} from "@/lib/tiers";

interface UserLimits {
	tier: MembershipTier;
	usage: {
		wardrobeItems: number;
		collections: number;
		activeSwaps: number;
		promotions: number;
	};
	limits: {
		wardrobeItemsReached: boolean;
		collectionsReached: boolean;
		activeSwapsReached: boolean;
		promotionsReached: boolean;
	};
}

export default function SubscriptionPage() {
	const [limits, setLimits] = useState<UserLimits | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		fetchLimits();
	}, []);

	const fetchLimits = async () => {
		try {
			const response = await fetch("/api/users/limits");
			const data = await response.json();
			if (data.success) {
				setLimits(data);
			}
		} catch (error) {
			console.error("Error fetching limits:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const renderFeatureValue = (value: number | boolean) => {
		if (typeof value === "boolean") {
			return value ? "✓" : "✗";
		}
		if (value === -1) return "Unlimited";
		return value.toString();
	};

	const tiers = [
		MembershipTier.BASIC,
		MembershipTier.STANDARD,
		MembershipTier.PRO,
	];

	const currentTier = limits?.tier || MembershipTier.BASIC;

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-white py-12">
			<div className="max-w-7xl mx-auto px-4">
				{/* Header */}
				<div className="text-center mb-12">
					<h1 className="text-8 font-bold text-gray-12 mb-3">
						Choose Your Plan
					</h1>
					<p className="text-4 text-gray-10 max-w-2xl mx-auto">
						Unlock more features and grow your sustainable fashion community
					</p>
				</div>

				{/* Current Usage */}
				{!isLoading && limits && (
					<div className="bg-white rounded-2xl border border-gray-a4 p-6 mb-12 max-w-3xl mx-auto">
						<h3 className="text-5 font-bold text-gray-12 mb-4">
							Your Current Usage
						</h3>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							<div className="text-center">
								<div className="text-6 font-bold text-blue-a11">
									{limits.usage.wardrobeItems}
								</div>
								<div className="text-2 text-gray-10">Wardrobe Items</div>
							</div>
							<div className="text-center">
								<div className="text-6 font-bold text-green-a11">
									{limits.usage.collections}
								</div>
								<div className="text-2 text-gray-10">Collections</div>
							</div>
							<div className="text-center">
								<div className="text-6 font-bold text-purple-a11">
									{limits.usage.activeSwaps}
								</div>
								<div className="text-2 text-gray-10">Active Swaps</div>
							</div>
							<div className="text-center">
								<div className="text-6 font-bold text-orange-a11">
									{limits.usage.promotions}
								</div>
								<div className="text-2 text-gray-10">Promotions</div>
							</div>
						</div>
					</div>
				)}

				{/* Pricing Cards */}
				<div className="grid md:grid-cols-3 gap-6 mb-12">
					{tiers.map((tier) => {
						const features = TIER_FEATURES[tier];
						const pricing = TIER_PRICING[tier];
						const isCurrentTier = tier === currentTier;

						return (
							<div
								key={tier}
								className={`relative bg-white rounded-2xl border-2 p-8 ${
									isCurrentTier
										? "border-blue-a9 shadow-xl scale-105"
										: "border-gray-a4"
								}`}
							>
								{isCurrentTier && (
									<div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-a9 text-white px-4 py-1 rounded-full text-2 font-medium">
										Current Plan
									</div>
								)}

								<div className="text-center mb-6">
									<h3 className="text-6 font-bold text-gray-12 mb-2">
										{tier.charAt(0) + tier.slice(1).toLowerCase()}
									</h3>
									<div className="text-8 font-bold text-gray-12 mb-1">
										${pricing.monthly}
										<span className="text-4 text-gray-10">/mo</span>
									</div>
									<div className="text-2 text-gray-10">
										or ${pricing.annual}/year (save{" "}
										{Math.round(
											((pricing.monthly * 12 - pricing.annual) /
												(pricing.monthly * 12)) *
												100,
										)}
										%)
									</div>
								</div>

								<ul className="space-y-3 mb-8">
									<li className="flex items-center justify-between text-3">
										<span className="text-gray-11">Wardrobe Items</span>
										<span className="font-medium text-gray-12">
											{renderFeatureValue(features.maxWardrobeItems)}
										</span>
									</li>
									<li className="flex items-center justify-between text-3">
										<span className="text-gray-11">Collections</span>
										<span className="font-medium text-gray-12">
											{renderFeatureValue(features.maxCollections)}
										</span>
									</li>
									<li className="flex items-center justify-between text-3">
										<span className="text-gray-11">Active Swaps</span>
										<span className="font-medium text-gray-12">
											{renderFeatureValue(features.maxActiveSwaps)}
										</span>
									</li>
									<li className="flex items-center justify-between text-3">
										<span className="text-gray-11">Sell Items</span>
										<span className="font-medium text-gray-12">
											{renderFeatureValue(features.canSellItems)}
										</span>
									</li>
									<li className="flex items-center justify-between text-3">
										<span className="text-gray-11">Creator Storefront</span>
										<span className="font-medium text-gray-12">
											{renderFeatureValue(features.canCreateStorefront)}
										</span>
									</li>
									<li className="flex items-center justify-between text-3">
										<span className="text-gray-11">AI Try-On Credits</span>
										<span className="font-medium text-gray-12">
											{features.aiTryOnCredits}/mo
										</span>
									</li>
									<li className="flex items-center justify-between text-3">
										<span className="text-gray-11">Analytics</span>
										<span className="font-medium text-gray-12">
											{renderFeatureValue(features.analyticsAccess)}
										</span>
									</li>
									<li className="flex items-center justify-between text-3">
										<span className="text-gray-11">Priority Support</span>
										<span className="font-medium text-gray-12">
											{renderFeatureValue(features.prioritySupport)}
										</span>
									</li>
								</ul>

								{isCurrentTier ? (
									<Button variant="surface" size="3" className="w-full" disabled>
										Current Plan
									</Button>
								) : (
									<Button variant="classic" size="3" className="w-full">
										Upgrade to {tier.charAt(0) + tier.slice(1).toLowerCase()}
									</Button>
								)}
							</div>
						);
					})}
				</div>

				{/* FAQ */}
				<div className="bg-white rounded-2xl border border-gray-a4 p-8 max-w-3xl mx-auto">
					<h3 className="text-5 font-bold text-gray-12 mb-6">
						Frequently Asked Questions
					</h3>
					<div className="space-y-4">
						<div>
							<h4 className="text-4 font-semibold text-gray-12 mb-2">
								Can I change my plan anytime?
							</h4>
							<p className="text-3 text-gray-10">
								Yes! You can upgrade or downgrade your plan at any time. Changes
								take effect immediately.
							</p>
						</div>
						<div>
							<h4 className="text-4 font-semibold text-gray-12 mb-2">
								What happens if I reach my limit?
							</h4>
							<p className="text-3 text-gray-10">
								You'll be prompted to upgrade to continue adding items,
								collections, or swaps. Your existing content remains safe.
							</p>
						</div>
						<div>
							<h4 className="text-4 font-semibold text-gray-12 mb-2">
								Do you offer refunds?
							</h4>
							<p className="text-3 text-gray-10">
								We offer a 30-day money-back guarantee on all plans. Contact
								support if you're not satisfied.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
