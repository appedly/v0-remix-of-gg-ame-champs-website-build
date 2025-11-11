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
    <section id="features" className="py-32 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <div className="inline-block px-4 py-2 bg-[#4A6CFF]/10 border border-[#4A6CFF]/30 rounded-full mb-6">
            <span className="text-[#4A6CFF] text-sm font-semibold">FEATURES</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 text-balance">
            Everything You Need to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD166] to-[#FF7A1A]">Dominate</span>
          </h2>
          <p className="text-xl text-white/60 leading-relaxed">
            Built for competitive gamers who want to showcase their skills and win real prizes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-8 bg-gradient-to-b from-[#1a2332]/80 to-[#0f1621]/80 rounded-2xl border border-[#2a3342]/60 hover:border-[#4A6CFF]/60 transition-all duration-300 hover:shadow-[0_0_40px_rgba(74,108,255,0.25)] hover:-translate-y-2 backdrop-blur-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-[#4A6CFF]/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

              <div className="relative space-y-4">
                <div className="w-16 h-16 bg-transparent border-2 border-[#4A6CFF]/60 rounded-xl flex items-center justify-center group-hover:scale-125 group-hover:border-[#4A6CFF] transition-all duration-300 text-[#4A6CFF]">
                  <feature.icon />
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-[#FFD166] transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-white/60 leading-relaxed text-sm group-hover:text-white/70 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
