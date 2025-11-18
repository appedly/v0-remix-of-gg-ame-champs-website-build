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
import { Eye, EyeOff } from "lucide-react"
import { GameEntryPortal } from "@/components/game-entry-portal"

// Force dynamic rendering since this page uses auth functionality
export const dynamic = 'force-dynamic'

export default function SignupPage() {
  const [confirmPassword, setConfirmPassword] = useState("")
  const [accessCode, setAccessCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showPortal, setShowPortal] = useState(false)

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
      // Google signup now redirects to waitlist-confirmation without requiring access code upfront
      await signupWithGoogle()
    } catch (error: unknown) {
      console.error("[v0] Google signup error:", error)
      setError(error instanceof Error ? error.message : "An error occurred")
      setIsGoogleLoading(false)
    }
  }

  return (
    <>
      <GameEntryPortal isOpen={showPortal} onComplete={() => setShowPortal(false)} />
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,#1a2845_25%,#0a0f1e_25%,#0a0f1e_50%,#1a2845_50%,#1a2845_75%,#0a0f1e_75%,#0a0f1e)] bg-[length:60px_60px] opacity-30" />
        </div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FFD700]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00D9FF]/5 rounded-full blur-3xl" />
        </div>

        <div className="w-full max-w-md relative z-10 animate-game-entry">
        <div className="text-center mb-8 animate-minecraft-slide" style={{ animationDelay: '0.1s' }}>
          <div className="relative mb-4">
            <Image src="/logo.png" alt="GC" width={100} height={100} className="w-24 h-24 mx-auto" />
          </div>
          <h1 className="text-4xl font-minecraft font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00D9FF] to-[#4fc3f7] mb-2 tracking-wider">
            ► CREATE ◄
          </h1>
          <p className="text-amber-400 text-lg font-minecraft tracking-wide">START YOUR QUEST</p>
        </div>

        <div className="bg-[#1a2845]/60 backdrop-blur-xl rounded-2xl border-2 border-cyan-400/30 p-8 shadow-2xl shadow-cyan-500/10 hover:border-cyan-400/50 hover:shadow-cyan-500/20 transition-all duration-300 max-h-[90vh] overflow-y-auto">
          <Button
            onClick={handleGoogleSignup}
            disabled={isGoogleLoading}
            className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#FFC700] hover:to-[#FF9500] text-black h-12 rounded-lg font-minecraft font-bold text-base mb-6 flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/50 border border-yellow-300/30"
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
            {isGoogleLoading ? "⏳ LOADING..." : "➤ GOOGLE SIGNUP ◄"}
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-cyan-400/20" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#1a2845]/80 text-cyan-400/60 font-minecraft tracking-wider">◆ OR ◆</span>
            </div>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <Label htmlFor="displayName" className="text-cyan-400 font-minecraft tracking-wider text-sm">
                GAMER TAG
              </Label>
              <Input
                id="displayName"
                name="displayName"
                type="text"
                placeholder="Your epic nickname"
                required
                className="bg-[#0a0f1e] border-2 border-cyan-400/20 text-white placeholder:text-cyan-400/30 h-11 rounded-lg focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all font-minecraft text-sm"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-cyan-400 font-minecraft tracking-wider text-sm">
                EMAIL ADDRESS
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                required
                className="bg-[#0a0f1e] border-2 border-cyan-400/20 text-white placeholder:text-cyan-400/30 h-11 rounded-lg focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all font-minecraft text-sm"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-cyan-400 font-minecraft tracking-wider text-sm">
                PASSWORD
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="bg-[#0a0f1e] border-2 border-cyan-400/20 text-white h-11 rounded-lg focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all pr-10 font-minecraft text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400/60 hover:text-cyan-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-cyan-400 font-minecraft tracking-wider text-sm">
                CONFIRM PASSWORD
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-[#0a0f1e] border-2 border-cyan-400/20 text-white h-11 rounded-lg focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all pr-10 font-minecraft text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400/60 hover:text-cyan-400 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="accessCode" className="text-amber-400 font-minecraft tracking-wider text-sm">
                ACCESS CODE (OPTIONAL)
              </Label>
              <Input
                id="accessCode"
                type="text"
                placeholder="Join now or waitlist"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                className="bg-[#0a0f1e] border-2 border-amber-400/20 text-white placeholder:text-amber-400/30 h-11 rounded-lg focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition-all font-minecraft text-sm"
              />
              <p className="text-amber-400/70 text-xs mt-1 font-minecraft tracking-wide">
                ◆ Have code? Join now. Otherwise: WAITLIST
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-500/20 border-2 border-red-500/50 rounded-lg animate-minecraft-pop">
                <p className="text-red-300 text-xs font-minecraft">⚠ {error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#00D9FF] to-[#4fc3f7] hover:from-[#00E9FF] hover:to-[#5FDCFF] text-black font-minecraft font-bold text-base rounded-lg h-11 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/50 border border-cyan-300/30 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "⏳ CREATING..." : "► BEGIN ADVENTURE ◄"}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-cyan-400/80 text-xs font-minecraft tracking-wider">
              ALREADY JOINED?{" "}
              <Link href="/login" className="text-[#FFD700] hover:text-[#FFA500] transition-colors font-bold">
                LOGIN
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
    </>
  )
}
