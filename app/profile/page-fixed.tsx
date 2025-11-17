"use client";

import { useEffect, useState } from "react";
import { Button } from "@whop/react/components";
import { Card } from "@/components/ui/card";
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
	const [error, setError] = useState<string | null>(null);
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
			setIsLoading(true);
			setError(null);
			const response = await fetch("/api/users/me");
			const data = await response.json();
			
			if (data.success && data.user) {
				setUser(data.user);
				setFormData({
					displayName: data.user.displayName || "",
					bio: data.user.bio || "",
					phoneNumber: data.user.phoneNumber || "",
				});
			} else {
				setError("Profile unavailable");
			}
		} catch (error) {
			console.error("Error fetching user:", error);
			setError("Something went wrong loading your profile");
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

	// Loading State
	if (isLoading) {
		return (
			<div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f9f7f4] via-[#f2ede6] to-[#eae4d6]">
				<main className="flex-grow flex items-center justify-center" role="status" aria-label="Loading profile">
					<div className="flex flex-col items-center gap-4">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4a8a62]" />
						<p className="text-lg text-gray-600">Loading your profile...</p>
					</div>
				</main>
				<Footer />
			</div>
		);
	}

	// Error State
	if (error || !user) {
		return (
			<div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f9f7f4] via-[#f2ede6] to-[#eae4d6]">
				<main className="flex-grow flex items-center justify-center p-4">
					<Card className="p-8 text-center max-w-md bg-white/80 backdrop-blur-sm">
						<div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
							<svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
						<h2 className="text-xl font-semibold text-gray-900 mb-2">
							{error || "Profile unavailable"}
						</h2>
						<p className="text-gray-600 mb-6">
							We couldn't load your profile. Please try again.
						</p>
						<Button 
							onClick={() => window.location.reload()} 
							className="bg-[#4a8a62] hover:bg-[#3a7550]"
							aria-label="Reload page"
						>
							Reload
						</Button>
					</Card>
				</main>
				<Footer />
			</div>
		);
	}

	// Success State - Profile Content
	return (
		<div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f9f7f4] via-[#f2ede6] to-[#eae4d6]">
			<main className="max-w-4xl mx-auto container-spacing section-spacing flex-grow">
				<Card className="glass-card rounded-2xl p-8 shadow-xl bg-white/80 backdrop-blur-sm">
				{/* Header */}
				<div className="flex items-start justify-between mb-8">
					<div className="flex items-center gap-4">
						{user.avatarUrl ? (
							<img
								src={user.avatarUrl}
								alt={`${user.displayName}'s profile`}
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
							<label htmlFor="displayName" className="block text-sm font-medium text-foreground mb-2">
								Display Name
							</label>
							<input
								id="displayName"
								type="text"
								value={formData.displayName}
								onChange={(e) =>
									setFormData({ ...formData, displayName: e.target.value })
								}
								className="w-full px-4 py-2.5 rounded-xl bg-background border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
							/>
						</div>

						<div>
							<label htmlFor="bio" className="block text-sm font-medium text-foreground mb-2">
								Bio
							</label>
							<textarea
								id="bio"
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
							<label htmlFor="phoneNumber" className="block text-sm font-medium text-foreground mb-2">
								Phone Number
							</label>
							<input
								id="phoneNumber"
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
								<h2 className="text-lg font-semibold text-foreground mb-2">Bio</h2>
								<p className="text-base text-muted-foreground">{user.bio}</p>
							</div>
						)}

						{user.phoneNumber && (
							<div>
								<h2 className="text-lg font-semibold text-foreground mb-2">
									Phone
								</h2>
								<p className="text-base text-muted-foreground">{user.phoneNumber}</p>
							</div>
						)}

						<div>
							<h2 className="text-lg font-semibold text-foreground mb-3">
								Profile Photos
							</h2>
							{user.profilePhotos.length > 0 ? (
								<div className="grid grid-cols-3 gap-4">
									{user.profilePhotos.map((photo: any) => (
										<img
											key={photo.id}
											src={photo.url}
											alt="Profile photo"
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
			</Card>
		</main>
		
		<Footer />
		</div>
	);
}
