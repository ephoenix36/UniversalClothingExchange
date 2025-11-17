import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon, User, Bell, Lock, Palette } from "lucide-react";

export default function SettingsPage() {
	return (
		<div className="container-spacing section-spacing max-w-4xl mx-auto">
			<div className="mb-12">
				<h1 className="heading-xl mb-4 bg-gradient-to-r from-[#4a8a62] to-[#d98960] bg-clip-text text-transparent">
					Settings
				</h1>
				<p className="body-lg text-muted-foreground">
					Manage your account preferences and settings
				</p>
			</div>

				{/* Settings Sections */}
				<div className="space-y-6">
					<Card className="card-interactive">
						<CardHeader className="card-spacing">
							<div className="flex items-center gap-3">
								<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
									<User className="w-6 h-6 text-primary" />
								</div>
								<div>
									<CardTitle className="heading-sm">Profile</CardTitle>
									<CardDescription className="body-sm">Update your profile information</CardDescription>
								</div>
							</div>
						</CardHeader>
					</Card>

					<Card className="card-interactive">
						<CardHeader className="card-spacing">
							<div className="flex items-center gap-3">
								<div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
									<Bell className="w-6 h-6 text-warning" />
								</div>
								<div>
									<CardTitle className="heading-sm">Notifications</CardTitle>
									<CardDescription className="body-sm">Manage your notification preferences</CardDescription>
								</div>
							</div>
						</CardHeader>
					</Card>

					<Card className="card-interactive">
						<CardHeader className="card-spacing">
							<div className="flex items-center gap-3">
								<div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
									<Lock className="w-6 h-6 text-destructive" />
								</div>
								<div>
									<CardTitle className="heading-sm">Privacy & Security</CardTitle>
									<CardDescription className="body-sm">Control your privacy settings</CardDescription>
								</div>
							</div>
						</CardHeader>
					</Card>

					<Card className="card-interactive">
						<CardHeader className="card-spacing">
							<div className="flex items-center gap-3">
								<div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
									<Palette className="w-6 h-6 text-success" />
								</div>
								<div>
									<CardTitle className="heading-sm">Appearance</CardTitle>
							<CardDescription className="body-sm">Customize the look and feel</CardDescription>
						</div>
					</div>
				</CardHeader>
			</Card>
		</div>
	</div>
	);
}