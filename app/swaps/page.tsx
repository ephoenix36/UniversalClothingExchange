import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function SwapsPage() {
return (
<div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f9f7f4] via-[#f2ede6] to-[#eae4d6]">
<div className="container-spacing section-spacing max-w-7xl mx-auto flex-grow">
<div className="mb-12">
<h1 className="heading-xl mb-4 bg-gradient-to-r from-[#4a8a62] to-[#d98960] bg-clip-text text-transparent">Your Swaps</h1>
<p className="body-lg text-muted-foreground">Manage all your clothing exchange requests</p>
</div>
			<Card className="card-spacing text-center py-16 border-2 border-dashed border-gray-300 hover:border-[#4a8a62] transition-colors bg-white/80 backdrop-blur-sm">
				<div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#4a8a62]/10 to-[#d98960]/10 flex items-center justify-center mx-auto mb-8 border-4 border-[#4a8a62]/20">
					<Heart className="w-14 h-14 text-[#4a8a62]" />
				</div>
				<CardTitle className="heading-md mb-4 bg-gradient-to-r from-[#4a8a62] to-[#d98960] bg-clip-text text-transparent">No Swaps Yet</CardTitle>
				<CardDescription className="body-lg mb-8 max-w-md mx-auto text-gray-600">Start browsing items to request your first swap!</CardDescription>
				<Link href="/discover">
					<Button size="lg" className="btn-touch-target shadow-lg hover:shadow-xl transition-shadow bg-[#4a8a62] hover:bg-[#3a7550]">Browse Items</Button>
				</Link>
			</Card>
</div>

<Footer />
</div>
);
}
