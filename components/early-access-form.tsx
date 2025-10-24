"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function EarlyAccessForm() {
  const [email, setEmail] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const supabase = createClient()

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            display_name: displayName,
            role: "user",
          },
        },
      })

      if (signUpError) throw signUpError

      if (data.user) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (signInError) {
          setMessage({ type: "success", text: "Account created! Please login to continue." })
        } else {
          setMessage({ type: "success", text: "Welcome! Redirecting to dashboard..." })
          setTimeout(() => {
            window.location.href = "/dashboard"
          }, 1500)
        }

        setEmail("")
        setDisplayName("")
        setPassword("")
      }
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "An error occurred" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section id="early-access" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Join{" "}
            <span className="bg-gradient-to-r from-[#4fc3f7] to-[#00C2FF] bg-clip-text text-transparent">
              Early Access
            </span>
          </h2>
          <p className="text-xl text-white/60">Be among the first to experience the future of competitive gaming</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Benefits Section */}
          <div className="space-y-4">
            <div className="bg-[#1a2845]/50 backdrop-blur-sm rounded-xl border border-[#2a3855] p-6 flex items-start gap-4">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#4fc3f7]/20 border border-[#4fc3f7] flex items-center justify-center mt-1">
                <svg className="w-4 h-4 text-[#4fc3f7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-1">Exclusive beta access before public launch</h3>
              </div>
            </div>

            <div className="bg-[#1a2845]/50 backdrop-blur-sm rounded-xl border border-[#2a3855] p-6 flex items-start gap-4">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#4fc3f7]/20 border border-[#4fc3f7] flex items-center justify-center mt-1">
                <svg className="w-4 h-4 text-[#4fc3f7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-1">Founding member badge and special perks</h3>
              </div>
            </div>

            <div className="bg-[#1a2845]/50 backdrop-blur-sm rounded-xl border border-[#2a3855] p-6 flex items-start gap-4">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#4fc3f7]/20 border border-[#4fc3f7] flex items-center justify-center mt-1">
                <svg className="w-4 h-4 text-[#4fc3f7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-1">
                  Early tournament entry with reduced competition
                </h3>
              </div>
            </div>

            <div className="bg-[#1a2845]/50 backdrop-blur-sm rounded-xl border border-[#2a3855] p-6 flex items-start gap-4">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#4fc3f7]/20 border border-[#4fc3f7] flex items-center justify-center mt-1">
                <svg className="w-4 h-4 text-[#4fc3f7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-1">Direct influence on platform features</h3>
              </div>
            </div>

            <div className="bg-[#1a2845]/50 backdrop-blur-sm rounded-xl border border-[#2a3855] p-6 flex items-start gap-4">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#4fc3f7]/20 border border-[#4fc3f7] flex items-center justify-center mt-1">
                <svg className="w-4 h-4 text-[#4fc3f7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-1">Priority support and community access</h3>
              </div>
            </div>
          </div>

          {/* Form Section - Code Editor Style */}
          <div className="bg-[#0a1628] rounded-xl border border-[#1e3a5f] overflow-hidden">
            {/* Code editor header */}
            <div className="bg-[#0d1b2a] border-b border-[#1e3a5f] px-4 py-3 flex items-center gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
              </div>
              <div className="ml-4 text-[#4fc3f7] text-sm font-mono flex items-center gap-2">
                <span className="text-[#4fc3f7]">▶</span>
                <span className="text-white/60">EARLY_ACCESS_PROTOCOL</span>
              </div>
              <div className="ml-auto w-3 h-3 rounded-full bg-[#4fc3f7] animate-pulse"></div>
            </div>

            {/* Form content */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6 font-mono">
              <div>
                <Label htmlFor="displayName" className="text-[#4fc3f7] text-sm mb-2 block font-mono">
                  DISPLAY_NAME
                </Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Enter your gamer tag"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="bg-[#0d1b2a] border-[#1e3a5f] text-white placeholder:text-white/30 h-12 font-mono"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-[#4fc3f7] text-sm mb-2 block font-mono">
                  EMAIL_ADDRESS
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#0d1b2a] border-[#1e3a5f] text-white placeholder:text-white/30 h-12 font-mono"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-[#4fc3f7] text-sm mb-2 block font-mono">
                  PASSWORD
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-[#0d1b2a] border-[#1e3a5f] text-white placeholder:text-white/30 h-12 font-mono"
                />
              </div>

              {message && (
                <div
                  className={`p-4 rounded-lg border font-sans ${
                    message.type === "success"
                      ? "bg-green-500/10 border-green-500/20 text-green-400"
                      : "bg-red-500/10 border-red-500/20 text-red-400"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-gradient-to-r from-[#4A6CFF] to-[#4fc3f7] hover:from-[#6A5CFF] hover:to-[#00C2FF] text-white text-lg font-bold uppercase tracking-wide"
              >
                {isLoading ? "JOINING..." : "JOIN WAITLIST"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
