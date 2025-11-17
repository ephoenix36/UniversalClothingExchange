import { Button } from "@whop/react/components";
import Link from "next/link";
import FeatureIcon from "@/components/FeatureIcon";
import Footer from "@/components/Footer";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";

export default function Page() {
	return (
		<div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f9f7f4] via-[#faf8f6] to-[#f2ede6]">
			{/* Hero Section - Enhanced */}
			<div className="section-spacing container-spacing flex-grow pt-16 md:pt-24">
				<div className="max-w-5xl mx-auto text-center">
					{/* Badge */}
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-[#4a8a62]/20 text-sm text-[#4a8a62] font-medium mb-8 shadow-sm hover:shadow-md transition-shadow">
						<Sparkles className="w-4 h-4" />
						<span>Join 10,000+ sustainable fashion enthusiasts</span>
					</div>

					{/* Main Heading - Improved typography */}
					<h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
						<span className="bg-gradient-to-r from-[#4a8a62] via-[#5a9a72] to-[#4a8a62] bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
							Swap. Style. Sustain.
						</span>
					</h1>

					{/* Subtitle - Better spacing and readability */}
					<p className="text-lg md:text-xl text-[#5a4d41] mb-12 max-w-2xl mx-auto leading-relaxed">
						Join the circular fashion revolution. Share your wardrobe, discover
						unique pieces, and reduce waste—all while building community.
					</p>

					{/* CTAs - Enhanced with icons */}
					<div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
						<Link href="/wardrobe/add" className="group">
							<Button 
								variant="classic" 
								size="4" 
								className="w-full sm:w-auto btn-touch-target bg-gradient-to-r from-[#4a8a62] to-[#5a9a72] hover:from-[#3a7550] hover:to-[#4a8a62] text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
							>
								<span className="flex items-center gap-2">
									Upload Your First Item
									<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
								</span>
							</Button>
						</Link>
						<Link href="/discover" className="group">
							<Button 
								variant="surface" 
								size="4" 
								className="w-full sm:w-auto btn-touch-target border-2 border-[#4a8a62] text-[#4a8a62] hover:bg-[#4a8a62] hover:text-white transition-all duration-300 transform hover:scale-105"
							>
								<span className="flex items-center gap-2">
									Browse Collection
									<TrendingUp className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
								</span>
							</Button>
						</Link>
					</div>

					{/* Stats - Refined with better visual hierarchy */}
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
						<div className="relative group">
							<div className="absolute inset-0 bg-gradient-to-r from-[#4a8a62]/10 to-[#5a9a72]/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100"></div>
							<div className="relative text-center p-6 md:p-8 rounded-2xl glass-card border border-white/40 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:translate-y-[-4px]">
								<div className="text-4xl md:text-6xl font-extrabold bg-gradient-to-br from-[#5a9a72] via-[#4a8a62] to-[#6aaa82] bg-clip-text text-transparent mb-3">92M</div>
								<div className="text-sm md:text-base text-[#5a4d41] font-medium leading-snug">
									Tonnes of textile waste<br />yearly
								</div>
							</div>
						</div>
						<div className="relative group">
							<div className="absolute inset-0 bg-gradient-to-r from-[#4a8a62]/10 to-[#5a9a72]/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100"></div>
							<div className="relative text-center p-6 md:p-8 rounded-2xl glass-card border border-white/40 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:translate-y-[-4px]">
								<div className="text-4xl md:text-6xl font-extrabold bg-gradient-to-br from-[#5a9a72] via-[#4a8a62] to-[#6aaa82] bg-clip-text text-transparent mb-3">60%</div>
								<div className="text-sm md:text-base text-[#5a4d41] font-medium leading-snug">
									Clothes landfilled<br />within 12 months
								</div>
							</div>
						</div>
						<div className="relative group">
							<div className="absolute inset-0 bg-gradient-to-r from-[#4a8a62]/10 to-[#5a9a72]/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100"></div>
							<div className="relative text-center p-6 md:p-8 rounded-2xl glass-card border border-white/40 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:translate-y-[-4px]">
								<div className="text-4xl md:text-6xl font-extrabold bg-gradient-to-br from-[#5a9a72] via-[#4a8a62] to-[#6aaa82] bg-clip-text text-transparent mb-3">∞</div>
								<div className="text-sm md:text-base text-[#5a4d41] font-medium leading-snug">
									Swaps possible<br />per garment
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Features - Enhanced cards */}
			<div className="section-spacing container-spacing bg-white/40 backdrop-blur-sm py-20 md:py-28">
				<div className="max-w-6xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-[#2d2520]">
							How It Works
						</h2>
						<p className="text-lg text-[#5a4d41] max-w-2xl mx-auto">
							Three simple steps to start your sustainable fashion journey
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-8 md:gap-10">
						{/* Step 1 */}
						<div className="relative group">
							<div className="absolute -inset-1 bg-gradient-to-r from-[#4a8a62] to-[#5a9a72] rounded-3xl blur-lg opacity-0 group-hover:opacity-30 transition-all duration-300"></div>
							<div className="relative glass-card rounded-3xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:translate-y-[-8px] border border-white/60">
								{/* Step Number */}
								<div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-[#4a8a62]/10 flex items-center justify-center text-[#4a8a62] font-bold text-lg">
									1
								</div>
								
								<FeatureIcon 
									type="upload" 
									className="mb-8 shadow-lg shadow-[#4a8a62]/20 group-hover:shadow-[#4a8a62]/40 group-hover:scale-110 transition-all duration-300" 
								/>
								<h3 className="text-xl md:text-2xl font-bold mb-4 text-[#2d2520]">
									Upload Your Wardrobe
								</h3>
								<p className="text-base text-[#5a4d41] leading-relaxed">
									Add items you're willing to swap. Take photos, add details, and
									let AI help with virtual try-ons.
								</p>
							</div>
						</div>

						{/* Step 2 */}
						<div className="relative group">
							<div className="absolute -inset-1 bg-gradient-to-r from-[#4a8a62] to-[#5a9a72] rounded-3xl blur-lg opacity-0 group-hover:opacity-30 transition-all duration-300"></div>
							<div className="relative glass-card rounded-3xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:translate-y-[-8px] border border-white/60">
								{/* Step Number */}
								<div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-[#4a8a62]/10 flex items-center justify-center text-[#4a8a62] font-bold text-lg">
									2
								</div>
								
								<FeatureIcon 
									type="swap" 
									className="mb-8 shadow-lg shadow-[#4a8a62]/20 group-hover:shadow-[#4a8a62]/40 group-hover:scale-110 transition-all duration-300" 
								/>
								<h3 className="text-xl md:text-2xl font-bold mb-4 text-[#2d2520]">
									Request Swaps
								</h3>
								<p className="text-base text-[#5a4d41] leading-relaxed">
									Browse community wardrobes, find pieces you love, and request
									swaps with other members.
								</p>
							</div>
						</div>

						{/* Step 3 */}
						<div className="relative group">
							<div className="absolute -inset-1 bg-gradient-to-r from-[#4a8a62] to-[#5a9a72] rounded-3xl blur-lg opacity-0 group-hover:opacity-30 transition-all duration-300"></div>
							<div className="relative glass-card rounded-3xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:translate-y-[-8px] border border-white/60">
								{/* Step Number */}
								<div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-[#4a8a62]/10 flex items-center justify-center text-[#4a8a62] font-bold text-lg">
									3
								</div>
								
								<FeatureIcon 
									type="impact" 
									className="mb-8 shadow-lg shadow-[#4a8a62]/20 group-hover:shadow-[#4a8a62]/40 group-hover:scale-110 transition-all duration-300" 
								/>
								<h3 className="text-xl md:text-2xl font-bold mb-4 text-[#2d2520]">
									Make an Impact
								</h3>
								<p className="text-base text-[#5a4d41] leading-relaxed">
									Every swap reduces waste, extends garment life, and builds
									sustainable fashion habits.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* CTA - Dramatically improved */}
			<div className="section-spacing container-spacing py-20 md:py-28">
				<div className="max-w-4xl mx-auto">
					<div className="relative group">
						{/* Glow effect */}
						<div className="absolute -inset-2 bg-gradient-to-r from-[#4a8a62] via-[#d98960] to-[#4a8a62] rounded-[2rem] blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
						
						{/* Main CTA card */}
						<div className="relative rounded-[2rem] bg-gradient-to-br from-[#4a8a62] via-[#5a9a72] to-[#d98960] p-12 md:p-16 text-center overflow-hidden shadow-2xl">
							{/* Decorative elements */}
							<div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
							<div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
							
							{/* Content */}
							<div className="relative z-10">
								<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white leading-tight">
									Ready to Start Swapping?
								</h2>
								<p className="text-lg md:text-xl text-white/95 mb-10 max-w-2xl mx-auto leading-relaxed">
									Join our community and give your wardrobe new life while making a positive impact on the planet.
								</p>
								<Link href="/profile" className="inline-block group/btn">
									<Button 
										variant="classic" 
										size="4" 
										className="btn-touch-target bg-white text-[#4a8a62] hover:bg-white/95 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 font-semibold px-8 py-6 text-lg"
									>
										<span className="flex items-center gap-3">
											Set Up Your Profile
											<ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform duration-300" />
										</span>
									</Button>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Footer */}
			<Footer />
		</div>
	);
}
