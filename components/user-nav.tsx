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
    <nav className="bg-[#1a2332] border-b border-[#2a3342]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Image src="/logo.png" alt="GGameChamps" width={40} height={40} className="w-10 h-10" />
              <span className="text-xl font-bold text-white">GGameChamps</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm transition-colors ${
                    pathname === item.href ? "text-[#4A6CFF]" : "text-white/60 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-white/60 text-sm hidden sm:block">{userName}</span>
            <form action="/api/auth/signout" method="post">
              <button
                type="submit"
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm"
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
