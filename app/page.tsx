import { TopNav } from "./components/top-nav";
import { FluidOrbHero } from "./components/fluid-orb-hero";
import { Hero } from "./components/hero";
import { CircularBadge } from "./components/circular-badge";
import { Mission } from "./components/mission";
import { Chapters } from "./components/chapters";
import { Programs } from "./components/programs";
import { Partners } from "./components/partners";
import { StartChapter } from "./components/start-chapter";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full">
      <section className="relative h-screen min-h-[640px] w-full overflow-hidden">
        <FluidOrbHero />
        <TopNav />
        <Hero />
        <CircularBadge />
      </section>

      {/* Order mirrors SEN's homepage flow:
       *   Vision → Chapters → Programs → (FN-only) Coalition → Start a Chapter
       * The Coalition section is the FN-specific UCSD-internal coalition
       * of partner orgs, distinct from "chapters" (geographic nodes).
       */}
      <Mission />
      <Chapters />
      <Programs />
      <Partners />
      <StartChapter />
    </main>
  );
}
