"use client"

import { useEffect, useRef, useState } from "react"
import {
  TrophyIcon,
  UsersIcon,
  VideoIcon,
  ShieldIcon,
  AwardIcon,
  TrendingIcon,
  ClockIcon,
  ZapIcon,
} from "./bordered-icons"
import { Crown, Star, Target, Gamepad2, Medal, Sparkles } from "lucide-react"

export function Features() {
  const [activeSection, setActiveSection] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActiveSection(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const floatingIcons = [
    { icon: Crown, side: 'left', position: 'top', delay: '0s', tilt: -15, color: '#FFD166' },
    { icon: Star, side: 'right', position: 'middle', delay: '0.3s', tilt: 12, color: '#4A6CFF' },
    { icon: Target, side: 'left', position: 'bottom', delay: '0.6s', tilt: -8, color: '#FF7A1A' },
    { icon: Gamepad2, side: 'right', position: 'top', delay: '0.9s', tilt: 18, color: '#4fc3f7' },
    { icon: Medal, side: 'left', position: 'middle', delay: '1.2s', tilt: 10, color: '#00C2FF' },
    { icon: Sparkles, side: 'right', position: 'bottom', delay: '1.5s', tilt: -12, color: '#FFD166' },
  ]
  const featuredFeatures = [
    {
      icon: TrophyIcon,
      title: "Weekly Tournaments",
      description: "Battle for real cash and exclusive rewards in epic competitions.",
      featured: true,
    },
    {
      icon: ZapIcon,
      title: "Instant Payouts",
      description: "Win today, get paid today. No waiting, no hassle.",
      featured: true,
    },
  ]

  const regularFeatures = [
    {
      icon: UsersIcon,
      title: "Community Voting",
      description: "Fair and transparent voting system where the community decides the best clips.",
    },
    {
      icon: VideoIcon,
      title: "Instant Uploads",
      description: "Upload your gaming clips in seconds with our optimized submission system.",
    },
    {
      icon: ShieldIcon,
      title: "Anti-Cheat Protection",
      description: "Advanced moderation ensures every submission is legitimate and fair.",
    },
    {
      icon: AwardIcon,
      title: "Skill-Based Ranking",
      description: "Climb the leaderboards and earn your place among the elite players.",
    },
    {
      icon: TrendingIcon,
      title: "Real-Time Stats",
      description: "Track your performance with detailed analytics and insights.",
    },
    {
      icon: ClockIcon,
      title: "24/7 Competitions",
      description: "New tournaments starting every day - never miss a chance to compete.",
    },
  ]

  return (
    <section id="features" ref={sectionRef} className="py-32 relative overflow-hidden">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B1020] via-[#1a2332] to-[#0B1020]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(79,195,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(79,195,247,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
      
      {/* Enhanced floating orbs with more movement */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-[#FFD166]/8 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/3 left-1/4 w-[500px] h-[500px] bg-[#4A6CFF]/8 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-[#FF7A1A]/6 rounded-full blur-[80px] pointer-events-none animate-pulse" style={{ animationDelay: "2s" }} />
      
      {/* Animated lightning traces */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-0.5 h-full bg-gradient-to-b from-transparent via-[#FFD166]/20 to-transparent lightning-trace" style={{ animationDelay: "0s" }} />
        <div className="absolute top-0 right-1/3 w-0.5 h-full bg-gradient-to-b from-transparent via-[#4A6CFF]/20 to-transparent lightning-trace" style={{ animationDelay: "1.5s" }} />
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingIcons.map((floatingIcon, index) => {
          const FloatingIcon = floatingIcon.icon
          const isLeft = floatingIcon.side === 'left'
          const positionY = floatingIcon.position === 'top' ? '20%' : floatingIcon.position === 'bottom' ? '80%' : '50%'
          const positionX = isLeft ? '5%' : '95%'
          
          return (
            <div
              key={index}
              className={`absolute transition-all duration-1000 ease-out ${activeSection ? 'opacity-100' : 'opacity-0'}`}
              style={{
                left: positionX,
                top: positionY,
                transform: `translateY(-50%) rotate(${floatingIcon.tilt}deg)`,
                animationDelay: floatingIcon.delay,
                animation: activeSection ? `float-feature-icon-${index} 4s ease-in-out infinite` : 'none',
              }}
            >
              <div className="relative group">
                {/* Icon shadow */}
                <div 
                  className="absolute rounded-full blur-xl transition-all duration-500 w-12 h-12"
                  style={{
                    backgroundColor: `${floatingIcon.color}20`,
                    transform: isLeft ? 'translateX(20px) translateY(10px)' : 'translateX(-20px) translateY(10px)',
                    opacity: activeSection ? 0.6 : 0,
                  }}
                />
                
                {/* Main icon */}
                <div
                  className="relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 border-2"
                  style={{
                    backgroundColor: `${floatingIcon.color}15`,
                    borderColor: `${floatingIcon.color}40`,
                    color: floatingIcon.color,
                  }}
                >
                  <FloatingIcon className="w-6 h-6" />
                  
                  {/* Glow effect on hover */}
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      backgroundColor: floatingIcon.color,
                      filter: 'blur(8px)',
                    }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Enhanced header section */}
        <div className="max-w-4xl mx-auto text-center mb-24">
          <div className="inline-block px-8 py-4 bg-gradient-to-r from-[#FFD166]/10 to-[#FF7A1A]/10 border border-[#FFD166]/30 rounded-full mb-10 backdrop-blur-sm hover:from-[#FFD166]/20 hover:to-[#FF7A1A]/20 transition-all duration-500">
            <span className="text-[#FFD166] text-sm font-bold tracking-wider uppercase">PREMIUM FEATURES</span>
          </div>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 text-balance leading-tight" style={{ fontFamily: 'var(--font-eb-garamond), Georgia, serif' }}>
            Everything You Need to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD166] via-[#FF7A1A] to-[#FF6B6B] animate-gradient">
              Dominate
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-white/60 leading-relaxed max-w-3xl mx-auto" style={{ fontFamily: 'var(--font-eb-garamond), Georgia, serif' }}>
            Built for competitive gamers who want to showcase their skills and win real prizes.
          </p>
        </div>

        {/* Featured Features Section */}
        <div className="mb-20 relative">
          {/* Glowing connecting line */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-[#FFD166]/60 to-transparent relative">
              <div className="absolute inset-0 h-px bg-gradient-to-r from-transparent via-[#FFD166] to-transparent animate-pulse blur-sm" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#FFD166] rounded-full animate-ping" />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto relative z-10">
            {featuredFeatures.map((feature, index) => (
              <div
                key={`featured-${index}`}
                className="group relative p-10 bg-gradient-to-br from-[#1a2332]/80 to-[#0f1621]/80 rounded-4xl border-2 border-[#FFD166]/30 hover:border-[#FFD166]/60 transition-all duration-700 hover:shadow-[0_30px_60px_rgba(255,209,102,0.25)] hover:-translate-y-4 backdrop-blur-xl transform"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Shimmer effect for featured cards */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFD166]/10 to-transparent -skew-x-12 group-hover:translate-x-full transition-transform duration-1000 opacity-0 group-hover:opacity-100" />
                
                {/* Enhanced glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-br from-[#FFD166]/30 via-[#FF7A1A]/20 to-[#FFD166]/30 rounded-4xl opacity-0 group-hover:opacity-40 transition-opacity duration-700 blur-xl" />

                <div className="relative space-y-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#FFD166]/15 to-[#FF7A1A]/15 border-3 border-[#FFD166]/40 rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:border-[#FFD166] group-hover:from-[#FFD166]/25 group-hover:to-[#FF7A1A]/25 transition-all duration-700 text-[#FFD166] shadow-2xl group-hover:shadow-[0_0_40px_rgba(255,209,102,0.4)]">
                    <feature.icon />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl font-black text-white group-hover:text-[#FFD166] transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <div className="px-3 py-1 bg-gradient-to-r from-[#FFD166]/20 to-[#FF7A1A]/20 border border-[#FFD166]/30 rounded-full">
                        <span className="text-[#FFD166] text-xs font-bold uppercase tracking-wider">Featured</span>
                      </div>
                    </div>
                    <p className="text-white/70 leading-relaxed text-base group-hover:text-white/90 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>
                  
                  {/* Enhanced hover indicator */}
                  <div className="h-1 bg-gradient-to-r from-transparent via-[#FFD166] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section divider */}
        <div className="relative my-20">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-[#FFD166]/30 to-transparent" />
          </div>
          <div className="relative flex justify-center">
            <div className="px-8 py-3 bg-gradient-to-r from-[#0B1020] via-[#1a2332] to-[#0B1020] backdrop-blur-sm">
              <span className="text-white/50 text-sm font-semibold tracking-wider uppercase">More Features</span>
            </div>
          </div>
        </div>

        {/* Regular Features Grid */}
        <div className="relative">
          {/* Horizontal and vertical glowing lines */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Horizontal lines */}
            <div className="absolute top-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4A6CFF]/30 to-transparent">
              <div className="absolute inset-0 h-px bg-gradient-to-r from-transparent via-[#4A6CFF] to-transparent animate-pulse blur-sm" />
            </div>
            <div className="absolute top-2/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4A6CFF]/30 to-transparent">
              <div className="absolute inset-0 h-px bg-gradient-to-r from-transparent via-[#4A6CFF] to-transparent animate-pulse blur-sm" />
            </div>
            {/* Vertical lines */}
            <div className="absolute left-1/3 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#4fc3f7]/30 to-transparent">
              <div className="absolute inset-0 w-px bg-gradient-to-b from-transparent via-[#4fc3f7] to-transparent animate-pulse blur-sm" />
            </div>
            <div className="absolute left-2/3 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#4fc3f7]/30 to-transparent">
              <div className="absolute inset-0 w-px bg-gradient-to-b from-transparent via-[#4fc3f7] to-transparent animate-pulse blur-sm" />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10">
          {regularFeatures.map((feature, index) => (
            <div
              key={`regular-${index}`}
              className="group relative p-8 bg-gradient-to-br from-[#1a2332]/60 to-[#0f1621]/60 rounded-3xl border border-[#2a3342]/40 hover:border-[#4A6CFF]/40 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(74,108,255,0.15)] hover:-translate-y-2 backdrop-blur-md"
              style={{ animationDelay: `${(index + 2) * 100}ms` }}
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#4A6CFF]/8 via-transparent to-[#4fc3f7]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
              
              {/* Glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-br from-[#4A6CFF]/20 to-[#4fc3f7]/20 rounded-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-md" />

              <div className="relative space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-[#4A6CFF]/10 to-[#4fc3f7]/10 border-2 border-[#4A6CFF]/30 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:border-[#4A6CFF] group-hover:from-[#4A6CFF]/20 group-hover:to-[#4fc3f7]/20 transition-all duration-500 text-[#4A6CFF] shadow-lg">
                  <feature.icon />
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white group-hover:text-[#4A6CFF] transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-white/60 leading-relaxed text-sm group-hover:text-white/80 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
                
                {/* Hover indicator line */}
                <div className="h-0.5 bg-gradient-to-r from-transparent via-[#4A6CFF]/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </div>
            </div>
          ))}
          </div>
        </div>
        
        {/* Enhanced bottom decorative element */}
        <div className="mt-24 text-center">
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#4A6CFF]/10 to-[#4fc3f7]/10 border border-[#4A6CFF]/30 rounded-full backdrop-blur-sm hover:from-[#4A6CFF]/20 hover:to-[#4fc3f7]/20 transition-all duration-500">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-[#4fc3f7] rounded-full animate-pulse lightning-pulse" />
              <div className="w-2 h-2 bg-[#4A6CFF] rounded-full animate-pulse lightning-pulse" style={{ animationDelay: "0.3s" }} />
              <div className="w-2 h-2 bg-[#4fc3f7] rounded-full animate-pulse lightning-pulse" style={{ animationDelay: "0.6s" }} />
            </div>
            <span className="text-white/70 text-sm font-semibold">And much more coming soon</span>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-[#4A6CFF] rounded-full animate-pulse lightning-pulse" style={{ animationDelay: "0.9s" }} />
              <div className="w-2 h-2 bg-[#4fc3f7] rounded-full animate-pulse lightning-pulse" style={{ animationDelay: "1.2s" }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
