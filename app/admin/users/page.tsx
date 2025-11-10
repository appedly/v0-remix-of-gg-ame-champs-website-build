"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { AdminNav } from "@/components/admin-nav"
import { Button } from "@/components/ui/button"

interface User {
  id: string
  email: string
  display_name: string | null
  role: string
  created_at: string
}

export default function UsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const adminSession = localStorage.getItem("admin_session")
    if (!adminSession) {
      router.push("/admin/login")
      return
    }

    const fetchUsers = async () => {
      const supabase = createClient()
      const { data } = await supabase.from("users").select("*").order("created_at", { ascending: false })
      setUsers(data || [])
      setIsLoading(false)
    }

    fetchUsers()
  }, [router])

  const handleRoleChange = async (userId: string, newRole: string) => {
    const supabase = createClient()
    const { error } = await supabase.from("users").update({ role: newRole }).eq("id", userId)

    if (!error) {
      setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)))
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B1020] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B1020]">
      <AdminNav userName="Admin" />

      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-1">Users</h1>
          <p className="text-white/40 text-sm">{users.length} {users.length === 1 ? "user" : "users"}</p>
        </div>

        <div className="bg-gradient-to-br from-[#1a2332] to-[#0F1823] rounded-lg border border-[#2a3342]/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0B1020]/50 border-b border-[#2a3342]/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a3342]/30">
                {users.map((u, idx) => (
                  <tr key={u.id} className={idx % 2 === 0 ? "bg-[#0F1823]/30" : ""}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{u.display_name || "N/A"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white/70">{u.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${
                          u.role === "admin"
                            ? "bg-purple-500/15 text-purple-400 border-purple-500/30"
                            : "bg-blue-500/15 text-blue-400 border-blue-500/30"
                        }`}
                      >
                        {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRoleChange(u.id, u.role === "admin" ? "user" : "admin")}
                        className="bg-[#0B1020]/50 border-[#2a3342]/50 text-white hover:bg-[#1a2332] hover:border-[#2a3342] transition-all text-xs"
                      >
                        {u.role === "admin" ? "Make User" : "Make Admin"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
