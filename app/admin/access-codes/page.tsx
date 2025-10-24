"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { AdminNav } from "@/components/admin-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AccessCode {
  id: string
  code: string
  created_at: string
  expires_at: string | null
  used_at: string | null
  used_by: string | null
}

export default function AccessCodesPage() {
  const router = useRouter()
  const [codes, setCodes] = useState<AccessCode[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [expiryDays, setExpiryDays] = useState(30)
  const [adminId, setAdminId] = useState<string | null>(null)

  useEffect(() => {
    const adminSession = localStorage.getItem("admin_session")
    if (!adminSession) {
      router.push("/admin/login")
      return
    }

    const fetchAdminAndCodes = async () => {
      const supabase = createClient()

      const { data: sessionData } = await supabase.auth.getSession()
      if (sessionData.session?.user) {
        setAdminId(sessionData.session.user.id)
      }

      const { data } = await supabase.from("access_codes").select("*").order("created_at", { ascending: false })
      setCodes(data || [])
      setIsLoading(false)
    }

    fetchAdminAndCodes()
  }, [router])

  const generateCode = async () => {
    if (!adminId) {
      alert("Admin ID not found. Please log in again.")
      return
    }

    setIsGenerating(true)
    const supabase = createClient()

    // Generate random code
    const code = Math.random().toString(36).substring(2, 10).toUpperCase()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + expiryDays)

    const { error } = await supabase.from("access_codes").insert({
      code,
      expires_at: expiresAt.toISOString(),
      created_by: adminId,
    })

    if (!error) {
      await fetchCodes()
    } else {
      alert("Error generating code: " + error.message)
    }

    setIsGenerating(false)
  }

  const fetchCodes = async () => {
    const supabase = createClient()
    const { data } = await supabase.from("access_codes").select("*").order("created_at", { ascending: false })
    setCodes(data || [])
  }

  const revokeCode = async (id: string) => {
    if (!confirm("Are you sure you want to revoke this code?")) return

    const supabase = createClient()
    const { error } = await supabase.from("access_codes").delete().eq("id", id)

    if (!error) {
      setCodes(codes.filter((c) => c.id !== id))
    } else {
      alert("Error revoking code: " + error.message)
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
        <h1 className="text-3xl font-bold text-white mb-8">Access Codes</h1>

        <div className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Generate New Code</h2>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-white/60 text-sm block mb-2">Expiry (days)</label>
              <Input
                type="number"
                value={expiryDays}
                onChange={(e) => setExpiryDays(Number.parseInt(e.target.value))}
                min="1"
                max="365"
                className="bg-[#0B1020] border-white/10 text-white"
              />
            </div>
            <Button
              onClick={generateCode}
              disabled={isGenerating}
              className="bg-[#4A6CFF] hover:bg-[#5A7CFF] text-white"
            >
              {isGenerating ? "Generating..." : "Generate Code"}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white mb-4">
            Active Codes ({codes.filter((c) => !c.used_at).length})
          </h2>
          {codes.filter((c) => !c.used_at).length === 0 ? (
            <div className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-6 text-center">
              <p className="text-white/60">No active codes</p>
            </div>
          ) : (
            codes
              .filter((c) => !c.used_at)
              .map((code) => (
                <div
                  key={code.id}
                  className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="text-white font-mono text-lg">{code.code}</p>
                    <p className="text-white/40 text-sm">
                      Expires: {new Date(code.expires_at || "").toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    onClick={() => revokeCode(code.id)}
                    variant="outline"
                    className="bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
                  >
                    Revoke
                  </Button>
                </div>
              ))
          )}

          <h2 className="text-xl font-semibold text-white mb-4 mt-8">
            Used Codes ({codes.filter((c) => c.used_at).length})
          </h2>
          {codes.filter((c) => c.used_at).length === 0 ? (
            <div className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-6 text-center">
              <p className="text-white/60">No used codes</p>
            </div>
          ) : (
            codes
              .filter((c) => c.used_at)
              .map((code) => (
                <div key={code.id} className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-4">
                  <p className="text-white font-mono">{code.code}</p>
                  <p className="text-white/40 text-sm">Used: {new Date(code.used_at || "").toLocaleDateString()}</p>
                </div>
              ))
          )}
        </div>
      </main>
    </div>
  )
}
