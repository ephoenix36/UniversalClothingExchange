import { Button } from "@whop/react/components";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import FeatureIcon from "@/components/FeatureIcon";
import Footer from "@/components/Footer";

export default function Page() {
	return (
		<div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f9f7f4] via-[#faf8f6] to-[#f2ede6]">
			{/* Navigation */}
			<Navigation />

			{/* Hero Section */}
			<div className="section-spacing container-spacing flex-grow">
				<div className="max-w-4xl mx-auto text-center">
					<h1 className="heading-xl mb-6 bg-gradient-to-r from-[#4a8a62] to-[#d98960] bg-clip-text text-transparent">
						Swap. Style. Sustain.
					</h1>
					<p className="body-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
						Join the circular fashion revolution. Share your wardrobe, discover
						unique pieces, and reduce waste—all while building community.
					</p>

					<div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
						<Link href="/wardrobe/add">
							<Button variant="classic" size="4" className="w-full sm:w-auto btn-touch-target">
								Upload Your First Item
							</Button>
						</Link>
						<Link href="/discover">
							<Button variant="surface" size="4" className="w-full sm:w-auto btn-touch-target">
								Browse Collection
							</Button>
						</Link>
					</div>

					{/* Stats */}
					<div className="grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto">
						<div className="text-center p-4 md:p-6 rounded-2xl glass-card card-interactive group hover:shadow-xl transition-all">
							<div className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-[#5a9a72] via-[#4a8a62] to-[#6aaa82] bg-clip-text text-transparent mb-2 md:mb-3 group-hover:scale-110 transition-transform">92M</div>
							<div className="body-sm text-muted-foreground">
								Tonnes of textile waste yearly
							</div>
						</div>
						<div className="text-center p-4 md:p-6 rounded-2xl glass-card card-interactive group hover:shadow-xl transition-all">
							<div className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-[#5a9a72] via-[#4a8a62] to-[#6aaa82] bg-clip-text text-transparent mb-2 md:mb-3 group-hover:scale-110 transition-transform">60%</div>
							<div className="body-sm text-muted-foreground">
								Clothes landfilled within 12 months
							</div>
						</div>
						<div className="text-center p-4 md:p-6 rounded-2xl glass-card card-interactive group hover:shadow-xl transition-all">
							<div className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-[#5a9a72] via-[#4a8a62] to-[#6aaa82] bg-clip-text text-transparent mb-2 md:mb-3 group-hover:scale-110 transition-transform">∞</div>
							<div className="body-sm text-muted-foreground">
								Swaps possible per garment
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Features */}
			<div className="section-spacing container-spacing bg-white/40">
				<div className="max-w-6xl mx-auto">
					<h2 className="heading-lg mb-12 text-center text-foreground">
						How It Works
					</h2>
					<div className="grid md:grid-cols-3 gap-6 md:gap-8">
						<div className="glass-card rounded-2xl card-spacing shadow-sm card-interactive group hover:shadow-xl transition-all">
							<FeatureIcon type="upload" className="mb-6 shadow-md shadow-[#4a8a62]/20 group-hover:shadow-[#4a8a62]/40 group-hover:scale-105 transition-all" />
							<h3 className="heading-sm mb-3 text-foreground">Upload Your Wardrobe</h3>
							<p className="body-md text-muted-foreground">
								Add items you're willing to swap. Take photos, add details, and
								let AI help with virtual try-ons.
							</p>
						</div>
						<div className="glass-card rounded-2xl card-spacing shadow-sm card-interactive group hover:shadow-xl transition-all">
							<FeatureIcon type="swap" className="mb-6 shadow-md shadow-[#4a8a62]/20 group-hover:shadow-[#4a8a62]/40 group-hover:scale-105 transition-all" />
							<h3 className="heading-sm mb-3 text-foreground">Request Swaps</h3>
							<p className="body-md text-muted-foreground">
								Browse community wardrobes, find pieces you love, and request
				swaps with other members.
							</p>
						</div>
						<div className="glass-card rounded-2xl card-spacing shadow-sm card-interactive group hover:shadow-xl transition-all">
							<FeatureIcon type="impact" className="mb-6 shadow-md shadow-[#4a8a62]/20 group-hover:shadow-[#4a8a62]/40 group-hover:scale-105 transition-all" />
							<h3 className="heading-sm mb-3 text-foreground">Make an Impact</h3>
							<p className="body-md text-muted-foreground">
								Every swap reduces waste, extends garment life, and builds
								sustainable fashion habits.
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* CTA */}
			<div className="section-spacing container-spacing">
				<div className="max-w-3xl mx-auto rounded-3xl bg-gradient-to-r from-primary to-secondary p-10 md:p-14 text-center border border-border shadow-2xl shadow-primary/20 card-interactive">
					<h2 className="heading-lg mb-4 text-primary-foreground">
						Ready to Start Swapping?
					</h2>
					<p className="body-lg text-primary-foreground/90 mb-8 max-w-xl mx-auto">
						Join our community and give your wardrobe new life.
					</p>
					<Link href="/profile">
						<Button variant="classic" size="4" className="btn-touch-target bg-background text-foreground hover:bg-background/90 shadow-xl">
							Set Up Your Profile
						</Button>
					</Link>
				</div>
			</div>

			{/* Footer */}
			<Footer />
		</div>
	);
}

