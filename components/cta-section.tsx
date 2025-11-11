export function CTASection() {
  const benefits = [
    "Exclusive beta access before public launch",
    "Founding member badge with special perks",
    "Reduced competition in early tournaments",
    "Direct influence on platform development",
  ]

  return (
    <section className="py-40 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#4A6CFF]/5 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#FFD166] via-[#FF7A1A] to-[#FFD166] rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative bg-gradient-to-br from-[#1a2332] to-[#0f1621] p-12 md:p-16 rounded-3xl border border-[#FFD166]/30 text-center space-y-10">
              <div className="w-20 h-20 bg-gradient-to-br from-[#FFD166] to-[#FF7A1A] rounded-2xl flex items-center justify-center mx-auto">
                <svg className="w-10 h-10 text-[#0B1020]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>

              <div>
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 text-balance">
                  Ready to Compete with the Best?
                </h2>

                <p className="text-lg md:text-xl text-white/70 mb-10 leading-relaxed">
                  Join thousands of gamers competing for real prizes
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto py-4">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-white/70">
                    <span className="text-[#FFD166] font-bold mt-0.5">✓</span>
                    <span className="text-sm md:text-base">{benefit}</span>
                  </div>
                ))}
              </div>

              <a
                href="#early-access"
                className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#FFD166] to-[#FF7A1A] text-[#0B1020] rounded-full font-bold text-lg hover:shadow-[0_0_50px_rgba(255,209,102,0.6)] transition-all hover:scale-110 shadow-2xl"
              >
                Join Early Access Now
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
