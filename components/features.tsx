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
  const features = [
    {
      icon: TrophyIcon,
      title: "Weekly Tournaments",
      description: "Compete in tournaments across multiple games with real cash prizes and exclusive rewards.",
    },
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
    {
      icon: ZapIcon,
      title: "Instant Payouts",
      description: "Winners receive their prizes instantly through secure payment methods.",
    },
  ]

  return (
    <section id="features" className="py-32 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B1020] via-[#1a2332] to-[#0B1020]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(79,195,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(79,195,247,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
      
      {/* Floating orbs */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#FFD166]/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] bg-[#4A6CFF]/10 rounded-full blur-[80px] pointer-events-none animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-24">
          <div className="inline-block px-6 py-3 bg-gradient-to-r from-[#FFD166]/10 to-[#FF7A1A]/10 border border-[#FFD166]/30 rounded-full mb-8 backdrop-blur-sm">
            <span className="text-[#FFD166] text-sm font-semibold tracking-wide">FEATURES</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 text-balance leading-tight">
            Everything You Need to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD166] via-[#FF7A1A] to-[#FF6B6B] animate-gradient">
              Dominate
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-white/60 leading-relaxed max-w-3xl mx-auto">
            Built for competitive gamers who want to showcase their skills and win real prizes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-8 bg-gradient-to-br from-[#1a2332]/60 to-[#0f1621]/60 rounded-3xl border border-[#2a3342]/40 hover:border-[#FFD166]/40 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(255,209,102,0.15)] hover:-translate-y-3 backdrop-blur-md"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Animated gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFD166]/8 via-transparent to-[#FF7A1A]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
              
              {/* Subtle glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-br from-[#FFD166]/20 to-[#FF7A1A]/20 rounded-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-md" />

              <div className="relative space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-[#FFD166]/10 to-[#FF7A1A]/10 border-2 border-[#FFD166]/30 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:border-[#FFD166] group-hover:from-[#FFD166]/20 group-hover:to-[#FF7A1A]/20 transition-all duration-500 text-[#FFD166] shadow-lg">
                  <feature.icon />
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white group-hover:text-[#FFD166] transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-white/60 leading-relaxed text-sm group-hover:text-white/80 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
                
                {/* Hover indicator line */}
                <div className="h-0.5 bg-gradient-to-r from-transparent via-[#FFD166]/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </div>
            </div>
          ))}
        </div>
        
        {/* Bottom decorative element */}
        <div className="mt-24 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4A6CFF]/10 to-[#4fc3f7]/10 border border-[#4A6CFF]/30 rounded-full backdrop-blur-sm">
            <div className="w-2 h-2 bg-[#4fc3f7] rounded-full animate-pulse" />
            <span className="text-white/70 text-sm">And much more coming soon</span>
            <div className="w-2 h-2 bg-[#4A6CFF] rounded-full animate-pulse" style={{ animationDelay: "0.5s" }} />
          </div>
        </div>
      </div>
    </section>
  )
}
