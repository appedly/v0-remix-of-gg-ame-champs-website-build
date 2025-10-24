export function Testimonials() {
  const testimonials = [
    {
      name: "Alex Chen",
      role: "Pro Valorant Player",
      company: "Competitive Esports",
      content:
        "GGameChamps helped me showcase my skills to a wider audience. The tournament system is incredibly fair and the prizes are legit. Landed a sponsorship deal after winning 3 tournaments!",
      avatar: "A",
      rating: 5,
    },
    {
      name: "Sarah Martinez",
      role: "Content Creator",
      company: "Gaming Influencer",
      content:
        "Finally, a platform that rewards skill over luck. The community voting system is transparent and the competition is fierce. Made $5K in my first month!",
      avatar: "S",
      rating: 5,
    },
    {
      name: "Jake Thompson",
      role: "Fortnite Champion",
      company: "Pro Gaming",
      content:
        "The best competitive gaming platform I've used. Clean interface, instant payouts, and the anti-cheat system actually works. Highly recommend to any serious gamer.",
      avatar: "J",
      rating: 5,
    },
  ]

  return (
    <section className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Trusted by{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD166] to-[#FF7A1A]">gamers</span>
            <br />
            landing sponsorships and winning prizes
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#4A6CFF]/20 to-[#00C2FF]/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative bg-[#1a2332]/90 backdrop-blur-sm p-8 rounded-3xl border border-[#2a3342] hover:border-[#4A6CFF]/50 transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#FFD166] to-[#FF7A1A] rounded-full flex items-center justify-center text-[#0B1020] font-bold text-lg">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-white">{testimonial.name}</div>
                    <div className="text-sm text-white/50">{testimonial.role}</div>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-[#FFD166]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-white/70 leading-relaxed mb-4">{testimonial.content}</p>
                <div className="text-sm text-[#4A6CFF] font-semibold">{testimonial.company}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
