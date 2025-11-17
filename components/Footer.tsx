import Link from 'next/link';
import Logo from './Logo';
import { Heart, Twitter, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#dcd6cc] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Logo variant="icon" size={36} />
              <span className="text-lg font-bold bg-gradient-to-r from-[#4a8a62] to-[#d98960] bg-clip-text text-transparent">
                Universal Clothing Exchange
              </span>
            </Link>
            <p className="text-[#5a4d41] mb-4 max-w-md leading-relaxed">
              Join the circular fashion revolution. Share your wardrobe, discover unique pieces, 
              and reduce waste—all while building community.
            </p>
            <div className="flex gap-4">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-[#f2ede6] hover:bg-[#4a8a62] hover:text-white flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-[#f2ede6] hover:bg-[#4a8a62] hover:text-white flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-[#f2ede6] hover:bg-[#4a8a62] hover:text-white flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-[#2d2520] mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/discover" className="text-[#5a4d41] hover:text-[#4a8a62] transition-colors">
                  Discover
                </Link>
              </li>
              <li>
                <Link href="/wardrobe" className="text-[#5a4d41] hover:text-[#4a8a62] transition-colors">
                  My Wardrobe
                </Link>
              </li>
              <li>
                <Link href="/swaps" className="text-[#5a4d41] hover:text-[#4a8a62] transition-colors">
                  My Swaps
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-[#5a4d41] hover:text-[#4a8a62] transition-colors">
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-[#2d2520] mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-[#5a4d41] hover:text-[#4a8a62] transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[#5a4d41] hover:text-[#4a8a62] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-[#5a4d41] hover:text-[#4a8a62] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-[#5a4d41] hover:text-[#4a8a62] transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#d4cec4] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[#5a4d41]">
            © {new Date().getFullYear()} Universal Clothing Exchange. All rights reserved.
          </p>
          <p className="text-sm text-[#5a4d41] flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-[#c95945] fill-current" /> for sustainable fashion
          </p>
        </div>
      </div>
    </footer>
  );
}
