export function GamesSection() {
  const games = [
    { abbr: "CS", name: "Counter-Strike" },
    { abbr: "RL", name: "Rocket League" },
    { abbr: "DOTA", name: "Dota 2" },
    { abbr: "GTA", name: "GTA" },
    { abbr: "R6", name: "Rainbow Six Siege" },
    { abbr: "VAL", name: "Valorant" },
    { abbr: "COD", name: "Call of Duty" },
    { abbr: "FN", name: "Fortnite" },
  ]

  return (
    <section id="games" className="py-20 px-4 bg-[#0a0f1a]">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Supported{" "}
            <span className="bg-gradient-to-r from-[#4A6CFF] to-[#00C2FF] bg-clip-text text-transparent">Games</span>
          </h2>
          <p className="text-xl text-white/60">Compete across your favorite titles</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {games.map((game) => (
            <div
              key={game.abbr}
              className="bg-[#1a2332] rounded-xl border border-[#2a3342] p-8 text-center hover:border-[#4A6CFF] transition-all group"
            >
              <div className="text-5xl font-black text-white/20 mb-2 group-hover:text-[#4A6CFF]/30 transition-colors">
                {game.abbr}
              </div>
              <div className="text-white/80 font-medium">{game.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
