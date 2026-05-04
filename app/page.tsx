import { TopNav } from "./components/top-nav";
import { OrbBackground } from "./components/orb-background";
import { Hero } from "./components/hero";
import { CircularBadge } from "./components/circular-badge";
import { Partners } from "./components/partners";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full">
      <section className="relative h-screen min-h-[640px] w-full overflow-hidden">
        <OrbBackground />
        <TopNav />
        <Hero />
        <CircularBadge />
      </section>

      <Partners />
    </main>
  );
}
