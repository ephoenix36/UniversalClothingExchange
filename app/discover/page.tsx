import Navigation from "@/components/Navigation";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, TrendingUp, Users, Sparkles } from "lucide-react";
import ClothingPlaceholder from "@/components/ClothingPlaceholder";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function DiscoverPage() {
	return (
		<div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f9f7f4] via-[#f2ede6] to-[#eae4d6]">
			<Navigation />
			
			<div className="container-spacing section-spacing max-w-7xl mx-auto flex-grow">
				<PageHeader
					title="Discover Amazing Pieces"
					description="Browse unique clothing items from our community members"
				/>

				{/* Featured Stats */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
					<Card className="card-interactive">
						<CardContent className="pt-6 text-center">
							<Sparkles className="w-8 h-8 mx-auto mb-2 text-[#4a8a62]" />
							<div className="text-2xl font-bold text-foreground">2,847</div>
							<div className="body-sm text-muted-foreground">Items Available</div>
						</CardContent>
					</Card>
					<Card className="card-interactive">
						<CardContent className="pt-6 text-center">
							<Users className="w-8 h-8 mx-auto mb-2 text-[#4a8a62]" />
							<div className="text-2xl font-bold text-foreground">1,203</div>
							<div className="body-sm text-muted-foreground">Active Members</div>
						</CardContent>
					</Card>
					<Card className="card-interactive">
						<CardContent className="pt-6 text-center">
							<Heart className="w-8 h-8 mx-auto mb-2 text-[#c95945]" />
							<div className="text-2xl font-bold text-foreground">8,421</div>
							<div className="body-sm text-muted-foreground">Successful Swaps</div>
						</CardContent>
					</Card>
					<Card className="card-interactive">
						<CardContent className="pt-6 text-center">
							<TrendingUp className="w-8 h-8 mx-auto mb-2 text-[#3a7550]" />
							<div className="text-2xl font-bold text-foreground">92%</div>
							<div className="body-sm text-muted-foreground">Satisfaction Rate</div>
						</CardContent>
					</Card>
				</div>

				{/* Filter Categories */}
				<div className="mb-8">
					<h2 className="heading-sm mb-4 text-foreground">Browse by Category</h2>
					<div className="flex flex-wrap gap-2">
						{["All Items", "Tops", "Bottoms", "Dresses", "Outerwear", "Shoes", "Accessories", "Vintage"].map((category) => (
							<Badge key={category} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors btn-touch-target">
								{category}
							</Badge>
						))}
					</div>
				</div>
				{/* Sample Items Grid */}
				<div className="grid-responsive">
					{[
						{ name: "Vintage Levi's Jacket", size: "M", condition: "Like New", category: "Outerwear", type: "jacket" as const },
						{ name: "Floral Summer Dress", size: "S", condition: "Good", category: "Dresses", type: "dress" as const },
						{ name: "Designer Sneakers", size: "9", condition: "New", category: "Shoes", type: "shoes" as const },
						{ name: "Leather Crossbody Bag", size: "OS", condition: "Like New", category: "Accessories", type: "bag" as const },
						{ name: "Cashmere Sweater", size: "L", condition: "Good", category: "Tops", type: "sweater" as const },
						{ name: "High-Waisted Jeans", size: "28", condition: "Like New", category: "Bottoms", type: "jeans" as const },
					].map((item, idx) => (
						<Card key={idx} className="card-interactive overflow-hidden group hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
							<div className="aspect-square overflow-hidden">
								<ClothingPlaceholder type={item.type} className="group-hover:scale-110 transition-transform duration-300" />
							</div>
							<CardHeader className="card-spacing">
								<div className="flex items-start justify-between gap-2">
									<CardTitle className="heading-sm text-base group-hover:text-[#4a8a62] transition-colors">{item.name}</CardTitle>
									<Badge 
										variant="secondary" 
										className={`text-xs ${
											item.condition === 'New' ? 'bg-[#3a7550]/10 text-[#3a7550] border-[#3a7550]/20' :
											item.condition === 'Like New' ? 'bg-[#4a8a62]/10 text-[#4a8a62] border-[#4a8a62]/20' :
											'bg-muted text-muted-foreground'
										}`}
									>
										{item.condition}
									</Badge>
								</div>
								<CardDescription className="body-sm">
									{item.category} • Size {item.size}
								</CardDescription>
							</CardHeader>
							<CardContent className="pt-0 px-6 pb-6">
								<button className="w-full bg-[#4a8a62] text-white rounded-xl px-4 py-2.5 font-medium hover:bg-[#3a7550] transition-colors btn-touch-target shadow-sm hover:shadow-md">
									View Details
								</button>
							</CardContent>
						</Card>
					))}
				</div>

				{/* Call to Action */}
				<div className="mt-16 text-center">
					<Card className="card-spacing bg-gradient-to-r from-primary to-secondary text-primary-foreground border-none shadow-2xl overflow-hidden relative">
						<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
						<CardHeader className="relative">
							<CardTitle className="heading-md">Share Your Wardrobe</CardTitle>
							<CardDescription className="body-md text-primary-foreground/90">
								Have items to swap? Add them to your wardrobe and connect with our community!
							</CardDescription>
						</CardHeader>
						<CardContent className="relative">
							<Link href="/wardrobe/add">
								<button className="bg-background text-foreground px-8 py-3 rounded-xl font-semibold hover:bg-background/90 transition-all shadow-xl hover:shadow-2xl hover:scale-105 btn-touch-target">
									Add Your First Item
								</button>
							</Link>
						</CardContent>
					</Card>
				</div>
			</div>
			
			<Footer />
		</div>
	);
}
