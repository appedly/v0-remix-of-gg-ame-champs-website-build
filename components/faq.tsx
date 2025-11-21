"use client"

import { useState } from "react"
import { ChevronDown, HelpCircleIcon } from "lucide-react"

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: "How do tournaments work?",
      answer:
        "Tournaments run weekly for each supported game. Submit your best clips during the submission period, and the community votes on the winners. Top submissions receive cash prizes and recognition.",
    },
    {
      question: "How are winners determined?",
      answer:
        "Winners are determined through community voting. Each registered user can vote on submissions, and the clips with the most votes win. We have anti-cheat measures to prevent vote manipulation.",
    },
    {
      question: "When do I receive my prize money?",
      answer:
        "Prize money is distributed within 24 hours of tournament completion through your preferred payment method (PayPal, Stripe, or crypto).",
    },
    {
      question: "What games are supported?",
      answer:
        "We currently support popular games including Valorant, Fortnite, Apex Legends, Call of Duty, League of Legends, and more. New games are added based on community demand.",
    },
    {
      question: "Is there a free trial?",
      answer:
        "Yes! Early access members get free entry to their first 3 tournaments. After that, tournament entry fees vary based on the prize pool.",
    },
  ]

  return (
    <section id="faq" className="py-20 sm:py-24 md:py-32 relative overflow-hidden">
      {/* Sophisticated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B1020] via-[#1a2332] to-[#0B1020]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(79,195,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(79,195,247,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
      
      {/* Floating orbs with FAQ-themed colors */}
      <div className="absolute top-1/4 right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[#4A6CFF]/10 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/3 left-1/4 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-[#FFD166]/10 rounded-full blur-[60px] sm:blur-[80px] pointer-events-none animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Enhanced header section */}
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#4A6CFF]/10 to-[#4fc3f7]/10 border border-[#4A6CFF]/30 rounded-full mb-6 sm:mb-8 backdrop-blur-sm">
              <HelpCircleIcon className="w-4 h-4 text-[#4fc3f7]" />
              <span className="text-[#4fc3f7] text-xs sm:text-sm font-semibold tracking-wide">FREQUENTLY ASKED QUESTIONS</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 text-balance leading-tight">
              Got{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500">
                Questions?
              </span>
            </h2>
            <p className="text-xl sm:text-2xl text-slate-400 leading-relaxed">
              We've Got{" "}
              <span className="text-white font-bold">
                Answers
              </span>
            </p>
          </div>

          {/* Enhanced FAQ items */}
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="group relative"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient border effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4A6CFF]/20 via-[#4fc3f7]/20 to-[#4A6CFF]/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md" />
                
                <div
                  className={`relative bg-gradient-to-br ${
                    openIndex === index 
                      ? "from-[#4A6CFF]/10 to-[#4fc3f7]/5 border-[#4A6CFF]/40" 
                      : "from-[#1a2332]/60 to-[#0f1621]/60 border-[#2a3342]/40"
                  } backdrop-blur-md rounded-3xl border transition-all duration-500 hover:shadow-[0_20px_40px_rgba(74,108,255,0.15)] hover:-translate-y-1 overflow-hidden`}
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full px-5 sm:px-8 py-5 sm:py-6 flex items-center justify-between text-left group"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 flex-1">
                      {/* Question number indicator */}
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300 ${
                        openIndex === index 
                          ? "bg-gradient-to-br from-[#4A6CFF] to-[#4fc3f7] text-white shadow-lg" 
                          : "bg-[#2a3342]/60 text-white/60 group-hover:bg-[#4A6CFF]/20 group-hover:text-[#4fc3f7]"
                      }`}>
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      
                      <span className={`text-base sm:text-lg font-semibold pr-6 sm:pr-8 transition-colors duration-300 ${
                        openIndex === index 
                          ? "text-[#4fc3f7]" 
                          : "text-white group-hover:text-white/90"
                      }`}>
                        {faq.question}
                      </span>
                    </div>
                    
                    <ChevronDown
                      className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 flex-shrink-0 ${
                        openIndex === index 
                          ? "text-[#4fc3f7] rotate-180" 
                          : "text-white/40 group-hover:text-[#4fc3f7]/70"
                      }`}
                    />
                  </button>
                  
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}>
                    <div className="px-5 sm:px-8 pb-5 sm:pb-6">
                      <div className="pl-11 sm:pl-14 text-sm sm:text-base text-white/70 leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                        {faq.answer}
                      </div>
                    </div>
                  </div>

                  {/* Hover indicator line */}
                  <div className={`h-0.5 bg-gradient-to-r from-transparent via-[#4A6CFF]/50 to-transparent transition-all duration-500 ${
                    openIndex === index ? "scale-x-100" : "scale-x-0"
                  }`} />
                </div>
              </div>
            ))}
          </div>

          {/* Bottom decorative element */}
          <div className="mt-20 text-center">
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FFD166]/10 to-[#FF7A1A]/10 border border-[#FFD166]/30 rounded-full backdrop-blur-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-[#FFD166] rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-[#FF7A1A] rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
                <div className="w-2 h-2 bg-[#FF6B6B] rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
              </div>
              <span className="text-white/70 text-sm font-medium">Still have questions? Contact our support team</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
