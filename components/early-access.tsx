"use client"

import type React from "react"

import { useState } from "react"
import { Check } from "lucide-react"
import { registerEarlyAccess } from "@/app/actions/early-access"

export function EarlyAccess() {
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const benefits = [
    "Exclusive beta access before public launch",
    "Founding member badge and special perks",
    "Early tournament entry with reduced competition",
    "Direct influence on platform features",
    "Priority support and community access",
  ]

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const password = formData.get("password") as string

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const result = await registerEarlyAccess(formData)

      if (result.error) {
        setError(result.error)
      } else if (result.success) {
        setSuccess(true)
        e.currentTarget.reset()
        setConfirmPassword("")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section id="early-access" className="py-40 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-8">Join Early Access</h2>
            <p className="text-lg md:text-xl text-white/70 leading-relaxed">Be among the first to experience the future of competitive gaming</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Benefits */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-8">What You Get</h3>
              <div className="space-y-5">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-5 bg-[#1a2332]/50 rounded-lg border border-[#2a3342] hover:border-[#4A6CFF]/30 hover:translate-x-2 transition-all"
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    <div className="w-6 h-6 bg-[#00C2FF]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-[#00C2FF]" />
                    </div>
                    <p className="text-white/80 leading-relaxed">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <h3 className="text-2xl font-bold text-white mb-8">Create Your Account</h3>
              <div className="bg-[#151b2e]/50 backdrop-blur-sm p-8 rounded-2xl border border-white/5 shadow-2xl">
                {success ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-[#00C2FF]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-[#00C2FF]" />
                    </div>
                    <p className="text-white font-semibold mb-2 text-xl">Registration Successful!</p>
                    <p className="text-white/60 text-sm">Check your email to verify your account and get started</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="your@email.com"
                        required
                        className="w-full px-4 py-3 bg-[#0a0f1e] border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#4A6CFF] focus:ring-1 focus:ring-[#4A6CFF] transition-all h-12"
                      />
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Password</label>
                      <input
                        type="password"
                        name="password"
                        placeholder="Min. 6 characters"
                        required
                        minLength={6}
                        className="w-full px-4 py-3 bg-[#0a0f1e] border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#4A6CFF] focus:ring-1 focus:ring-[#4A6CFF] transition-all h-12"
                      />
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Confirm Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        required
                        minLength={6}
                        className="w-full px-4 py-3 bg-[#0a0f1e] border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#4A6CFF] focus:ring-1 focus:ring-[#4A6CFF] transition-all h-12"
                      />
                    </div>

                    {error && (
                      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                        <p className="text-red-400 text-sm">{error}</p>
                      </div>
                    )}

                    <button
                       type="submit"
                       disabled={isLoading}
                       className="w-full px-6 py-3 bg-gradient-to-r from-[#FFD166] to-[#FF7A1A] text-[#0B1020] rounded-full font-bold text-base hover:shadow-[0_0_30px_rgba(255,209,102,0.4)] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed h-12"
                     >
                       {isLoading ? "Creating account..." : "Pre-Register"}
                     </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
