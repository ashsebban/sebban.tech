import { projects } from "../projects/_content/projects";

const featured = projects.find((game) => game.id === "mongols-chess")!;
const squares = Array.from({ length: 36 });

export default function GameCenterFeature() {
  return (
    <section aria-labelledby="featured-game" className="relative isolate overflow-hidden rounded-3xl border border-[#54615a] bg-[#17231f]">
      <div aria-hidden="true" className="pointer-events-none absolute right-[-3rem] top-[-3rem] grid w-[19rem] rotate-12 grid-cols-6 overflow-hidden rounded-xl opacity-20 sm:right-[-1rem] sm:w-[25rem] sm:opacity-60">
        {squares.map((_, index) => (
          <span key={index} className={`grid aspect-square place-items-center text-4xl text-[#f4dfba] sm:text-5xl ${(index + Math.floor(index / 6)) % 2 ? "bg-[#526955]" : "bg-[#2f4137]"}`}>
            {index === 13 || index === 22 ? "♞" : index === 5 || index === 30 ? "♜" : ""}
          </span>
        ))}
      </div>
      <div className="relative max-w-xl p-6 sm:p-10">
        <p className="mb-3 font-semibold text-[#b8cfad]">Featured playtest</p>
        <h2 id="featured-game" className="text-3xl font-extrabold tracking-tight text-[#fff1d9] sm:text-5xl">{featured.title}</h2>
        <p className="mt-3 max-w-sm text-[#e4e7df]">{featured.description}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={featured.deployUrl} className="rounded-lg bg-[#f5deaa] px-5 py-3 font-bold text-[#18231e] hover:bg-[#fff1d1]">
            Play Mongol’s Chess
          </a>
        </div>
      </div>
    </section>
  );
}
