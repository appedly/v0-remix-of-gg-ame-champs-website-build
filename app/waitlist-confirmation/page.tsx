"use client"

import type React from "react"

import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function WaitlistConfirmationPage() {
  const [accessCode, setAccessCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showCodeInput, setShowCodeInput] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleAccessCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) {
        setError("User not found")
        setIsLoading(false)
        return
      }

      // Validate access code
      const { data: codeData, error: codeError } = await supabase
        .from("access_codes")
        .select("*")
        .eq("code", accessCode.toUpperCase())

      if (codeError || !codeData || codeData.length === 0) {
        setError("Invalid access code")
        setIsLoading(false)
        return
      }

      const code = codeData[0]
      if (code.used_at) {
        setError("Access code has already been used")
        setIsLoading(false)
        return
      }

      if (code.expires_at && new Date(code.expires_at) < new Date()) {
        setError("Access code has expired")
        setIsLoading(false)
        return
      }

      // Mark code as used
      await supabase
        .from("access_codes")
        .update({ used_by: userData.user.id, used_at: new Date().toISOString() })
        .eq("id", code.id)

      // Update user with access code
      await supabase.from("users").update({ access_code_id: code.id }).eq("id", userData.user.id)

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1e] via-[#0f1428] to-[#0a0f1e] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#4A6CFF]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00D9FF]/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Image src="/logo.png" alt="GGameChamps" width={100} height={100} className="w-24 h-24 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-3">Thank you for joining!</h1>
          <p className="text-white/60 text-base">You've been added to our waitlist</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl space-y-6">
          <div className="bg-gradient-to-r from-[#4A6CFF]/10 to-[#00D9FF]/10 border border-[#4A6CFF]/20 rounded-xl p-6 text-center">
            <p className="text-white/80 text-sm leading-relaxed">
              We will notify you when access is available. In the meantime, follow our socials for invite code
              giveaways!
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setShowCodeInput(!showCodeInput)}
              className="w-full text-center text-[#4A6CFF] hover:text-[#5A7CFF] text-sm font-medium transition-colors py-2"
            >
              {showCodeInput ? "✕ Hide" : "+ Received an invite code?"}
            </button>

            {showCodeInput && (
              <form onSubmit={handleAccessCodeSubmit} className="space-y-3 pt-3 border-t border-white/10">
                <input
                  type="text"
                  placeholder="Enter your access code"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                  className="w-full bg-[#0a0f1e] border border-white/10 text-white placeholder:text-white/30 h-12 rounded-xl px-4 focus:border-[#4A6CFF] focus:ring-1 focus:ring-[#4A6CFF] transition-all"
                />
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isLoading || !accessCode}
                  className="w-full bg-[#4A6CFF] hover:bg-[#5A7CFF] disabled:opacity-50 text-white h-12 rounded-xl font-medium transition-all shadow-lg shadow-[#4A6CFF]/20"
                >
                  {isLoading ? "Verifying..." : "Unlock Access"}
                </button>
              </form>
            )}
          </div>

          <div className="pt-4 border-t border-white/10">
            <p className="text-white/60 text-xs text-center mb-4">Follow our socials for invite code giveaways</p>
            <div className="flex gap-3 justify-center">
              <a
                href="https://discord.gg/ggamechamps"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/70 hover:text-white text-sm transition-all"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.211.375-.444.864-.607 1.25a18.27 18.27 0 00-5.487 0c-.163-.386-.395-.875-.607-1.25a.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.08.08 0 00.087-.027c.461-.63.873-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.294.075.075 0 01.078-.01c3.928 1.793 8.18 1.793 12.062 0a.075.075 0 01.079.009c.12.098.246.198.373.294a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.076.076 0 00-.041.107c.36.699.77 1.364 1.225 1.994a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-4.506-.838-8.962-3.368-12.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-.965-2.157-2.156 0-1.193.964-2.157 2.157-2.157 1.193 0 2.157.964 2.157 2.157 0 1.191-.964 2.156-2.157 2.156zm7.975 0c-1.183 0-2.157-.965-2.157-2.156 0-1.193.964-2.157 2.157-2.157 1.193 0 2.157.964 2.157 2.157 0 1.191-.964 2.156-2.157 2.156z" />
                </svg>
                Discord
              </a>
              <a
                href="https://twitter.com/ggamechamps"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/70 hover:text-white text-sm transition-all"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7a10.6 10.6 0 01-9-5.5z" />
                </svg>
                Twitter
              </a>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full mt-6 text-center text-white/60 hover:text-white text-sm transition-colors py-2"
        >
          Log out
        </button>
      </div>
    </div>
  )
}
