"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

export function AdminNav({ userName }: { userName: string }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    // Clear admin session from localStorage
    localStorage.removeItem("admin_session")
    
    // Navigate to login page
    router.push("/admin/login")
  }

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/tournaments", label: "Tournaments" },
    { href: "/admin/submissions", label: "Submissions" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/leaderboard", label: "Leaderboard" },
    { href: "/admin/access-codes", label: "Access Codes" },
    { href: "/admin/waitlist", label: "Waitlist" },
    { href: "/admin/settings", label: "Settings" },
  ]

  return (
    <nav className="bg-[#1a2332] border-b border-[#2a3342]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <Image src="/logo.png" alt="GGameChamps" width={40} height={40} className="w-10 h-10" />
              <span className="text-xl font-bold text-white">Admin</span>
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
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
