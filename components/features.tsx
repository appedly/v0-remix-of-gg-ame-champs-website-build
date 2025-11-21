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
          <div className="inline-block px-6 py-2 bg-blue-600/10 border border-blue-500/30 rounded-full mb-8 backdrop-blur-sm">
            <span className="text-blue-400 text-sm font-semibold tracking-wide uppercase">PREMIUM FEATURES</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 text-balance leading-tight">
            Everything You Need to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500">
              Dominate
            </span>
          </h2>
          <p className="text-xl text-slate-400 leading-relaxed max-w-3xl mx-auto">
            Built for competitive gamers who want to showcase their skills and win real prizes.
          </p>
        </div>

        {/* Featured Features Section */}
        <div className="mb-20">
          <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {featuredFeatures.map((feature, index) => (
              <div
                key={`featured-${index}`}
                className="group relative p-10 bg-slate-900/80 rounded-3xl border border-slate-800 transition-all duration-300 hover:border-blue-500/50 hover:-translate-y-2 hover:shadow-2xl backdrop-blur-sm"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="relative space-y-6">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-500 text-white shadow-lg">
                    <feature.icon />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl font-bold text-white transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <div className="px-2.5 py-0.5 bg-blue-600/20 border border-blue-500/30 rounded-full">
                        <span className="text-blue-400 text-xs font-semibold">Featured</span>
                      </div>
                    </div>
                    <p className="text-slate-400 leading-relaxed text-base">
                      {feature.description}
                    </p>
                  </div>
                  
                  <div className="h-0.5 bg-blue-500/50 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
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
              <span className="text-white/50 text-xs font-minecraft font-semibold tracking-wider uppercase">More Features</span>
            </div>
          </div>
        </div>

        {/* Regular Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {regularFeatures.map((feature, index) => (
            <div
              key={`regular-${index}`}
              className="group relative p-8 bg-slate-900/60 rounded-2xl border border-slate-800 transition-all duration-300 hover:border-slate-700 hover:-translate-y-1 hover:shadow-xl backdrop-blur-sm"
              style={{ animationDelay: `${(index + 2) * 100}ms` }}
            >
              <div className="relative space-y-5">
                <div className="w-14 h-14 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:bg-slate-700 group-hover:border-slate-600 text-blue-400 shadow-md">
                  <feature.icon />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </div>
                
                <div className="h-px bg-slate-700 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
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
