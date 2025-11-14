"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { AdminNav } from "@/components/admin-nav"
import { Button } from "@/components/ui/button"

interface WaitlistEntry {
  id: string
  email: string
  display_name: string
  status: string
  created_at: string
  user_id: string | null
}

export default function WaitlistPage() {
  const router = useRouter()
  const [entries, setEntries] = useState<WaitlistEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [approvingId, setApprovingId] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      // Check for admin_session flag set by hardcoded login
      const adminSession = localStorage.getItem("admin_session")
      
      if (!adminSession) {
        // Fallback to checking Supabase auth
        const supabase = createClient()
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          router.push("/admin/login")
          return
        }

        // Verify admin role
        const { data: userData } = await supabase
          .from("users")
          .select("role")
          .eq("id", session.user.id)
          .single()

        if (userData?.role !== "admin") {
          router.push("/admin/login")
          return
        }

        await fetchWaitlist()
        setIsLoading(false)
      } else {
        // Admin session found in localStorage (hardcoded credentials)
        await fetchWaitlist()
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const fetchWaitlist = async () => {
    const supabase = createClient()
    const { data } = await supabase.from("waitlist").select("*").order("created_at", { ascending: false })
    setEntries(data || [])
  }

  const approveEntry = async (id: string, email: string) => {
    setApprovingId(id)
    const supabase = createClient()

    // Check if already approved
    const { data: existingEntry } = await supabase.from("waitlist").select("status, user_id").eq("id", id).single()

    if (existingEntry?.status === "approved") {
      setApprovingId(null)
      return
    }

    const { error } = await supabase.from("waitlist").update({ status: "approved" }).eq("id", id)

    if (!error) {
      // Also update the user's approved status if they have a user_id
      if (existingEntry?.user_id) {
        await supabase.from("users").update({ approved: true }).eq("id", existingEntry.user_id)
      } else {
        // If no user_id, find user by email and approve them
        const { data: userData } = await supabase.from("users").select("id").eq("email", email).single()
        if (userData) {
          await supabase.from("users").update({ approved: true }).eq("id", userData.id)
        }
      }
      
      setEntries(entries.map((e) => (e.id === id ? { ...e, status: "approved" } : e)))
    } else {
      alert("Error approving entry: " + error.message)
    }

    setApprovingId(null)
  }

  const rejectEntry = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from("waitlist").delete().eq("id", id)

    if (!error) {
      setEntries(entries.filter((e) => e.id !== id))
    } else {
      alert("Error rejecting entry: " + error.message)
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

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Waitlist ({entries.length})</h1>

        <div className="space-y-4">
          {entries.length === 0 ? (
            <div className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-12 text-center">
              <p className="text-white/60">No waitlist entries</p>
            </div>
          ) : (
            entries.map((entry) => (
              <div key={entry.id} className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">{entry.display_name}</h3>
                    <p className="text-white/60 text-sm">{entry.email}</p>
                    <p className="text-white/40 text-xs mt-2">
                      Joined: {new Date(entry.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded text-xs font-medium ${
                      entry.status === "approved"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {entry.status}
                  </span>
                </div>

                <div className="flex gap-2">
                  {entry.status !== "approved" && (
                    <Button
                      onClick={() => approveEntry(entry.id, entry.email)}
                      className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border-green-500/30"
                      variant="outline"
                      disabled={approvingId === entry.id}
                    >
                      {approvingId === entry.id ? "Approving..." : "Approve"}
                    </Button>
                  )}
                  {entry.status !== "approved" && (
                    <Button
                      onClick={() => rejectEntry(entry.id)}
                      className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border-red-500/30"
                      variant="outline"
                    >
                      Reject
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
