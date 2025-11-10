"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function UserNav({ userName }: { userName: string }) {
  const pathname = usePathname()

  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/tournaments", label: "Tournaments" },
    { href: "/submissions", label: "My Submissions" },
    { href: "/leaderboard", label: "Leaderboard" },
    { href: "/profile", label: "Profile" },
  ]

  return (
    <nav className="bg-gradient-to-r from-[#1a2332]/95 to-[#2a3342]/95 backdrop-blur-sm border-b border-[#3a4352] sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-[#4A6CFF] to-[#6A5CFF] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Image src="/logo.png" alt="GGameChamps" width={24} height={24} className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-white group-hover:text-[#4A6CFF] transition-colors">GGameChamps</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    pathname === item.href 
                      ? "bg-[#4A6CFF]/20 text-[#4A6CFF] border border-[#4A6CFF]/30" 
                      : "text-white/60 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-white/10">
              <div className="w-6 h-6 bg-gradient-to-br from-[#00C2FF] to-[#00E5FF] rounded-full flex items-center justify-center">
                <span className="text-white text-xs">👤</span>
              </div>
              <span className="text-white/80 text-sm font-medium">{userName}</span>
            </div>
            
            <form action="/api/auth/signout" method="post">
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-400 rounded-lg hover:from-red-500/30 hover:to-red-600/30 border border-red-500/30 transition-all duration-200 text-sm font-medium"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </div>
    </nav>
  )
}
