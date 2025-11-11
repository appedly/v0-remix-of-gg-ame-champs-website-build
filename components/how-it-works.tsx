export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Create Your Account",
      description: "Sign up in seconds and join thousands of competitive gamers.",
    },
    {
      number: "02",
      title: "Upload Your Best Clips",
      description: "Submit your most impressive gaming moments to active tournaments.",
    },
    {
      number: "03",
      title: "Get Votes & Compete",
      description: "The community votes on the best clips. Top submissions win prizes.",
    },
    {
      number: "04",
      title: "Win Real Prizes",
      description: "Earn cash prizes, sponsorships, and recognition in the gaming community.",
    },
  ]

  return (
    <section id="how-it-works" className="py-32 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <div className="inline-block px-4 py-2 bg-[#00C2FF]/10 border border-[#00C2FF]/30 rounded-full mb-6">
            <span className="text-[#00C2FF] text-sm font-semibold">HOW IT WORKS</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 text-balance">
            Start Competing in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4A6CFF] to-[#00C2FF]">
              4 Simple Steps
            </span>
          </h2>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#4A6CFF] to-[#00C2FF] rounded-3xl blur opacity-25 group-hover:opacity-50 transition-opacity" />
                <div className="relative bg-[#0B1020] p-8 rounded-3xl border border-[#2a3342]">
                  <div className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#4A6CFF]/30 to-[#00C2FF]/30 mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-white/60 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
