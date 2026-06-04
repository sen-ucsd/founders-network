import { TopNav } from "./components/top-nav";
import { FluidOrbHero } from "./components/fluid-orb-hero";
import { Hero } from "./components/hero";
import { CircularBadge } from "./components/circular-badge";
import { Mission } from "./components/mission";
import { Programs } from "./components/programs";
import { Partners } from "./components/partners";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full">
      <section className="relative h-screen min-h-[640px] w-full overflow-hidden">
        <FluidOrbHero />
        <TopNav />
        <Hero />
        <CircularBadge />
      </section>

      {/*
       * Vision → Programs → Coalition. The Chapters and Start-a-Chapter
       * sections are gone with the chapter-expansion narrative; FN is
       * UCSD-only now.
       */}
      <Mission />
      <Programs />
      <Partners />
    </main>
  );
}
