"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { UserNav } from "@/components/user-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, Check, Gift, Users } from "lucide-react"

export default function ReferralCodesPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [accessCodes, setAccessCodes] = useState([])
  const [referrals, setReferrals] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [copiedCode, setCopiedCode] = useState(null)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push("/login")
        return
      }

      // Fetch user data
      const { data: userData } = await supabase.from("users").select("*").eq("id", session.user.id).single()

      if (!userData?.approved) {
        router.push("/waitlist-confirmation")
        return
      }

      setUser(userData)

      const [codesData, referralsData] = await Promise.all([
        supabase
          .from("access_codes")
          .select("*")
          .eq("generated_by", session.user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("user_referrals")
          .select("*, referred_user:users(display_name, email, approved)")
          .eq("referrer_id", session.user.id),
      ])

      setAccessCodes(codesData.data || [])
      setReferrals(referralsData.data || [])
      setIsLoading(false)
    }

    checkAuthAndFetchData()
  }, [router])

  const generateNewAccessCode = async () => {
    if (!user) return

    setIsGenerating(true)
    setMessage(null)

    const supabase = createClient()

    try {
      // Call the Supabase function to create a user access code
      const { data, error } = await supabase.rpc("create_user_access_code", {
        user_id: user.id,
      })

      if (error) {
        setMessage({ type: "error", text: `Failed to generate code: ${error.message}` })
      } else if (data && data[0]) {
        setMessage({ type: "success", text: "New access code generated! Share it with a friend." })

        // Add to list
        const newCode = {
          code: data[0].code,
          id: data[0].id,
          created_at: new Date().toISOString(),
          is_used: false,
          referral_count: 0,
        }

        setAccessCodes([newCode, ...accessCodes])
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error generating access code" })
    }

    setIsGenerating(false)
  }

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
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
      <UserNav userName={user?.display_name || "User"} />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <Gift className="w-8 h-8" />
            Referral Program
          </h1>
          <p className="text-white/60">Generate access codes and invite friends to join GGameChamps</p>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              message.type === "success"
                ? "bg-green-500/10 border-green-500/20 text-green-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Generate New Code Section */}
        <Card className="bg-[#1a2332] border-[#2a3342] mb-8">
          <CardHeader>
            <CardTitle className="text-white">Generate New Access Code</CardTitle>
            <CardDescription>Create a code to share with friends. Each code can be used once.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={generateNewAccessCode}
              disabled={isGenerating}
              className="bg-[#4A6CFF] hover:bg-[#6A5CFF] text-white"
            >
              {isGenerating ? "Generating..." : "Generate Access Code"}
            </Button>
          </CardContent>
        </Card>

        {/* Your Codes Section */}
        <Card className="bg-[#1a2332] border-[#2a3342] mb-8">
          <CardHeader>
            <CardTitle className="text-white">Your Access Codes</CardTitle>
            <CardDescription>Codes you have generated to share</CardDescription>
          </CardHeader>
          <CardContent>
            {accessCodes.length > 0 ? (
              <div className="space-y-3">
                {accessCodes.map((codeData) => (
                  <div
                    key={codeData.id}
                    className="flex items-center justify-between p-4 bg-[#0B1020] rounded-lg border border-[#2a3342]"
                  >
                    <div className="flex-1">
                      <p className="font-mono text-[#4A6CFF] font-semibold text-lg">{codeData.code}</p>
                      <div className="flex items-center gap-4 text-sm text-white/60 mt-1">
                        <span>{codeData.is_used ? "Used" : "Available"}</span>
                        <span>{codeData.referral_count} referrals</span>
                        <span>{new Date(codeData.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => copyToClipboard(codeData.code)}
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/10"
                    >
                      {copiedCode === codeData.code ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/60 text-center py-8">No access codes generated yet</p>
            )}
          </CardContent>
        </Card>

        {/* Successful Referrals Section */}
        <Card className="bg-[#1a2332] border-[#2a3342]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5" />
              Your Referrals ({referrals.length})
            </CardTitle>
            <CardDescription>Friends you have successfully referred to GGameChamps</CardDescription>
          </CardHeader>
          <CardContent>
            {referrals.length > 0 ? (
              <div className="space-y-3">
                {referrals.map((referral) => (
                  <div
                    key={referral.id}
                    className="flex items-center justify-between p-4 bg-[#0B1020] rounded-lg border border-[#2a3342]"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-white">{referral.referred_user?.display_name}</p>
                      <p className="text-sm text-white/60">{referral.referred_user?.email}</p>
                    </div>
                    <div className="text-right">
                      <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
                        Approved
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/60 text-center py-8">
                You haven't referred anyone yet. Share your access codes to get started!
              </p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
