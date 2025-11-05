"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@whop/react/components";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface SwapDetail {
	id: string;
	status: string;
	deliveryMethod: string;
	scheduledPickup?: string;
	scheduledReturn?: string;
	depositAmount?: number;
	depositPaid: boolean;
	createdAt: string;
	completedAt?: string;
	item: {
		id: string;
		title: string;
		description?: string;
		size: string;
		condition: string;
		images: { url: string }[];
	};
	requester: {
		id: string;
		displayName?: string;
		avatarUrl?: string;
		membershipTier: string;
	};
	owner: {
		id: string;
		displayName?: string;
		avatarUrl?: string;
		membershipTier: string;
	};
	messages: {
		id: string;
		senderId: string;
		content: string;
		timestamp: string;
	}[];
}

export default function SwapDetailPage({
	params,
}: {
	params: { swapId: string };
}) {
	const router = useRouter();
	const [swap, setSwap] = useState<SwapDetail | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [currentUserId, setCurrentUserId] = useState<string | null>(null);
	const [messageText, setMessageText] = useState("");
	const [isSending, setIsSending] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		fetchSwap();
		fetchCurrentUser();
	}, []);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [swap?.messages]);

	const fetchCurrentUser = async () => {
		try {
			const response = await fetch("/api/users/me");
			const data = await response.json();
			if (data.success) {
				setCurrentUserId(data.user.id);
			}
		} catch (error) {
			console.error("Error fetching user:", error);
		}
	};

	const fetchSwap = async () => {
		try {
			const response = await fetch(`/api/swaps/${params.swapId}`);
			const data = await response.json();
			if (data.success) {
				setSwap(data.swap);
			}
		} catch (error) {
			console.error("Error fetching swap:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSendMessage = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!messageText.trim() || isSending) return;

		setIsSending(true);
		try {
			const response = await fetch(`/api/swaps/${params.swapId}/messages`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ content: messageText }),
			});
			const data = await response.json();
			if (data.success) {
				setMessageText("");
				fetchSwap(); // Refresh to get new message
			}
		} catch (error) {
			console.error("Error sending message:", error);
		} finally {
			setIsSending(false);
		}
	};

	const handleStatusAction = async (action: string) => {
		try {
			const response = await fetch(`/api/swaps/${params.swapId}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ action }),
			});
			const data = await response.json();
			if (data.success) {
				setSwap(data.swap);
			}
		} catch (error) {
			console.error("Error updating swap:", error);
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-gray-10">Loading...</div>
			</div>
		);
	}

	if (!swap) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<h2 className="text-6 font-bold text-gray-12 mb-4">
						Swap Not Found
					</h2>
					<Link href="/swaps">
						<Button variant="classic" size="3">
							← Back to Swaps
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	const isOwner = currentUserId === swap.owner.id;
	const isRequester = currentUserId === swap.requester.id;

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-white py-8">
			<div className="max-w-6xl mx-auto px-4">
				{/* Header */}
				<div className="mb-6">
					<Link href="/swaps">
						<Button variant="surface" size="2">
							← Back to Swaps
						</Button>
					</Link>
				</div>

				<div className="grid md:grid-cols-3 gap-6">
					{/* Left Column - Item & Details */}
					<div className="md:col-span-1 space-y-6">
						{/* Item */}
						<div className="bg-white rounded-2xl border border-gray-a4 overflow-hidden">
							<div className="aspect-square bg-gray-a2">
								{swap.item.images.length > 0 ? (
									<img
										src={swap.item.images[0].url}
										alt={swap.item.title}
										className="w-full h-full object-cover"
									/>
								) : (
									<div className="w-full h-full flex items-center justify-center text-8 text-gray-a6">
										📷
									</div>
								)}
							</div>
							<div className="p-4">
								<h3 className="text-4 font-bold text-gray-12 mb-2">
									{swap.item.title}
								</h3>
								{swap.item.description && (
									<p className="text-2 text-gray-10 mb-3">
										{swap.item.description}
									</p>
								)}
								<div className="flex gap-2">
									<span className="text-2 text-gray-10 bg-gray-a2 px-2 py-1 rounded">
										{swap.item.size}
									</span>
									<span className="text-2 text-gray-10 bg-gray-a2 px-2 py-1 rounded">
										{swap.item.condition}
									</span>
								</div>
							</div>
						</div>

						{/* Swap Details */}
						<div className="bg-white rounded-2xl border border-gray-a4 p-6">
							<h3 className="text-4 font-bold text-gray-12 mb-4">
								Swap Details
							</h3>

							<div className="space-y-3 text-3">
								<div>
									<div className="text-2 text-gray-10 mb-1">Status</div>
									<div
										className={`inline-block px-3 py-1 rounded-full text-2 font-medium ${
											swap.status === "PENDING"
												? "bg-yellow-a3 text-yellow-a11"
												: swap.status === "ACCEPTED"
													? "bg-green-a3 text-green-a11"
													: swap.status === "COMPLETED"
														? "bg-blue-a3 text-blue-a11"
														: "bg-gray-a3 text-gray-a11"
										}`}
									>
										{swap.status}
									</div>
								</div>

								<div>
									<div className="text-2 text-gray-10 mb-1">
										Delivery Method
									</div>
									<div className="text-gray-12">
										{swap.deliveryMethod.replace("_", " ")}
									</div>
								</div>

								{swap.scheduledPickup && (
									<div>
										<div className="text-2 text-gray-10 mb-1">
											Scheduled Pickup
										</div>
										<div className="text-gray-12">
											{new Date(swap.scheduledPickup).toLocaleDateString()}
										</div>
									</div>
								)}

								{swap.scheduledReturn && (
									<div>
										<div className="text-2 text-gray-10 mb-1">
											Scheduled Return
										</div>
										<div className="text-gray-12">
											{new Date(swap.scheduledReturn).toLocaleDateString()}
										</div>
									</div>
								)}

								<div>
									<div className="text-2 text-gray-10 mb-1">Created</div>
									<div className="text-gray-12">
										{new Date(swap.createdAt).toLocaleDateString()}
									</div>
								</div>

								{swap.completedAt && (
									<div>
										<div className="text-2 text-gray-10 mb-1">Completed</div>
										<div className="text-gray-12">
											{new Date(swap.completedAt).toLocaleDateString()}
										</div>
									</div>
								)}
							</div>
						</div>

						{/* Actions */}
						{swap.status === "PENDING" && isOwner && (
							<div className="bg-white rounded-2xl border border-gray-a4 p-6">
								<h3 className="text-4 font-bold text-gray-12 mb-4">Actions</h3>
								<div className="flex flex-col gap-3">
									<Button
										variant="classic"
										size="3"
										onClick={() => handleStatusAction("accept")}
										className="w-full"
									>
										Accept Swap
									</Button>
									<Button
										variant="surface"
										size="3"
										onClick={() => handleStatusAction("decline")}
										className="w-full"
									>
										Decline
									</Button>
								</div>
							</div>
						)}

						{swap.status === "ACCEPTED" && (
							<div className="bg-white rounded-2xl border border-gray-a4 p-6">
								<h3 className="text-4 font-bold text-gray-12 mb-4">Actions</h3>
								<Button
									variant="classic"
									size="3"
									onClick={() => handleStatusAction("complete")}
									className="w-full"
								>
									Mark as Completed
								</Button>
							</div>
						)}
					</div>

					{/* Right Column - Messages */}
					<div className="md:col-span-2">
						<div className="bg-white rounded-2xl border border-gray-a4 h-[600px] flex flex-col">
							<div className="p-6 border-b border-gray-a4">
								<h3 className="text-5 font-bold text-gray-12">Messages</h3>
								<div className="flex items-center gap-4 mt-3">
									<div className="flex items-center gap-2">
										{swap.requester.avatarUrl ? (
											<img
												src={swap.requester.avatarUrl}
												alt=""
												className="w-8 h-8 rounded-full"
											/>
										) : (
											<div className="w-8 h-8 rounded-full bg-gray-a5 flex items-center justify-center text-2 text-gray-10">
												{swap.requester.displayName?.[0] || "U"}
											</div>
										)}
										<span className="text-3 font-medium text-gray-12">
											{swap.requester.displayName || "Requester"}
										</span>
									</div>
									<span className="text-gray-10">↔</span>
									<div className="flex items-center gap-2">
										{swap.owner.avatarUrl ? (
											<img
												src={swap.owner.avatarUrl}
												alt=""
												className="w-8 h-8 rounded-full"
											/>
										) : (
											<div className="w-8 h-8 rounded-full bg-gray-a5 flex items-center justify-center text-2 text-gray-10">
												{swap.owner.displayName?.[0] || "U"}
											</div>
										)}
										<span className="text-3 font-medium text-gray-12">
											{swap.owner.displayName || "Owner"}
										</span>
									</div>
								</div>
							</div>

							{/* Messages */}
							<div className="flex-1 overflow-y-auto p-6 space-y-4">
								{swap.messages.length === 0 ? (
									<div className="text-center py-12">
										<div className="text-5 text-gray-a6 mb-3">💬</div>
										<p className="text-3 text-gray-10">
											No messages yet. Start the conversation!
										</p>
									</div>
								) : (
									swap.messages.map((message) => {
										const isMine = message.senderId === currentUserId;
										return (
											<div
												key={message.id}
												className={`flex ${isMine ? "justify-end" : "justify-start"}`}
											>
												<div
													className={`max-w-[70%] rounded-lg p-3 ${
														isMine
															? "bg-blue-a9 text-white"
															: "bg-gray-a3 text-gray-12"
													}`}
												>
													<p className="text-3">{message.content}</p>
													<div
														className={`text-1 mt-1 ${isMine ? "text-blue-a2" : "text-gray-10"}`}
													>
														{new Date(message.timestamp).toLocaleTimeString()}
													</div>
												</div>
											</div>
										);
									})
								)}
								<div ref={messagesEndRef} />
							</div>

							{/* Message Input */}
							<form
								onSubmit={handleSendMessage}
								className="p-4 border-t border-gray-a4"
							>
								<div className="flex gap-2">
									<input
										type="text"
										value={messageText}
										onChange={(e) => setMessageText(e.target.value)}
										placeholder="Type a message..."
										disabled={isSending}
										className="flex-1 px-4 py-2 rounded-lg bg-gray-a1 border border-gray-a4 text-gray-12 focus:outline-none focus:border-gray-a6"
									/>
									<Button
										type="submit"
										variant="classic"
										size="3"
										disabled={isSending || !messageText.trim()}
									>
										Send
									</Button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
