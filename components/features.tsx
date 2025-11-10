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

export function Features() {
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
    <section id="features" className="py-32 relative overflow-hidden">
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

      <div className="container mx-auto px-4 relative z-10">
        {/* Enhanced header section */}
        <div className="max-w-4xl mx-auto text-center mb-24">
          <div className="inline-block px-8 py-4 bg-gradient-to-r from-[#FFD166]/10 to-[#FF7A1A]/10 border border-[#FFD166]/30 rounded-full mb-10 backdrop-blur-sm hover:from-[#FFD166]/20 hover:to-[#FF7A1A]/20 transition-all duration-500">
            <span className="text-[#FFD166] text-sm font-bold tracking-wider uppercase">PREMIUM FEATURES</span>
          </div>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 text-balance leading-tight">
            Everything You Need to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD166] via-[#FF7A1A] to-[#FF6B6B] animate-gradient">
              Dominate
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-white/60 leading-relaxed max-w-3xl mx-auto">
            Built for competitive gamers who want to showcase their skills and win real prizes.
          </p>
        </div>

        {/* Featured Features Section */}
        <div className="mb-20">
          <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
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