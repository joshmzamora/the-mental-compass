import { Hero } from "../components/Hero";
import { PageTransition } from "../components/PageTransition";
import { InteractiveMentalCompass } from "../components/InteractiveMentalCompass";
import { FeaturedNavigators } from "../components/FeaturedNavigators";
import { CompassInAction } from "../components/CompassInAction";
import { FinalCTA } from "../components/FinalCTA";

export function Home() {
  return (
    <PageTransition>
      <Hero />
      <InteractiveMentalCompass />
      <FeaturedNavigators />
      <CompassInAction />
      <FinalCTA />
    </PageTransition>
  );
}
