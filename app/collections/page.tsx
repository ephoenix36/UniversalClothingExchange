"use client";

import { useEffect, useState } from "react";
import { Button } from "@whop/react/components";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";

interface Collection {
	id: string;
	name: string;
	description?: string;
	isPublic: boolean;
	tags: string[];
	coverImageUrl?: string;
	items: {
		item: {
			id: string;
			title: string;
			images: { url: string; isPrimary: boolean }[];
		};
	}[];
	createdAt: string;
}

export default function CollectionsPage() {
	const [collections, setCollections] = useState<Collection[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [newCollection, setNewCollection] = useState({
		name: "",
		description: "",
		isPublic: false,
	});

	useEffect(() => {
		fetchCollections();
	}, []);

	const fetchCollections = async () => {
		try {
			const response = await fetch("/api/collections");
			const data = await response.json();
			if (data.success) {
				setCollections(data.collections);
			}
		} catch (error) {
			console.error("Error fetching collections:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleCreateCollection = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await fetch("/api/collections", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(newCollection),
			});
			const data = await response.json();
			if (data.success) {
				setCollections([data.collection, ...collections]);
				setShowCreateModal(false);
				setNewCollection({ name: "", description: "", isPublic: false });
			}
		} catch (error) {
			console.error("Error creating collection:", error);
		}
	};

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<PageHeader
				title="Collections"
				description={`${collections.length} ${collections.length === 1 ? "collection" : "collections"} curated by you`}
				backLink="/wardrobe"
				backLabel="Wardrobe"
				actions={
					<Button
						variant="classic"
						size="3"
						onClick={() => setShowCreateModal(true)}
					>
						+ New Collection
					</Button>
				}
				showHomeButton={false}
			/>

			{/* Content */}
			<div className="max-w-7xl mx-auto px-4 py-8">
				{isLoading ? (
					<div className="flex items-center justify-center py-20">
						<div className="text-gray-10">Loading collections...</div>
					</div>
				) : collections.length === 0 ? (
					<div className="text-center py-20">
						<div className="w-20 h-20 rounded-full bg-gray-a3 flex items-center justify-center mx-auto mb-6">
							<span className="text-8">📚</span>
						</div>
						<h3 className="text-5 font-bold text-gray-12 mb-3">
							No collections yet
						</h3>
						<p className="text-3 text-gray-10 mb-6 max-w-md mx-auto">
							Create collections to organize your wardrobe by theme, season, or
							style.
						</p>
						<Button
							variant="classic"
							size="4"
							onClick={() => setShowCreateModal(true)}
						>
							Create Your First Collection
						</Button>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{collections.map((collection) => (
							<Link
								key={collection.id}
								href={`/collections/${collection.id}`}
								className="group"
							>
								<div className="bg-white rounded-xl border border-gray-a4 overflow-hidden hover:shadow-lg transition-shadow">
									{/* Cover/Preview */}
									<div className="aspect-video bg-gray-a2 relative overflow-hidden">
										{collection.coverImageUrl ? (
											<img
												src={collection.coverImageUrl}
												alt={collection.name}
												className="w-full h-full object-cover group-hover:scale-105 transition-transform"
											/>
										) : collection.items.length > 0 ? (
											<div className="grid grid-cols-2 h-full">
												{collection.items.slice(0, 4).map((ci, idx) => (
													<div key={idx} className="relative">
														{ci.item.images.length > 0 ? (
															<img
																src={ci.item.images[0].url}
																alt=""
																className="w-full h-full object-cover"
															/>
														) : (
															<div className="w-full h-full bg-gray-a3" />
														)}
													</div>
												))}
											</div>
										) : (
											<div className="w-full h-full flex items-center justify-center text-6 text-gray-a6">
												📚
											</div>
										)}

										{/* Item Count */}
										<div className="absolute top-2 right-2 bg-black/70 text-white text-2 px-2 py-1 rounded-full font-medium">
											{collection.items.length}{" "}
											{collection.items.length === 1 ? "item" : "items"}
										</div>
									</div>

									{/* Info */}
									<div className="p-4">
										<h3 className="text-4 font-semibold text-gray-12 mb-1">
											{collection.name}
										</h3>
										{collection.description && (
											<p className="text-2 text-gray-10 mb-2 line-clamp-2">
												{collection.description}
											</p>
										)}
										<div className="flex items-center gap-2">
											{collection.isPublic && (
												<span className="text-2 text-gray-10 bg-green-a2 px-2 py-1 rounded">
													Public
												</span>
											)}
											{collection.tags.length > 0 && (
												<span className="text-2 text-gray-10 bg-gray-a2 px-2 py-1 rounded">
													{collection.tags.length} tags
												</span>
											)}
										</div>
									</div>
								</div>
							</Link>
						))}
					</div>
				)}
			</div>

			{/* Create Modal */}
			{showCreateModal && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-2xl p-8 max-w-md w-full">
						<h2 className="text-6 font-bold text-gray-12 mb-6">
							Create Collection
						</h2>

						<form onSubmit={handleCreateCollection} className="space-y-4">
							<div>
								<label className="block text-3 font-medium text-gray-11 mb-2">
									Name *
								</label>
								<input
									type="text"
									required
									value={newCollection.name}
									onChange={(e) =>
										setNewCollection({ ...newCollection, name: e.target.value })
									}
									placeholder="e.g., Summer Essentials"
									className="w-full px-4 py-3 rounded-lg bg-gray-a1 border border-gray-a4 text-gray-12 focus:outline-none focus:border-gray-a6"
								/>
							</div>

							<div>
								<label className="block text-3 font-medium text-gray-11 mb-2">
									Description
								</label>
								<textarea
									value={newCollection.description}
									onChange={(e) =>
										setNewCollection({
											...newCollection,
											description: e.target.value,
										})
									}
									rows={3}
									placeholder="What's this collection about?"
									className="w-full px-4 py-3 rounded-lg bg-gray-a1 border border-gray-a4 text-gray-12 focus:outline-none focus:border-gray-a6"
								/>
							</div>

							<div className="flex items-center gap-3">
								<input
									type="checkbox"
									id="isPublic"
									checked={newCollection.isPublic}
									onChange={(e) =>
										setNewCollection({
											...newCollection,
											isPublic: e.target.checked,
										})
									}
									className="w-5 h-5 rounded"
								/>
								<label
									htmlFor="isPublic"
									className="text-3 font-medium text-gray-12"
								>
									Make this collection public
								</label>
							</div>

							<div className="flex gap-3 pt-4">
								<Button type="submit" variant="classic" size="3" className="flex-1">
									Create
								</Button>
								<Button
									type="button"
									variant="surface"
									size="3"
									onClick={() => {
										setShowCreateModal(false);
										setNewCollection({
											name: "",
											description: "",
											isPublic: false,
										});
									}}
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
