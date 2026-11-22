import type { Metadata } from "next";
import { projects } from "../projects/_content/projects";
import GameCenterFeature from "./GameCenterFeature";
import PersonalBest from "./PersonalBest";

export const metadata: Metadata = {
  title: "Game Center",
  description: "Play original browser games by Asher Sebban.",
};

const games = projects.filter((game) => game.category === "game" && game.status === "live");
const arcade = games.filter((game) => !game.collection);

export default function GameCenter() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-20 pt-12 md:pt-20">
      <h1 className="mb-3 text-5xl font-extrabold tracking-tight md:text-7xl">Game Center</h1>
      <p className="mb-8 text-lg text-muted">Original browser games by Asher Sebban.</p>
      <GameCenterFeature />
      <section id="arcade" aria-labelledby="arcade-title" className="mt-12 scroll-mt-28 sm:scroll-mt-24">
        <h2 id="arcade-title" className="mb-4 text-2xl font-bold">Arcade</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {arcade.map((game) => (
            <article key={game.id} className="flex flex-col rounded-2xl border border-border bg-card p-5">
              <h3 className="text-xl font-semibold">{game.title}</h3>
              <p className="mt-2 flex-1 text-muted">{game.description}</p>
              <PersonalBest gameId={game.id} />
              <a href={game.deployUrl} aria-label={"Play " + game.title}
                className="mt-5 self-start rounded-lg border border-zinc-600 px-5 py-2.5 font-semibold hover:border-blue-400 hover:text-blue-300">
                Play
              </a>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
