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
    <nav className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Image src="/logo.png" alt="GGameChamps" width={24} height={24} className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-white group-hover:text-blue-500 transition-colors">GGameChamps</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    pathname === item.href 
                      ? "bg-blue-600/20 text-blue-500 border border-blue-600/30" 
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-slate-800 rounded-lg border border-slate-700">
              <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">●</span>
              </div>
              <span className="text-slate-300 text-sm font-medium">{userName}</span>
            </div>
            
            <form action="/api/auth/signout" method="post">
              <button
                type="submit"
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 border border-slate-700 transition-all duration-200 text-sm font-medium"
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
