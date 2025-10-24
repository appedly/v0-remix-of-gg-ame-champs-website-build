"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { signup } from "./actions"

export default function SignupPage() {
  const [confirmPassword, setConfirmPassword] = useState("")
  const [accessCode, setAccessCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

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

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Image src="/logo.png" alt="GC" width={100} height={100} className="w-24 h-24 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-3">Create Account</h1>
          <p className="text-white/50 text-base">Sign up to compete and win</p>
        </div>

        <div className="bg-[#151b2e]/50 backdrop-blur-sm rounded-2xl border border-white/5 p-8 shadow-2xl">
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
