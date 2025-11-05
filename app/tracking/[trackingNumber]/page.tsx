"use client";

import { useState, useEffect } from "react";
import { Button } from "@whop/react/components";
import Link from "next/link";

interface Shipment {
	trackingNumber: string;
	carrier: string;
	service: string;
	status: string;
	estimatedDelivery?: string;
	actualDelivery?: string;
	itemTitle: string;
}

interface TrackingEvent {
	timestamp: string;
	status: string;
	location: string;
	description: string;
}

export default function TrackingPage({
	params,
}: {
	params: Promise<{ trackingNumber: string }>;
}) {
	const [shipment, setShipment] = useState<Shipment | null>(null);
	const [events, setEvents] = useState<TrackingEvent[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [trackingNumber, setTrackingNumber] = useState<string>("");

	useEffect(() => {
		params.then((p) => {
			setTrackingNumber(p.trackingNumber);
			fetchTracking(p.trackingNumber);
		});
	}, []);

	const fetchTracking = async (tracking: string) => {
		try {
			const response = await fetch(`/api/shipping/track/${tracking}`);
			const data = await response.json();
			if (data.success) {
				setShipment(data.shipment);
				setEvents(data.events);
			}
		} catch (error) {
			console.error("Error fetching tracking:", error);
		} finally {
			setIsLoading(false);
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-gray-10">Loading tracking information...</div>
			</div>
		);
	}

	if (!shipment) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<h2 className="text-6 font-bold text-gray-12 mb-4">
						Tracking Not Found
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

	const getStatusColor = (status: string) => {
		switch (status) {
			case "DELIVERED":
				return "text-green-a11";
			case "OUT_FOR_DELIVERY":
				return "text-blue-a11";
			case "IN_TRANSIT":
				return "text-purple-a11";
			case "LABEL_CREATED":
				return "text-gray-a11";
			default:
				return "text-gray-11";
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "DELIVERED":
				return "✓";
			case "OUT_FOR_DELIVERY":
				return "🚚";
			case "IN_TRANSIT":
				return "📦";
			case "LABEL_CREATED":
				return "🏷️";
			default:
				return "📍";
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-white py-12">
			<div className="max-w-4xl mx-auto px-4">
				{/* Header */}
				<div className="mb-8">
					<Link
						href="/swaps"
						className="text-3 text-blue-a11 hover:underline mb-4 inline-block"
					>
						← Back to Swaps
					</Link>
					<h1 className="text-8 font-bold text-gray-12 mb-2">
						Track Your Package
					</h1>
					<p className="text-4 text-gray-10">{shipment.itemTitle}</p>
				</div>

				{/* Status Card */}
				<div className="bg-white rounded-2xl border border-gray-a4 p-8 mb-8">
					<div className="flex items-start justify-between mb-6">
						<div>
							<div className="flex items-center gap-3 mb-3">
								<span className="text-8">{getStatusIcon(shipment.status)}</span>
								<h2
									className={`text-6 font-bold ${getStatusColor(shipment.status)}`}
								>
									{shipment.status.replace(/_/g, " ")}
								</h2>
							</div>
							<div className="space-y-2">
								<div className="flex items-center gap-2 text-3 text-gray-11">
									<span className="font-medium text-gray-12">Tracking:</span>
									<code className="bg-gray-a3 px-2 py-1 rounded font-mono">
										{trackingNumber}
									</code>
								</div>
								<div className="flex items-center gap-2 text-3 text-gray-11">
									<span className="font-medium text-gray-12">Carrier:</span>
									<span>
										{shipment.carrier} - {shipment.service}
									</span>
								</div>
								{shipment.estimatedDelivery && !shipment.actualDelivery && (
									<div className="flex items-center gap-2 text-3 text-gray-11">
										<span className="font-medium text-gray-12">
											Estimated Delivery:
										</span>
										<span>
											{new Date(shipment.estimatedDelivery).toLocaleDateString(
												"en-US",
												{
													weekday: "long",
													month: "long",
													day: "numeric",
												},
											)}
										</span>
									</div>
								)}
								{shipment.actualDelivery && (
									<div className="flex items-center gap-2 text-3 text-green-a11">
										<span className="font-medium">Delivered:</span>
										<span>
											{new Date(shipment.actualDelivery).toLocaleDateString(
												"en-US",
												{
													weekday: "long",
													month: "long",
													day: "numeric",
													hour: "numeric",
													minute: "2-digit",
												},
											)}
										</span>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Tracking Timeline */}
				<div className="bg-white rounded-2xl border border-gray-a4 p-8">
					<h3 className="text-5 font-bold text-gray-12 mb-6">
						Tracking History
					</h3>

					{events.length === 0 ? (
						<div className="text-center py-8">
							<div className="w-16 h-16 rounded-full bg-gray-a3 flex items-center justify-center mx-auto mb-4">
								<span className="text-6">📭</span>
							</div>
							<p className="text-3 text-gray-10">
								No tracking events yet. Check back soon!
							</p>
						</div>
					) : (
						<div className="space-y-6">
							{events.map((event, index) => (
								<div key={index} className="flex gap-4">
									{/* Timeline dot */}
									<div className="flex flex-col items-center">
										<div
											className={`w-3 h-3 rounded-full ${
												index === 0 ? "bg-blue-a9" : "bg-gray-a6"
											} mt-2`}
										/>
										{index < events.length - 1 && (
											<div className="w-0.5 h-full bg-gray-a4 mt-2" />
										)}
									</div>

									{/* Event details */}
									<div className="flex-1 pb-6">
										<div className="flex items-start justify-between mb-2">
											<div>
												<div className="font-semibold text-gray-12 text-4 mb-1">
													{event.description}
												</div>
												<div className="text-3 text-gray-10">
													{event.location}
												</div>
											</div>
											<div className="text-3 text-gray-10 whitespace-nowrap ml-4">
												{new Date(event.timestamp).toLocaleString("en-US", {
													month: "short",
													day: "numeric",
													hour: "numeric",
													minute: "2-digit",
												})}
											</div>
										</div>
										<div
											className={`inline-block px-3 py-1 rounded-full text-2 ${
												index === 0
													? "bg-blue-a3 text-blue-a11"
													: "bg-gray-a3 text-gray-11"
											}`}
										>
											{event.status.replace(/_/g, " ")}
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Help Section */}
				<div className="mt-8 bg-blue-a2 border border-blue-a4 rounded-xl p-6">
					<h3 className="text-4 font-bold text-gray-12 mb-3">
						Need Help?
					</h3>
					<p className="text-3 text-gray-11 mb-4">
						If you have questions about your shipment or notice any issues,
						we're here to help.
					</p>
					<div className="flex gap-3">
						<Button variant="soft" size="2">
							Contact Support
						</Button>
						<Button variant="ghost" size="2">
							Report an Issue
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
