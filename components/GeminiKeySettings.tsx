"use client";

import { useState, useEffect } from "react";
import { Button } from "@whop/react/components";

export default function GeminiKeySettings() {
	const [hasKey, setHasKey] = useState(false);
	const [apiKey, setApiKey] = useState("");
	const [showKey, setShowKey] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [message, setMessage] = useState("");

	useEffect(() => {
		checkKey();
	}, []);

	const checkKey = async () => {
		try {
			const response = await fetch("/api/users/gemini-key");
			const data = await response.json();
			if (data.success) {
				setHasKey(data.hasKey);
			}
		} catch (error) {
			console.error("Error checking API key:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const saveKey = async () => {
		if (!apiKey.startsWith("AIza")) {
			setMessage("Invalid API key format. Must start with 'AIza'");
			return;
		}

		setIsSaving(true);
		setMessage("");

		try {
			const response = await fetch("/api/users/gemini-key", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ geminiApiKey: apiKey }),
			});

			const data = await response.json();

			if (data.success) {
				setHasKey(true);
				setApiKey("");
				setMessage("✓ API key saved successfully!");
			} else {
				setMessage(data.error || "Failed to save API key");
			}
		} catch (error) {
			setMessage("Error saving API key");
		} finally {
			setIsSaving(false);
		}
	};

	const removeKey = async () => {
		if (!confirm("Remove your Gemini API key? AI features will be disabled."))
			return;

		try {
			const response = await fetch("/api/users/gemini-key", {
				method: "DELETE",
			});

			const data = await response.json();

			if (data.success) {
				setHasKey(false);
				setMessage("API key removed");
			}
		} catch (error) {
			setMessage("Error removing API key");
		}
	};

	if (isLoading) {
		return <div className="text-gray-10">Loading...</div>;
	}

	return (
		<div className="bg-white rounded-2xl border border-gray-a4 p-6">
			{/* Header */}
			<div className="flex items-start justify-between mb-6">
				<div>
					<h3 className="text-5 font-bold text-gray-12 mb-2">
						Google Gemini API Key
					</h3>
					<p className="text-3 text-gray-10">
						Required for AI-powered clothing analysis and styling features
					</p>
				</div>
				{hasKey && (
					<span className="px-3 py-1 bg-green-a3 text-green-a11 rounded-full text-2 font-medium">
						✓ Configured
					</span>
				)}
			</div>

			{!hasKey ? (
				<div>
					{/* Setup Instructions */}
					<div className="bg-blue-a2 border border-blue-a4 rounded-xl p-4 mb-6">
						<h4 className="text-4 font-semibold text-gray-12 mb-3">
							How to Get Your API Key
						</h4>
						<ol className="space-y-2 text-3 text-gray-11">
							<li>
								1. Visit{" "}
								<a
									href="https://makersuite.google.com/app/apikey"
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-a11 hover:underline"
								>
									Google AI Studio
								</a>
							</li>
							<li>2. Sign in with your Google account</li>
							<li>3. Click "Get API Key" or "Create API Key"</li>
							<li>4. Copy the key and paste it below</li>
						</ol>
					</div>

					{/* Privacy Notice */}
					<div className="bg-purple-a2 border border-purple-a4 rounded-xl p-4 mb-6">
						<div className="flex items-start gap-3">
							<span className="text-4">🔒</span>
							<div>
								<h4 className="text-3 font-semibold text-gray-12 mb-1">
									Your Privacy
								</h4>
								<ul className="space-y-1 text-2 text-gray-11">
									<li>• Your API key is stored securely and encrypted</li>
									<li>• Only you can access AI features with your key</li>
									<li>• We never share or expose your key to others</li>
									<li>• You control usage and billing through Google</li>
								</ul>
							</div>
						</div>
					</div>

					{/* Input Form */}
					<div className="space-y-4">
						<div>
							<label className="block text-3 font-medium text-gray-12 mb-2">
								API Key
							</label>
							<div className="relative">
								<input
									type={showKey ? "text" : "password"}
									value={apiKey}
									onChange={(e) => setApiKey(e.target.value)}
									placeholder="AIza..."
									className="w-full px-4 py-3 bg-gray-a2 border border-gray-a4 rounded-xl text-3 text-gray-12 focus:outline-none focus:border-blue-a7"
								/>
								<button
									type="button"
									onClick={() => setShowKey(!showKey)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-2 text-gray-10 hover:text-gray-12"
								>
									{showKey ? "Hide" : "Show"}
								</button>
							</div>
						</div>

						{message && (
							<div
								className={`text-3 ${message.startsWith("✓") ? "text-green-a11" : "text-red-a11"}`}
							>
								{message}
							</div>
						)}

						<Button
							variant="classic"
							size="3"
							className="w-full"
							onClick={saveKey}
							disabled={!apiKey || isSaving}
						>
							{isSaving ? "Saving..." : "Save API Key"}
						</Button>
					</div>
				</div>
			) : (
				<div>
					{/* Key Configured */}
					<div className="bg-green-a2 border border-green-a4 rounded-xl p-4 mb-6">
						<div className="flex items-center gap-3 mb-3">
							<span className="text-5">✓</span>
							<h4 className="text-4 font-semibold text-gray-12">
								AI Features Enabled
							</h4>
						</div>
						<p className="text-3 text-gray-11 mb-3">
							You can now use AI-powered features:
						</p>
						<ul className="space-y-1 text-3 text-gray-11">
							<li>• Auto-populate clothing details from photos</li>
							<li>• Virtual try-on descriptions</li>
							<li>• Personalized style recommendations</li>
							<li>• Outfit pairing suggestions</li>
						</ul>
					</div>

					{/* Usage Info */}
					<div className="bg-gray-a2 rounded-xl p-4 mb-6">
						<h4 className="text-3 font-semibold text-gray-12 mb-2">
							Billing & Usage
						</h4>
						<p className="text-2 text-gray-11">
							Your API key usage is billed directly by Google. Monitor your
							usage in{" "}
							<a
								href="https://console.cloud.google.com"
								target="_blank"
								rel="noopener noreferrer"
								className="text-blue-a11 hover:underline"
							>
								Google Cloud Console
							</a>
							. Most users stay within the free tier.
						</p>
					</div>

					{message && (
						<div className="text-3 text-gray-11 mb-4">{message}</div>
					)}

					<Button variant="soft" size="3" className="w-full" onClick={removeKey}>
						Remove API Key
					</Button>
				</div>
			)}
		</div>
	);
}
