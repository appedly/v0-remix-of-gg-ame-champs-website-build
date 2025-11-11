import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer id="contact" className="bg-[#0a0f1a] border-t border-[#1a2332] py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image src="/logo.png" alt="GGameChamps" width={32} height={32} className="w-8 h-8" />
              <span className="text-lg font-bold text-white">GGameChamps</span>
            </div>
            <p className="text-white/60 text-sm">The ultimate platform for competitive gaming clips.</p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#features" className="text-white/60 hover:text-white text-sm transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#games" className="text-white/60 hover:text-white text-sm transition-colors">
                  Games
                </Link>
              </li>
              <li>
                <Link href="#early-access" className="text-white/60 hover:text-white text-sm transition-colors">
                  Early Access
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-white/60 hover:text-white text-sm transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/60 hover:text-white text-sm transition-colors">
                  Community
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-white/60 hover:text-white text-sm transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-white/60 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/60 hover:text-white text-sm transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/60 hover:text-white text-sm transition-colors">
                  Rules
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#1a2332] pt-8 text-center">
          <p className="text-white/40 text-sm">© 2025 GGameChamps. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
