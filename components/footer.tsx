import Link from "next/link"
import Image from "next/image"
import { Twitter, MessageCircle, Youtube, Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer id="contact" className="relative bg-[#0a0f1a] border-t border-[#1a2332] py-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(0,194,255,0.08),rgba(10,15,26,0)_70%)]" />
      
      <div className="container mx-auto px-4 relative">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative">
                <Image src="/logo.png" alt="GGameChamps" width={40} height={40} className="w-10 h-10" />
                <div className="absolute -inset-1 bg-[#00C2FF]/20 rounded-full blur-md" />
              </div>
              <span className="text-xl font-bold text-white">GGameChamps</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              The ultimate platform for competitive gaming clips. Turn your highlights into championships.
            </p>
            <div className="flex gap-3">
              <a 
                href="#" 
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-[#00C2FF] hover:border-[#00C2FF]/50 hover:bg-[#00C2FF]/10 transition-all duration-300"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-[#00C2FF] hover:border-[#00C2FF]/50 hover:bg-[#00C2FF]/10 transition-all duration-300"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-[#00C2FF] hover:border-[#00C2FF]/50 hover:bg-[#00C2FF]/10 transition-all duration-300"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a 
                href="#" 
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-[#00C2FF] hover:border-[#00C2FF]/50 hover:bg-[#00C2FF]/10 transition-all duration-300"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Platform</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#features" className="text-white/60 hover:text-[#00C2FF] text-sm transition-all duration-300 hover:translate-x-1 inline-block">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#games" className="text-white/60 hover:text-[#00C2FF] text-sm transition-all duration-300 hover:translate-x-1 inline-block">
                  Games
                </Link>
              </li>
              <li>
                <Link href="#early-access" className="text-white/60 hover:text-[#00C2FF] text-sm transition-all duration-300 hover:translate-x-1 inline-block">
                  Early Access
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="text-white/60 hover:text-[#00C2FF] text-sm transition-all duration-300 hover:translate-x-1 inline-block">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Support</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-white/60 hover:text-[#00C2FF] text-sm transition-all duration-300 hover:translate-x-1 inline-block">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/60 hover:text-[#00C2FF] text-sm transition-all duration-300 hover:translate-x-1 inline-block">
                  Community
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-white/60 hover:text-[#00C2FF] text-sm transition-all duration-300 hover:translate-x-1 inline-block">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/60 hover:text-[#00C2FF] text-sm transition-all duration-300 hover:translate-x-1 inline-block">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-white/60 hover:text-[#00C2FF] text-sm transition-all duration-300 hover:translate-x-1 inline-block">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/60 hover:text-[#00C2FF] text-sm transition-all duration-300 hover:translate-x-1 inline-block">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/60 hover:text-[#00C2FF] text-sm transition-all duration-300 hover:translate-x-1 inline-block">
                  Rules
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/60 hover:text-[#00C2FF] text-sm transition-all duration-300 hover:translate-x-1 inline-block">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#1a2332] pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-sm">
              © 2025 GGameChamps. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-white/40 text-sm">
              <span>Made with 🔥 for gamers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
