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

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Access Codes Management</h1>

        <div className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Generate New Access Codes</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-white/60 text-sm block mb-2 font-medium">Expiry (days)</label>
                <Input
                  type="number"
                  value={expiryDays}
                  onChange={(e) => setExpiryDays(Number.parseInt(e.target.value))}
                  min="1"
                  max="365"
                  className="bg-[#0B1020] border-white/10 text-white"
                />
              </div>
              <div>
                <label className="text-white/60 text-sm block mb-2 font-medium">Quantity</label>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number.parseInt(e.target.value))}
                  min="1"
                  max="100"
                  className="bg-[#0B1020] border-white/10 text-white"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-green-400 text-sm">{success}</p>
              </div>
            )}

            <Button
              onClick={generateCodes}
              disabled={isGenerating || quantity < 1}
              className="w-full bg-[#4A6CFF] hover:bg-[#5A7CFF] text-white"
            >
              {isGenerating ? `Generating ${quantity} code(s)...` : `Generate ${quantity} Code(s)`}
            </Button>
          </div>
        </div>

        {/* Active Codes */}
        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Active Codes ({activeCodes.length})</h2>
          {activeCodes.length === 0 ? (
            <div className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-6 text-center">
              <p className="text-white/60">No active codes</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {activeCodes.map((code) => (
                <div
                  key={code.id}
                  className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="text-white font-mono text-lg font-semibold">{code.code}</p>
                    <p className="text-white/40 text-sm">
                      Expires: {new Date(code.expires_at || "").toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    onClick={() => revokeCode(code.id, code.code)}
                    variant="outline"
                    className="bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
                  >
                    Revoke
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Used Codes */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white mb-4">Used Codes ({usedCodes.length})</h2>
          {usedCodes.length === 0 ? (
            <div className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-6 text-center">
              <p className="text-white/60">No used codes</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {usedCodes.map((code) => (
                <div key={code.id} className="bg-[#1a2332] rounded-lg border border-[#2a3342] p-4">
                  <p className="text-white font-mono font-semibold">{code.code}</p>
                  <p className="text-white/40 text-sm">Used: {new Date(code.used_at || "").toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
