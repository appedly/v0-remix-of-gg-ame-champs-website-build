"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { signup } from "./actions"
import { signupWithGoogle } from "./oauth-actions"

export default function SignupPage() {
  const [confirmPassword, setConfirmPassword] = useState("")
  const [accessCode, setAccessCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
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

    formData.append("accessCode", accessCode)

    try {
      const result = await signup(formData)

      if (result?.error) {
        setError(result.error)
        setIsLoading(false)
      }
    } catch (error: unknown) {
      console.error("[v0] Signup error:", error)
      setError(error instanceof Error ? error.message : "An error occurred")
      setIsLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true)
    setError(null)
    try {
      await signupWithGoogle(accessCode)
    } catch (error: unknown) {
      console.error("[v0] Google signup error:", error)
      setError(error instanceof Error ? error.message : "An error occurred")
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1e] via-[#0f1428] to-[#0a0f1e] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#4A6CFF]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00D9FF]/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Image src="/logo.png" alt="GC" width={100} height={100} className="w-24 h-24 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-3">Create Account</h1>
          <p className="text-white/50 text-base">Sign up to compete and win</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl">
          <Button
            onClick={handleGoogleSignup}
            disabled={isGoogleLoading}
            className="w-full bg-white hover:bg-white/90 text-black h-12 rounded-xl font-medium text-base mb-6 flex items-center justify-center gap-2 transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {isGoogleLoading ? "Signing up..." : "Sign up with Google"}
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#151b2e]/50 text-white/40">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <Label htmlFor="displayName" className="text-white/80 text-sm font-medium mb-2 block">
                Display Name
              </Label>
              <Input
                id="displayName"
                name="displayName"
                type="text"
                placeholder="Your gamer tag"
                required
                className="bg-[#0a0f1e] border-white/10 text-white placeholder:text-white/30 h-12 rounded-xl focus:border-[#4A6CFF] focus:ring-1 focus:ring-[#4A6CFF] transition-all"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-white/80 text-sm font-medium mb-2 block">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                required
                className="bg-[#0a0f1e] border-white/10 text-white placeholder:text-white/30 h-12 rounded-xl focus:border-[#4A6CFF] focus:ring-1 focus:ring-[#4A6CFF] transition-all"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-white/80 text-sm font-medium mb-2 block">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="bg-[#0a0f1e] border-white/10 text-white h-12 rounded-xl focus:border-[#4A6CFF] focus:ring-1 focus:ring-[#4A6CFF] transition-all"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-white/80 text-sm font-medium mb-2 block">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-[#0a0f1e] border-white/10 text-white h-12 rounded-xl focus:border-[#4A6CFF] focus:ring-1 focus:ring-[#4A6CFF] transition-all"
              />
            </div>

            <div>
              <Label htmlFor="accessCode" className="text-white/80 text-sm font-medium mb-2 block">
                Access Code (optional)
              </Label>
              <Input
                id="accessCode"
                type="text"
                placeholder="Enter your access code"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                className="bg-[#0a0f1e] border-white/10 text-white placeholder:text-white/30 h-12 rounded-xl focus:border-[#4A6CFF] focus:ring-1 focus:ring-[#4A6CFF] transition-all"
              />
              <p className="text-white/40 text-xs mt-2">
                Have an access code? Enter it here to join immediately. Otherwise, you'll be added to the waitlist.
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-[#4A6CFF] hover:bg-[#5A7CFF] text-white h-12 rounded-xl font-medium text-base shadow-lg shadow-[#4A6CFF]/20 transition-all"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/50 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-[#4A6CFF] hover:text-[#5A7CFF] transition-colors font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-white/40 hover:text-white/60 text-sm transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
