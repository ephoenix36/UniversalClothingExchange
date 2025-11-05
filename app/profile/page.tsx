"use client";

import { useEffect, useState } from "react";
import { Button } from "@whop/react/components";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

interface UserProfile {
	id: string;
	displayName?: string;
	bio?: string;
	phoneNumber?: string;
	avatarUrl?: string;
	membershipTier: string;
	profilePhotos: any[];
}

export default function ProfilePage() {
	const [user, setUser] = useState<UserProfile | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		displayName: "",
		bio: "",
		phoneNumber: "",
	});

	useEffect(() => {
		fetchUser();
	}, []);

	const fetchUser = async () => {
		try {
			const response = await fetch("/api/users/me");
			const data = await response.json();
			if (data.success) {
				setUser(data.user);
				setFormData({
					displayName: data.user.displayName || "",
					bio: data.user.bio || "",
					phoneNumber: data.user.phoneNumber || "",
				});
			}
		} catch (error) {
			console.error("Error fetching user:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await fetch("/api/users/me", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});
			const data = await response.json();
			if (data.success) {
				setUser(data.user);
				setIsEditing(false);
			}
		} catch (error) {
			console.error("Error updating user:", error);
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-gray-10">Loading...</div>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-red-10">Error loading profile</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f9f7f4] via-[#faf8f6] to-[#f2ede6]">
			<Navigation />
			
			<div className="max-w-4xl mx-auto container-spacing section-spacing flex-grow">
				<div className="glass-card rounded-2xl p-8 shadow-xl">
				{/* Header */}
				<div className="flex items-start justify-between mb-8">
					<div className="flex items-center gap-4">
						{user.avatarUrl ? (
							<img
								src={user.avatarUrl}
								alt="Profile"
								className="w-20 h-20 rounded-full ring-4 ring-[#4a8a62]/20"
							/>
						) : (
							<div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#4a8a62] to-[#d98960] flex items-center justify-center ring-4 ring-[#4a8a62]/20">
								<span className="text-2xl font-bold text-white">
									{user.displayName?.[0] || "U"}
								</span>
							</div>
						)}
						<div>
							<h1 className="text-3xl font-bold bg-gradient-to-r from-[#4a8a62] to-[#d98960] bg-clip-text text-transparent">
								{user.displayName || "User"}
							</h1>
							<div className="flex items-center gap-2 mt-2">
								<span className="text-sm font-medium text-[#4a8a62] bg-[#4a8a62]/10 px-3 py-1 rounded-full border border-[#4a8a62]/20">
									{user.membershipTier}
								</span>
							</div>
						</div>
					</div>
					{!isEditing && (
						<Button
							variant="classic"
							size="3"
							onClick={() => setIsEditing(true)}
						>
							Edit Profile
						</Button>
					)}
				</div>

				{isEditing ? (
					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<label className="block text-sm font-medium text-foreground mb-2">
								Display Name
							</label>
							<input
								type="text"
								value={formData.displayName}
								onChange={(e) =>
									setFormData({ ...formData, displayName: e.target.value })
								}
								className="w-full px-4 py-2.5 rounded-xl bg-background border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-foreground mb-2">
								Bio
							</label>
							<textarea
								value={formData.bio}
								onChange={(e) =>
									setFormData({ ...formData, bio: e.target.value })
								}
								rows={4}
								className="w-full px-4 py-2.5 rounded-xl bg-background border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-none"
								placeholder="Tell us about yourself..."
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-foreground mb-2">
								Phone Number
							</label>
							<input
								type="tel"
								value={formData.phoneNumber}
								onChange={(e) =>
									setFormData({ ...formData, phoneNumber: e.target.value })
								}
								className="w-full px-4 py-2.5 rounded-xl bg-background border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
								placeholder="(555) 123-4567"
							/>
						</div>

						<div className="flex gap-3">
							<Button type="submit" variant="classic" size="3">
								Save Changes
							</Button>
							<Button
								type="button"
								variant="surface"
								size="3"
								onClick={() => {
									setIsEditing(false);
									setFormData({
										displayName: user.displayName || "",
										bio: user.bio || "",
										phoneNumber: user.phoneNumber || "",
									});
								}}
							>
								Cancel
							</Button>
						</div>
					</form>
				) : (
					<div className="space-y-6">
						{user.bio && (
							<div>
								<h3 className="text-lg font-semibold text-foreground mb-2">Bio</h3>
								<p className="text-base text-muted-foreground">{user.bio}</p>
							</div>
						)}

						{user.phoneNumber && (
							<div>
								<h3 className="text-lg font-semibold text-foreground mb-2">
									Phone
								</h3>
								<p className="text-base text-muted-foreground">{user.phoneNumber}</p>
							</div>
						)}

						<div>
							<h3 className="text-lg font-semibold text-foreground mb-3">
								Profile Photos
							</h3>
							{user.profilePhotos.length > 0 ? (
								<div className="grid grid-cols-3 gap-4">
									{user.profilePhotos.map((photo: any) => (
										<img
											key={photo.id}
											src={photo.url}
											alt="Profile"
											className="rounded-lg aspect-square object-cover"
										/>
									))}
								</div>
							) : (
								<p className="text-sm text-muted-foreground">
									No profile photos uploaded yet
								</p>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
		
		<Footer />
		</div>
	);
}
