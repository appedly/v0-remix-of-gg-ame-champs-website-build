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
    const adminSession = localStorage.getItem("admin_session")
    if (!adminSession) {
      router.push("/admin/login")
      return
    }

    fetchWaitlist()
  }, [router])

  const fetchWaitlist = async () => {
    const supabase = createClient()
    const { data } = await supabase.from("waitlist").select("*").order("created_at", { ascending: false })
    setEntries(data || [])
    setIsLoading(false)
  }

  const approveEntry = async (id: string, email: string) => {
    setApprovingId(id)
    const supabase = createClient()

    // Check if already approved
    const { data: existingEntry } = await supabase.from("waitlist").select("status").eq("id", id).single()

    if (existingEntry?.status === "approved") {
      setApprovingId(null)
      return
    }

    const { error } = await supabase.from("waitlist").update({ status: "approved" }).eq("id", id)

    if (!error) {
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

      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-1">Waitlist</h1>
          <p className="text-white/40 text-sm">{entries.length} {entries.length === 1 ? "entry" : "entries"}</p>
        </div>

        <div className="space-y-4">
          {entries.length === 0 ? (
            <div className="bg-gradient-to-br from-[#1a2332] to-[#0F1823] rounded-lg border border-[#2a3342]/50 p-12 text-center">
              <p className="text-white/60">No waitlist entries</p>
            </div>
          ) : (
            entries.map((entry) => (
              <div key={entry.id} className="bg-gradient-to-r from-[#1a2332] to-[#0F1823] rounded-lg border border-[#2a3342]/50 p-6 hover:border-[#2a3342] transition-all hover:shadow-lg hover:shadow-[#4A6CFF]/5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{entry.display_name}</h3>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium border ${
                          entry.status === "approved"
                            ? "bg-green-500/15 text-green-400 border-green-500/30"
                            : "bg-yellow-500/15 text-yellow-400 border-yellow-500/30"
                        }`}
                      >
                        {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-white/60 text-sm mb-1">{entry.email}</p>
                    <p className="text-white/40 text-xs">
                      Joined: {new Date(entry.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {entry.status !== "approved" && (
                    <Button
                      onClick={() => approveEntry(entry.id, entry.email)}
                      className="bg-green-500/15 text-green-400 hover:bg-green-500/25 border-green-500/30 transition-all"
                      variant="outline"
                      disabled={approvingId === entry.id}
                    >
                      {approvingId === entry.id ? "..." : "Approve"}
                    </Button>
                  )}
                  {entry.status !== "approved" && (
                    <Button
                      onClick={() => rejectEntry(entry.id)}
                      className="bg-red-500/15 text-red-400 hover:bg-red-500/25 border-red-500/30 transition-all"
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
