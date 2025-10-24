"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

export default function SignupSuccessPage() {
  const [showAccessCode, setShowAccessCode] = useState(false)
  const [accessCode, setAccessCode] = useState("")

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Image src="/logo.png" alt="GC" width={100} height={100} className="w-24 h-24 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-3">Verify Your Email</h1>
          <p className="text-white/50 text-base">You're almost there!</p>
        </div>

        <div className="bg-[#151b2e]/50 backdrop-blur-sm rounded-2xl border border-white/5 p-8 shadow-2xl space-y-6">
          <div className="bg-[#4A6CFF]/10 border border-[#4A6CFF]/30 rounded-xl p-4">
            <p className="text-white/80 text-sm leading-relaxed">
              Please verify your email address to complete your account setup. Once verified, you'll be added to our
              waitlist and can start competing when your access is approved.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setShowAccessCode(!showAccessCode)}
              className="w-full text-center text-[#4A6CFF] hover:text-[#5A7CFF] text-sm font-medium transition-colors"
            >
              {showAccessCode ? "Hide" : "Have an access code?"} →
            </button>

            {showAccessCode && (
              <div className="space-y-3 pt-3 border-t border-white/10">
                <input
                  type="text"
                  placeholder="Enter your access code"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                  className="w-full bg-[#0a0f1e] border border-white/10 text-white placeholder:text-white/30 h-12 rounded-xl px-4 focus:border-[#4A6CFF] focus:ring-1 focus:ring-[#4A6CFF] transition-all"
                />
                <p className="text-white/40 text-xs">
                  If you have an access code, you can sign up immediately and start competing right away!
                </p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Link
              href="/login"
              className="block w-full text-center px-6 py-3 bg-[#4A6CFF] hover:bg-[#5A7CFF] text-white rounded-xl font-medium transition-all shadow-lg shadow-[#4A6CFF]/20"
            >
              Go to Login
            </Link>
            <Link
              href="/"
              className="block w-full text-center px-6 py-3 bg-white/5 hover:bg-white/10 text-white/80 rounded-xl font-medium transition-all border border-white/10"
            >
              Back to Home
            </Link>
          </div>
        </div>

        <p className="text-center text-white/40 text-xs mt-6">
          Check your email for the verification link. It may take a few minutes to arrive.
        </p>
      </div>
    </div>
  )
}
