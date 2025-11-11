"use client"

import Image from "next/image"
import Link from "next/link"

export default function ConfirmationWaitlistPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1e] via-[#0f1428] to-[#0a0f1e] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#4A6CFF]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00D9FF]/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Image src="/logo.png" alt="GGameChamps" width={100} height={100} className="w-24 h-24 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-3">Check Your Email</h1>
          <p className="text-white/60 text-base">We've sent you a verification link</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl space-y-6">
          <div className="bg-[#4A6CFF]/10 border border-[#4A6CFF]/30 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#4A6CFF]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-6 h-6 text-[#4A6CFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-white font-semibold mb-1">Verification email sent!</p>
                <p className="text-white/70 text-sm leading-relaxed">
                  We've sent a verification link to your email. Click the link to verify your account and access the
                  dashboard.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6">
            <p className="text-white/60 text-sm text-center mb-4">
              Once verified, you'll either be added to the waitlist or granted immediate access if you had an access
              code.
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href="/login"
              className="block w-full text-center px-6 py-3 bg-[#4A6CFF] hover:bg-[#5A7CFF] text-white rounded-xl font-medium transition-all shadow-lg shadow-[#4A6CFF]/20"
            >
              Back to Login
            </Link>
            <Link
              href="/"
              className="block w-full text-center px-6 py-3 bg-white/5 hover:bg-white/10 text-white/80 rounded-xl font-medium transition-all border border-white/10"
            >
              Back to Home
            </Link>
          </div>

          <div className="text-center text-white/40 text-xs space-y-2">
            <p>📧 Check your spam folder if you don't see the email</p>
            <p>💡 The link will expire in 24 hours</p>
          </div>
        </div>
      </div>
    </div>
  )
}
