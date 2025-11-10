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
  const [quantity, setQuantity] = useState(1)
  const [adminId, setAdminId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    const fetchAdminAndCodes = async () => {
      const supabase = createClient()

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push("/admin/login")
        return
      }

      // Verify admin role
      const { data: userData } = await supabase.from("users").select("role").eq("id", session.user.id).single()

      if (userData?.role !== "admin") {
        router.push("/admin/login")
        return
      }

      setAdminId(session.user.id)
      await fetchCodes()
      setIsLoading(false)
    }

    fetchAdminAndCodes()
  }, [router])

  const fetchCodes = async () => {
    const supabase = createClient()
    const { data } = await supabase.from("access_codes").select("*").order("created_at", { ascending: false })
    setCodes(data || [])
  }

  const generateCodes = async () => {
    if (!adminId) {
      setError("Admin ID not found. Please log in again.")
      return
    }

    setIsGenerating(true)
    setError(null)
    setSuccess(null)

    const supabase = createClient()
    const generatedCodes = []

    try {
      for (let i = 0; i < quantity; i++) {
        // Generate random alphanumeric code (8 characters)
        const code = Math.random().toString(36).substring(2, 10).toUpperCase()
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + expiryDays)

        const { error: insertError } = await supabase.from("access_codes").insert({
          code,
          expires_at: expiresAt.toISOString(),
          created_by: adminId,
        })

        if (insertError) {
          throw new Error(insertError.message)
        }

        generatedCodes.push(code)
      }

      setSuccess(`Successfully generated ${generatedCodes.length} access code(s)`)
      await fetchCodes()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error generating codes")
    }

    setIsGenerating(false)
  }

  const revokeCode = async (id: string, code: string) => {
    if (!confirm(`Are you sure you want to revoke code ${code}?`)) return

    const supabase = createClient()
    const { error } = await supabase.from("access_codes").delete().eq("id", id)

    if (!error) {
      setCodes(codes.filter((c) => c.id !== id))
      setSuccess(`Code ${code} has been revoked`)
    } else {
      setError(`Error revoking code: ${error.message}`)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B1020] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  const activeCodes = codes.filter((c) => !c.used_at)
  const usedCodes = codes.filter((c) => c.used_at)

  return (
    <div className="min-h-screen bg-[#0B1020]">
      <AdminNav userName="Admin" />

      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-1">Access Codes Management</h1>
          <p className="text-white/40 text-sm">{activeCodes.length} active • {usedCodes.length} used</p>
        </div>

        <div className="bg-gradient-to-br from-[#1a2332] to-[#0F1823] rounded-lg border border-[#2a3342]/50 p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-6">Generate New Access Codes</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-white/60 text-xs font-medium uppercase tracking-wide block mb-2">Expiry (days)</label>
                <Input
                  type="number"
                  value={expiryDays}
                  onChange={(e) => setExpiryDays(Number.parseInt(e.target.value))}
                  min="1"
                  max="365"
                  className="bg-[#0B1020] border-[#2a3342]/50 text-white placeholder-white/30 focus:border-[#4A6CFF] transition-colors"
                />
              </div>
              <div>
                <label className="text-white/60 text-xs font-medium uppercase tracking-wide block mb-2">Quantity</label>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number.parseInt(e.target.value))}
                  min="1"
                  max="100"
                  className="bg-[#0B1020] border-[#2a3342]/50 text-white placeholder-white/30 focus:border-[#4A6CFF] transition-colors"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/15 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm font-medium">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-500/15 border border-green-500/30 rounded-lg">
                <p className="text-green-400 text-sm font-medium">{success}</p>
              </div>
            )}

            <Button
              onClick={generateCodes}
              disabled={isGenerating || quantity < 1}
              className="w-full bg-[#4A6CFF] hover:bg-[#6A5CFF] text-white font-medium transition-all hover:shadow-lg hover:shadow-[#4A6CFF]/20 disabled:opacity-50"
            >
              {isGenerating ? "..." : `Generate ${quantity}`}
            </Button>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-white mb-1">Active Codes</h2>
              <p className="text-white/40 text-sm">{activeCodes.length} {activeCodes.length === 1 ? "code" : "codes"}</p>
            </div>
            {activeCodes.length === 0 ? (
              <div className="bg-gradient-to-br from-[#1a2332] to-[#0F1823] rounded-lg border border-[#2a3342]/50 p-6 text-center">
                <p className="text-white/60">No active codes</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {activeCodes.map((code) => (
                  <div
                    key={code.id}
                    className="bg-gradient-to-r from-[#1a2332] to-[#0F1823] rounded-lg border border-[#2a3342]/50 p-4 flex items-center justify-between hover:border-[#2a3342] transition-all hover:shadow-lg hover:shadow-[#4A6CFF]/5"
                  >
                    <div>
                      <p className="text-white font-mono text-sm font-semibold">{code.code}</p>
                      <p className="text-white/40 text-xs mt-1">
                        Expires: {new Date(code.expires_at || "").toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      onClick={() => revokeCode(code.id, code.code)}
                      variant="outline"
                      className="bg-red-500/15 border-red-500/30 text-red-400 hover:bg-red-500/25 transition-all text-xs"
                    >
                      Revoke
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-white mb-1">Used Codes</h2>
              <p className="text-white/40 text-sm">{usedCodes.length} {usedCodes.length === 1 ? "code" : "codes"}</p>
            </div>
            {usedCodes.length === 0 ? (
              <div className="bg-gradient-to-br from-[#1a2332] to-[#0F1823] rounded-lg border border-[#2a3342]/50 p-6 text-center">
                <p className="text-white/60">No used codes</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {usedCodes.map((code) => (
                  <div key={code.id} className="bg-gradient-to-r from-[#1a2332] to-[#0F1823] rounded-lg border border-[#2a3342]/30 p-4 opacity-75">
                    <p className="text-white/80 font-mono text-sm font-semibold">{code.code}</p>
                    <p className="text-white/40 text-xs mt-1">Used: {new Date(code.used_at || "").toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
