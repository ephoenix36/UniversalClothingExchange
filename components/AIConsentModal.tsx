"use client";

import { useState, useEffect } from "react";
import { Button } from "@whop/react/components";

interface AIConsentModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConsent: (granted: boolean) => void;
}

export default function AIConsentModal({
	isOpen,
	onClose,
	onConsent,
}: AIConsentModalProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);

	if (!isOpen) return null;

	const handleConsent = async (granted: boolean) => {
		setIsSubmitting(true);
		try {
			const response = await fetch("/api/users/ai-consent", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ granted }),
			});

			if (response.ok) {
				onConsent(granted);
			}
		} catch (error) {
			console.error("Error saving consent:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
				{/* Header */}
				<div className="bg-gradient-to-r from-purple-a9 to-blue-a9 p-8 text-white">
					<div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
						<span className="text-8">🤖</span>
					</div>
					<h2 className="text-7 font-bold mb-2">AI Virtual Try-On</h2>
					<p className="text-3 text-white/90">
						Experience your future outfit with AI-powered visualization
					</p>
				</div>

				{/* Content */}
				<div className="p-8">
					<div className="space-y-6">
						{/* What We Do */}
						<div>
							<h3 className="text-5 font-bold text-gray-12 mb-3">
								How It Works
							</h3>
							<p className="text-3 text-gray-11 mb-3">
								Our AI technology analyzes your photo and the clothing item to
								generate personalized styling recommendations and fit
								descriptions.
							</p>
							<ul className="space-y-2">
								<li className="flex items-start gap-3">
									<span className="text-green-a11 text-4 mt-1">✓</span>
									<span className="text-3 text-gray-11">
										Get instant style advice based on your body type and the
										item
									</span>
								</li>
								<li className="flex items-start gap-3">
									<span className="text-green-a11 text-4 mt-1">✓</span>
									<span className="text-3 text-gray-11">
										Receive outfit pairing suggestions
									</span>
								</li>
								<li className="flex items-start gap-3">
									<span className="text-green-a11 text-4 mt-1">✓</span>
									<span className="text-3 text-gray-11">
										Discover which occasions the item suits best
									</span>
								</li>
							</ul>
						</div>

						{/* Privacy */}
						<div className="bg-blue-a2 border border-blue-a4 rounded-xl p-6">
							<h3 className="text-4 font-bold text-gray-12 mb-3 flex items-center gap-2">
								<span>🔒</span> Your Privacy Matters
							</h3>
							<ul className="space-y-2 text-3 text-gray-11">
								<li>
									• Your photos are processed securely and never shared publicly
								</li>
								<li>• We don't train AI models on your personal images</li>
								<li>
									• You can revoke consent and delete your photos at any time
								</li>
								<li>• All data is encrypted in transit and at rest</li>
							</ul>
						</div>

						{/* What We Collect */}
						<div>
							<h3 className="text-4 font-bold text-gray-12 mb-3">
								What We Collect
							</h3>
							<p className="text-3 text-gray-11 mb-2">
								To provide AI try-on features, we temporarily process:
							</p>
							<ul className="space-y-1 text-3 text-gray-11">
								<li>• Your uploaded photo (optional)</li>
								<li>• Clothing item images from your wardrobe</li>
								<li>• Generated AI descriptions and recommendations</li>
							</ul>
						</div>

						{/* Credits Info */}
						<div className="bg-purple-a2 border border-purple-a4 rounded-xl p-6">
							<h3 className="text-4 font-bold text-gray-12 mb-2">
								AI Credits
							</h3>
							<p className="text-3 text-gray-11">
								Your subscription includes monthly AI credits:
							</p>
							<div className="grid grid-cols-3 gap-4 mt-3">
								<div className="text-center">
									<div className="text-5 font-bold text-gray-12">10</div>
									<div className="text-2 text-gray-10">Basic</div>
								</div>
								<div className="text-center">
									<div className="text-5 font-bold text-gray-12">50</div>
									<div className="text-2 text-gray-10">Standard</div>
								</div>
								<div className="text-center">
									<div className="text-5 font-bold text-gray-12">200</div>
									<div className="text-2 text-gray-10">Pro</div>
								</div>
							</div>
						</div>

						{/* Consent Statement */}
						<div className="border-t border-gray-a4 pt-6">
							<p className="text-3 text-gray-11 leading-relaxed">
								By clicking "I Agree", you consent to the collection and
								processing of your photos for AI-powered virtual try-on and
								styling features. You acknowledge that you have read and
								understood our{" "}
								<a href="/privacy" className="text-blue-a11 hover:underline">
									Privacy Policy
								</a>{" "}
								and{" "}
								<a href="/terms" className="text-blue-a11 hover:underline">
									Terms of Service
								</a>
								.
							</p>
						</div>
					</div>

					{/* Actions */}
					<div className="flex gap-3 mt-8">
						<Button
							variant="soft"
							size="3"
							className="flex-1"
							onClick={() => handleConsent(false)}
							disabled={isSubmitting}
						>
							No Thanks
						</Button>
						<Button
							variant="classic"
							size="3"
							className="flex-1"
							onClick={() => handleConsent(true)}
							disabled={isSubmitting}
						>
							{isSubmitting ? "Saving..." : "I Agree - Enable AI Features"}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
