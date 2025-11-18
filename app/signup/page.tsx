"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { signup } from "./actions"
import { signupWithGoogle } from "./oauth-actions"
import { Eye, EyeOff, Sparkles, Rocket, Zap } from "lucide-react"

export const dynamic = 'force-dynamic'

export default function SignupPage() {
  const [confirmPassword, setConfirmPassword] = useState("")
  const [accessCode, setAccessCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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
      await signupWithGoogle()
    } catch (error: unknown) {
      console.error("[v0] Google signup error:", error)
      setError(error instanceof Error ? error.message : "An error occurred")
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#0a0614] via-[#0f0a1e] to-[#1a0b2e]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[700px] h-[700px] bg-[#4fc3f7]/10 rounded-full blur-[140px] animate-pulse-slow" />
        <div className="absolute bottom-0 left-1/4 w-[700px] h-[700px] bg-[#4A6CFF]/10 rounded-full blur-[140px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 right-1/3 w-[500px] h-[500px] bg-[#00D9FF]/8 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b05_1px,transparent_1px),linear-gradient(to_bottom,#1e293b05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="min-h-screen flex items-center justify-center p-4 py-12 relative z-10">
        <div 
          className={`w-full max-w-lg transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="text-center mb-8 space-y-4">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-[#4fc3f7] via-[#00C2FF] to-[#4A6CFF] blur-2xl opacity-60 rounded-full" />
              <Image 
                src="/logo.png" 
                alt="GC" 
                width={120} 
                height={120} 
                className="w-28 h-28 mx-auto relative z-10 drop-shadow-2xl" 
              />
            </div>
            
            <div className="space-y-2">
              <h1 className="font-outfit text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#4fc3f7] to-white">
                Join the Arena
              </h1>
              <p className="text-slate-400 text-lg font-space-grotesk">Create your account and start competing</p>
            </div>

            <div className="flex items-center justify-center gap-2 text-[#4fc3f7]">
              <Rocket className="w-4 h-4 animate-pulse" />
              <span className="text-sm font-medium">Level Up Your Game</span>
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#4fc3f7] via-[#00C2FF] to-[#4A6CFF] rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition duration-500" />
            
            <div className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-2xl rounded-3xl border border-white/10 p-8 shadow-2xl">
              <Button
                onClick={handleGoogleSignup}
                disabled={isGoogleLoading}
                className="w-full bg-white hover:bg-white/90 text-black h-14 rounded-xl font-space-grotesk font-semibold text-base mb-6 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] shadow-lg hover:shadow-xl"
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
                {isGoogleLoading ? "Signing up..." : "Continue with Google"}
              </Button>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-[#0a0614]/80 text-slate-400 font-medium">Or sign up with email</span>
                </div>
              </div>

              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName" className="text-white font-space-grotesk font-medium text-sm">
                    Display Name
                  </Label>
                  <Input
                    id="displayName"
                    name="displayName"
                    type="text"
                    placeholder="Your gamer tag"
                    required
                    className="h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:bg-white/10 focus:border-[#4fc3f7] focus:ring-2 focus:ring-[#4fc3f7]/20 transition-all font-space-grotesk"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white font-space-grotesk font-medium text-sm">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="yourname@example.com"
                    required
                    className="h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:bg-white/10 focus:border-[#4fc3f7] focus:ring-2 focus:ring-[#4fc3f7]/20 transition-all font-space-grotesk"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white font-space-grotesk font-medium text-sm">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      className="h-12 bg-white/5 border-white/10 text-white rounded-xl pr-12 focus:bg-white/10 focus:border-[#4fc3f7] focus:ring-2 focus:ring-[#4fc3f7]/20 transition-all font-space-grotesk"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-white font-space-grotesk font-medium text-sm">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-12 bg-white/5 border-white/10 text-white rounded-xl pr-12 focus:bg-white/10 focus:border-[#4fc3f7] focus:ring-2 focus:ring-[#4fc3f7]/20 transition-all font-space-grotesk"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accessCode" className="text-white font-space-grotesk font-medium text-sm flex items-center gap-2">
                    Access Code
                    <span className="text-xs text-slate-500 font-normal">(optional)</span>
                  </Label>
                  <Input
                    id="accessCode"
                    type="text"
                    placeholder="Enter your access code"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                    className="h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:bg-white/10 focus:border-[#4fc3f7] focus:ring-2 focus:ring-[#4fc3f7]/20 transition-all font-space-grotesk uppercase tracking-wider"
                  />
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Have an access code? Enter it to join immediately. Otherwise, you'll be added to the waitlist.
                  </p>
                </div>

                {error && (
                  <div className="relative overflow-hidden p-4 bg-red-500/10 border border-red-500/20 rounded-xl backdrop-blur-sm">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent" />
                    <p className="text-red-400 text-sm font-medium relative z-10">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-14 bg-gradient-to-r from-[#4fc3f7] via-[#00C2FF] to-[#4A6CFF] hover:shadow-[0_0_40px_rgba(79,195,247,0.4)] text-white font-space-grotesk font-bold text-base rounded-xl transition-all hover:scale-[1.02] shadow-lg group relative overflow-hidden"
                  disabled={isLoading}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <Zap className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-slate-400 text-sm">
                  Already have an account?{" "}
                  <Link 
                    href="/login" 
                    className="text-[#4fc3f7] hover:text-[#00C2FF] transition-colors font-semibold inline-flex items-center gap-1"
                  >
                    Sign in
                    <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link 
              href="/" 
              className="text-slate-400 hover:text-white text-sm transition-colors inline-flex items-center gap-2 group"
            >
              <span className="inline-block group-hover:-translate-x-1 transition-transform">←</span>
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
