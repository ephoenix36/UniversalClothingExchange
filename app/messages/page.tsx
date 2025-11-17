import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Send, Search } from "lucide-react";

export default function MessagesPage() {
	return (
		<div className="container-spacing section-spacing max-w-7xl mx-auto">
			<div className="mb-12">
				<h1 className="heading-xl mb-4 bg-gradient-to-r from-[#4a8a62] to-[#d98960] bg-clip-text text-transparent">
					Messages
				</h1>
				<p className="body-lg text-muted-foreground">
					Chat with other members about swap requests
				</p>
			</div>

				{/* Empty State */}
				<Card className="card-spacing text-center py-16">
					<div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
						<MessageCircle className="w-10 h-10 text-muted-foreground" />
					</div>
					<CardTitle className="heading-md mb-3">No Messages Yet</CardTitle>
					<CardDescription className="body-md mb-6 max-w-md mx-auto">
					Start a swap request to begin chatting with other members!
				</CardDescription>
				<Button size="lg" className="btn-touch-target">
					Browse Items
				</Button>
			</Card>
		</div>
	);
}